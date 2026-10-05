// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { readFileSync, writeFileSync } from "node:fs";
import { parseDate } from "@internationalized/date";
import {
  buildVietnameseReports,
  type VietnameseControlBalance,
  type VietnameseJournalLine,
  type VietnameseOpeningBalance,
} from "../apps/erp/app/modules/accounting/vietnamese-reports.ts";

type Snapshot = {
  company: { id: string; name: string; currencyCode: string; today: string };
  journalLines: Array<VietnameseJournalLine & { maturity?: "current" | "noncurrent" }>;
  classifications: Array<{ number: string; classification: { maturity?: string; balanceSheetCode?: string; incomeStatementCode?: string } | null }>;
};
const evidencePath = process.argv[2] ?? ".cc1-agentic/fmcg-dry-run.json";
const outputPath = process.argv[3] ?? ".cc1-agentic/fmcg-reports.json";
const snapshot: Snapshot = JSON.parse(readFileSync(evidencePath, "utf8")).verification.reportSnapshot;
if (!snapshot) throw new Error("Seed evidence lacks report snapshot.");
const end = parseDate(snapshot.company.today);
const start = end.set({ month: 1, day: 1 });
const period = {
  startDate: start.toString(), endDate: end.toString(),
  priorStartDate: start.subtract({ years: 1 }).toString(),
  priorEndDate: end.subtract({ years: 1 }).toString(),
};
const opening = (before: string): VietnameseOpeningBalance[] => {
  const values = new Map<string, number>();
  for (const line of snapshot.journalLines) {
    if (line.postingDate < before) values.set(line.accountNumber, (values.get(line.accountNumber) ?? 0) + line.amount);
  }
  return [...values].map(([accountNumber, amount]) => ({ accountNumber, amount }));
};
const controls = (at: string, exclusive = false): VietnameseControlBalance[] => {
  const values = new Map<string, VietnameseControlBalance>();
  for (const line of snapshot.journalLines) {
    if (exclusive ? line.postingDate >= at : line.postingDate > at) continue;
    if (!/^(131|331)/.test(line.accountNumber) || !line.partyId || !line.maturity) continue;
    const key = `${line.accountNumber}/${line.partyId}/${line.maturity}`;
    const current = values.get(key) ?? { accountNumber: line.accountNumber, partyId: line.partyId, maturity: line.maturity, amount: 0 };
    current.amount += line.amount;
    values.set(key, current);
  }
  return [...values.values()];
};
const accountClassifications = Object.fromEntries(snapshot.classifications.map(({ number, classification }) => [number, {
  balanceSheetCode: classification?.balanceSheetCode ?? (
    number.startsWith("341") ? classification?.maturity === "current" ? "321" : classification?.maturity === "noncurrent" ? "339" : undefined :
    number.startsWith("242") ? classification?.maturity === "current" ? "161" : classification?.maturity === "noncurrent" ? "271" : undefined : undefined
  ), incomeStatementCode: classification?.incomeStatementCode,
}]));
const reports = buildVietnameseReports({
  company: snapshot.company, period,
  openingBalances: opening(period.startDate), priorOpeningBalances: opening(period.priorStartDate),
  journalLines: snapshot.journalLines.filter((line) => line.postingDate >= period.startDate && line.postingDate <= period.endDate),
  priorJournalLines: snapshot.journalLines.filter((line) => line.postingDate >= period.priorStartDate && line.postingDate <= period.priorEndDate),
  controlBalances: controls(period.endDate), openingControlBalances: controls(period.startDate, true),
  priorControlBalances: controls(period.priorEndDate), accountClassifications,
});
writeFileSync(outputPath, `${JSON.stringify({ period, ...reports }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ forms: reports.forms.map((form) => ({ code: form.code, rows: form.lines.length })), checks: reports.checks, warnings: reports.warnings, blocked: reports.blocked }, null, 2));
// Missing narrative disclosures remain OPEN; numeric failures are never treated as success.
if (reports.checks.some((check) => check.id !== "notes" && !check.passed)) process.exitCode = 1;
