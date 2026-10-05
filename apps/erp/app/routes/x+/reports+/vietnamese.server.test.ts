// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  permissions: vi.fn(),
  database: vi.fn(),
  execute: vi.fn(),
  build: vi.fn(),
  download: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  document: vi.fn(),
  companyStorage: vi.fn()
}));
vi.mock("~/modules/documents/documents.service", () => ({
  upsertDocument: mocks.document
}));
vi.mock("@carbon/auth/auth.server", () => ({
  requirePermissions: mocks.permissions
}));
vi.mock("~/services/database.server", () => ({
  getDatabaseClient: mocks.database
}));
vi.mock("kysely", () => ({ sql: () => ({ execute: mocks.execute }) }));
vi.mock("~/modules/accounting/vietnamese-reports", () => ({
  buildVietnameseReports: mocks.build,
  VIETNAMESE_NOTE_DEFINITIONS: Array.from({ length: 101 }, (_, i) => [
    `I.${i}`,
    `Note ${i}`
  ])
}));
vi.mock("@carbon/files", () => ({
  storage: () => ({ company: mocks.companyStorage }),
  hasCompanyPrivateObjectPathPrefix: (companyId: string, path: string) =>
    path.startsWith(`${companyId}/`),
  isUnsafeStoragePath: (path: string) => path.includes("..")
}));

import { vietnameseLedgerDigest } from "~/modules/accounting/vietnamese-demo-package.server";
import {
  loadVietnameseReport,
  saveVietnameseNotes,
  vietnameseCsvCell,
  vietnameseReportCsv
} from "./vietnamese.server";

function setupPackage(value: unknown, path = "company-a/reports/package.json") {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn()
  };
  for (const name of ["select", "eq", "order", "limit"] as const)
    query[name].mockReturnValue(query);
  query.maybeSingle.mockResolvedValue({
    data: {
      id: "package-1",
      companyId: "company-a",
      path,
      createdAt: "2026-10-05T00:00:00Z"
    },
    error: null
  });
  mocks.permissions.mockResolvedValue({
    companyId: "company-a",
    companyGroupId: "group-a",
    client: { from: vi.fn(() => query) }
  });
  mocks.execute.mockResolvedValueOnce({
    rows: [
      {
        id: "company-a",
        name: "Demo",
        currencyCode: "VND",
        timezone: "Asia/Ho_Chi_Minh"
      }
    ]
  });
  mocks.execute.mockResolvedValue({ rows: [] });
  mocks.companyStorage.mockReturnValue({
    download: mocks.download,
    upload: mocks.upload,
    remove: mocks.remove
  });
  mocks.download.mockResolvedValue({
    data: new Blob([JSON.stringify(value)]),
    error: null
  });
  mocks.build.mockReturnValue({
    forms: [{ code: "B09-DN", title: "Notes", columns: [], lines: [] }],
    checks: [
      { id: "ledger", passed: true },
      { id: "notes", passed: true }
    ],
    warnings: [
      "Kỳ này: Kết quả chưa kết chuyển được trình bày tạm ở 420b; cần khóa sổ và xác nhận kỳ lợi nhuận."
    ],
    blocked: true
  });
  return query;
}
const packageRequest = () =>
  new Request(
    "http://localhost/x/reports/vietnamese?startDate=2026-01-01&endDate=2026-10-05"
  );
function validPackage() {
  const input = {
    company: { id: "company-a", name: "Demo", currencyCode: "VND" },
    period: {
      startDate: "2026-01-01",
      endDate: "2026-10-05",
      priorStartDate: "2025-01-01",
      priorEndDate: "2025-10-05"
    },
    openingBalances: [],
    journalLines: []
  };
  return {
    schemaVersion: 1,
    companyId: "company-a",
    period: input.period,
    ledgerDigest: vietnameseLedgerDigest(input),
    status: "DEMO_PREPARED",
    statutorySubmission: false,
    notes: Object.fromEntries(
      Array.from({ length: 101 }, (_, i) => [
        `I.${i}`,
        "DEMO: Thuyết minh giả lập đầy đủ cho mục báo cáo."
      ])
    )
  };
}

function reportFixture(): Awaited<ReturnType<typeof loadVietnameseReport>> {
  return {
    company: {
      id: "company-a",
      name: "Nhà máy giả lập",
      currencyCode: "VND",
      timezone: "Asia/Ho_Chi_Minh",
      fiscalStartMonth: "January"
    },
    period: {
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      priorStartDate: "2025-01-01",
      priorEndDate: "2025-12-31"
    },
    reports: { forms: [], checks: [], warnings: [], blocked: false },
    journalLineCount: 0,
    demoPackage: null,
    demoPackageIssue: null,
    demoExportReady: false,
    managementExportReady: false,
    nativeDraft: null,
    nativeDraftIssue: null,
    ledgerDigest: "fixture-ledger-digest",
    annualPeriod: true
  };
}

describe("Vietnamese financial report access and export", () => {
  beforeEach(() => vi.resetAllMocks());
  it("loads all persisted notes with company/RLS scope and allows only marked demo export", async () => {
    const value = validPackage();
    const query = setupPackage(value);
    const report = await loadVietnameseReport(packageRequest());
    expect(query.eq).toHaveBeenCalledWith("companyId", "company-a");
    expect(query.eq).toHaveBeenCalledWith(
      "name",
      "TT99-demo-2026-01-01-2026-10-05.json"
    );
    expect(query.order).toHaveBeenCalledWith("createdAt", { ascending: false });
    expect(mocks.companyStorage).toHaveBeenCalledWith("company-a");
    expect(mocks.build).toHaveBeenCalledWith(
      expect.objectContaining({ notes: value.notes })
    );
    expect(report.demoExportReady).toBe(true);
    expect(() => vietnameseReportCsv(report, "B09-DN")).toThrow();
    const response = vietnameseReportCsv(report, "B09-DN", "demo");
    expect(response.headers.get("Content-Disposition")).toContain(
      "DEMO-B09-DN"
    );
    expect(await response.text()).toContain(
      "KHÔNG DÙNG NỘP BÁO CÁO CHÍNH THỨC"
    );
  });
  it.each([
    "cross-company",
    "stale",
    "missing-note",
    "wrong-period"
  ])("blocks invalid persisted %s package", async (kind) => {
    const value = validPackage();
    if (kind === "stale") value.ledgerDigest = "stale";
    if (kind === "missing-note") delete value.notes["I.0"];
    if (kind === "wrong-period") value.period.endDate = "2026-10-04";
    setupPackage(
      value,
      kind === "cross-company" ? "company-b/reports/package.json" : undefined
    );
    const result = await loadVietnameseReport(packageRequest());
    expect(result.demoExportReady).toBe(false);
    expect(result.demoPackage).toBeNull();
    expect(() => vietnameseReportCsv(result, "B09-DN", "demo")).toThrow();
    if (kind === "cross-company") expect(mocks.download).not.toHaveBeenCalled();
  });
  it("never permits standard export of persisted demo notes even when closing removes all warnings", async () => {
    setupPackage(validPackage());
    mocks.build.mockReturnValue({
      forms: [{ code: "B09-DN", title: "Notes", columns: [], lines: [] }],
      checks: [
        { id: "ledger", passed: true },
        { id: "notes", passed: true, label: "Confirmed", detail: "Confirmed" }
      ],
      warnings: [],
      blocked: false
    });
    const report = await loadVietnameseReport(packageRequest());
    expect(report.demoExportReady).toBe(true);
    expect(
      report.reports.checks.find((check) => check.id === "notes")?.detail
    ).toContain("chưa xác nhận pháp lý");
    expect(() => vietnameseReportCsv(report, "B09-DN")).toThrow();
    expect(vietnameseReportCsv(report, "B09-DN", "demo").status).toBe(200);
  });
  it("does not allow unrelated warnings containing the temporary profit sentence", async () => {
    setupPackage(validPackage());
    mocks.build.mockReturnValue({
      forms: [],
      checks: [{ id: "ledger", passed: true }],
      warnings: [
        "OPEN — Kết quả chưa kết chuyển được trình bày tạm ở 420b; cần khóa sổ và xác nhận kỳ lợi nhuận."
      ],
      blocked: true
    });
    expect((await loadVietnameseReport(packageRequest())).demoExportReady).toBe(
      false
    );
  });
  it("blocks edited notes and failed checks or any additional classification warning", async () => {
    setupPackage(validPackage());
    const edited = await loadVietnameseReport(packageRequest(), {
      "I.0": "Changed disclosure in current session"
    });
    expect(edited.demoExportReady).toBe(false);
    expect(edited.demoPackage).toBeNull();
    vi.resetAllMocks();
    setupPackage(validPackage());
    mocks.build.mockReturnValue({
      forms: [],
      checks: [{ id: "ledger", passed: false }],
      warnings: [],
      blocked: true
    });
    expect((await loadVietnameseReport(packageRequest())).demoExportReady).toBe(
      false
    );
    vi.resetAllMocks();
    setupPackage(validPackage());
    mocks.build.mockReturnValue({
      forms: [],
      checks: [{ id: "ledger", passed: true }],
      warnings: ["OPEN — Missing control allocation"],
      blocked: true
    });
    expect((await loadVietnameseReport(packageRequest())).demoExportReady).toBe(
      false
    );
  });
  it("requires accounting employee permission before accessing the database", async () => {
    const denied = new Response("Forbidden", { status: 403 });
    mocks.permissions.mockRejectedValue(denied);
    await expect(
      loadVietnameseReport(new Request("http://localhost/x/reports/vietnamese"))
    ).rejects.toBe(denied);
    expect(mocks.permissions).toHaveBeenCalledWith(expect.any(Request), {
      view: "accounting",
      role: "employee"
    });
    expect(mocks.database).not.toHaveBeenCalled();
    expect(mocks.execute).not.toHaveBeenCalled();
  });
  it("rejects invalid date filters before reading ledger transactions", async () => {
    mocks.permissions.mockResolvedValue({
      companyId: "company-a",
      companyGroupId: "group-a"
    });
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          id: "company-a",
          name: "Demo",
          currencyCode: "VND",
          timezone: "Asia/Ho_Chi_Minh"
        }
      ]
    });
    await expect(
      loadVietnameseReport(
        new Request(
          "http://localhost/x/reports/vietnamese?startDate=2026-02-30"
        )
      )
    ).rejects.toMatchObject({ status: 400 });
    expect(mocks.execute).toHaveBeenCalledTimes(1);
  });
  it("stops when the authorized company does not belong to the selected group", async () => {
    mocks.permissions.mockResolvedValue({
      companyId: "company-a",
      companyGroupId: "group-a"
    });
    mocks.execute.mockResolvedValueOnce({ rows: [] });
    await expect(
      loadVietnameseReport(new Request("http://localhost/x/reports/vietnamese"))
    ).rejects.toMatchObject({ status: 404 });
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.build).not.toHaveBeenCalled();
  });
  it("does not reconstruct cash-flow classifications for arbitrary cash journals", async () => {
    mocks.permissions.mockResolvedValue({
      companyId: "company-a",
      companyGroupId: "group-a"
    });
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          id: "company-a",
          name: "Demo",
          currencyCode: "VND",
          timezone: "Asia/Ho_Chi_Minh"
        }
      ]
    });
    mocks.execute.mockResolvedValue({ rows: [] });
    mocks.build.mockReturnValue({
      forms: [],
      checks: [],
      warnings: [],
      blocked: false
    });
    await loadVietnameseReport(
      new Request(
        "http://localhost/x/reports/vietnamese?startDate=2026-01-01&endDate=2026-03-31"
      )
    );
    expect(mocks.build).toHaveBeenCalledWith(
      expect.objectContaining({
        period: {
          startDate: "2026-01-01",
          endDate: "2026-03-31",
          priorStartDate: "2025-01-01",
          priorEndDate: "2025-03-31"
        },
        journalLines: [],
        openingBalances: []
      })
    );
  });
  it("quotes CSV text and prevents formula execution while retaining negative numbers", () => {
    expect(vietnameseCsvCell("=SUM(1,2)")).toBe('"\'=SUM(1,2)"');
    expect(vietnameseCsvCell('Tên "giả lập"')).toBe('"Tên ""giả lập"""');
    expect(vietnameseCsvCell(-100)).toBe('"-100"');
  });
  it("refuses CSV export when report validation is blocked", () => {
    const report: Awaited<ReturnType<typeof loadVietnameseReport>> = {
      ...reportFixture(),
      reports: {
        forms: [
          {
            code: "B03-DN",
            title: "Lưu chuyển tiền tệ",
            columns: ["Kỳ này", "Kỳ trước"],
            lines: []
          }
        ],
        blocked: true,
        checks: [],
        warnings: []
      }
    };
    expect(() => vietnameseReportCsv(report, "B03-DN")).toThrow();
    try {
      vietnameseReportCsv(report, "B03-DN");
    } catch (error) {
      expect(error).toMatchObject({ status: 409 });
    }
  });
  it("refuses unreviewed session notes even if numeric validation passes", () => {
    const report: Awaited<ReturnType<typeof loadVietnameseReport>> = {
      ...reportFixture(),
      company: {
        id: "company-a",
        name: "Nhà máy giả lập",
        currencyCode: "VND",
        timezone: "Asia/Ho_Chi_Minh",
        fiscalStartMonth: "January"
      },
      period: {
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        priorStartDate: "2025-01-01",
        priorEndDate: "2025-12-31"
      },
      journalLineCount: 2,
      reports: {
        forms: [
          {
            code: "B01-DN",
            title: "Báo cáo tình hình tài chính",
            columns: ["Cuối kỳ", "Đầu kỳ"],
            lines: [
              {
                code: "280",
                label: "Tổng cộng tài sản",
                current: 100,
                previous: 0,
                note: "Giả lập"
              }
            ]
          }
        ],
        checks: [],
        warnings: [],
        blocked: false
      }
    };
    expect(() => vietnameseReportCsv(report, "B01-DN")).toThrow();
  });
  it("requires update accounting and create documents before any save", async () => {
    const denied = new Response("Forbidden", { status: 403 });
    mocks.permissions.mockRejectedValue(denied);
    await expect(
      saveVietnameseNotes(
        packageRequest(),
        validPackage().notes,
        validPackage().ledgerDigest
      )
    ).rejects.toBe(denied);
    expect(mocks.permissions).toHaveBeenCalledWith(expect.any(Request), {
      update: "accounting",
      create: "documents",
      role: "employee"
    });
    expect(mocks.database).not.toHaveBeenCalled();
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("saves a new immutable DRAFT version bound to tenant, period, ledger and creator", async () => {
    const value = validPackage();
    setupPackage(value);
    const scope = await mocks.permissions();
    mocks.permissions.mockResolvedValue({ ...scope, userId: "author-1" });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.document.mockResolvedValue({ error: null });
    expect(
      await saveVietnameseNotes(
        packageRequest(),
        value.notes,
        value.ledgerDigest
      )
    ).toEqual({
      saved: true,
      status: "DRAFT"
    });
    const [path, blob, options] = mocks.upload.mock.calls[0];
    expect(path).toMatch(
      /^company-a\/accounting\/tt99\/2026-01-01-2026-10-05\/[^/]+\.json$/
    );
    expect(options.upsert).toBe(false);
    expect(JSON.parse(await blob.text())).toMatchObject({
      companyId: "company-a",
      status: "DRAFT",
      statutorySubmission: false,
      createdBy: "author-1",
      ledgerDigest: value.ledgerDigest,
      notes: value.notes
    });
    expect(mocks.document).toHaveBeenCalledWith(
      scope.client,
      expect.objectContaining({
        companyId: "company-a",
        readGroups: ["author-1"],
        writeGroups: ["author-1"],
        createdBy: "author-1",
        path
      })
    );
  });
  it("reloads native persisted draft notes while blocking statutory exports", async () => {
    const value = { ...validPackage(), status: "DRAFT", createdBy: "author-1" };
    setupPackage(value);
    const report = await loadVietnameseReport(packageRequest());
    expect(report.nativeDraft).toMatchObject({
      status: "DRAFT",
      createdBy: "author-1"
    });
    expect(report.demoExportReady).toBe(false);
    expect(report.annualPeriod).toBe(false);
    expect(report.managementExportReady).toBe(true);
    expect(mocks.build).toHaveBeenCalledWith(
      expect.objectContaining({ notes: value.notes })
    );
    expect(() => vietnameseReportCsv(report, "B09-DN")).toThrow();
    const management = vietnameseReportCsv(report, "B09-DN", "management");
    expect(management.status).toBe(200);
    expect(management.headers.get("Content-Disposition")).toContain(
      "DRAFT-B09-DN"
    );
    expect(await management.text()).toContain(
      "DRAFT — BÁO CÁO QUẢN TRỊ — KHÔNG DÙNG NỘP BÁO CÁO CHÍNH THỨC"
    );
  });
  it("never reloads stale native drafts", async () => {
    setupPackage({
      ...validPackage(),
      status: "DRAFT",
      createdBy: "author-1",
      ledgerDigest: "stale"
    });
    const stale = await loadVietnameseReport(packageRequest());
    expect(stale.nativeDraft).toBeNull();
    expect(stale.managementExportReady).toBe(false);
    expect(() => vietnameseReportCsv(stale, "B09-DN", "management")).toThrow();
  });
  it("never exports session-edited notes as persisted management disclosures", async () => {
    setupPackage({ ...validPackage(), status: "DRAFT", createdBy: "author-1" });
    const report = await loadVietnameseReport(packageRequest(), {
      "I.0": "Unsaved note from session"
    });
    expect(report.managementExportReady).toBe(false);
    expect(() => vietnameseReportCsv(report, "B09-DN", "management")).toThrow();
  });
  it("requires all 101 defined note fields before uploading", async () => {
    const value = validPackage();
    setupPackage(value);
    delete value.notes["I.0"];
    await expect(
      saveVietnameseNotes(packageRequest(), value.notes, value.ledgerDigest)
    ).rejects.toMatchObject({ status: 400 });
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.document).not.toHaveBeenCalled();
  });
  it("removes only the newly uploaded object when document insertion fails", async () => {
    const value = validPackage();
    setupPackage(value);
    const scope = await mocks.permissions();
    mocks.permissions.mockResolvedValue({ ...scope, userId: "author-1" });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.document.mockResolvedValue({ error: { message: "Insert denied" } });
    await expect(
      saveVietnameseNotes(packageRequest(), value.notes, value.ledgerDigest)
    ).rejects.toMatchObject({ status: 500 });
    expect(mocks.remove).toHaveBeenCalledWith([mocks.upload.mock.calls[0][0]]);
  });
  it("rejects stale editor ledger digests before uploading or inserting documents", async () => {
    const value = validPackage();
    setupPackage(value);
    await expect(
      saveVietnameseNotes(packageRequest(), value.notes, "stale-editor-digest")
    ).rejects.toMatchObject({ status: 409 });
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.document).not.toHaveBeenCalled();
  });
  it.each([
    "DEMO_PREPARED",
    "DRAFT"
  ])("blocks net-zero unclassified gross controls in %s exports", async (status) => {
    setupPackage({ ...validPackage(), status, createdBy: "author-1" });
    // Classification query and four opening/movement reads precede controls.
    for (let i = 0; i < 5; i++)
      mocks.execute.mockResolvedValueOnce({ rows: [] });
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          accountNumber: "1311",
          partyId: null,
          maturity: null,
          amount: 0,
          unknownPartyLineCount: 2
        }
      ]
    });
    const report = await loadVietnameseReport(packageRequest());
    expect(report.reports.warnings).toContain(
      "OPEN — Công nợ 131/331 chưa có đầy đủ đối tượng hoặc kỳ hạn; cần đối chiếu chi tiết trước khi xuất báo cáo."
    );
    expect(report.demoExportReady).toBe(false);
    expect(report.managementExportReady).toBe(false);
    expect(() =>
      vietnameseReportCsv(
        report,
        "B09-DN",
        status === "DRAFT" ? "management" : "demo"
      )
    ).toThrow();
  });
  it.each([
    "DEMO_PREPARED",
    "DRAFT"
  ])("does not block a known settled party with zero balance and no residual maturity in %s", async (status) => {
    setupPackage({ ...validPackage(), status, createdBy: "author-1" });
    for (let i = 0; i < 5; i++)
      mocks.execute.mockResolvedValueOnce({ rows: [] });
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          accountNumber: "1311",
          partyId: "known-customer",
          maturity: null,
          amount: 0,
          unknownPartyLineCount: 0
        }
      ]
    });
    const report = await loadVietnameseReport(packageRequest());
    expect(
      report.reports.warnings.some((warning) =>
        warning.includes("Công nợ 131/331")
      )
    ).toBe(false);
    expect(
      status === "DRAFT" ? report.managementExportReady : report.demoExportReady
    ).toBe(true);
    expect(
      vietnameseReportCsv(
        report,
        "B09-DN",
        status === "DRAFT" ? "management" : "demo"
      ).status
    ).toBe(200);
  });
  it("recognizes only a complete configured financial year", async () => {
    setupPackage(validPackage());
    mocks.execute.mockReset();
    mocks.execute
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-a",
            name: "Demo",
            currencyCode: "VND",
            timezone: "Asia/Ho_Chi_Minh",
            fiscalStartMonth: "July"
          }
        ]
      })
      .mockResolvedValue({ rows: [] });
    const complete = await loadVietnameseReport(
      new Request(
        "http://localhost/x/reports/vietnamese?startDate=2026-07-01&endDate=2027-06-30"
      )
    );
    expect(complete.annualPeriod).toBe(true);
    mocks.execute.mockReset();
    mocks.execute
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-a",
            name: "Demo",
            currencyCode: "VND",
            timezone: "Asia/Ho_Chi_Minh",
            fiscalStartMonth: "July"
          }
        ]
      })
      .mockResolvedValue({ rows: [] });
    expect(
      (
        await loadVietnameseReport(
          new Request(
            "http://localhost/x/reports/vietnamese?startDate=2026-01-01&endDate=2026-12-31"
          )
        )
      ).annualPeriod
    ).toBe(false);
  });
});
