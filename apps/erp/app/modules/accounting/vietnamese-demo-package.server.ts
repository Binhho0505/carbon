// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { createHash } from "node:crypto";
import { round } from "@carbon/database/precision";
import {
  VIETNAMESE_NOTE_DEFINITIONS,
  type VietnameseReportInput
} from "./vietnamese-reports";

export type VietnameseDemoPackage = {
  schemaVersion: 1;
  companyId: string;
  period: VietnameseReportInput["period"];
  ledgerDigest: string;
  status: "DEMO_PREPARED";
  statutorySubmission: false;
  notes: Record<string, string>;
};

/** Bind disclosures to the actual ledger and classifications, independently of row order. */
export function vietnameseLedgerDigest(input: VietnameseReportInput): string {
  const balances = (rows: VietnameseReportInput["openingBalances"]) =>
    rows
      .map(({ accountNumber, amount }) => [accountNumber, round(amount)])
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const movements = (rows: VietnameseReportInput["journalLines"]) => {
    const codes = new Map<string, Set<string>>();
    for (const row of rows) {
      if (!row.cashFlowCode) continue;
      const group = codes.get(row.journalId) ?? new Set<string>();
      group.add(row.cashFlowCode);
      codes.set(row.journalId, group);
    }
    // The engine classifies distinct codes per journal, not per duplicate tag.
    return {
      lines: rows
        .map(({ journalId, postingDate, accountNumber, amount }) => [
          journalId,
          postingDate,
          accountNumber,
          round(amount)
        ])
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
      cashFlowCodes: [...codes]
        .map(([id, group]) => [id, [...group].sort()])
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
    };
  };
  const controls = (
    rows: NonNullable<VietnameseReportInput["controlBalances"]>
  ) =>
    rows
      .filter((row) => round(row.amount) !== 0)
      .map(({ accountNumber, partyId, maturity, amount }) => [
        accountNumber,
        partyId,
        maturity,
        round(amount)
      ])
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const classifications = Object.entries(input.accountClassifications ?? {})
    .map(([number, value]) => [
      number,
      value.balanceSheetCode ?? null,
      value.incomeStatementCode ?? null
    ])
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return createHash("sha256")
    .update(
      JSON.stringify({
        companyId: input.company.id,
        currency: input.company.currencyCode,
        period: input.period,
        opening: balances(input.openingBalances),
        priorOpening: balances(input.priorOpeningBalances ?? []),
        movements: movements(input.journalLines),
        priorMovements: movements(input.priorJournalLines ?? []),
        controls: controls(input.controlBalances ?? []),
        openingControls: controls(input.openingControlBalances ?? []),
        priorControls: controls(input.priorControlBalances ?? []),
        classifications
      })
    )
    .digest("hex");
}

export function validateVietnameseDemoPackage(
  value: unknown,
  input: VietnameseReportInput
): value is VietnameseDemoPackage {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<VietnameseDemoPackage>;
  if (
    item.schemaVersion !== 1 ||
    item.status !== "DEMO_PREPARED" ||
    item.statutorySubmission !== false ||
    item.companyId !== input.company.id ||
    item.ledgerDigest !== vietnameseLedgerDigest(input) ||
    !item.period ||
    !item.notes
  )
    return false;
  if (
    Object.entries(input.period).some(
      ([key, date]) => item.period?.[key as keyof typeof item.period] !== date
    )
  )
    return false;
  if (Object.keys(item.notes).length !== VIETNAMESE_NOTE_DEFINITIONS.length)
    return false;
  return VIETNAMESE_NOTE_DEFINITIONS.every(([code]) => {
    const note = item.notes?.[code];
    return (
      typeof note === "string" &&
      note.trim().length >= 30 &&
      note.length <= 5000 &&
      !/^(OPEN|DRAFT|PROPOSED)\b/.test(note.trim())
    );
  });
}
