// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PoolClient } from "pg";

export const TT99_CLOSING_ACCOUNTS = [
  {
    number: "911",
    name: "Xác định kết quả kinh doanh",
    class: "Expense",
    incomeBalance: "Income Statement",
    template: "6421"
  },
  {
    number: "4211",
    name: "Lợi nhuận sau thuế chưa phân phối năm trước",
    class: "Equity",
    incomeBalance: "Balance Sheet",
    template: "421"
  },
  {
    number: "4212",
    name: "Lợi nhuận sau thuế chưa phân phối năm nay",
    class: "Equity",
    incomeBalance: "Balance Sheet",
    template: "421"
  }
] as const;

type Account = {
  id: string;
  number: string;
  class: string;
  incomeBalance: string;
  active: boolean;
  isGroup: boolean;
};
export function validateTt99ClosingAccounts(rows: Account[]) {
  for (const definition of TT99_CLOSING_ACCOUNTS) {
    const matches = rows.filter((row) => row.number === definition.number);
    if (matches.length > 1)
      throw new Error(
        `Ambiguous account ${definition.number}; no existing account will be altered.`
      );
    const account = matches[0];
    if (
      account &&
      (account.class !== definition.class ||
        account.incomeBalance !== definition.incomeBalance ||
        !account.active ||
        account.isGroup)
    )
      throw new Error(
        `Incompatible account ${definition.number}; no existing account will be altered.`
      );
  }
}

/** Caller owns authorization, transaction and company-group advisory lock. Add only. */
export async function addTt99ClosingAccounts(
  client: PoolClient,
  companyGroupId: string,
  userId: string,
  verifyOnly = false
) {
  const existing = await client.query<Account>(
    `SELECT id,number,class,"incomeBalance",active,"isGroup" FROM account WHERE "companyGroupId"=$1 AND number=ANY($2::text[])`,
    [companyGroupId, TT99_CLOSING_ACCOUNTS.map((row) => row.number)]
  );
  validateTt99ClosingAccounts(existing.rows);
  const missing = TT99_CLOSING_ACCOUNTS.filter(
    (row) => !existing.rows.some((account) => account.number === row.number)
  );
  if (verifyOnly && missing.length)
    throw new Error(
      `Missing TT99 closing accounts: ${missing.map((row) => row.number).join(", ")}`
    );
  let added = 0;
  if (missing.length) {
    const templates = await client.query<Account>(
      `SELECT id,number,class,"incomeBalance",active,"isGroup" FROM account WHERE "companyGroupId"=$1 AND number=ANY($2::text[])`,
      [companyGroupId, [...new Set(missing.map((row) => row.template))]]
    );
    for (const row of missing) {
      const template = templates.rows.filter(
        (account) => account.number === row.template
      );
      if (
        template.length !== 1 ||
        template[0]!.class !== row.class ||
        template[0]!.incomeBalance !== row.incomeBalance ||
        !template[0]!.active ||
        template[0]!.isGroup
      )
        throw new Error(
          `Compatible TT99 template ${row.template} required; existing chart is preserved.`
        );
    }
    const result = await client.query(
      `INSERT INTO account (number,name,"isGroup",active,"accountType","incomeBalance",class,"parentId","companyGroupId","createdBy","consolidatedRate")
      SELECT m.number,m.name,false,true,a."accountType",a."incomeBalance",a.class,a."parentId",a."companyGroupId",$3,a."consolidatedRate"
      FROM jsonb_to_recordset($2::jsonb) AS m(number text,name text,template text)
      JOIN account a ON a.number=m.template AND a."companyGroupId"=$1
      WHERE NOT EXISTS (SELECT 1 FROM account e WHERE e.number=m.number AND e."companyGroupId"=$1)`,
      [companyGroupId, JSON.stringify(missing), userId]
    );
    added = result.rowCount ?? 0;
    if (added !== missing.length)
      throw new Error(
        "Closing account insertion incomplete; transaction must roll back."
      );
  }
  const after = await client.query<Account>(
    `SELECT id,number,class,"incomeBalance",active,"isGroup" FROM account WHERE "companyGroupId"=$1 AND number=ANY($2::text[]) ORDER BY number`,
    [companyGroupId, TT99_CLOSING_ACCOUNTS.map((row) => row.number)]
  );
  validateTt99ClosingAccounts(after.rows);
  if (after.rows.length !== TT99_CLOSING_ACCOUNTS.length)
    throw new Error("Closing accounts missing after setup.");
  return { added, preserved: existing.rows.length, accounts: after.rows };
}
