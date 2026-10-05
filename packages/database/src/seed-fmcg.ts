// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { getProcessPool } from "./client.ts";
import { seedCompanyReferenceData } from "./datasets/bootstrap.ts";
import { loadEnv } from "./datasets/cli.ts";
import {
  applyVietnameseAccounting,
  classifyFmcgAccounting,
  postFmcgPlantAccounting,
  prepareVietnameseAccounting
} from "./datasets/fmcg-accounting.ts";
import { seedFmcgAttendance } from "./datasets/fmcg-attendance.ts";
import { seedFmcgOpeningBalance } from "./datasets/fmcg-opening.ts";
import { applyFmcgScale } from "./datasets/fmcg-scale.ts";
import { verifyFmcgCompany } from "./datasets/fmcg-verify.ts";
import { applyDatasetTiers, getDataset } from "./datasets/index.ts";
import { validateDataset } from "./datasets/validate.ts";

loadEnv();
const { values } = parseArgs({
  args: process.argv.slice(2).filter((arg) => arg !== "--"),
  options: {
    apply: { type: "boolean", default: false },
    verify: { type: "boolean", default: false },
    email: { type: "string", default: "test@carbon.ms" },
    output: { type: "string" }
  },
  strict: true
});
const companyName = "FMCG Việt Nam — Dữ liệu giả lập 3 nhà máy";
async function main() {
  const pool = getProcessPool();
  const client = await pool.connect();
  let transactionOpen = false;
  try {
    // This tool is exclusively local. Never accept a hosted database by mistake.
    const connection = new URL(process.env.SUPABASE_DB_URL ?? "");
    if (!["localhost", "127.0.0.1", "[::1]"].includes(connection.hostname)) {
      throw new Error("FMCG demo requires a loopback development database.");
    }
    const user = await client.query<{ id: string }>(
      `SELECT id FROM "user" WHERE email = $1 AND active = true`,
      [values.email]
    );
    if (user.rowCount !== 1)
      throw new Error("Existing active local administrator required.");
    const userId = user.rows[0]!.id;
    const existing = await client.query<{ id: string }>(
      `SELECT c.id FROM company c JOIN "userToCompany" m ON m."companyId" = c.id
     WHERE c.name = $1 AND m."userId" = $2 AND m.role = 'employee'`,
      [companyName, userId]
    );
    if ((existing.rowCount ?? 0) > 1)
      throw new Error("Ambiguous FMCG company; refusing mutation.");
    let companyId: string;
    let scaling: unknown = null;
    let accounting: unknown = null;
    let mode: string;
    if (existing.rows[0]) {
      companyId = existing.rows[0].id;
      mode = "existing-company-verification-only";
    } else {
      if (values.verify)
        throw new Error("No FMCG demo company has been applied yet.");
      const dataset = getDataset("fmcg");
      if (!dataset) throw new Error("FMCG dataset not registered.");
      const violations = validateDataset(dataset);
      if (violations.length)
        throw new Error(`Invalid FMCG dataset:\n${violations.join("\n")}`);
      await client.query("BEGIN");
      transactionOpen = true;
      await client.query(`SET LOCAL "app.sync_in_progress" = 'true'`);
      await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
        companyName
      ]);
      const concurrent = await client.query(
        `SELECT id FROM company WHERE name = $1`,
        [companyName]
      );
      if (concurrent.rowCount)
        throw new Error(
          "Another seed created the company; rerun to verify it."
        );
      const reference = await seedCompanyReferenceData(client, {
        userId,
        companyName
      });
      companyId = reference.companyId;
      await client.query(
        `UPDATE company SET "baseCurrencyCode" = 'VND', timezone = 'Asia/Ho_Chi_Minh' WHERE id = $1`,
        [companyId]
      );
      await client.query(
        `UPDATE "companySettings" SET "accountingEnabled" = true WHERE id = $1`,
        [companyId]
      );
      await client.query(
        `UPDATE location SET name = 'Trụ sở FMCG giả lập', "countryCode" = 'VN',
       city = 'Hồ Chí Minh', timezone = 'Asia/Ho_Chi_Minh' WHERE id = $1 AND "companyId" = $2`,
        [reference.locationId, companyId]
      );
      await prepareVietnameseAccounting(client, {
        companyId,
        companyGroupId: reference.companyGroupId,
        userId
      });
      await seedFmcgOpeningBalance(client, {
        companyId,
        companyGroupId: reference.companyGroupId,
        userId,
        dataset
      });
      await applyDatasetTiers(client, {
        companyId,
        userId,
        dataset,
        timeZone: "Asia/Ho_Chi_Minh",
        wipeFirst: false,
        log: (message) => console.log(message)
      });
      scaling = await applyFmcgScale(client, { companyId, userId });
      const attendance = await seedFmcgAttendance(client, companyId, userId);
      scaling = { plantScale: scaling, attendance };
      accounting = await applyVietnameseAccounting(client, {
        companyId,
        companyGroupId: reference.companyGroupId,
        userId
      });
      const plantAccounting = await postFmcgPlantAccounting(client, {
        companyId,
        companyGroupId: reference.companyGroupId,
        userId
      });
      const classifications = await classifyFmcgAccounting(client, {
        companyId,
        companyGroupId: reference.companyGroupId,
        userId
      });
      accounting = {
        configuration: accounting,
        plantAccounting,
        classifications
      };
      mode = values.apply ? "apply" : "dry-run-rollback";
    }
    const verification = await verifyFmcgCompany(client, companyId);
    const report = {
      mode,
      companyName,
      companyId,
      scaling,
      accounting,
      verification
    };
    if (verification.issues.length)
      throw new Error(
        `FMCG verification failed:\n${verification.issues.join("\n")}`
      );
    if (transactionOpen) {
      await client.query(values.apply ? "COMMIT" : "ROLLBACK");
      transactionOpen = false;
    }
    if (values.output) {
      const output = path.resolve(values.output);
      mkdirSync(path.dirname(output), { recursive: true });
      writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    }
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    if (transactionOpen) await client.query("ROLLBACK").catch(() => {});
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
