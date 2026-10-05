// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { Database } from "@carbon/database";
import {
  getPostgresClient,
  getProcessPool,
  type Kysely,
  type KyselyDatabase
} from "@carbon/database/client";
import { createClient } from "@supabase/supabase-js";
import { PostgresDriver, sql } from "kysely";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ permissions: vi.fn(), database: vi.fn() }));
vi.mock("@carbon/auth/auth.server", () => ({
  requirePermissions: mocks.permissions
}));
vi.mock("~/services/database.server", () => ({
  getDatabaseClient: mocks.database
}));
// This read-only report comparison never saves a document. Avoid loading the
// unrelated UI/glossary barrel through the document-write service in Vitest.
vi.mock("~/modules/documents/documents.service", () => ({
  upsertDocument: vi.fn()
}));

import { loadVietnameseReport } from "~/routes/x+/reports+/vietnamese.server";
import {
  postVietnameseClosing,
  previewVietnameseClosingForScope
} from "./vietnamese-closing.server";

/** Actual local auth/RLS is verified before supplying the test adapter scope.
 * Actual closing SQL/triggers run inside an outer transaction always rolled back.
 * This is not browser/HTTP authentication coverage and never commits closing. */
describe.skipIf(process.env.CARBON_DEMO_INTEGRATION !== "1")(
  "TT99 native closing rollback integration",
  () => {
    let db: Kysely<KyselyDatabase>;
    let scope: { companyId: string; companyGroupId: string; userId: string };
    let signOut: (() => Promise<unknown>) | undefined;
    const window = { startDate: "2026-01-01", endDate: "2026-10-05" };
    const request = () =>
      new Request(
        `http://localhost:3000/x/accounting/vietnamese?startDate=${window.startDate}&endDate=${window.endDate}`,
        { method: "POST" }
      );
    beforeAll(async () => {
      for (const key of [
        "SUPABASE_URL",
        "SUPABASE_API_URL",
        "SUPABASE_DB_URL",
        "SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY"
      ])
        delete process.env[key];
      const { loadEnv } = await import(
        "../../../../../packages/database/src/datasets/cli"
      );
      const { DEV_PASSWORD } = await import(
        "../../../../../packages/database/src/datasets/bootstrap"
      );
      loadEnv();
      process.env.SUPABASE_URL = "http://localhost:54321";
      process.env.SUPABASE_API_URL = process.env.SUPABASE_URL;
      process.env.SUPABASE_DB_URL =
        "postgresql://postgres:postgres@localhost:55584/postgres";
      for (const key of ["SUPABASE_URL", "SUPABASE_DB_URL"])
        if (
          !["localhost", "127.0.0.1", "[::1]"].includes(
            new URL(process.env[key]!).hostname
          )
        )
          throw new Error("Rollback integration requires loopback services");
      const client = createClient<Database>(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      const login = await client.auth.signInWithPassword({
        email: "test@carbon.ms",
        password: DEV_PASSWORD
      });
      if (login.error || !login.data.user)
        throw new Error("Local accounting fixture authentication failed");
      signOut = () => client.auth.signOut({ scope: "local" });
      const company = await client
        .from("company")
        .select("id,companyGroupId")
        .eq("name", "FMCG Việt Nam — Dữ liệu giả lập 3 nhà máy")
        .single();
      if (company.error || !company.data || !company.data.companyGroupId)
        throw new Error(
          "Local FMCG fixture must be visible through authenticated RLS"
        );
      const membership = await client
        .from("userToCompany")
        .select("role")
        .eq("userId", login.data.user.id)
        .eq("companyId", company.data.id)
        .single();
      if (membership.error || membership.data?.role !== "employee")
        throw new Error("Accounting fixture requires employee membership");
      const user = await client
        .from("user")
        .select("active")
        .eq("id", login.data.user.id)
        .single();
      if (user.error || !user.data?.active)
        throw new Error("Accounting fixture requires active user");
      const permission = await client
        .from("userPermission")
        .select("permissions")
        .eq("id", login.data.user.id)
        .single();
      const permissions = permission.data?.permissions as Record<
        string,
        string[]
      > | null;
      if (
        permission.error ||
        ["accounting_view", "accounting_create", "accounting_update"].some(
          (key) => !permissions?.[key]?.includes(company.data.id)
        )
      )
        throw new Error(
          "Verified accounting view/create/update permissions required"
        );
      scope = {
        companyId: company.data.id,
        companyGroupId: company.data.companyGroupId,
        userId: login.data.user.id
      };
      mocks.permissions.mockResolvedValue({ ...scope, client });
      db = getPostgresClient<KyselyDatabase>(getProcessPool(), PostgresDriver);
    }, 30000);
    afterAll(async () => {
      await signOut?.();
      if (db) await getProcessPool().end();
    });
    it("posts native balanced closing, preserves B02, zeros income/911, is idempotent, then rolls every write back", async () => {
      const countBefore = await db
        .selectFrom("journal")
        .select(sql<number>`count(*)::int`.as("count"))
        .where("companyId", "=", scope.companyId)
        .executeTakeFirstOrThrow();
      const rollback = new Error("EXPECTED_TT99_ROLLBACK");
      let journalIds: string[] = [];
      let reachedAssertions = false;
      try {
        await db
          .transaction()
          .setIsolationLevel("serializable")
          .execute(async (trx) => {
            const adapter = new Proxy(trx, {
              get(target, property) {
                if (property === "transaction")
                  return () => ({
                    setIsolationLevel: () => ({
                      execute: (
                        callback: (transaction: typeof trx) => Promise<unknown>
                      ) => callback(trx)
                    })
                  });
                const value = Reflect.get(target, property, target);
                return typeof value === "function" ? value.bind(target) : value;
              }
            });
            mocks.database.mockReturnValue(adapter);
            const periodStatesBefore = await trx
              .selectFrom("accountingPeriod")
              .select(["id", "closeStatus"])
              .where("companyId", "=", scope.companyId)
              .orderBy("id")
              .execute();
            const retained = async () =>
              (
                await sql<{
                  amount: number;
                }>`SELECT COALESCE(sum(line.amount),0)::float8 AS amount FROM "journalLine" line JOIN journal j ON j.id=line."journalId" AND j."companyId"=line."companyId" JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${scope.companyGroupId} WHERE line."companyId"=${scope.companyId} AND j."companyId"=${scope.companyId} AND j.status IN ('Posted','Reversed') AND a.number LIKE '4212%'`.execute(
                  trx
                )
              ).rows[0]!.amount;
            const retainedBefore = await retained();
            const beforeReport = await loadVietnameseReport(request());
            const preview = await previewVietnameseClosingForScope(
              trx,
              scope,
              window
            );
            expect(preview.plan.issues).toEqual([]);
            expect(preview.plan.steps.length).toBeGreaterThan(0);
            const posted = await postVietnameseClosing(
              request(),
              window,
              preview.fingerprint
            );
            journalIds = posted.journalIds;
            expect(posted.alreadyPosted).toBe(false);
            expect((await retained()) - retainedBefore).toBeCloseTo(
              preview.plan.netIncome,
              5
            );
            expect(
              await trx
                .selectFrom("accountingPeriod")
                .select(["id", "closeStatus"])
                .where("companyId", "=", scope.companyId)
                .orderBy("id")
                .execute()
            ).toEqual(periodStatesBefore);
            expect(journalIds.length).toBe(preview.plan.steps.length);
            const balances = (
              await sql<{
                id: string;
                balance: number;
                status: string;
              }>`SELECT j.id,j.status,sum(CASE WHEN a.class IN ('Asset','Expense') THEN line.amount ELSE -line.amount END)::float8 AS balance FROM journal j JOIN "journalLine" line ON line."journalId"=j.id AND line."companyId"=j."companyId" JOIN account a ON a.id=line."accountId" AND a."companyGroupId"=${scope.companyGroupId} WHERE j."companyId"=${scope.companyId} AND j.id=ANY(${journalIds}::text[]) GROUP BY j.id,j.status`.execute(
                trx
              )
            ).rows;
            expect(balances).toHaveLength(journalIds.length);
            expect(
              balances.every(
                (row) =>
                  row.status === "Posted" && Math.abs(row.balance) < 0.000001
              )
            ).toBe(true);
            const afterPreview = await previewVietnameseClosingForScope(
              trx,
              scope,
              window
            );
            expect(afterPreview.plan.blocked).toBe(false);
            expect(afterPreview.plan.steps).toEqual([]);
            expect(afterPreview.plan.netIncome).toBe(0);
            const repeated = await postVietnameseClosing(
              request(),
              window,
              preview.fingerprint
            );
            expect(repeated.alreadyPosted).toBe(true);
            expect([...repeated.journalIds].sort()).toEqual(
              [...journalIds].sort()
            );
            const afterReport = await loadVietnameseReport(request());
            const b02 = (report: typeof beforeReport) =>
              report.reports.forms
                .find((form) => form.code === "B02-DN")!
                .lines.map((line) => ({
                  code: line.code,
                  current: line.current,
                  previous: line.previous
                }));
            expect(b02(afterReport)).toEqual(b02(beforeReport));
            reachedAssertions = true;
            throw rollback;
          });
      } catch (error) {
        if (error !== rollback) throw error;
      }
      expect(reachedAssertions).toBe(true);
      const countAfter = await db
        .selectFrom("journal")
        .select(sql<number>`count(*)::int`.as("count"))
        .where("companyId", "=", scope.companyId)
        .executeTakeFirstOrThrow();
      expect(countAfter.count).toBe(countBefore.count);
      expect(
        await db
          .selectFrom("journal")
          .select("id")
          .where("companyId", "=", scope.companyId)
          .where("id", "in", journalIds)
          .execute()
      ).toEqual([]);
    }, 30000);
  }
);
