// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { describe, expect, it } from "vitest";
import {
  buildVietnameseClosingPlan,
  type VietnameseClosingAccount,
  type VietnameseClosingInput
} from "./vietnamese-closing";

const accounts: VietnameseClosingAccount[] = [
  ["5111", "Revenue", "Income Statement"],
  ["515", "Revenue", "Income Statement"],
  ["5211", "Expense", "Income Statement"],
  ["632", "Expense", "Income Statement"],
  ["8212", "Expense", "Income Statement"],
  ["622", "Expense", "Income Statement"],
  ["154", "Asset", "Balance Sheet"],
  ["911", "Expense", "Income Statement"],
  ["4212", "Equity", "Balance Sheet"]
].map(([number, accountClass, incomeBalance]) => ({
  id: number!,
  number: number!,
  class: accountClass!,
  incomeBalance: incomeBalance!,
  active: true,
  isGroup: false
}));
const input = (amounts: Record<string, number>): VietnameseClosingInput => ({
  companyId: "company-A",
  startDate: "2026-01-01",
  endDate: "2026-10-05",
  accounts,
  openingBalances: [],
  movements: Object.entries(amounts).map(([accountId, amount]) => ({
    accountId,
    amount,
    postingDate: "2026-10-05",
    status: "Posted"
  }))
});
const apply = (request: VietnameseClosingInput) => {
  const plan = buildVietnameseClosingPlan(request);
  const balances = new Map<string, number>();
  for (const row of [...request.openingBalances, ...request.movements])
    balances.set(
      row.accountId,
      (balances.get(row.accountId) ?? 0) + row.amount
    );
  for (const step of plan.steps) {
    expect(
      step.lines.reduce((total, line) => total + line.debit - line.credit, 0)
    ).toBeCloseTo(0, 5);
    for (const line of step.lines)
      balances.set(
        line.accountId,
        (balances.get(line.accountId) ?? 0) + line.debit - line.credit
      );
  }
  return { plan, balances };
};

describe("TT99 closing preview", () => {
  it("accepts contra-revenue521 without requiring an expense class remapping", () => {
    const request = input({ 5111: -100, 5211: 10, 632: 60 });
    request.accounts = accounts.map((account) =>
      account.number === "5211" ? { ...account, class: "Revenue" } : account
    );
    expect(buildVietnameseClosingPlan(request).blocked).toBe(false);
    expect(buildVietnameseClosingPlan(request).netIncome).toBe(30);
  });
  it("closes discounts first, profit through911 then4212 and leaves every income account zero", () => {
    const { plan, balances } = apply(
      input({ 5111: -1000, 515: -20, 5211: 50, 632: 600 })
    );
    expect(plan.blocked).toBe(false);
    expect(plan.steps.map((step) => step.kind)).toEqual([
      "discounts",
      "income",
      "result"
    ]);
    expect(plan.netIncome).toBe(370);
    for (const account of ["5111", "515", "5211", "632", "911"])
      expect(balances.get(account)).toBe(0);
    expect(balances.get("4212")).toBe(-370);
  });
  it("posts loss as debit4212, including credit deferred tax expense", () => {
    const { plan, balances } = apply(
      input({ 5111: -100, 632: 250, 8212: -20 })
    );
    expect(plan.netIncome).toBe(-130);
    expect(balances.get("4212")).toBe(130);
    expect(balances.get("911")).toBe(0);
  });
  it("is empty on rerun after its closing journals and includes reversed originals and reversal", () => {
    const request = input({ 5111: -100, 632: 60 });
    const first = buildVietnameseClosingPlan(request);
    for (const step of first.steps)
      for (const row of step.lines)
        request.movements.push({
          accountId: row.accountId,
          amount: row.debit - row.credit,
          postingDate: request.endDate,
          status: "Posted"
        });
    request.movements.push(
      {
        accountId: "515",
        amount: -50,
        postingDate: request.endDate,
        status: "Reversed"
      },
      {
        accountId: "515",
        amount: 50,
        postingDate: request.endDate,
        status: "Posted"
      }
    );
    const second = buildVietnameseClosingPlan(request);
    expect(second.blocked).toBe(false);
    expect(second.steps).toEqual([]);
    expect(second.key).toBe(first.key);
  });
  it("includes carried income but ignores drafts and postings outside the window", () => {
    const request = input({ 5111: -100 });
    request.openingBalances.push({ accountId: "632", amount: 60 });
    request.movements.push(
      {
        accountId: "632",
        amount: 100,
        postingDate: "2026-10-06",
        status: "Posted"
      },
      {
        accountId: "632",
        amount: 100,
        postingDate: request.endDate,
        status: "Draft"
      }
    );
    expect(buildVietnameseClosingPlan(request).netIncome).toBe(40);
  });
  it("blocks uncleared manufacturing collectors but accepts their already closed net balance", () => {
    const request = input({ 5111: -100, 622: 25 });
    expect(buildVietnameseClosingPlan(request).blocked).toBe(true);
    request.movements.push(
      {
        accountId: "622",
        amount: -25,
        postingDate: request.endDate,
        status: "Posted"
      },
      {
        accountId: "154",
        amount: 25,
        postingDate: request.endDate,
        status: "Posted"
      }
    );
    expect(buildVietnameseClosingPlan(request).blocked).toBe(false);
  });
  it.each([
    "missing911",
    "missing4212",
    "inactive",
    "group",
    "misclassified",
    "old911",
    "unknownIncome",
    "nan",
    "date",
    "unknownAccount"
  ])("holds unsafe plan: %s", (failure) => {
    const request = input({ 5111: -100, 632: 60 });
    request.accounts = accounts.map((account) => ({ ...account }));
    if (failure === "missing911")
      request.accounts = request.accounts.filter((a) => a.number !== "911");
    if (failure === "missing4212")
      request.accounts = request.accounts.filter((a) => a.number !== "4212");
    if (failure === "inactive")
      request.accounts.find((a) => a.number === "632")!.active = false;
    if (failure === "group")
      request.accounts.find((a) => a.number === "911")!.isGroup = true;
    if (failure === "misclassified")
      request.accounts.find((a) => a.number === "5111")!.class = "Asset";
    if (failure === "old911")
      request.openingBalances.push({ accountId: "911", amount: 3 });
    if (failure === "unknownIncome") {
      request.accounts.push({ ...accounts[0]!, id: "999", number: "999" });
      request.openingBalances.push({ accountId: "999", amount: -3 });
    }
    if (failure === "nan")
      request.openingBalances.push({ accountId: "632", amount: Number.NaN });
    if (failure === "date") request.endDate = "2026-02-30";
    if (failure === "unknownAccount")
      request.openingBalances.push({ accountId: "outside-company", amount: 1 });
    const result = buildVietnameseClosingPlan(request);
    expect(result.blocked).toBe(true);
    expect(result.steps).toEqual([]);
    expect(result.issues.length).toBeGreaterThan(0);
  });
  it("keeps PostgreSQL-compatible five-decimal transfer precision", () => {
    const { plan, balances } = apply(
      input({ 5111: -1.00001, 632: 0.30001, 5211: 0.00001 })
    );
    expect(plan.netIncome).toBe(0.69999);
    expect(balances.get("911")).toBeCloseTo(0, 5);
  });
});
