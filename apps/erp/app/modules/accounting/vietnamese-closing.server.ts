// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { createHash, randomUUID } from "node:crypto";
import { requirePermissions } from "@carbon/auth/auth.server";
import type { Kysely, KyselyDatabase } from "@carbon/database/client";
import { EPSILON } from "@carbon/database/precision";
import { getNextSequence } from "@carbon/database/sequence";
import { datetime, MONTH_NUMBER, toStoredAmount } from "@carbon/utils";
import { parseDate } from "@internationalized/date";
import { sql } from "kysely";
import { getDatabaseClient } from "~/services/database.server";
import {
  buildVietnameseClosingPlan,
  type VietnameseClosingAccount,
  type VietnameseClosingBalance,
  type VietnameseClosingInput
} from "./vietnamese-closing";

type Scope = { companyId: string; companyGroupId: string };
type Window = { startDate: string; endDate: string };
type ClosingDb = Kysely<KyselyDatabase>;

async function resolveFiscalWindow(
  db: ClosingDb,
  scope: Scope,
  endDate: string
) {
  const settings = (
    await sql<{
      startMonth: string;
    }>`SELECT "startMonth"::text FROM "fiscalYearSettings" WHERE "companyId"=${scope.companyId}`.execute(
      db
    )
  ).rows;
  const month =
    settings.length === 1
      ? MONTH_NUMBER[settings[0]!.startMonth as keyof typeof MONTH_NUMBER]
      : undefined;
  if (!month)
    throw new Response(
      "Cần cấu hình duy nhất một lịch năm tài chính hợp lệ trước khi kết chuyển",
      { status: 409 }
    );
  const end = parseDate(endDate);
  const start = end.set({
    year: end.year - (end.month < month ? 1 : 0),
    month,
    day: 1
  });
  return {
    startMonth: settings[0]!.startMonth,
    startDate: start.toString(),
    endDate: start.add({ years: 1 }).subtract({ days: 1 }).toString()
  };
}

function validateWindow(window: Window) {
  try {
    if (
      parseDate(window.startDate).toString() !== window.startDate ||
      parseDate(window.endDate).toString() !== window.endDate ||
      window.startDate > window.endDate ||
      window.startDate < "2026-01-01"
    )
      throw new Error();
  } catch {
    throw new Response("Khoảng ngày kết chuyển TT99 không hợp lệ", {
      status: 400
    });
  }
}

/** Reusable scoped query for local verification. HTTP callers must first authenticate. */
export async function previewVietnameseClosingForScope(
  db: ClosingDb,
  scope: Scope,
  window: Window
) {
  validateWindow(window);
  const company = await db
    .selectFrom("company")
    .select(["id", "name", "baseCurrencyCode", "timezone"])
    .where("id", "=", scope.companyId)
    .where("companyGroupId", "=", scope.companyGroupId)
    .executeTakeFirst();
  if (!company) throw new Response("Không tìm thấy công ty", { status: 404 });
  const fiscalYear = await resolveFiscalWindow(db, scope, window.endDate);
  const priorFiscalBalances = (
    await sql<VietnameseClosingBalance>`SELECT line."accountId",sum(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS amount
    FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId"
    JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${scope.companyGroupId} AND a."incomeBalance"='Income Statement'
    WHERE line."companyId"=${scope.companyId} AND j."companyId"=${scope.companyId} AND j.status IN ('Posted','Reversed') AND j."postingDate"<${fiscalYear.startDate}::date GROUP BY line."accountId" ORDER BY line."accountId"`.execute(
      db
    )
  ).rows;
  const accounts = (
    await sql<VietnameseClosingAccount>`SELECT id,COALESCE(number,'') AS number,COALESCE(class::text,'') AS class,"incomeBalance","isGroup",active FROM account WHERE "companyGroupId"=${scope.companyGroupId} ORDER BY number,id`.execute(
      db
    )
  ).rows;
  const balances = (
    await sql<VietnameseClosingBalance>`SELECT line."accountId",sum(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS amount
    FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId"
    JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${scope.companyGroupId}
    WHERE line."companyId"=${scope.companyId} AND j."companyId"=${scope.companyId} AND j.status IN ('Posted','Reversed') AND j."postingDate"<${window.startDate}::date GROUP BY line."accountId" ORDER BY line."accountId"`.execute(
      db
    )
  ).rows;
  const movements = (
    await sql<
      VietnameseClosingInput["movements"][number]
    >`SELECT line."accountId",sum(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS amount, ${window.endDate}::text AS "postingDate",'Posted'::text AS status
    FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId"
    JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${scope.companyGroupId}
    WHERE line."companyId"=${scope.companyId} AND j."companyId"=${scope.companyId} AND j.status IN ('Posted','Reversed') AND j."postingDate">=${window.startDate}::date AND j."postingDate"<=${window.endDate}::date GROUP BY line."accountId" ORDER BY line."accountId"`.execute(
      db
    )
  ).rows;
  const periods = (
    await sql<{
      id: string;
      closeStatus: string;
      startDate: string;
      endDate: string;
    }>`SELECT id,"closeStatus","startDate"::text,"endDate"::text FROM "accountingPeriod" WHERE "companyId"=${scope.companyId} AND "startDate"<=${window.endDate}::date AND "endDate">=${window.endDate}::date`.execute(
      db
    )
  ).rows;
  const input: VietnameseClosingInput = {
    ...window,
    companyId: scope.companyId,
    accounts,
    openingBalances: balances,
    movements
  };
  const plan = buildVietnameseClosingPlan(input);
  // TT99 Article 31: applies to financial years BEGINNING on/after 01/01/2026.
  // A calendar date in 2026 does not move a July-2025 fiscal year into TT99.
  if (fiscalYear.startDate < "2026-01-01") {
    plan.issues.push(
      "Thông tư 99 chỉ áp dụng cho năm tài chính bắt đầu từ ngày 01/01/2026. Năm tài chính đang chọn bắt đầu trước ngày này; cần xử lý theo chế độ áp dụng cho năm đó."
    );
    plan.blocked = true;
  }
  if (
    window.startDate < fiscalYear.startDate ||
    window.endDate > fiscalYear.endDate
  ) {
    plan.issues.push(
      `Khoảng kết chuyển phải nằm trong một năm tài chính ${fiscalYear.startDate} → ${fiscalYear.endDate}; không gộp kết quả nhiều năm vào 4212.`
    );
    plan.blocked = true;
  }
  if (
    priorFiscalBalances.some(
      (row) => !Number.isFinite(row.amount) || Math.abs(row.amount) > EPSILON
    )
  ) {
    plan.issues.push(
      "Còn số dư tài khoản kết quả/chi phí sản xuất của năm tài chính trước. Cần đối soát và xử lý riêng năm trước; không tự chuyển sang 4212 năm hiện hành."
    );
    plan.blocked = true;
  }
  const period = periods.length === 1 ? periods[0] : undefined;
  if (!period || period.closeStatus !== "Open") {
    plan.issues.push(
      "Ngày kết chuyển phải thuộc duy nhất một kỳ kế toán đang mở (Open)."
    );
    plan.blocked = true;
  }
  if (company.baseCurrencyCode !== "VND") {
    plan.issues.push(
      "Workbench hiện yêu cầu đồng tiền kế toán VND; chưa hỗ trợ chuyển đổi đơn vị báo cáo."
    );
    plan.blocked = true;
  }
  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        company,
        input,
        periods,
        fiscalYear,
        priorFiscalBalances
      })
    )
    .digest("hex");
  return { company, window, plan, fingerprint, period, fiscalYear };
}

export async function loadVietnameseClosing(request: Request) {
  const scope = await requirePermissions(request, {
    view: "accounting",
    role: "employee"
  });
  const db = getDatabaseClient();
  const company = await db
    .selectFrom("company")
    .select("timezone")
    .where("id", "=", scope.companyId)
    .where("companyGroupId", "=", scope.companyGroupId)
    .executeTakeFirst();
  if (!company) throw new Response("Không tìm thấy công ty", { status: 404 });
  const today = datetime.today(company.timezone);
  const url = new URL(request.url);
  const endDate = url.searchParams.get("endDate") ?? today.toString();
  try {
    parseDate(endDate);
  } catch {
    throw new Response("Ngày kết chuyển không hợp lệ", { status: 400 });
  }
  const fiscalYear = await resolveFiscalWindow(db, scope, endDate);
  return previewVietnameseClosingForScope(db, scope, {
    startDate: url.searchParams.get("startDate") ?? fiscalYear.startDate,
    endDate
  });
}

/** All steps share one native transaction; posted history is never mutated. */
export async function postVietnameseClosing(
  request: Request,
  window: Window,
  expectedFingerprint: string
) {
  const scope = await requirePermissions(request, {
    create: "accounting",
    update: "accounting",
    role: "employee"
  });
  validateWindow(window);
  if (!/^[a-f0-9]{64}$/.test(expectedFingerprint))
    throw new Response("Thiếu bản xem trước hợp lệ", { status: 400 });
  const db = getDatabaseClient();
  return db
    .transaction()
    .setIsolationLevel("serializable")
    .execute(async (trx) => {
      await sql`SELECT pg_advisory_xact_lock(hashtextextended(${`tt99-closing:${scope.companyId}`},0))`.execute(
        trx
      );
      // Closing reads prior opening balances as well as the selected window.
      // Native posting takes FOR SHARE on its period; lock every historical
      // period that can change those balances, in deterministic order.
      await sql`SELECT id FROM "accountingPeriod" WHERE "companyId"=${scope.companyId} AND "startDate"<=${window.endDate}::date ORDER BY id FOR UPDATE`.execute(
        trx
      );
      const preview = await previewVietnameseClosingForScope(
        trx,
        scope,
        window
      );
      const existing = (
        await sql<{
          id: string;
          status: string;
        }>`SELECT id,status FROM journal WHERE "companyId"=${scope.companyId} AND "customFields"->'tt99'->>'closingKey'=${preview.plan.key} ORDER BY id`.execute(
          trx
        )
      ).rows;
      if (existing.some((row) => row.status === "Reversed"))
        throw new Response(
          "Bút toán kết chuyển đã đảo; cần đối soát và chọn kỳ kết chuyển mới",
          { status: 409 }
        );
      if (existing.length) {
        if (
          existing.some((row) => row.status !== "Posted") ||
          preview.plan.steps.length ||
          preview.plan.blocked
        )
          throw new Response(
            "Kỳ đã kết chuyển nhưng số liệu hoặc trạng thái đã thay đổi; cần đối soát",
            { status: 409 }
          );
        return {
          journalIds: existing.map((row) => row.id),
          alreadyPosted: true
        };
      }
      if (preview.fingerprint !== expectedFingerprint)
        throw new Response(
          "Sổ hoặc cấu hình đã thay đổi. Xem trước lại trước khi ghi sổ",
          { status: 409 }
        );
      if (preview.plan.blocked || !preview.period)
        throw new Response(preview.plan.issues.join("\n"), { status: 409 });
      const byId = new Map(
        (
          await trx
            .selectFrom("account")
            .select(["id", "class"])
            .where("companyGroupId", "=", scope.companyGroupId)
            .execute()
        ).map((a) => [a.id, a.class])
      );
      const journalIds: string[] = [];
      for (const step of preview.plan.steps) {
        const journalEntryId = await getNextSequence(
          trx,
          "journalEntry",
          scope.companyId
        );
        const header = await trx
          .insertInto("journal")
          .values({
            journalEntryId,
            companyId: scope.companyId,
            postingDate: window.endDate,
            accountingPeriodId: preview.period.id,
            sourceType: "Manual",
            status: "Draft",
            description: step.description,
            createdBy: scope.userId,
            customFields: {
              tt99: {
                closingKey: preview.plan.key,
                closingStep: step.kind,
                startDate: window.startDate,
                endDate: window.endDate,
                previewFingerprint: expectedFingerprint
              }
            }
          })
          .returning("id")
          .executeTakeFirstOrThrow();
        await trx
          .insertInto("journalLine")
          .values(
            step.lines.map((line) => ({
              journalId: header.id,
              companyId: scope.companyId,
              accountId: line.accountId,
              amount: toStoredAmount(
                line.debit,
                line.credit,
                byId.get(line.accountId)!
              ),
              journalLineReference: randomUUID(),
              description: step.description
            }))
          )
          .execute();
        await trx
          .updateTable("journal")
          .set({
            status: "Posted",
            postedAt: sql<string>`now()`,
            postedBy: scope.userId,
            updatedBy: scope.userId
          })
          .where("id", "=", header.id)
          .where("companyId", "=", scope.companyId)
          .where("status", "=", "Draft")
          .executeTakeFirstOrThrow();
        journalIds.push(header.id);
      }
      return { journalIds, alreadyPosted: false };
    });
}
