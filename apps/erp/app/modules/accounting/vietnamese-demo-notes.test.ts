// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { describe, expect, it } from "vitest";
import {
  buildVietnameseDemoNotes,
  type VietnameseDemoNoteContext
} from "./vietnamese-demo-notes";
import {
  buildVietnameseReports,
  VIETNAMESE_NOTE_DEFINITIONS,
  type VietnameseReportInput
} from "./vietnamese-reports";

const context: VietnameseDemoNoteContext = {
  fictionalDemo: true,
  workerCount: 3000,
  plants: [
    { name: "Bình Dương", workerCount: 1000, productGroup: "Đồ uống" },
    { name: "Đồng Nai", workerCount: 1000, productGroup: "Thực phẩm" },
    { name: "Long An", workerCount: 1000, productGroup: "Chăm sóc cá nhân" }
  ],
  assetRegisterCount: 4,
  inventoryItemCount: 39
};
const base = (): VietnameseReportInput => ({
  company: {
    id: "fictional",
    name: "FMCG Việt Nam — Dữ liệu giả lập 3 nhà máy",
    currencyCode: "VND"
  },
  period: {
    startDate: "2026-01-01",
    endDate: "2026-10-05",
    priorStartDate: "2025-01-01",
    priorEndDate: "2025-10-05"
  },
  openingBalances: [
    { accountNumber: "1121", amount: 1000 },
    { accountNumber: "4111", amount: -1000 }
  ],
  journalLines: []
});

describe("fictional FMCG disclosures", () => {
  it("prepares every official note with explicit demo provenance without approving statutory filing", () => {
    const input = base();
    const result = buildVietnameseDemoNotes(
      input,
      buildVietnameseReports(input),
      context
    );
    expect(Object.keys(result.notes)).toEqual(
      VIETNAMESE_NOTE_DEFINITIONS.map(([code]) => code)
    );
    expect(result.disclosures).toHaveLength(101);
    expect(result.statutorySubmission).toBe(false);
    expect(
      result.disclosures.every(
        (row) =>
          row.status === "DEMO_PREPARED" &&
          row.provenance.includes("TT99") &&
          row.content.includes("DỮ LIỆU GIẢ LẬP")
      )
    ).toBe(true);
    expect(result.notes["III.2"]).toContain("Không tuyên bố tuân thủ đầy đủ");
    expect(result.notes["V.21"]).toContain("PIT");
    expect(result.notes["I.7"]).toContain("3000");
  });

  it("preserves gross counterparties, distinguishes missing subledger evidence and derives asset movement", () => {
    const input = base();
    input.openingBalances.push(
      { accountNumber: "2111", amount: 200 },
      { accountNumber: "4111", amount: -200 }
    );
    input.journalLines = [
      {
        journalId: "asset",
        postingDate: "2026-05-01",
        accountNumber: "2111",
        amount: 300
      },
      {
        journalId: "asset",
        postingDate: "2026-05-01",
        accountNumber: "3311",
        amount: -300
      }
    ];
    input.controlBalances = [
      {
        accountNumber: "3311",
        amount: -500,
        partyId: "supplier-a",
        maturity: "current"
      },
      {
        accountNumber: "3311",
        amount: 200,
        partyId: "supplier-b",
        maturity: "current"
      }
    ];
    const result = buildVietnameseDemoNotes(
      input,
      buildVietnameseReports(input),
      context
    );
    expect(result.notes["V.17"]).toContain("dư Nợ 200 VND");
    expect(result.notes["V.17"]).toContain("dư Có 500 VND");
    expect(result.notes["V.9"]).toContain(
      "đầu kỳ 200 VND; phát sinh Nợ 300 VND; phát sinh Có 0 VND; cuối kỳ 500 VND"
    );
    expect(result.notes["VIII.2"]).toContain("111/112/113: 1");
    expect(result.notes["IX.3"]).toContain("không tạo danh tính");
  });

  it("rejects a real tenant or inconsistent worker evidence instead of silently filling notes", () => {
    const input = base();
    expect(() =>
      buildVietnameseDemoNotes(
        { ...input, company: { ...input.company, name: "Actual enterprise" } },
        buildVietnameseReports(input),
        context
      )
    ).toThrow("giả lập");
    expect(() =>
      buildVietnameseDemoNotes(input, buildVietnameseReports(input), {
        ...context,
        workerCount: 2
      })
    ).toThrow("chưa đối chiếu");
  });
});
