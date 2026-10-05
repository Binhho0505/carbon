// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { today } from "@internationalized/date";
import type { PoolClient } from "pg";
import type { Dataset } from "./types.ts";

/** Seed the fictional prior-year closing balance while its period is open.
 * The normal tiers adopt this journal and subsequently set historical close states.
 * Never reopens a used period, edits posted lines or bypasses posting constraints.
 */
export async function seedFmcgOpeningBalance(
  client: PoolClient,
  options: {
    companyId: string;
    companyGroupId: string;
    userId: string;
    dataset: Dataset;
  }
) {
  const { companyId, companyGroupId, userId, dataset } = options;
  const entry = dataset.accounting.journalEntries.find(
    (journal) => journal.sourceType === "Opening Balance"
  );
  if (!entry) throw new Error("Missing FMCG opening balance.");
  const anchor = today("Asia/Ho_Chi_Minh");
  const closing = anchor.set({ year: anchor.year - 1, month: 12, day: 31 });
  const periods = await client.query(
    `INSERT INTO "accountingPeriod" ("companyId","startDate","endDate","fiscalYear","periodNumber",status,"closeStatus","createdBy")
     VALUES ($1,$2,$3,$4,12,'Inactive','Open',$5) RETURNING id`,
    [
      companyId,
      closing.set({ day: 1 }).toString(),
      closing.toString(),
      closing.year,
      userId
    ]
  );
  const accounts = await client.query<{
    id: string;
    number: string;
    class: string;
  }>(
    `SELECT id,number,class FROM account WHERE "companyGroupId"=$1 AND NOT "isGroup" ORDER BY number`,
    [companyGroupId]
  );
  const lines = entry.lines.map((line) => {
    const account = accounts.rows.find((account) =>
      line.account
        ? account.number === line.account
        : account.class === line.accountClass
    );
    if (!account) throw new Error("Opening account missing.");
    return {
      accountId: account.id,
      amount: line.amount,
      description: line.description,
      journalLineReference: line.journalLineReference,
      signed: ["Asset", "Expense"].includes(account.class)
        ? line.amount
        : -line.amount
    };
  });
  if (lines.reduce((sum, line) => sum + line.signed, 0) !== 0)
    throw new Error("Opening balance is not balanced.");
  const journal = await client.query<{ id: string }>(
    `INSERT INTO journal ("companyId","journalEntryId",description,status,"postingDate","accountingPeriodId","sourceType","createdBy")
     VALUES ($1,$2,$3,'Draft',$4,$5,'Opening Balance',$6) RETURNING id`,
    [
      companyId,
      entry.journalEntryId,
      entry.description,
      closing.toString(),
      periods.rows[0].id,
      userId
    ]
  );
  await client.query(
    `INSERT INTO "journalLine" ("journalId","accountId",amount,description,"journalLineReference","companyId","createdBy")
     SELECT $1,x."accountId",x.amount,x.description,x."journalLineReference",$2,$3 FROM jsonb_to_recordset($4::jsonb) x("accountId" text,amount numeric,description text,"journalLineReference" text)`,
    [journal.rows[0]!.id, companyId, userId, JSON.stringify(lines)]
  );
  await client.query(
    `UPDATE journal SET status='Posted',"postedAt"=now(),"postedBy"=$2 WHERE id=$1 AND "companyId"=$3`,
    [journal.rows[0]!.id, userId, companyId]
  );
  return { journalId: journal.rows[0]!.id, postingDate: closing.toString() };
}
