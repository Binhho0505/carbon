// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { describe, expect, it } from "vitest";
import { fmcg } from "./data/fmcg/index.ts";
import { motor } from "./data/motor/index.ts";
import { precision } from "./data/precision/index.ts";
import { robotics } from "./data/robotics/index.ts";
import { satellite } from "./data/satellite/index.ts";
import { validateDataset } from "./validate.ts";

describe("dataset company base currency", () => {
  it.each([
    satellite,
    robotics,
    precision,
    motor,
    fmcg
  ])("accepts the complete $key fixture without relaxing its accounting checks", (dataset) => {
    expect(validateDataset(dataset)).toEqual([]);
  });

  it("rejects a VND company fixture claiming a different base currency", () => {
    const violations = validateDataset({ ...fmcg, baseCurrencyCode: "USD" });
    expect(violations.some((v) => v.includes("base currency (USD)"))).toBe(
      true
    );
  });

  it("rejects an inverted EUR-per-VND rate even when all other data is valid", () => {
    const violations = validateDataset({
      ...fmcg,
      accounting: {
        ...fmcg.accounting,
        exchangeRateOverrides: [{ currencyCode: "EUR", rate: 27_129 }]
      }
    });
    expect(violations.some((v) => v.includes("is it inverted?"))).toBe(true);
  });

  it("still rejects an unbalanced authored VND journal", () => {
    const first = fmcg.accounting.journalEntries[0]!;
    const violations = validateDataset({
      ...fmcg,
      accounting: {
        ...fmcg.accounting,
        journalEntries: [
          {
            ...first,
            lines: first.lines.map((line, index) => ({
              ...line,
              amount: line.amount + (index === 0 ? 10 : 0)
            }))
          },
          ...fmcg.accounting.journalEntries.slice(1)
        ]
      }
    });
    expect(violations.some((v) => /balanc/i.test(v))).toBe(true);
  });
});
