// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { randomUUID } from "node:crypto";
import { requirePermissions } from "@carbon/auth/auth.server";
import {
  hasCompanyPrivateObjectPathPrefix,
  isUnsafeStoragePath,
  storage
} from "@carbon/files";
import { datetime, MONTH_NUMBER } from "@carbon/utils";
import { parseDate } from "@internationalized/date";
import { sql } from "kysely";
import {
  validateVietnameseDemoPackage,
  vietnameseLedgerDigest
} from "~/modules/accounting/vietnamese-demo-package.server";
import {
  buildVietnameseReports,
  VIETNAMESE_NOTE_DEFINITIONS,
  type VietnameseReportInput
} from "~/modules/accounting/vietnamese-reports";
import { upsertDocument } from "~/modules/documents/documents.service";
import { getDatabaseClient } from "~/services/database.server";

type JournalRow = {
  journalId: string;
  postingDate: string;
  accountNumber: string;
  accountName: string;
  accountClass: string;
  amount: number;
  description: string | null;
  sourceType: string;
  cashFlowCode: string | null;
};

/** Auth precedes the privileged DB client; every ledger read is tenant scoped. */
export async function loadVietnameseReport(
  request: Request,
  notes?: Record<string, string>
) {
  const { companyId, companyGroupId, client } = await requirePermissions(
    request,
    {
      view: "accounting",
      role: "employee"
    }
  );
  const db = getDatabaseClient();
  const companyResult = await sql<{
    id: string;
    name: string;
    currencyCode: string;
    timezone: string;
    fiscalStartMonth: string | null;
  }>`SELECT c.id,c.name,c."baseCurrencyCode" AS "currencyCode",c.timezone,f."startMonth"::text AS "fiscalStartMonth" FROM company c
      LEFT JOIN "fiscalYearSettings" f ON f."companyId"=c.id
      WHERE c.id=${companyId} AND c."companyGroupId"=${companyGroupId}`.execute(
    db
  );
  const company = companyResult.rows[0];
  if (!company) throw new Response("Không tìm thấy công ty", { status: 404 });
  const url = new URL(request.url);
  const today = datetime.today(company.timezone);
  let start;
  let end;
  try {
    start = parseDate(
      url.searchParams.get("startDate") ??
        today.set({ month: 1, day: 1 }).toString()
    );
    end = parseDate(url.searchParams.get("endDate") ?? today.toString());
  } catch {
    throw new Response("Ngày báo cáo không hợp lệ", { status: 400 });
  }
  if (start.compare(end) > 0 || start.year < 2026) {
    throw new Response(
      "Kỳ báo cáo phải bắt đầu từ năm 2026 và ngày đầu kỳ không được sau ngày cuối kỳ",
      { status: 400 }
    );
  }
  const period = {
    startDate: start.toString(),
    endDate: end.toString(),
    priorStartDate: start.subtract({ years: 1 }).toString(),
    priorEndDate: end.subtract({ years: 1 }).toString()
  };
  // Four bounded/grouped scans avoid transferring the entire historical ledger.
  // Natural account balances are converted to debit-positive amounts once here.
  const opening = (before: string) =>
    sql<{ accountNumber: string; amount: number }>`
    SELECT COALESCE(a.number,'UNMAPPED') AS "accountNumber",sum(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS amount
    FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId"
    JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${companyGroupId}
    WHERE line."companyId"=${companyId} AND j."companyId"=${companyId}
      AND j.status IN ('Posted','Reversed') AND j."postingDate"<${before}::date
    GROUP BY a.number`.execute(db);
  const movements = (from: string, to: string) =>
    sql<JournalRow>`
    SELECT j.id AS "journalId",j."postingDate"::text AS "postingDate",COALESCE(a.number,'UNMAPPED') AS "accountNumber",a.name AS "accountName",
      a.class AS "accountClass",(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS amount,
      COALESCE(line.description,j.description) AS description,j."sourceType"::text AS "sourceType",
      COALESCE(line."customFields"->'tt99'->>'cashFlowCode',a."customFields"->'tt99'->'cashFlowAllocations'->line.id->>'cashFlowCode',a."customFields"->'tt99'->'controlAllocations'->line.id->>'cashFlowCode',CASE WHEN payment."customerId" IS NOT NULL THEN '01' ELSE NULL END) AS "cashFlowCode"
    FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId"
    JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${companyGroupId}
    LEFT JOIN payment ON payment."journalId"=j.id AND payment."companyId"=${companyId} AND payment.status='Posted'
    WHERE line."companyId"=${companyId} AND j."companyId"=${companyId} AND j.status IN ('Posted','Reversed')
      AND j."postingDate">=${from}::date AND j."postingDate"<=${to}::date
    ORDER BY j."postingDate",j.id,line.id`.execute(db);
  const controls = (at: string) =>
    sql<{
      accountNumber: string;
      partyId: string | null;
      maturity: "current" | "noncurrent" | null;
      amount: number;
      unknownPartyLineCount: number;
    }>`SELECT a.number AS "accountNumber",CASE WHEN a.number LIKE '131%' THEN customer.id ELSE supplier.id END AS "partyId",
      COALESCE(line."customFields"->'tt99'->>'maturity',a."customFields"->'tt99'->'controlAllocations'->line.id->>'maturity') AS maturity,
      count(*) FILTER (WHERE abs(line.amount)>0 AND (CASE WHEN a.number LIKE '131%' THEN customer.id ELSE supplier.id END) IS NULL)::int AS "unknownPartyLineCount",
      sum(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS amount
    FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId"
    JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${companyGroupId}
    LEFT JOIN LATERAL (
      SELECT dimension_value."valueId" AS party_id FROM "journalLineDimension" dimension_value
      JOIN dimension ON dimension.id=dimension_value."dimensionId" AND dimension."companyGroupId"=${companyGroupId}
      WHERE dimension_value."journalLineId"=line.id AND dimension_value."companyId"=${companyId}
        AND dimension."entityType"::text=CASE WHEN a.number LIKE '131%' THEN 'Customer' ELSE 'Supplier' END
      ORDER BY dimension_value.id LIMIT 1
    ) dimension_party ON true
    LEFT JOIN customer ON customer.id=COALESCE(line."customFields"->'tt99'->>'counterpartyId',a."customFields"->'tt99'->'controlAllocations'->line.id->>'counterpartyId',dimension_party.party_id) AND customer."companyId"=${companyId}
    LEFT JOIN supplier ON supplier.id=COALESCE(line."customFields"->'tt99'->>'counterpartyId',a."customFields"->'tt99'->'controlAllocations'->line.id->>'counterpartyId',dimension_party.party_id) AND supplier."companyId"=${companyId}
    WHERE line."companyId"=${companyId} AND j."companyId"=${companyId} AND j.status IN ('Posted','Reversed')
      AND j."postingDate"<=${at}::date AND (a.number LIKE '131%' OR a.number LIKE '331%')
    GROUP BY a.number,customer.id,supplier.id,COALESCE(line."customFields"->'tt99'->>'maturity',a."customFields"->'tt99'->'controlAllocations'->line.id->>'maturity')`.execute(
      db
    );
  const classificationQuery = sql<{
    accountNumber: string;
    balanceSheetCode: string | null;
    incomeStatementCode: string | null;
    maturity: string | null;
  }>`SELECT COALESCE(number,'UNMAPPED') AS "accountNumber","customFields"->'tt99'->>'balanceSheetCode' AS "balanceSheetCode",
      "customFields"->'tt99'->>'incomeStatementCode' AS "incomeStatementCode","customFields"->'tt99'->>'maturity' AS maturity
    FROM account WHERE "companyGroupId"=${companyGroupId} AND "isGroup"=false`.execute(
    db
  );
  const [
    openingResult,
    priorOpeningResult,
    current,
    prior,
    currentControls,
    priorControls,
    classifications,
    beginningControls
  ] = await Promise.all([
    opening(period.startDate),
    opening(period.priorStartDate),
    movements(period.startDate, period.endDate),
    movements(period.priorStartDate, period.priorEndDate),
    controls(period.endDate),
    controls(period.priorEndDate),
    classificationQuery,
    controls(start.subtract({ days: 1 }).toString())
  ]);
  const normalize = (rows: JournalRow[]) =>
    rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
      description: row.description ?? undefined,
      cashFlowCode: row.cashFlowCode ?? undefined
    }));
  const accountClassifications = Object.fromEntries(
    classifications.rows.map((row) => [
      row.accountNumber,
      {
        balanceSheetCode:
          row.balanceSheetCode ??
          (row.accountNumber.startsWith("341")
            ? row.maturity === "current"
              ? "321"
              : row.maturity === "noncurrent"
                ? "339"
                : undefined
            : row.accountNumber.startsWith("242")
              ? row.maturity === "current"
                ? "161"
                : row.maturity === "noncurrent"
                  ? "271"
                  : undefined
              : undefined),
        incomeStatementCode: row.incomeStatementCode ?? undefined
      }
    ])
  );
  const normalizeControls = (rows: typeof currentControls.rows) =>
    rows.flatMap((row) =>
      row.partyId &&
      (row.maturity === "current" || row.maturity === "noncurrent")
        ? [
            {
              ...row,
              partyId: row.partyId,
              maturity: row.maturity,
              amount: Number(row.amount)
            }
          ]
        : []
    );
  const input: VietnameseReportInput = {
    company,
    period,
    openingBalances: openingResult.rows.map((row) => ({
      ...row,
      amount: Number(row.amount)
    })),
    priorOpeningBalances: priorOpeningResult.rows.map((row) => ({
      ...row,
      amount: Number(row.amount)
    })),
    journalLines: normalize(current.rows),
    priorJournalLines: normalize(prior.rows),
    controlBalances: normalizeControls(currentControls.rows),
    priorControlBalances: normalizeControls(priorControls.rows),
    openingControlBalances: normalizeControls(beginningControls.rows),
    accountClassifications,
    notes
  };
  let demoPackage: {
    id: string;
    createdAt: string;
    ledgerDigest: string;
    status: "DEMO_PREPARED";
    statutorySubmission: false;
  } | null = null;
  let demoPackageIssue: string | null = null;
  const ledgerDigest = vietnameseLedgerDigest(input);
  let nativeDraft: {
    id: string;
    createdAt: string;
    createdBy: string;
    status: "DRAFT";
  } | null = null;
  let nativeDraftIssue: string | null = null;
  if (client) {
    const document = await client
      .from("document")
      .select("id,path,companyId,createdAt")
      .eq("companyId", companyId)
      .eq("active", true)
      .eq("name", `TT99-demo-${period.startDate}-${period.endDate}.json`)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (document.error)
      demoPackageIssue = "Không đọc được gói thuyết minh demo đã lưu.";
    else if (document.data) {
      const item = document.data;
      if (
        item.companyId !== companyId ||
        !hasCompanyPrivateObjectPathPrefix(companyId, item.path) ||
        isUnsafeStoragePath(item.path)
      ) {
        demoPackageIssue = "Gói thuyết minh không thuộc công ty đang chọn.";
      } else {
        try {
          const file = await storage(client)
            .company(companyId)
            .download(item.path);
          if (file.error || !file.data) throw new Error("Unavailable package");
          const value: unknown = JSON.parse(await file.data.text());
          if (validateVietnameseDemoPackage(value, input)) {
            input.notes = { ...value.notes, ...notes };
            // Session edits are draft text, never an attested persisted package.
            if (
              !notes ||
              Object.entries(notes).every(
                ([code, note]) => value.notes[code] === note
              )
            ) {
              demoPackage = {
                id: item.id,
                createdAt: item.createdAt,
                ledgerDigest: value.ledgerDigest,
                status: value.status,
                statutorySubmission: value.statutorySubmission
              };
            } else
              demoPackageIssue =
                "Nội dung đang sửa khác gói demo đã lưu; cần chuẩn bị lại gói trước khi xuất demo.";
          } else
            demoPackageIssue =
              "Gói thuyết minh thiếu nội dung, sai kỳ hoặc không còn khớp sổ kế toán; cần chuẩn bị lại.";
        } catch {
          demoPackageIssue =
            "Không đọc được nội dung gói thuyết minh demo đã lưu.";
        }
      }
    }
  }
  if (client) {
    const document = await client
      .from("document")
      .select("id,path,companyId,createdAt")
      .eq("companyId", companyId)
      .eq("active", true)
      .eq("name", `TT99-notes-${period.startDate}-${period.endDate}.json`)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (document.error)
      nativeDraftIssue = "Không đọc được phiên bản thuyết minh đã lưu.";
    if (document.data && !document.error) {
      const item = document.data;
      if (
        item.companyId === companyId &&
        hasCompanyPrivateObjectPathPrefix(companyId, item.path) &&
        !isUnsafeStoragePath(item.path)
      ) {
        try {
          const file = await storage(client)
            .company(companyId)
            .download(item.path);
          if (file.error || !file.data) throw new Error("Unavailable draft");
          const value: unknown = JSON.parse(await file.data.text());
          if (isVietnameseDraft(value, input)) {
            input.notes = { ...value.notes, ...notes };
            nativeDraft = {
              id: item.id,
              createdAt: item.createdAt,
              createdBy: value.createdBy,
              status: "DRAFT"
            };
            demoPackage = null;
          } else
            nativeDraftIssue =
              "Bản nháp thuyết minh không còn khớp kỳ hoặc sổ kế toán; cần rà soát và lưu phiên bản mới.";
        } catch {
          nativeDraftIssue =
            "Không đọc được nội dung bản nháp thuyết minh đã lưu.";
        }
      } else
        nativeDraftIssue =
          "Bản nháp thuyết minh không thuộc công ty đang chọn.";
    }
  }
  const reports = buildVietnameseReports(input);
  if (demoPackage) {
    const notesCheck = reports.checks.find((check) => check.id === "notes");
    if (notesCheck) {
      notesCheck.label = "B09-DN: Đủ 101 mục thuyết minh demo";
      notesCheck.detail =
        "Nội dung giả lập đã chuẩn bị; chưa xác nhận pháp lý hoặc phê duyệt kế toán";
    }
  }
  const missingControls = [
    ...currentControls.rows,
    ...priorControls.rows,
    ...beginningControls.rows
  ].filter(
    (row) =>
      Number(row.unknownPartyLineCount) > 0 ||
      (Math.abs(Number(row.amount)) > 0 &&
        (!row.partyId ||
          !["current", "noncurrent"].includes(row.maturity ?? "")))
  );
  if (missingControls.length) {
    reports.blocked = true;
    reports.warnings.push(
      "OPEN — Công nợ 131/331 chưa có đầy đủ đối tượng hoặc kỳ hạn; cần đối chiếu chi tiết trước khi xuất báo cáo."
    );
  }
  const demoExportReady =
    Boolean(demoPackage) &&
    !missingControls.length &&
    reports.checks.length > 0 &&
    reports.checks.every((check) => check.passed) &&
    reports.warnings.every((warning) =>
      /^(Kỳ này|Đầu kỳ): Kết quả chưa kết chuyển được trình bày tạm ở 420b; cần khóa sổ và xác nhận kỳ lợi nhuận\.$/.test(
        warning
      )
    );
  return {
    company,
    period,
    reports,
    journalLineCount: current.rows.length,
    demoPackage,
    demoPackageIssue,
    demoExportReady,
    managementExportReady:
      Boolean(nativeDraft) &&
      !notes &&
      !missingControls.length &&
      reports.checks.length > 0 &&
      reports.checks.every((check) => check.passed) &&
      reports.warnings.every((warning) =>
        /^(Kỳ này|Đầu kỳ): Kết quả chưa kết chuyển được trình bày tạm ở 420b; cần khóa sổ và xác nhận kỳ lợi nhuận\.$/.test(
          warning
        )
      ),
    nativeDraft,
    nativeDraftIssue,
    ledgerDigest,
    annualPeriod: (() => {
      const month = company.fiscalStartMonth
        ? MONTH_NUMBER[company.fiscalStartMonth as keyof typeof MONTH_NUMBER]
        : undefined;
      return Boolean(
        month &&
          start.month === month &&
          start.day === 1 &&
          end.compare(start.add({ years: 1 }).subtract({ days: 1 })) === 0
      );
    })()
  };
}

type VietnameseDraft = {
  schemaVersion: 1;
  companyId: string;
  period: VietnameseReportInput["period"];
  ledgerDigest: string;
  status: "DRAFT";
  statutorySubmission: false;
  notes: Record<string, string>;
  createdBy: string;
};
function isVietnameseDraft(
  value: unknown,
  input: VietnameseReportInput
): value is VietnameseDraft {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<VietnameseDraft>;
  return (
    item.schemaVersion === 1 &&
    item.status === "DRAFT" &&
    item.statutorySubmission === false &&
    item.companyId === input.company.id &&
    item.ledgerDigest === vietnameseLedgerDigest(input) &&
    typeof item.createdBy === "string" &&
    Boolean(item.createdBy) &&
    Boolean(item.period) &&
    Object.entries(input.period).every(
      ([key, date]) => item.period?.[key as keyof typeof item.period] === date
    ) &&
    Boolean(item.notes) &&
    Object.keys(item.notes ?? {}).length ===
      VIETNAMESE_NOTE_DEFINITIONS.length &&
    VIETNAMESE_NOTE_DEFINITIONS.every(
      ([code]) =>
        typeof item.notes?.[code] === "string" &&
        item.notes[code].length <= 5000
    )
  );
}

/** Immutable versions use the existing authenticated document/storage policies. */
export async function saveVietnameseNotes(
  request: Request,
  notes: Record<string, string>,
  expectedLedgerDigest: string
) {
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "accounting",
    create: "documents",
    role: "employee"
  });
  const report = await loadVietnameseReport(request);
  if (!expectedLedgerDigest || expectedLedgerDigest !== report.ledgerDigest)
    throw new Response(
      "Sổ kế toán đã thay đổi. Tải lại báo cáo và rà soát thuyết minh trước khi lưu.",
      { status: 409 }
    );
  if (report.company.id !== companyId)
    throw new Response("Công ty không khớp", { status: 409 });
  if (
    Object.keys(notes).length !== VIETNAMESE_NOTE_DEFINITIONS.length ||
    VIETNAMESE_NOTE_DEFINITIONS.some(
      ([code]) => typeof notes[code] !== "string" || notes[code].length > 5000
    )
  )
    throw new Response("Cần đủ 101 mục thuyết minh hợp lệ", { status: 400 });
  const value: VietnameseDraft = {
    schemaVersion: 1,
    companyId,
    period: report.period,
    ledgerDigest: report.ledgerDigest,
    status: "DRAFT",
    statutorySubmission: false,
    notes,
    createdBy: userId
  };
  const objectPath = `${companyId}/accounting/tt99/${report.period.startDate}-${report.period.endDate}/${randomUUID()}.json`;
  const file = new Blob([JSON.stringify(value)], { type: "application/json" });
  const bucket = storage(client).company(companyId);
  const upload = await bucket.upload(objectPath, file, {
    upsert: false,
    contentType: "application/json"
  });
  if (upload.error)
    throw new Response("Không lưu được thuyết minh", { status: 500 });
  const document = await upsertDocument(client, {
    path: objectPath,
    name: `TT99-notes-${report.period.startDate}-${report.period.endDate}.json`,
    size: Math.ceil(file.size / 1024),
    readGroups: [userId],
    writeGroups: [userId],
    createdBy: userId,
    companyId
  });
  if (document.error) {
    await bucket.remove([objectPath]);
    throw new Response("Không lưu được tài liệu thuyết minh", { status: 500 });
  }
  return { saved: true, status: "DRAFT" as const };
}

/** Text-only fields are escaped against spreadsheet formula execution. */
export function vietnameseCsvCell(value: unknown): string {
  const raw = value == null ? "" : String(value);
  const safe =
    typeof value === "string" && /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function vietnameseReportCsv(
  report: Awaited<ReturnType<typeof loadVietnameseReport>>,
  code: string,
  mode: "standard" | "demo" | "management" = "standard"
) {
  const form = report.reports.forms.find((item) => item.code === code);
  if (!form) throw new Response("Mẫu báo cáo không hợp lệ", { status: 400 });
  if (
    mode === "demo"
      ? !report.demoExportReady
      : mode === "management"
        ? !report.managementExportReady
        : report.reports.blocked ||
          Boolean(report.demoPackage) ||
          !report.annualPeriod ||
          !report.nativeDraft ||
          report.nativeDraft.status === "DRAFT"
  )
    throw new Response(
      "Báo cáo chưa đủ điều kiện xuất; cần xử lý các kiểm tra và phân loại còn thiếu",
      { status: 409 }
    );
  const rows: unknown[][] = [
    ...(mode === "management"
      ? [
          ["DRAFT — BÁO CÁO QUẢN TRỊ — KHÔNG DÙNG NỘP BÁO CÁO CHÍNH THỨC"],
          [
            "Phiên bản thuyết minh",
            report.nativeDraft?.id,
            "statutorySubmission=false",
            report.ledgerDigest
          ]
        ]
      : []),
    ...(mode === "demo"
      ? [
          ["DEMO — DỮ LIỆU GIẢ LẬP — KHÔNG DÙNG NỘP BÁO CÁO CHÍNH THỨC"],
          [
            "Trạng thái gói",
            "DEMO_PREPARED",
            "statutorySubmission=false",
            report.demoPackage?.ledgerDigest
          ]
        ]
      : []),
    [form.code, form.title, report.company.name, report.company.currencyCode],
    ["Kỳ hiện tại", report.period.startDate, report.period.endDate],
    ["Kỳ so sánh", report.period.priorStartDate, report.period.priorEndDate],
    form.code === "B09-DN"
      ? ["Mã số", "Chỉ tiêu", "Nội dung thuyết minh"]
      : ["Mã số", "Chỉ tiêu", form.columns[0], form.columns[1], "Thuyết minh"],
    ...form.lines.map((line) =>
      form.code === "B09-DN"
        ? [line.code, line.label, line.note ?? ""]
        : [line.code, line.label, line.current, line.previous, line.note ?? ""]
    ),
    [
      "Trạng thái",
      mode === "demo"
        ? "DEMO — chỉ phát hành bộ dữ liệu giả lập; chưa khóa sổ/phê duyệt và không dùng nộp báo cáo chính thức"
        : "Bản nháp nội bộ — cần kế toán rà soát và phê duyệt trước khi sử dụng chính thức"
    ],
    ...report.reports.warnings.map((warning) => ["Lưu ý", warning])
  ];
  return new Response(
    `\ufeff${rows.map((row) => row.map(vietnameseCsvCell).join(",")).join("\r\n")}`,
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${mode === "demo" ? "DEMO-" : mode === "management" ? "DRAFT-" : ""}${form.code}-${report.period.startDate}-${report.period.endDate}.csv"`,
        "Cache-Control": "private, no-store"
      }
    }
  );
}
