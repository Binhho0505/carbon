// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { describe, expect, it } from "vitest";
import {
  TT99_CLOSING_ACCOUNTS,
  validateTt99ClosingAccounts
} from "./tt99-chart";

const existing = () =>
  TT99_CLOSING_ACCOUNTS.map((account) => ({
    ...account,
    id: `id-${account.number}`,
    active: true,
    isGroup: false
  }));
describe("add-only TT99 closing chart compatibility", () => {
  it("accepts correct existing leaves and absent accounts without reclassification", () => {
    expect(() => validateTt99ClosingAccounts(existing())).not.toThrow();
    expect(() => validateTt99ClosingAccounts([])).not.toThrow();
  });
  it.each([
    "class",
    "incomeBalance",
    "active",
    "isGroup"
  ] as const)("rejects incompatible existing %s", (field) => {
    const rows = existing();
    const invalid = {
      ...rows[0],
      [field]: field === "active" ? false : field === "isGroup" ? true : "Wrong"
    };
    expect(() =>
      validateTt99ClosingAccounts([invalid as (typeof rows)[number]])
    ).toThrow("Incompatible account 911");
  });
  it("rejects ambiguous account numbers", () => {
    const rows = existing();
    expect(() => validateTt99ClosingAccounts([...rows, rows[0]!])).toThrow(
      "Ambiguous account 911"
    );
  });
});
