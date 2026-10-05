// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { buildVietnameseDemoNotes } from "../../../apps/erp/app/modules/accounting/vietnamese-demo-notes.ts";
import {
  validateVietnameseDemoPackage,
  vietnameseLedgerDigest
} from "../../../apps/erp/app/modules/accounting/vietnamese-demo-package.server.ts";
import { buildVietnameseReports } from "../../../apps/erp/app/modules/accounting/vietnamese-reports.ts";
import { storage } from "../../files/src/storage.ts";
import { getProcessPool } from "./client.ts";
import { DEV_PASSWORD } from "./datasets/bootstrap.ts";
import { loadEnv } from "./datasets/cli.ts";
import {
  type FmcgReportSnapshot,
  fmcgReportInput
} from "./datasets/fmcg-report-input.ts";
import { verifyFmcgCompany } from "./datasets/fmcg-verify.ts";
import type { Database } from "./types.ts";

loadEnv();
const { values } = parseArgs({
  options: {
    company: { type: "string" },
    apply: { type: "boolean", default: false },
    email: { type: "string", default: "test@carbon.ms" }
  }
});
const hash = (text: string | Buffer) =>
  createHash("sha256").update(text).digest("hex");
const html = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!
  );
const cell = (value: unknown) => {
  const raw = String(value ?? "");
  const safe =
    typeof value === "string" && /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
};
const banner =
  "BỘ BÁO CÁO DEMO FMCG — DỮ LIỆU GIẢ LẬP; KHÔNG PHẢI BÁO CÁO NỘP CƠ QUAN QUẢN LÝ";

async function main() {
  if (!values.company) throw new Error("Required --company");
  for (const address of [
    process.env.SUPABASE_DB_URL,
    process.env.SUPABASE_URL
  ]) {
    if (
      !address ||
      !["localhost", "127.0.0.1", "[::1]"].includes(new URL(address).hostname)
    )
      throw new Error("Loopback database and API required");
  }
  const pool = getProcessPool();
  const db = await pool.connect();
  let verification;
  let registers;
  try {
    await db.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
    verification = await verifyFmcgCompany(db, values.company);
    if (verification.issues.length)
      throw new Error(verification.issues.join("\n"));
    registers = (
      await db.query<{ assets: number; items: number }>(
        `SELECT
      (SELECT count(*)::int FROM "fixedAsset" WHERE "companyId"=$1) AS assets,
      (SELECT count(*)::int FROM item WHERE "companyId"=$1) AS items`,
        [values.company]
      )
    ).rows[0]!;
    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  } finally {
    db.release();
    await pool.end();
  }
  const input = fmcgReportInput(
    verification.reportSnapshot as FmcgReportSnapshot
  );
  const initial = buildVietnameseReports(input);
  const content = buildVietnameseDemoNotes(input, initial, {
    fictionalDemo: true,
    workerCount: verification.plants.reduce(
      (sum, plant) => sum + plant.workers,
      0
    ),
    plants: verification.plants.map((plant) => ({
      name: plant.name,
      workerCount: plant.workers,
      productGroup: plant.name.includes("Đồ uống")
        ? "Đồ uống"
        : plant.name.includes("Thực phẩm")
          ? "Thực phẩm đóng gói"
          : "Chăm sóc cá nhân"
    })),
    assetRegisterCount: registers.assets,
    inventoryItemCount: registers.items
  });
  const prepared = {
    schemaVersion: 1,
    companyId: input.company.id,
    period: input.period,
    ledgerDigest: vietnameseLedgerDigest(input),
    ...content
  };
  if (!validateVietnameseDemoPackage(prepared, input))
    throw new Error("Invalid prepared disclosure package");
  const reports = buildVietnameseReports({ ...input, notes: prepared.notes });
  const notesCheck = reports.checks.find((check) => check.id === "notes");
  if (notesCheck) {
    notesCheck.label = "B09-DN: Đủ 101 mục thuyết minh demo";
    notesCheck.detail =
      "Nội dung giả lập đã chuẩn bị; chưa xác nhận pháp lý hoặc phê duyệt kế toán.";
  }
  if (
    reports.checks.some((check) => !check.passed) ||
    reports.warnings.some(
      (warning) =>
        !warning.startsWith(
          "Kỳ này: Kết quả chưa kết chuyển được trình bày tạm ở 420b;"
        )
    )
  )
    throw new Error(
      `Demo report checks failed: ${JSON.stringify(reports.checks)} ${reports.warnings.join("\n")}`
    );
  const bytes = `${JSON.stringify(prepared, null, 2)}\n`;
  const packageHash = hash(bytes);
  const files = new Map<
    string,
    {
      text: string;
      mime: string;
      type: "Document" | "Spreadsheet" | "Text" | "Other";
    }
  >();
  const jsonName = `TT99-demo-${input.period.startDate}-${input.period.endDate}.json`;
  files.set(jsonName, { text: bytes, mime: "application/json", type: "Other" });
  for (const form of reports.forms) {
    const rows: unknown[][] = [
      [banner],
      [form.code, form.title, input.company.name, input.company.currencyCode],
      ["Kỳ báo cáo", input.period.startDate, input.period.endDate],
      ["Kỳ so sánh", input.period.priorStartDate, input.period.priorEndDate],
      form.code === "B09-DN"
        ? ["Mã", "Chỉ tiêu", "Thuyết minh"]
        : ["Mã", "Chỉ tiêu", ...form.columns, "Thuyết minh"],
      ...form.lines.map((line) =>
        form.code === "B09-DN"
          ? [line.code, line.label, line.note]
          : [line.code, line.label, line.current, line.previous, line.note]
      ),
      ...reports.warnings.map((warning) => ["Lưu ý", warning]),
      ["Trạng thái", "DEMO_PREPARED; chưa xác nhận pháp lý/chữ ký/khóa sổ"]
    ];
    files.set(`${form.code}.csv`, {
      text: `\ufeff${rows.map((row) => row.map(cell).join(",")).join("\r\n")}`,
      mime: "text/csv",
      type: "Spreadsheet"
    });
  }
  files.set("B09-DN.md", {
    text: `# ${banner}\n\n${input.company.name}\n\nKỳ ${input.period.startDate} → ${input.period.endDate}; VND.\n\n${prepared.disclosures.map((note) => `## ${note.code} — ${note.label}\n\n${note.content}\n\nNguồn: ${note.provenance}\n`).join("\n")}\nNguồn chính thức: https://congbao.chinhphu.vn/van-ban/thong-tu-so-99-2025-tt-btc-46529/59631.htm\n`,
    mime: "text/markdown",
    type: "Text"
  });
  const sections = reports.forms
    .map(
      (form) =>
        `<section><h2>${html(form.code)} — ${html(form.title)}</h2><table><thead><tr><th>Mã</th><th>Chỉ tiêu</th>${form.code !== "B09-DN" ? form.columns.map((column) => `<th>${html(column)}</th>`).join("") : ""}<th>Thuyết minh</th></tr></thead><tbody>${form.lines.map((line) => `<tr><td>${html(line.code)}</td><td>${html(line.label)}</td>${form.code !== "B09-DN" ? `<td>${html(line.current)}</td><td>${html(line.previous)}</td>` : ""}<td>${html(line.note)}</td></tr>`).join("")}</tbody></table></section>`
    )
    .join("");
  files.set("Bao-cao-TT99-demo.html", {
    text: `<!doctype html><html lang="vi"><meta charset="utf-8"><title>TT99 demo FMCG</title><style>body{font:14px Arial;margin:32px;line-height:1.5}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;vertical-align:top}td:last-child{white-space:pre-wrap}section{break-before:page}h1{color:#134e4a}</style><h1>${html(banner)}</h1><p>${html(input.company.name)} · VND · ${html(input.period.startDate)} → ${html(input.period.endDate)}</p>${reports.warnings.map((warning) => `<p>${html(warning)}</p>`).join("")}${sections}<p>Chưa có chữ ký xác nhận hoặc phê duyệt pháp lý. Nguồn biểu mẫu: Công báo Chính phủ, TT99/2025/TT-BTC.</p></html>`,
    mime: "text/html",
    type: "Document"
  });
  const manifest = {
    schemaVersion: 1,
    companyId: input.company.id,
    period: input.period,
    status: "DEMO_PREPARED",
    statutorySubmission: false,
    packageHash,
    ledgerDigest: prepared.ledgerDigest,
    noteCount: Object.keys(prepared.notes).length,
    checks: reports.checks,
    warnings: reports.warnings,
    files: [...files].map(([name, file]) => ({
      name,
      sha256: hash(file.text),
      bytes: Buffer.byteLength(file.text)
    }))
  };
  const bundleHash = hash(JSON.stringify(manifest));
  const folder = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.cc1-agentic/releases",
    `TT99-demo-${input.period.endDate}-${bundleHash.slice(0, 12)}`
  );
  mkdirSync(folder, { recursive: true });
  files.set("manifest.json", {
    text: `${JSON.stringify(manifest, null, 2)}\n`,
    mime: "application/json",
    type: "Other"
  });
  for (const [name, file] of files) {
    const target = path.join(folder, name);
    if (existsSync(target) && readFileSync(target, "utf8") !== file.text)
      throw new Error("Immutable release file collision");
    if (!existsSync(target)) writeFileSync(target, file.text, "utf8");
  }
  if (values.apply) {
    const user = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const signed = await user.auth.signInWithPassword({
      email: values.email!,
      password: DEV_PASSWORD
    });
    if (signed.error || !signed.data.user)
      throw new Error("Existing local demo login failed");
    const userId = signed.data.user.id;
    const membership = await user
      .from("userToCompany")
      .select("companyId")
      .eq("companyId", input.company.id)
      .eq("userId", userId)
      .single();
    if (membership.error) throw new Error("Company membership required");
    const admin = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    const bucket = await admin.storage.getBucket(input.company.id);
    if (bucket.error) {
      const created = await admin.storage.createBucket(input.company.id, {
        public: false
      });
      if (created.error)
        throw new Error(
          "Could not provision local company-private document bucket"
        );
    } else if (bucket.data.public)
      throw new Error("Report bucket must be private");
    for (const [name, file] of files) {
      const objectPath = `${input.company.id}/reports/tt99/${bundleHash}/${name}`;
      const uploaded = await storage(user)
        .company(input.company.id)
        .upload(objectPath, Buffer.from(file.text), {
          contentType: file.mime,
          upsert: false
        });
      const downloaded = await storage(user)
        .company(input.company.id)
        .download(objectPath);
      if (
        downloaded.error ||
        !downloaded.data ||
        hash(Buffer.from(await downloaded.data.arrayBuffer())) !==
          hash(file.text)
      )
        throw new Error(
          `Storage digest verification failed: ${name}${uploaded.error ? ` (${uploaded.error.message})` : ""}`
        );
      const existing = await user
        .from("document")
        .select("id")
        .eq("companyId", input.company.id)
        .eq("path", objectPath)
        .maybeSingle();
      if (existing.error)
        throw new Error("Cannot verify existing report document");
      if (!existing.data) {
        const registered = await user
          .from("document")
          .insert({
            companyId: input.company.id,
            createdBy: userId,
            name,
            path: objectPath,
            size: Math.ceil(Buffer.byteLength(file.text) / 1024),
            type: file.type,
            description: banner,
            readGroups: [userId],
            writeGroups: [userId]
          })
          .select("id")
          .single();
        if (registered.error)
          throw new Error(
            `Document registration failed: ${registered.error.message}`
          );
      }
    }
    await user.auth.signOut({ scope: "local" });
  }
  console.log(
    JSON.stringify(
      {
        mode: values.apply ? "local-demo-published" : "prepared-local-files",
        companyId: input.company.id,
        noteCount: manifest.noteCount,
        packageHash,
        bundleHash,
        ledgerDigest: prepared.ledgerDigest,
        folder,
        files: [...files.keys()],
        numericChecksPassed: reports.checks.every((check) => check.passed),
        statutorySubmission: false
      },
      null,
      2
    )
  );
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
