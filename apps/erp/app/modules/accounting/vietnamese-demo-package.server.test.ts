// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { describe, expect, it } from "vitest";
import {
  validateVietnameseDemoPackage,
  vietnameseLedgerDigest
} from "./vietnamese-demo-package.server";
import {
  VIETNAMESE_NOTE_DEFINITIONS,
  type VietnameseReportInput
} from "./vietnamese-reports";

const input: VietnameseReportInput = {
  company: { id: "demo", name: "FMCG", currencyCode: "VND" },
  period: {
    startDate: "2026-01-01",
    endDate: "2026-10-05",
    priorStartDate: "2025-01-01",
    priorEndDate: "2025-10-05"
  },
  openingBalances: [
    { accountNumber: "111", amount: 100 },
    { accountNumber: "411", amount: -100 }
  ],
  journalLines: [
    {
      journalId: "j1",
      postingDate: "2026-02-01",
      accountNumber: "111",
      amount: 20
    },
    {
      journalId: "j1",
      postingDate: "2026-02-01",
      accountNumber: "511",
      amount: -20
    }
  ]
};
const prepared = () => ({
  schemaVersion: 1,
  companyId: input.company.id,
  period: input.period,
  ledgerDigest: vietnameseLedgerDigest(input),
  status: "DEMO_PREPARED",
  statutorySubmission: false,
  notes: Object.fromEntries(
    VIETNAMESE_NOTE_DEFINITIONS.map(([code]) => [
      code,
      "DỮ LIỆU GIẢ LẬP — nội dung đủ dài để rà soát bộ báo cáo demo."
    ])
  )
});

describe("Demo disclosure ledger binding", () => {
  it("normalizes duplicate cash-flow tags while retaining distinct classifications", () => {
    const once = {
      ...input,
      journalLines: input.journalLines.map((line, index) => ({
        ...line,
        cashFlowCode: index === 0 ? "01" : undefined
      }))
    };
    const duplicated = {
      ...input,
      journalLines: input.journalLines.map((line) => ({
        ...line,
        cashFlowCode: "01"
      }))
    };
    const conflicting = {
      ...input,
      journalLines: input.journalLines.map((line, index) => ({
        ...line,
        cashFlowCode: index === 0 ? "01" : "02"
      }))
    };
    expect(vietnameseLedgerDigest(duplicated)).toBe(
      vietnameseLedgerDigest(once)
    );
    expect(vietnameseLedgerDigest(conflicting)).not.toBe(
      vietnameseLedgerDigest(once)
    );
  });
  it("accepts complete scoped package and ignores input row ordering", () => {
    expect(validateVietnameseDemoPackage(prepared(), input)).toBe(true);
    expect(
      vietnameseLedgerDigest({
        ...input,
        openingBalances: [...input.openingBalances].reverse(),
        journalLines: [...input.journalLines].reverse()
      })
    ).toBe(vietnameseLedgerDigest(input));
  });
  it("rejects another company, another period, or a statutory approval claim", () => {
    expect(
      validateVietnameseDemoPackage(
        { ...prepared(), companyId: "other" },
        input
      )
    ).toBe(false);
    expect(
      validateVietnameseDemoPackage(
        { ...prepared(), period: { ...input.period, endDate: "2026-10-06" } },
        input
      )
    ).toBe(false);
    expect(
      validateVietnameseDemoPackage(
        { ...prepared(), statutorySubmission: true },
        input
      )
    ).toBe(false);
  });
  it("invalidates disclosures after ledger or classification changes", () => {
    expect(
      validateVietnameseDemoPackage(prepared(), {
        ...input,
        journalLines: input.journalLines.map((line) => ({
          ...line,
          amount: line.amount * 2
        }))
      })
    ).toBe(false);
    expect(
      validateVietnameseDemoPackage(prepared(), {
        ...input,
        accountClassifications: { "111": { balanceSheetCode: "111" } }
      })
    ).toBe(false);
  });
  it("rejects missing, unknown, placeholder and oversized disclosures", () => {
    const missing = prepared();
    delete missing.notes["I.1"];
    expect(validateVietnameseDemoPackage(missing, input)).toBe(false);
    const unknown = prepared();
    delete unknown.notes["I.1"];
    unknown.notes.UNKNOWN = "Unrelated field with no official note definition";
    expect(validateVietnameseDemoPackage(unknown, input)).toBe(false);
    expect(
      validateVietnameseDemoPackage(
        {
          ...prepared(),
          notes: {
            ...prepared().notes,
            "I.1": "OPEN — chưa có nội dung để xác nhận pháp lý."
          }
        },
        input
      )
    ).toBe(false);
    expect(
      validateVietnameseDemoPackage(
        {
          ...prepared(),
          notes: { ...prepared().notes, "I.1": "x".repeat(5001) }
        },
        input
      )
    ).toBe(false);
  });
});
