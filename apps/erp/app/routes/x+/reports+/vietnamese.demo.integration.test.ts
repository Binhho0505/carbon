// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { writeFileSync } from "node:fs";
import type { Database } from "@carbon/database";
import { getPostgresClient, getProcessPool } from "@carbon/database/client";
import { createClient } from "@supabase/supabase-js";
import { PostgresDriver } from "kysely";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ permissions: vi.fn(), database: vi.fn() }));
vi.mock("@carbon/auth/auth.server", () => ({
  requirePermissions: mocks.permissions
}));
vi.mock("~/services/database.server", () => ({
  getDatabaseClient: mocks.database
}));
// Read-only loader verification never saves a document. Avoid importing the
// unrelated document-write UI/glossary graph into this server-only Vitest run.
vi.mock("~/modules/documents/documents.service", () => ({
  upsertDocument: vi.fn()
}));
vi.mock(
  "~/modules/accounting/vietnamese-demo-package.server",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("~/modules/accounting/vietnamese-demo-package.server")
      >();
    return {
      ...actual,
      validateVietnameseDemoPackage: (
        value: unknown,
        input: Parameters<typeof actual.validateVietnameseDemoPackage>[1]
      ) => {
        const valid = actual.validateVietnameseDemoPackage(value, input);
        if (!valid && process.env.CARBON_DEMO_INTEGRATION === "1") {
          writeFileSync(
            new URL(
              "../../../../../../.cc1-agentic/tt99-demo-loader-diagnostic.json",
              import.meta.url
            ),
            JSON.stringify(
              {
                actualLedgerDigest: actual.vietnameseLedgerDigest(input),
                package: value,
                input
              },
              null,
              2
            )
          );
        }
        return valid;
      }
    };
  }
);

import { loadVietnameseReport, vietnameseReportCsv } from "./vietnamese.server";

/** Opt-in local SQL/storage adapter verification, not an HTTP/browser auth test. */
describe.skipIf(process.env.CARBON_DEMO_INTEGRATION !== "1")(
  "persisted TT99 demo local integration",
  () => {
    let closeFixtureSession: (() => Promise<unknown>) | undefined;
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
        "../../../../../../packages/database/src/datasets/cli"
      );
      const { DEV_PASSWORD } = await import(
        "../../../../../../packages/database/src/datasets/bootstrap"
      );
      loadEnv();
      process.env.SUPABASE_URL = "http://localhost:54321";
      process.env.SUPABASE_API_URL = process.env.SUPABASE_URL;
      process.env.SUPABASE_DB_URL =
        "postgresql://postgres:postgres@localhost:55584/postgres";
      for (const key of ["SUPABASE_URL", "SUPABASE_DB_URL"]) {
        if (
          !["localhost", "127.0.0.1", "[::1]"].includes(
            new URL(process.env[key]!).hostname
          )
        )
          throw new Error("Local integration requires loopback services");
      }
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
        throw new Error("Local integration fixture authentication failed");
      closeFixtureSession = () => client.auth.signOut({ scope: "local" });
      const company = await client
        .from("company")
        .select("id,companyGroupId")
        .eq("name", "FMCG Việt Nam — Dữ liệu giả lập 3 nhà máy")
        .single();
      if (company.error || !company.data)
        throw new Error("Local FMCG company unavailable under fixture RLS");
      const membership = await client
        .from("userToCompany")
        .select("role")
        .eq("userId", login.data.user.id)
        .eq("companyId", company.data.id)
        .single();
      if (membership.error || membership.data?.role !== "employee")
        throw new Error("Fixture company employee membership required");
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
        !permissions?.accounting_view?.includes(company.data.id)
      )
        throw new Error("Fixture accounting view permission required");
      // The adapter supplies an independently verified authorized fixture scope;
      // production requirePermissions and the HTTP Turnstile gate are unchanged.
      mocks.permissions.mockResolvedValue({
        client,
        companyId: company.data.id,
        companyGroupId: company.data.companyGroupId
      });
      mocks.database.mockReturnValue(
        getPostgresClient(getProcessPool(), PostgresDriver)
      );
    }, 30000);
    afterAll(async () => {
      await closeFixtureSession?.();
      if (mocks.database.mock.calls.length) await getProcessPool().end();
    });
    it("reads native SQL and authenticated document/storage, matching 101 notes and all marked exports", async () => {
      const result = await loadVietnameseReport(
        new Request(
          "http://localhost:3000/x/reports/vietnamese?startDate=2026-01-01&endDate=2026-10-05"
        )
      );
      expect(result.demoPackageIssue).toBeNull();
      expect(result.demoExportReady).toBe(true);
      expect(result.demoPackage?.status).toBe("DEMO_PREPARED");
      const notes = result.reports.forms.find(
        (form) => form.code === "B09-DN"
      )!.lines;
      expect(notes).toHaveLength(101);
      expect(notes.every((line) => (line.note?.trim().length ?? 0) >= 30)).toBe(
        true
      );
      expect(result.reports.checks.every((check) => check.passed)).toBe(true);
      for (const code of ["B01-DN", "B02-DN", "B03-DN", "B09-DN"]) {
        const response = vietnameseReportCsv(result, code, "demo");
        expect(response.status).toBe(200);
        expect(await response.text()).toContain(
          "KHÔNG DÙNG NỘP BÁO CÁO CHÍNH THỨC"
        );
        try {
          vietnameseReportCsv(result, code);
          throw new Error("Standard export unexpectedly allowed");
        } catch (error) {
          expect(error).toMatchObject({ status: 409 });
        }
      }
    }, 30000);
  }
);
