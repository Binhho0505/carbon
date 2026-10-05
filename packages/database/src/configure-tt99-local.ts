// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { getProcessPool } from "./client.ts";
import { loadEnv } from "./datasets/cli.ts";
import { addTt99ClosingAccounts } from "./tt99-chart.ts";

async function main() {
  loadEnv();
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((arg) => arg !== "--"),
    options: {
      company: { type: "string" },
      email: { type: "string", default: "test@carbon.ms" },
      apply: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      verify: { type: "boolean", default: false },
      output: { type: "string" }
    },
    strict: true
  });
  if (!values.company) throw new Error("Explicit --company ID required.");
  if (
    [values.apply, values["dry-run"], values.verify].filter(Boolean).length > 1
  )
    throw new Error("Choose only one of --apply, --dry-run or --verify.");
  const connection = new URL(process.env.SUPABASE_DB_URL ?? "");
  if (!["localhost", "127.0.0.1", "[::1]"].includes(connection.hostname))
    throw new Error("TT99 chart setup requires a loopback local database.");
  const pool = getProcessPool();
  const client = await pool.connect();
  let transaction = false;
  try {
    await client.query("BEGIN");
    transaction = true;
    if (values.verify) await client.query("SET TRANSACTION READ ONLY");
    const scope = await client.query<{
      companyId: string;
      companyGroupId: string;
      userId: string;
    }>(
      `SELECT c.id AS "companyId",c."companyGroupId",u.id AS "userId" FROM company c
      JOIN "userToCompany" m ON m."companyId"=c.id AND m.role='employee'
      JOIN "user" u ON u.id=m."userId" AND u.active=true
      JOIN "userPermission" p ON p.id=u.id
      WHERE c.id=$1 AND u.email=$2 AND c."baseCurrencyCode"='VND'
        AND COALESCE(p.permissions->'accounting_update','[]'::jsonb) ? c.id
        AND COALESCE(p.permissions->'accounting_create','[]'::jsonb) ? c.id`,
      [values.company, values.email]
    );
    if (scope.rowCount !== 1)
      throw new Error(
        "Existing active employee with accounting_create and accounting_update permissions in the specified VND company required."
      );
    const { companyId, companyGroupId, userId } = scope.rows[0]!;
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
      `tt99-chart:${companyGroupId}`
    ]);
    const configuration = await addTt99ClosingAccounts(
      client,
      companyGroupId,
      userId,
      values.verify
    );
    const result = {
      mode: values.verify
        ? "verify"
        : values.apply
          ? "apply"
          : "dry-run-rollback",
      companyId,
      companyGroupId,
      ...configuration,
      journalsPosted: 0,
      periodsClosed: 0
    };
    await client.query(values.apply ? "COMMIT" : "ROLLBACK");
    transaction = false;
    if (values.output) {
      const destination = path.resolve(values.output);
      mkdirSync(path.dirname(destination), { recursive: true });
      writeFileSync(
        destination,
        `${JSON.stringify(result, null, 2)}\n`,
        "utf8"
      );
    }
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } finally {
    if (transaction)
      await client.query("ROLLBACK").catch(() => {
        /* Preserve the original failure during rollback cleanup. */
      });
    client.release();
    await pool.end();
  }
}
main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Local TT99 setup failed."}\n`
  );
  process.exitCode = 1;
});
