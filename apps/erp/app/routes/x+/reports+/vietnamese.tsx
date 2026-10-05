// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { Badge, Button, Heading, Input } from "@carbon/react";
import { useState } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "react-router";
import { Form, Link, useActionData, useLoaderData } from "react-router";
import {
  loadVietnameseReport,
  saveVietnameseNotes,
  vietnameseReportCsv
} from "./vietnamese.server";

export const meta: MetaFunction = () => [
  { title: "Carbon | Báo cáo tài chính Việt Nam" }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const result = await loadVietnameseReport(request);
  const params = new URL(request.url).searchParams;
  const csv = params.get("export");
  if (csv)
    return vietnameseReportCsv(
      result,
      csv,
      params.get("mode") === "demo"
        ? "demo"
        : params.get("mode") === "management"
          ? "management"
          : "standard"
    );
  return result;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST")
    throw new Response("Method not allowed", { status: 405 });
  const fields = await request.formData();
  const notes: Record<string, string> = {};
  for (const [key, value] of fields) {
    if (!key.startsWith("note.") || typeof value !== "string") continue;
    if (!/^[IVX]+(?:\.\d+)?$/.test(key.slice(5))) continue;
    if (value.length > 5000)
      throw new Response("Thuyết minh quá dài", { status: 400 });
    notes[key.slice(5)] = value;
  }
  if (fields.get("intent") === "save-notes")
    return saveVietnameseNotes(
      request,
      notes,
      String(fields.get("ledgerDigest") ?? "")
    );
  const result = await loadVietnameseReport(request, notes);
  return vietnameseReportCsv(result, String(fields.get("export") ?? "B09-DN"));
}

export default function VietnameseReportsRoute() {
  const {
    company,
    period,
    reports,
    journalLineCount,
    demoPackage,
    demoPackageIssue,
    demoExportReady,
    managementExportReady,
    nativeDraft,
    nativeDraftIssue,
    ledgerDigest,
    annualPeriod
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selected, setSelected] = useState("B01-DN");
  const notesScope = `${company.id}:${period.startDate}:${period.endDate}:${nativeDraft?.id ?? demoPackage?.id ?? "draft"}`;
  const [editedNotes, setEditedNotes] = useState<{
    scope: string;
    values: Record<string, string>;
  }>({ scope: notesScope, values: {} });
  const notes = editedNotes.scope === notesScope ? editedNotes.values : {};
  const form =
    reports.forms.find((item) => item.code === selected) ?? reports.forms[0];
  const money = (amount: number | null) =>
    amount == null
      ? "Chưa đủ dữ liệu"
      : new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
          amount
        );
  const csv = new URLSearchParams({
    startDate: period.startDate,
    endDate: period.endDate,
    export: form.code
  });
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading>
            Báo cáo tài chính Việt Nam — Thông tư 99/2025/TT-BTC
          </Heading>
          <p className="text-sm text-muted-foreground">
            {company.name} · Đơn vị: {company.currencyCode} · {journalLineCount}{" "}
            dòng sổ đã ghi
          </p>
        </div>
        <Badge variant="secondary">
          {demoExportReady ? "Demo đã chuẩn bị" : "Bản nháp nội bộ"}
        </Badge>
      </div>
      <Form method="get" className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Từ ngày
          <Input
            type="date"
            name="startDate"
            defaultValue={period.startDate}
            required
            min="2026-01-01"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Đến ngày
          <Input
            type="date"
            name="endDate"
            defaultValue={period.endDate}
            required
          />
        </label>
        <Button type="submit" variant="primary">
          Xem báo cáo
        </Button>
        <Link to="/x/accounting/reports" className="text-sm underline">
          Danh mục báo cáo
        </Link>
      </Form>
      <p className="text-sm text-muted-foreground">
        {annualPeriod
          ? "Kỳ đủ năm tài chính"
          : "Báo cáo quản trị theo kỳ, chưa phải báo cáo năm"}
        . Kỳ so sánh: {period.priorStartDate} → {period.priorEndDate}. Báo cáo
        chỉ sử dụng sổ đã ghi của công ty đang chọn.
      </p>
      <div className="rounded-lg border p-4 space-y-2" role="status">
        {nativeDraftIssue && (
          <p className="text-sm text-amber-700">{nativeDraftIssue}</p>
        )}
        {nativeDraft && (
          <p className="text-sm">
            Đã tải phiên bản thuyết minh DRAFT đã lưu. Chưa được phê duyệt phát
            hành chính thức.
          </p>
        )}
        {actionData && "saved" in actionData && actionData.saved && (
          <p className="text-sm">
            Đã lưu phiên bản thuyết minh mới trên local.
          </p>
        )}
        {demoPackage && (
          <p className="text-sm">
            Đã nạp 101 mục thuyết minh từ gói DEMO_PREPARED. Bộ dữ liệu giả lập
            này không dùng nộp báo cáo chính thức.
          </p>
        )}
        {demoPackageIssue && (
          <p className="text-sm text-amber-700">{demoPackageIssue}</p>
        )}
        {demoExportReady && (
          <div className="flex flex-wrap gap-4">
            {reports.forms.map((item) => (
              <a
                key={item.code}
                className="text-sm underline"
                href={`?${new URLSearchParams({ startDate: period.startDate, endDate: period.endDate, export: item.code, mode: "demo" })}`}
              >
                Xuất DEMO {item.code}
              </a>
            ))}
          </div>
        )}
        {managementExportReady && (
          <div className="flex flex-wrap gap-4">
            {reports.forms.map((item) => (
              <a
                key={item.code}
                className="text-sm underline"
                href={`?${new URLSearchParams({ startDate: period.startDate, endDate: period.endDate, export: item.code, mode: "management" })}`}
              >
                Xuất bản nháp quản trị {item.code}
              </a>
            ))}
          </div>
        )}
        {reports.checks.map((check) => (
          <p
            key={check.id}
            className={check.passed ? "text-sm" : "text-sm text-destructive"}
          >
            {check.passed ? "✓" : "!"} {check.label}: {check.detail}
          </p>
        ))}
        {reports.warnings.map((warning) => (
          <p key={warning} className="text-sm text-amber-700">
            {warning}
          </p>
        ))}
        <p className="text-sm">
          Thuyết minh, phân loại chi tiết và phê duyệt cần được kế toán hoàn
          thiện trước khi sử dụng chính thức.
        </p>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Mẫu báo cáo tài chính">
        {reports.forms.map((item) => (
          <Button
            key={item.code}
            variant={item.code === form.code ? "primary" : "secondary"}
            onClick={() => setSelected(item.code)}
            aria-pressed={item.code === form.code}
          >
            {item.code}
          </Button>
        ))}
      </nav>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{form.title}</h2>
        {reports.blocked ||
        !annualPeriod ||
        !nativeDraft ||
        nativeDraft.status === "DRAFT" ? (
          <span className="text-sm text-destructive">
            Chưa đủ điều kiện xuất CSV
          </span>
        ) : (
          <a className="text-sm underline" href={`?${csv}`}>
            Xuất CSV
          </a>
        )}
      </div>
      {form.code === "B09-DN" && (
        <Form
          method="post"
          action={`?startDate=${period.startDate}&endDate=${period.endDate}`}
          className="rounded-lg border p-4 space-y-4"
        >
          <input type="hidden" name="ledgerDigest" value={ledgerDigest} />
          <p className="text-sm text-muted-foreground">
            {demoPackage
              ? "Nội dung bên dưới đã nạp từ gói demo đã lưu. Sửa trong phiên này chỉ tạo bản nháp, không cập nhật hoặc phê duyệt gói demo."
              : "Lưu thuyết minh tạo phiên bản DRAFT mới cho công ty và kỳ đang chọn. Phiên bản cũ được giữ nguyên; lưu không phải phê duyệt phát hành."}
          </p>
          {form.lines.map((line) => (
            <label key={line.code} className="flex flex-col gap-1 text-sm">
              <span>
                {line.code} — {line.label}
              </span>
              <textarea
                className="rounded-md border p-2 bg-background"
                rows={2}
                maxLength={5000}
                name={`note.${line.code}`}
                value={notes[line.code] ?? line.note ?? ""}
                onChange={(event) =>
                  setEditedNotes({
                    scope: notesScope,
                    values: { ...notes, [line.code]: event.target.value }
                  })
                }
                placeholder="Nhập nội dung thuyết minh được xác nhận"
              />
            </label>
          ))}
          <Button
            type="submit"
            name="intent"
            value="save-notes"
            variant="primary"
          >
            Lưu bản nháp thuyết minh
          </Button>
        </Form>
      )}
      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Mã số</th>
              <th className="p-3 text-left">Chỉ tiêu</th>
              {form.code !== "B09-DN" && (
                <>
                  <th className="p-3 text-right">{form.columns[0]}</th>
                  <th className="p-3 text-right">{form.columns[1]}</th>
                </>
              )}
              <th className="p-3 text-left">Thuyết minh</th>
            </tr>
          </thead>
          <tbody>
            {form.lines.map((line) => (
              <tr key={line.code} className="border-t">
                <td className="p-3">{line.code}</td>
                <td className="p-3">{line.label}</td>
                {form.code !== "B09-DN" && (
                  <>
                    <td className="p-3 text-right tabular-nums">
                      {money(line.current)}
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {money(line.previous)}
                    </td>
                  </>
                )}
                <td className="p-3 text-muted-foreground">
                  {notes[line.code] ?? line.note ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
