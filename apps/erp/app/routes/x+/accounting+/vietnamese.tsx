// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { assertIsPost } from "@carbon/auth";
import { Button, Heading } from "@carbon/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "react-router";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation
} from "react-router";
import {
  loadVietnameseClosing,
  postVietnameseClosing
} from "~/modules/accounting/vietnamese-closing.server";

export const meta: MetaFunction = () => [
  { title: "Carbon | Kế toán Việt Nam TT99" }
];
export async function loader({ request }: LoaderFunctionArgs) {
  return loadVietnameseClosing(request);
}
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const form = await request.formData();
  if (form.get("intent") !== "post" || form.get("confirm") !== "yes")
    throw new Response("Cần xác nhận ghi sổ kết chuyển", { status: 400 });
  return postVietnameseClosing(
    request,
    {
      startDate: String(form.get("startDate") ?? ""),
      endDate: String(form.get("endDate") ?? "")
    },
    String(form.get("fingerprint") ?? "")
  );
}

const money = (value: number) =>
  value.toLocaleString("vi-VN", { maximumFractionDigits: 5 });

export default function VietnameseAccounting() {
  const preview = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <div className="space-y-6 p-6">
      <Heading>Kế toán Việt Nam — Thông tư 99</Heading>
      <p>
        Năm tài chính: {preview.fiscalYear.startDate} →{" "}
        {preview.fiscalYear.endDate}. Khoảng kết chuyển phải nằm trong năm này;
        số dư kết quả chưa xử lý của năm trước cần đối soát riêng.
      </p>
      <p>
        {preview.company.name} · Đồng tiền kế toán:{" "}
        {preview.company.baseCurrencyCode}
      </p>
      <p>
        Kết chuyển giảm trừ doanh thu 521 vào 511, doanh thu và chi phí vào 911,
        lãi/lỗ vào 4212. Chi phí sản xuất 621/622/627 phải được phân bổ vào 154
        trước. Ghi sổ không tự khóa hay đóng kỳ kế toán.
      </p>
      <Link
        className="underline"
        to={`/x/reports/vietnamese?startDate=${preview.window.startDate}&endDate=${preview.window.endDate}`}
      >
        Báo cáo và 101 mục thuyết minh TT99
      </Link>
      <Form method="get" className="flex flex-wrap items-end gap-4">
        <label>
          Từ ngày
          <input
            className="ml-2 rounded border p-2"
            type="date"
            name="startDate"
            required
            defaultValue={preview.window.startDate}
          />
        </label>
        <label>
          Đến ngày
          <input
            className="ml-2 rounded border p-2"
            type="date"
            name="endDate"
            required
            defaultValue={preview.window.endDate}
          />
        </label>
        <Button type="submit" variant="secondary">
          Xem trước
        </Button>
      </Form>
      {result && (
        <p role="status">
          {result.alreadyPosted
            ? "Kỳ này đã ghi sổ kết chuyển; không tạo trùng."
            : `Đã ghi sổ ${result.journalIds.length} bút toán kết chuyển.`}
        </p>
      )}
      {preview.plan.issues.length > 0 && (
        <div role="alert" className="rounded border border-red-500 p-4">
          <p>Chưa thể ghi sổ:</p>
          <ul className="list-disc pl-6">
            {preview.plan.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      <p>
        Kết quả sau thuế được kết chuyển: {money(preview.plan.netIncome)} VND
      </p>
      {preview.plan.steps.map((step) => (
        <section key={step.kind} className="space-y-2">
          <h2 className="font-semibold">{step.description}</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th>Tài khoản</th>
                <th>Nợ</th>
                <th>Có</th>
              </tr>
            </thead>
            <tbody>
              {step.lines.map((line, index) => (
                <tr key={`${line.accountId}:${index}`} className="border-b">
                  <td>{line.accountNumber}</td>
                  <td>{money(line.debit)}</td>
                  <td>{money(line.credit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      {!preview.plan.blocked && preview.plan.steps.length === 0 && (
        <p>Không còn số dư cần kết chuyển trong khoảng ngày đã chọn.</p>
      )}
      <Form method="post" className="space-y-3">
        <input type="hidden" name="intent" value="post" />
        <input
          type="hidden"
          name="startDate"
          value={preview.window.startDate}
        />
        <input type="hidden" name="endDate" value={preview.window.endDate} />
        <input type="hidden" name="fingerprint" value={preview.fingerprint} />
        <label className="flex gap-2">
          <input type="checkbox" name="confirm" value="yes" required />
          Tôi đã đối soát số liệu, phân bổ chi phí, thuế thu nhập doanh nghiệp
          và xác nhận ghi sổ các bút toán trên.
        </label>
        <Button
          type="submit"
          isDisabled={
            preview.plan.blocked ||
            preview.plan.steps.length === 0 ||
            navigation.state !== "idle"
          }
        >
          Ghi sổ kết chuyển
        </Button>
      </Form>
      <p className="text-muted-foreground">
        Báo cáo pháp lý cần rà soát chính sách, phân loại công nợ và lưu chuyển
        tiền, hoàn thiện thuyết minh, khóa sổ và phê duyệt của người có thẩm
        quyền. Workbench không tự tính nghĩa vụ thuế hoặc thay thế việc rà soát
        của kế toán.
      </p>
    </div>
  );
}
