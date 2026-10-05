// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { EPSILON, round } from "@carbon/database/precision";
import { parseDate } from "@internationalized/date";

export type VietnameseClosingAccount = {
  id: string;
  number: string;
  class: string;
  incomeBalance: string;
  isGroup: boolean;
  active: boolean;
};
export type VietnameseClosingBalance = { accountId: string; amount: number };
export type VietnameseClosingMovement = VietnameseClosingBalance & {
  postingDate: string;
  status: "Posted" | "Reversed" | "Draft";
};
export type VietnameseClosingInput = {
  companyId: string;
  startDate: string;
  endDate: string;
  accounts: VietnameseClosingAccount[];
  /** Debit-positive opening balances immediately before startDate. */
  openingBalances: VietnameseClosingBalance[];
  /** Include originals and reversing entries; do not remove Reversed originals. */
  movements: VietnameseClosingMovement[];
};
export type VietnameseClosingLine = {
  accountId: string;
  accountNumber: string;
  debit: number;
  credit: number;
};
export type VietnameseClosingStep = {
  kind: "discounts" | "income" | "result";
  description: string;
  lines: VietnameseClosingLine[];
};
export type VietnameseClosingPlan = {
  key: string;
  blocked: boolean;
  issues: string[];
  steps: VietnameseClosingStep[];
  netIncome: number;
};

const revenue = /^(511|515|711)/;
const expense = /^(632|635|641|642|811|821)/;
const discounts = /^521/;
const collectors = /^(621|622|627)/;

/** TT99 Appendix II, TK 521 and TK 911. The caller posts atomically in an open
 * period and enforces company/window idempotency; this function never writes. */
export function buildVietnameseClosingPlan(
  input: VietnameseClosingInput
): VietnameseClosingPlan {
  const issues: string[] = [];
  const plan: VietnameseClosingPlan = {
    key: `tt99-close:${input.companyId}:${input.startDate}:${input.endDate}`,
    blocked: false,
    issues,
    steps: [],
    netIncome: 0
  };
  try {
    if (!input.companyId || input.startDate > input.endDate) throw new Error();
    for (const date of [input.startDate, input.endDate]) {
      if (parseDate(date).toString() !== date) throw new Error();
    }
  } catch {
    issues.push("Công ty hoặc khoảng ngày kết chuyển không hợp lệ.");
  }
  const accounts = new Map<string, VietnameseClosingAccount>();
  const balances = new Map<string, number>();
  for (const account of input.accounts) {
    if (accounts.has(account.id)) issues.push(`Trùng tài khoản ${account.id}.`);
    accounts.set(account.id, account);
  }
  const add = (balance: VietnameseClosingBalance) => {
    if (!Number.isFinite(balance.amount)) {
      issues.push(`Số dư không hợp lệ: ${balance.accountId}.`);
      return;
    }
    if (!accounts.has(balance.accountId)) {
      issues.push(`Không tìm thấy tài khoản ${balance.accountId}.`);
      return;
    }
    balances.set(
      balance.accountId,
      round((balances.get(balance.accountId) ?? 0) + balance.amount)
    );
  };
  input.openingBalances.forEach(add);
  for (const movement of input.movements) {
    try {
      if (parseDate(movement.postingDate).toString() !== movement.postingDate)
        throw new Error();
    } catch {
      issues.push(`Ngày hạch toán không hợp lệ: ${movement.postingDate}.`);
      continue;
    }
    if (
      movement.status !== "Draft" &&
      movement.postingDate >= input.startDate &&
      movement.postingDate <= input.endDate
    )
      add(movement);
  }
  const posting = (account: VietnameseClosingAccount) =>
    account.active && !account.isGroup;
  for (const [id, amount] of balances) {
    if (Math.abs(amount) <= EPSILON) continue;
    const account = accounts.get(id)!;
    if (collectors.test(account.number))
      issues.push(
        `TK ${account.number} còn số dư chi phí sản xuất; kết chuyển vào 154 trước khi xác định kết quả.`
      );
    if (/^911/.test(account.number))
      issues.push(
        `TK ${account.number} còn số dư; cần đối soát kết chuyển trước đó.`
      );
    if (
      revenue.test(account.number) ||
      expense.test(account.number) ||
      discounts.test(account.number)
    ) {
      const expectedClass = revenue.test(account.number)
        ? "Revenue"
        : "Expense";
      if (
        !posting(account) ||
        // Contra revenue may use Revenue or the legacy Expense class. Input
        // amounts are already debit-positive, so neither needs a chart rewrite.
        (discounts.test(account.number)
          ? !["Revenue", "Expense"].includes(account.class)
          : account.class !== expectedClass) ||
        account.incomeBalance !== "Income Statement"
      )
        issues.push(
          `TK ${account.number} không phải tài khoản ghi sổ ${expectedClass} tương thích.`
        );
    } else if (
      account.incomeBalance === "Income Statement" &&
      !collectors.test(account.number) &&
      !/^911/.test(account.number)
    ) {
      issues.push(`TK ${account.number} chưa có quy tắc kết chuyển TT99.`);
    }
  }
  const sorted = [...accounts.values()].sort((a, b) =>
    a.number.localeCompare(b.number)
  );
  const target = (
    prefix: string,
    accountClass: string,
    incomeBalance: string
  ) => {
    const match = sorted.find(
      (account) =>
        account.number.startsWith(prefix) &&
        posting(account) &&
        account.class === accountClass &&
        account.incomeBalance === incomeBalance
    );
    if (!match)
      issues.push(
        `Thiếu tài khoản ghi sổ ${prefix} (${accountClass}, ${incomeBalance}).`
      );
    return match;
  };
  const hasIncome = sorted.some(
    (a) =>
      (revenue.test(a.number) ||
        expense.test(a.number) ||
        discounts.test(a.number)) &&
      Math.abs(balances.get(a.id) ?? 0) > EPSILON
  );
  if (!hasIncome) {
    plan.blocked = issues.length > 0;
    return plan;
  }
  const clearing = target("911", "Expense", "Income Statement");
  const retained = target("4212", "Equity", "Balance Sheet");
  const hasDiscounts = sorted.some(
    (a) =>
      discounts.test(a.number) && Math.abs(balances.get(a.id) ?? 0) > EPSILON
  );
  const sales = hasDiscounts
    ? target("511", "Revenue", "Income Statement")
    : undefined;
  if (issues.length > 0 || !clearing || !retained) {
    plan.blocked = true;
    return plan;
  }
  const line = (
    account: VietnameseClosingAccount,
    amount: number
  ): VietnameseClosingLine => ({
    accountId: account.id,
    accountNumber: account.number,
    debit: Math.max(0, round(amount)),
    credit: Math.max(0, round(-amount))
  });
  const transfer = (
    account: VietnameseClosingAccount,
    destination: VietnameseClosingAccount,
    amount: number
  ): VietnameseClosingLine[] => {
    balances.set(account.id, 0);
    balances.set(
      destination.id,
      round((balances.get(destination.id) ?? 0) + amount)
    );
    return [line(account, -amount), line(destination, amount)];
  };
  const discountLines = sorted
    .filter((a) => discounts.test(a.number))
    .flatMap((a) => {
      const amount = balances.get(a.id) ?? 0;
      return Math.abs(amount) > EPSILON && sales
        ? transfer(a, sales, amount)
        : [];
    });
  if (discountLines.length)
    plan.steps.push({
      kind: "discounts",
      description: "Kết chuyển các khoản giảm trừ doanh thu 521 vào 511",
      lines: discountLines
    });
  const incomeLines = sorted
    .filter((a) => revenue.test(a.number) || expense.test(a.number))
    .flatMap((a) => {
      const amount = balances.get(a.id) ?? 0;
      return Math.abs(amount) > EPSILON ? transfer(a, clearing, amount) : [];
    });
  if (incomeLines.length)
    plan.steps.push({
      kind: "income",
      description: "Kết chuyển doanh thu thuần và chi phí vào 911",
      lines: incomeLines
    });
  const result = balances.get(clearing.id) ?? 0;
  plan.netIncome = round(-result);
  if (Math.abs(result) > EPSILON)
    plan.steps.push({
      kind: "result",
      description:
        result < 0 ? "Kết chuyển lãi vào 4212" : "Kết chuyển lỗ vào 4212",
      lines: transfer(clearing, retained, result)
    });
  return plan;
}
