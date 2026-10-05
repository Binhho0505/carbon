// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  permissions: vi.fn(),
  database: vi.fn(),
  sql: vi.fn(),
  sequence: vi.fn(),
  company: vi.fn(),
  chart: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  transaction: vi.fn()
}));
vi.mock("@carbon/auth/auth.server", () => ({
  requirePermissions: mocks.permissions
}));
vi.mock("~/services/database.server", () => ({
  getDatabaseClient: mocks.database
}));
vi.mock("@carbon/database/sequence", () => ({
  getNextSequence: mocks.sequence
}));
vi.mock("kysely", () => ({
  sql: (...args: unknown[]) => ({ execute: () => mocks.sql(...args) })
}));

import {
  loadVietnameseClosing,
  postVietnameseClosing,
  previewVietnameseClosingForScope
} from "./vietnamese-closing.server";

const accounts = [
  {
    id: "sales",
    number: "5111",
    class: "Revenue",
    incomeBalance: "Income Statement"
  },
  {
    id: "cost",
    number: "632",
    class: "Expense",
    incomeBalance: "Income Statement"
  },
  {
    id: "result",
    number: "911",
    class: "Expense",
    incomeBalance: "Income Statement"
  },
  {
    id: "equity",
    number: "4212",
    class: "Equity",
    incomeBalance: "Balance Sheet"
  }
].map((a) => ({ ...a, active: true, isGroup: false }));
const window = { startDate: "2026-01-01", endDate: "2026-10-05" };
const scope = {
  companyId: "company-a",
  companyGroupId: "group-a",
  userId: "user-a"
};
let periodStatus = "Open";
let existing: { id: string; status: string }[] = [];
let movementAmount = -100;
let costAmount = 60;
let fiscalStartMonth = "January";
let priorFiscalBalances: { accountId: string; amount: number }[] = [];
let db: ReturnType<typeof setupDb>;
function setupDb() {
  const select = {
    select: vi.fn(),
    where: vi.fn(),
    executeTakeFirst: mocks.company,
    execute: mocks.chart
  };
  select.select.mockReturnValue(select);
  select.where.mockReturnValue(select);
  const insert = {
    values: mocks.insert,
    returning: vi.fn(),
    executeTakeFirstOrThrow: vi.fn(async () => ({ id: "journal-new" })),
    execute: vi.fn(async () => [])
  };
  mocks.insert.mockReturnValue(insert);
  insert.returning.mockReturnValue(insert);
  const update = {
    set: mocks.update,
    where: vi.fn(),
    executeTakeFirstOrThrow: vi.fn(async () => ({ numUpdatedRows: BigInt(1) }))
  };
  mocks.update.mockReturnValue(update);
  update.where.mockReturnValue(update);
  const connection = {
    selectFrom: vi.fn(() => select),
    insertInto: vi.fn(() => insert),
    updateTable: vi.fn(() => update),
    transaction: vi.fn()
  };
  connection.transaction.mockReturnValue({
    setIsolationLevel: vi.fn(() => ({ execute: mocks.transaction }))
  });
  mocks.transaction.mockImplementation((callback) => callback(connection));
  return connection;
}
beforeEach(() => {
  vi.clearAllMocks();
  periodStatus = "Open";
  existing = [];
  movementAmount = -100;
  costAmount = 60;
  fiscalStartMonth = "January";
  priorFiscalBalances = [];
  db = setupDb();
  mocks.permissions.mockResolvedValue(scope);
  mocks.database.mockReturnValue(db);
  mocks.company.mockResolvedValue({
    id: "company-a",
    name: "Demo",
    baseCurrencyCode: "VND",
    timezone: "Asia/Ho_Chi_Minh"
  });
  mocks.chart.mockResolvedValue(accounts);
  mocks.sequence.mockResolvedValue("JE-1");
  mocks.sql.mockImplementation(async (parts: TemplateStringsArray) => {
    const statement = parts.join("?");
    if (statement.includes('FROM "fiscalYearSettings"'))
      return { rows: [{ startMonth: fiscalStartMonth }] };
    if (statement.includes("a.\"incomeBalance\"='Income Statement'"))
      return { rows: priorFiscalBalances };
    if (statement.includes("FROM account WHERE")) return { rows: accounts };
    if (statement.includes(" AS status"))
      return {
        rows: [
          {
            accountId: "sales",
            amount: movementAmount,
            postingDate: window.endDate,
            status: "Posted"
          },
          {
            accountId: "cost",
            amount: costAmount,
            postingDate: window.endDate,
            status: "Posted"
          }
        ]
      };
    if (statement.includes("sum(CASE")) return { rows: [] };
    if (statement.includes('SELECT id,"closeStatus"'))
      return {
        rows: [{ id: "period-a", closeStatus: periodStatus, ...window }]
      };
    if (statement.includes("closingKey")) return { rows: existing };
    return { rows: [] };
  });
});
const request = () =>
  new Request(
    "http://localhost:3000/x/accounting/vietnamese?startDate=2026-01-01&endDate=2026-10-05",
    { method: "POST" }
  );
async function fingerprint() {
  return (await previewVietnameseClosingForScope(db as never, scope, window))
    .fingerprint;
}

describe("native TT99 closing transaction", () => {
  it("blocks dates in 2026 belonging to a July-2025 fiscal year under TT99 Article31", async () => {
    fiscalStartMonth = "July";
    const dates = { startDate: "2026-01-01", endDate: "2026-06-30" };
    const preview = await previewVietnameseClosingForScope(
      db as never,
      scope,
      dates
    );
    expect(preview.fiscalYear.startDate).toBe("2025-07-01");
    expect(preview.plan.blocked).toBe(true);
    expect(preview.plan.issues.join(" ")).toContain(
      "năm tài chính bắt đầu từ ngày 01/01/2026"
    );
    await expect(
      postVietnameseClosing(request(), dates, preview.fingerprint)
    ).rejects.toHaveProperty("status", 409);
    expect(mocks.insert).not.toHaveBeenCalled();
    const eligible = await previewVietnameseClosingForScope(
      db as never,
      scope,
      { startDate: "2026-07-01", endDate: "2026-10-05" }
    );
    expect(eligible.plan.blocked).toBe(false);
  });
  it("blocks a closing spanning fiscal years before posting", async () => {
    const dates = { startDate: "2026-01-01", endDate: "2027-02-01" };
    const preview = await previewVietnameseClosingForScope(
      db as never,
      scope,
      dates
    );
    expect(preview.plan.blocked).toBe(true);
    expect(preview.plan.issues.join(" ")).toContain("nhiều năm");
    await expect(
      postVietnameseClosing(request(), dates, preview.fingerprint)
    ).rejects.toHaveProperty("status", 409);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("blocks prior fiscal income balances even when their total cancels", async () => {
    priorFiscalBalances = [
      { accountId: "sales", amount: -60 },
      { accountId: "cost", amount: 60 }
    ];
    const preview = await previewVietnameseClosingForScope(
      db as never,
      scope,
      window
    );
    expect(preview.plan.issues.join(" ")).toContain("năm tài chính trước");
    await expect(
      postVietnameseClosing(request(), window, preview.fingerprint)
    ).rejects.toHaveProperty("status", 409);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("uses July fiscal start for defaults and rejects windows crossing June/July", async () => {
    fiscalStartMonth = "July";
    const loaded = await loadVietnameseClosing(
      new Request(
        "http://localhost:3000/x/accounting/vietnamese?endDate=2026-10-05"
      )
    );
    expect(loaded.window.startDate).toBe("2026-07-01");
    expect(loaded.fiscalYear.endDate).toBe("2027-06-30");
    expect(loaded.plan.blocked).toBe(false);
    const crossed = await previewVietnameseClosingForScope(db as never, scope, {
      startDate: "2026-06-01",
      endDate: "2026-07-31"
    });
    expect(crossed.plan.blocked).toBe(true);
  });
  it("binds fiscal configuration and prior income balances in the preview fingerprint", async () => {
    const before = await fingerprint();
    priorFiscalBalances = [{ accountId: "sales", amount: -1 }];
    expect(await fingerprint()).not.toBe(before);
    priorFiscalBalances = [];
    fiscalStartMonth = "July";
    expect(await fingerprint()).not.toBe(before);
  });
  it("authenticates before constructing a privileged database for preview and posting", async () => {
    mocks.permissions.mockRejectedValue(
      new Response("Forbidden", { status: 403 })
    );
    await expect(loadVietnameseClosing(request())).rejects.toHaveProperty(
      "status",
      403
    );
    await expect(
      postVietnameseClosing(request(), window, "a".repeat(64))
    ).rejects.toHaveProperty("status", 403);
    expect(mocks.database).not.toHaveBeenCalled();
  });
  it("posts profit in one serializable transaction using natural account signs and native Draft→Posted", async () => {
    const digest = await fingerprint();
    const result = await postVietnameseClosing(request(), window, digest);
    expect(mocks.permissions).toHaveBeenLastCalledWith(expect.any(Request), {
      create: "accounting",
      update: "accounting",
      role: "employee"
    });
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(result.journalIds).toHaveLength(2);
    const lineBatches = mocks.insert.mock.calls
      .map(([value]) => value)
      .filter(Array.isArray);
    expect(lineBatches[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accountId: "sales",
          amount: -100,
          companyId: "company-a"
        }),
        expect.objectContaining({ accountId: "cost", amount: -60 })
      ])
    );
    expect(lineBatches[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ accountId: "equity", amount: 40 }),
        expect.objectContaining({ accountId: "result", amount: 40 })
      ])
    );
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "Posted", postedBy: "user-a" })
    );
  });
  it("rejects changed preview before inserting journals", async () => {
    const digest = await fingerprint();
    movementAmount = -101;
    await expect(
      postVietnameseClosing(request(), window, digest)
    ).rejects.toHaveProperty("status", 409);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it.each([
    "Locked",
    "Closed"
  ])("rejects %s period even though native manual posting permits Locked", async (status) => {
    periodStatus = status;
    await expect(
      postVietnameseClosing(request(), window, await fingerprint())
    ).rejects.toHaveProperty("status", 409);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("rejects reversed prior closing rather than silently creating a new closing", async () => {
    existing = [{ id: "old", status: "Reversed" }];
    await expect(
      postVietnameseClosing(request(), window, await fingerprint())
    ).rejects.toHaveProperty("status", 409);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("returns the existing posted closing without creating duplicates on a repeat request", async () => {
    existing = [
      { id: "old-income", status: "Posted" },
      { id: "old-result", status: "Posted" }
    ];
    movementAmount = 0;
    costAmount = 0;
    const result = await postVietnameseClosing(
      request(),
      window,
      await fingerprint()
    );
    expect(result).toEqual({
      journalIds: ["old-income", "old-result"],
      alreadyPosted: true
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("scopes chart and ledger SQL to the authorized company and group", async () => {
    await fingerprint();
    const ledgerCalls = mocks.sql.mock.calls.filter(([parts]) =>
      parts.join("?").includes('FROM "journalLine"')
    );
    expect(ledgerCalls).toHaveLength(3);
    for (const [, ...parameters] of ledgerCalls) {
      expect(parameters).toContain("group-a");
      expect(parameters.filter((value) => value === "company-a")).toHaveLength(
        2
      );
    }
  });
  it("propagates a native posting failure so its enclosing transaction rolls back all steps", async () => {
    mocks.update.mockImplementationOnce(() => {
      throw new Error("Native posting constraint");
    });
    await expect(
      postVietnameseClosing(request(), window, await fingerprint())
    ).rejects.toThrow("Native posting constraint");
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
  });
  it("rejects invalid TT99 date before accessing ledger", async () => {
    await expect(
      postVietnameseClosing(
        request(),
        { ...window, startDate: "2025-01-01" },
        "a".repeat(64)
      )
    ).rejects.toHaveProperty("status", 400);
    expect(mocks.database).not.toHaveBeenCalled();
  });
});
