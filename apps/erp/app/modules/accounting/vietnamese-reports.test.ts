// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { describe, expect, it } from "vitest";
import {
  buildVietnameseReports,
  VIETNAMESE_NOTE_DEFINITIONS,
  type VietnameseControlBalance,
  type VietnameseJournalLine,
  type VietnameseReportInput,
  type VietnameseReportResult
} from "./vietnamese-reports";

function base(): VietnameseReportInput {
  return {
    company: { id: "demo", name: "FMCG Demo", currencyCode: "VND" },
    period: {
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      priorStartDate: "2025-01-01",
      priorEndDate: "2025-12-31"
    },
    openingBalances: [
      { accountNumber: "1121", amount: 1000 },
      { accountNumber: "4111", amount: -1000 }
    ],
    priorOpeningBalances: [],
    journalLines: [],
    priorJournalLines: [],
    notes: Object.fromEntries(
      VIETNAMESE_NOTE_DEFINITIONS.map(([code]) => [
        code,
        "Không phát sinh; đã đối chiếu dữ liệu và xác nhận áp dụng cho bộ dữ liệu kiểm thử."
      ])
    )
  };
}

function journal(
  id: string,
  amounts: [string, number][],
  cashFlowCode?: string
): VietnameseJournalLine[] {
  return amounts.map(([accountNumber, amount]) => ({
    journalId: id,
    postingDate: "2026-10-05",
    accountNumber,
    amount,
    cashFlowCode
  }));
}
function value(
  result: VietnameseReportResult,
  form: string,
  code: string
): number | null | undefined {
  return result.forms
    .find((f) => f.code === form)
    ?.lines.find((line) => line.code === code)?.current;
}

describe("Circular 99 financial report calculations", () => {
  it("blocks nonzero gross counterparties without confirmed maturity", () => {
    const input = base();
    input.journalLines = journal(
      "advance",
      [
        ["131", 100],
        ["1121", -100]
      ],
      "07"
    );
    // Exercise malformed persisted runtime data while preserving the strict API type.
    const control = {
      accountNumber: "131",
      partyId: "customer",
      amount: 100
    } as unknown as VietnameseControlBalance;
    input.controlBalances = [control];
    const result = buildVietnameseReports(input);
    expect(result.blocked).toBe(true);
    expect(
      result.warnings.some((warning) =>
        warning.includes("chưa xác nhận kỳ hạn")
      )
    ).toBe(true);
    expect(value(result, "B01-DN", "131")).toBe(0);
    control.maturity = "noncurrent";
    const confirmed = buildVietnameseReports(input);
    expect(confirmed.blocked).toBe(false);
    expect(value(confirmed, "B01-DN", "211")).toBe(100);
  });

  it("checks the opening B01 independently of a balanced current closing", () => {
    const input = base();
    input.openingBalances.push({ accountNumber: "UNMAPPED", amount: 100 });
    input.journalLines = journal("correct-opening", [["UNMAPPED", -100]]);
    const result = buildVietnameseReports(input);
    expect(
      result.checks.find((check) => check.id === "balance-sheet")?.passed
    ).toBe(true);
    // Missing classifications are also blocked even when totals happen to agree.
    expect(result.blocked).toBe(true);
    input.openingBalances = [
      { accountNumber: "1121", amount: 1100 },
      { accountNumber: "4111", amount: -1000 }
    ];
    input.journalLines = journal("repair", [["1121", -100]], "07");
    const repaired = buildVietnameseReports(input);
    expect(
      repaired.checks.find((check) => check.id === "balance-sheet")?.passed
    ).toBe(true);
    expect(
      repaired.checks.find((check) => check.id === "opening-balance-sheet")
        ?.passed
    ).toBe(false);
  });

  it("checks comparative cash flow separately from the current-year cash flow", () => {
    const input = base();
    input.priorJournalLines = journal("unknown-prior-payment", [
      ["1121", 100],
      ["3388", -100]
    ]).map((line) => ({ ...line, postingDate: "2025-10-05" }));
    const result = buildVietnameseReports(input);
    expect(
      result.checks.find((check) => check.id === "cash-flow")?.passed
    ).toBe(true);
    expect(
      result.checks.find((check) => check.id === "comparative-cash-flow")
        ?.passed
    ).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it("does not warn on gross manufacturing activity after accounts 622 and 6274 close", () => {
    const input = base();
    input.journalLines = [
      ...journal("labor", [
        ["622", 300],
        ["334", -300]
      ]),
      ...journal("depreciation", [
        ["6274", 200],
        ["2141", -200]
      ]),
      ...journal("production-close", [
        ["154", 500],
        ["622", -300],
        ["6274", -200]
      ])
    ];
    const closed = buildVietnameseReports(input);
    expect(
      closed.warnings.some((warning) => /TK (622|6274) /.test(warning))
    ).toBe(false);
    expect(closed.blocked).toBe(false);

    input.journalLines = input.journalLines.filter(
      (line) => line.journalId !== "production-close"
    );
    const unclosed = buildVietnameseReports(input);
    expect(
      unclosed.warnings.some((warning) => warning.includes("TK 622 "))
    ).toBe(true);
    expect(
      unclosed.warnings.some((warning) => warning.includes("TK 6274 "))
    ).toBe(true);
    expect(unclosed.blocked).toBe(true);
  });

  it("uses TT99 form codes and computes every subtotal in dependency order", () => {
    const result = buildVietnameseReports(base());
    expect(value(result, "B01-DN", "110")).toBe(1000);
    expect(value(result, "B01-DN", "100")).toBe(1000);
    expect(value(result, "B01-DN", "280")).toBe(1000);
    expect(value(result, "B01-DN", "440")).toBe(1000);
    expect(result.forms[0]!.lines.some((line) => line.code === "420")).toBe(
      true
    );
    expect(result.forms[0]!.lines.some((line) => line.code === "421")).toBe(
      false
    );
    expect(result.checks.every((check) => check.passed)).toBe(true);
    expect(result.blocked).toBe(false);
  });

  it("ties a closed profit period to equity and direct cash flow without counting closing transfers as activity", () => {
    const input = base();
    input.openingBalances = [
      { accountNumber: "1121", amount: 1000 },
      { accountNumber: "1551", amount: 600 },
      { accountNumber: "4111", amount: -1600 }
    ];
    input.accountClassifications = { "6351": { incomeStatementCode: "24" } };
    input.journalLines = [
      ...journal(
        "sale",
        [
          ["1121", 1000],
          ["5111", -1000]
        ],
        "01"
      ),
      ...journal("cogs", [
        ["6321", 600],
        ["1551", -600]
      ]),
      ...journal(
        "interest",
        [
          ["6351", 50],
          ["1121", -50]
        ],
        "04"
      ),
      ...journal(
        "selling",
        [
          ["6411", 100],
          ["1121", -100]
        ],
        "07"
      ),
      ...journal(
        "admin",
        [
          ["6421", 80],
          ["1121", -80]
        ],
        "07"
      ),
      ...journal(
        "tax",
        [
          ["8211", 34],
          ["1121", -34]
        ],
        "05"
      ),
      ...journal("close-revenue", [
        ["5111", 1000],
        ["911", -1000]
      ]),
      ...journal("close-cost", [
        ["911", 864],
        ["6321", -600],
        ["6351", -50],
        ["6411", -100],
        ["6421", -80],
        ["8211", -34]
      ]),
      ...journal("close-profit", [
        ["911", 136],
        ["4212", -136]
      ])
    ];
    const result = buildVietnameseReports(input);
    expect(value(result, "B02-DN", "01")).toBe(1000);
    expect(value(result, "B02-DN", "23")).toBe(50);
    expect(value(result, "B02-DN", "24")).toBe(50);
    expect(value(result, "B02-DN", "30")).toBe(170);
    expect(value(result, "B02-DN", "60")).toBe(136);
    expect(value(result, "B01-DN", "420b")).toBe(136);
    expect(value(result, "B03-DN", "50")).toBe(736);
    expect(value(result, "B03-DN", "70")).toBe(1736);
    expect(value(result, "B01-DN", "280")).toBe(1736);
    expect(result.warnings).toEqual([]);
    expect(result.blocked).toBe(false);
  });

  it("does not net different customer debit and advance credit balances", () => {
    const input = base();
    input.openingBalances = [
      { accountNumber: "1121", amount: 1000 },
      { accountNumber: "1311", amount: 200 },
      { accountNumber: "4111", amount: -1200 }
    ];
    input.controlBalances = [
      {
        accountNumber: "1311",
        partyId: "customer-A",
        amount: 300,
        maturity: "current"
      },
      {
        accountNumber: "1311",
        partyId: "customer-B",
        amount: -100,
        maturity: "current"
      }
    ];
    input.openingControlBalances = input.controlBalances;
    const result = buildVietnameseReports(input);
    expect(value(result, "B01-DN", "131")).toBe(300);
    expect(value(result, "B01-DN", "312")).toBe(100);
    expect(value(result, "B01-DN", "280")).toBe(1300);
    expect(value(result, "B01-DN", "440")).toBe(1300);
    expect(result.blocked).toBe(false);
  });

  it("counts a sales return once even after the 521-to-511 transfer and period close", () => {
    const input = base();
    input.journalLines = [
      ...journal(
        "sale",
        [
          ["1121", 1000],
          ["5111", -1000]
        ],
        "01"
      ),
      ...journal(
        "return",
        [
          ["5212", 100],
          ["1121", -100]
        ],
        "01"
      ),
      ...journal("transfer-reductions", [
        ["5111", 100],
        ["5212", -100]
      ]),
      ...journal("close-revenue", [
        ["5111", 900],
        ["911", -900]
      ]),
      ...journal("close-profit", [
        ["911", 900],
        ["4212", -900]
      ])
    ];
    const result = buildVietnameseReports(input);
    expect(value(result, "B02-DN", "01")).toBe(1000);
    expect(value(result, "B02-DN", "02")).toBe(100);
    expect(value(result, "B02-DN", "10")).toBe(900);
    expect(value(result, "B02-DN", "60")).toBe(900);
    expect(result.blocked).toBe(false);
  });

  it("excludes transfers between cash accounts from cash-flow revenue", () => {
    const input = base();
    input.journalLines = journal("bank-to-cash", [
      ["1111", 200],
      ["1121", -200]
    ]);
    const result = buildVietnameseReports(input);
    expect(value(result, "B03-DN", "50")).toBe(0);
    expect(value(result, "B03-DN", "70")).toBe(1000);
    expect(result.blocked).toBe(false);
  });

  it("includes confirmed cash equivalents and excludes restricted cash", () => {
    const input = base();
    input.openingBalances = [
      { accountNumber: "1121", amount: 1000 },
      { accountNumber: "128101", amount: 500 },
      { accountNumber: "112901", amount: 200 },
      { accountNumber: "4111", amount: -1700 }
    ];
    input.accountClassifications = {
      "128101": { balanceSheetCode: "112" },
      "112901": { balanceSheetCode: "165" }
    };
    input.journalLines = journal("cash-to-equivalent", [
      ["1121", -100],
      ["128101", 100]
    ]);
    const result = buildVietnameseReports(input);
    expect(value(result, "B01-DN", "110")).toBe(1500);
    expect(value(result, "B01-DN", "165")).toBe(200);
    expect(value(result, "B03-DN", "50")).toBe(0);
    expect(value(result, "B03-DN", "70")).toBe(1500);
    expect(result.blocked).toBe(false);
  });

  it("blocks a net-zero journal mixing external cash receipts and payments", () => {
    const input = base();
    input.journalLines = journal("mixed", [
      ["1111", 100],
      ["1121", -100],
      ["1311", -100],
      ["3311", 100]
    ]);
    const result = buildVietnameseReports(input);
    expect(
      result.warnings.some((warning) => warning.includes("gộp thu và chi"))
    ).toBe(true);
    expect(result.blocked).toBe(true);
  });

  it("blocks unknown supplier cash purposes instead of inventing an operating classification", () => {
    const input = base();
    input.journalLines = journal("supplier", [
      ["3311", 100],
      ["1121", -100]
    ]);
    const result = buildVietnameseReports(input);
    expect(
      result.warnings.some((warning) =>
        warning.includes("chưa được phân loại B03-DN")
      )
    ).toBe(true);
    expect(
      result.checks.find((check) => check.id === "cash-flow")?.passed
    ).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it("blocks missing disclosures and unsupported GL classifications", () => {
    const input = base();
    delete input.notes;
    input.openingBalances.push({ accountNumber: "99999", amount: 10 });
    const result = buildVietnameseReports(input);
    expect(
      result.forms.find((form) => form.code === "B09-DN")!.lines[0]!.note
    ).toMatch(/^OPEN/);
    expect(result.blocked).toBe(true);
    expect(result.checks.find((check) => check.id === "notes")?.passed).toBe(
      false
    );
  });

  it("rejects non-finite money and impossible calendar periods", () => {
    const input = base();
    input.openingBalances[0]!.amount = Number.NaN;
    expect(() => buildVietnameseReports(input)).toThrow("hữu hạn");
    input.period.startDate = "2026-02-30";
    expect(() => buildVietnameseReports(input)).toThrow();
  });
});
