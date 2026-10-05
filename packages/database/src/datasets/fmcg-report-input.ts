// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { parseDate } from "@internationalized/date";
import type {
  VietnameseControlBalance,
  VietnameseJournalLine,
  VietnameseReportInput
} from "../../../../apps/erp/app/modules/accounting/vietnamese-reports.ts";
import { round } from "../precision.ts";

export type FmcgReportSnapshot = {
  company: VietnameseReportInput["company"] & { today: string };
  journalLines: Array<
    VietnameseJournalLine & { maturity?: "current" | "noncurrent" }
  >;
  classifications: Array<{
    number: string;
    classification: {
      maturity?: string;
      balanceSheetCode?: string;
      incomeStatementCode?: string;
    } | null;
  }>;
};

/** Same debit-positive ledger and calendar window used by the scoped report loader. */
export function fmcgReportInput(
  snapshot: FmcgReportSnapshot
): VietnameseReportInput {
  const end = parseDate(snapshot.company.today);
  const start = end.set({ month: 1, day: 1 });
  const period = {
    startDate: start.toString(),
    endDate: end.toString(),
    priorStartDate: start.subtract({ years: 1 }).toString(),
    priorEndDate: end.subtract({ years: 1 }).toString()
  };
  const opening = (before: string) => {
    const values = new Map<string, number>();
    for (const line of snapshot.journalLines) {
      if (line.postingDate < before)
        values.set(
          line.accountNumber,
          (values.get(line.accountNumber) ?? 0) + line.amount
        );
    }
    return [...values].map(([accountNumber, amount]) => ({
      accountNumber,
      amount: round(amount)
    }));
  };
  const controls = (at: string, exclusive = false) => {
    const values = new Map<string, VietnameseControlBalance>();
    for (const line of snapshot.journalLines) {
      if (exclusive ? line.postingDate >= at : line.postingDate > at) continue;
      if (
        !/^(131|331)/.test(line.accountNumber) ||
        !line.partyId ||
        !line.maturity
      )
        continue;
      const key = `${line.accountNumber}/${line.partyId}/${line.maturity}`;
      const current = values.get(key) ?? {
        accountNumber: line.accountNumber,
        partyId: line.partyId,
        maturity: line.maturity,
        amount: 0
      };
      current.amount += line.amount;
      values.set(key, current);
    }
    return [...values.values()].map((row) => ({
      ...row,
      amount: round(row.amount)
    }));
  };
  const classifications = Object.fromEntries(
    snapshot.classifications.map(({ number, classification }) => [
      number,
      {
        balanceSheetCode:
          classification?.balanceSheetCode ??
          (number.startsWith("341")
            ? classification?.maturity === "current"
              ? "321"
              : classification?.maturity === "noncurrent"
                ? "339"
                : undefined
            : number.startsWith("242")
              ? classification?.maturity === "current"
                ? "161"
                : classification?.maturity === "noncurrent"
                  ? "271"
                  : undefined
              : undefined),
        incomeStatementCode: classification?.incomeStatementCode
      }
    ])
  );
  return {
    company: snapshot.company,
    period,
    openingBalances: opening(period.startDate),
    priorOpeningBalances: opening(period.priorStartDate),
    journalLines: snapshot.journalLines.filter(
      (line) =>
        line.postingDate >= period.startDate &&
        line.postingDate <= period.endDate
    ),
    priorJournalLines: snapshot.journalLines.filter(
      (line) =>
        line.postingDate >= period.priorStartDate &&
        line.postingDate <= period.priorEndDate
    ),
    controlBalances: controls(period.endDate),
    openingControlBalances: controls(period.startDate, true),
    priorControlBalances: controls(period.priorEndDate),
    accountClassifications: classifications
  };
}
