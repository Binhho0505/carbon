// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PoolClient } from "pg";
import { addTt99ClosingAccounts } from "../tt99-chart.ts";

/** Proposed Vietnamese analytical accounts for this local demo, not a statutory certification.
 * Technical clearing/variance suffixes preserve Carbon posting behavior and require accountant review.
 * Existing IDs, classes, hierarchy and foreign keys are deliberately preserved.
 */
export const VIETNAMESE_ACCOUNT_MAPPING: Record<string, [string, string]> = {
  "1010": ["1111", "Tiền mặt Việt Nam"],
  "1020": ["1121", "Tiền gửi ngân hàng VND"],
  "1030": ["1122", "Tiền gửi ngân hàng ngoại tệ"],
  "1110": ["131", "Phải thu của khách hàng"],
  "1130": ["1368", "Phải thu nội bộ khác"],
  "1150": ["331.TRATRUOC", "Trả trước cho người bán - dư Nợ chi tiết"],
  "1210": ["152", "Nguyên liệu, vật liệu"],
  "1220": ["155", "Thành phẩm"],
  "1230": ["154", "Chi phí sản xuất, kinh doanh dở dang"],
  "1240": ["2294", "Dự phòng giảm giá hàng tồn kho"],
  "1310": ["2118", "Tài sản cố định hữu hình khác"],
  "1320": ["2118.THANHLY", "Nguyên giá thanh lý - trung gian demo"],
  "1330": ["2141", "Hao mòn tài sản cố định hữu hình"],
  "1340": ["2141.THANHLY", "Hao mòn thanh lý - trung gian demo"],
  "1350": ["2112", "Máy móc, thiết bị"],
  "1360": ["2111", "Nhà cửa, vật kiến trúc"],
  "1410": ["213", "Tài sản cố định vô hình"],
  "1420": ["2143", "Hao mòn tài sản cố định vô hình"],
  "1430": ["221", "Đầu tư vào công ty con"],
  "1440": ["243", "Tài sản thuế thu nhập hoãn lại"],
  "2010": ["331", "Phải trả cho người bán"],
  "2020": ["3368", "Phải trả nội bộ khác"],
  "2110": ["131.NHANTT", "Khách hàng trả trước - dư Có chi tiết"],
  "2125": ["331.GRIR", "Hàng nhận chưa có hóa đơn - trung gian demo"],
  "2140": ["335", "Chi phí phải trả"],
  "2150": ["3341", "Phải trả người lao động"],
  "2160": ["3387", "Doanh thu chờ phân bổ"],
  "2170": ["3411.NGANHAN", "Các khoản đi vay - ngắn hạn"],
  "2180": ["3388.HOANUNG", "Phải trả hoàn ứng nhân viên"],
  "2210": ["33311", "Thuế GTGT đầu ra"],
  "2220": ["1331", "Thuế GTGT được khấu trừ của hàng hóa, dịch vụ"],
  "2230": ["33311.REVERSE", "Thuế reverse charge - trung gian demo"],
  "2410": ["3411.DAIHAN", "Các khoản đi vay - dài hạn"],
  "2420": ["347", "Thuế thu nhập hoãn lại phải trả"],
  "2430": ["3388.HUUTRI", "Nghĩa vụ hưu trí - phân tích demo"],
  "3010": ["4111", "Vốn góp của chủ sở hữu"],
  "3100": ["421", "Lợi nhuận sau thuế chưa phân phối"],
  "3200": ["413", "Chênh lệch tỷ giá hối đoái"],
  "3300": ["3388.COTUC", "Cổ tức phải trả"],
  "4010": ["5111", "Doanh thu bán hàng hóa"],
  "4020": ["5211", "Chiết khấu thương mại"],
  "4030": ["5113", "Doanh thu cung cấp dịch vụ"],
  "4040": ["635.CKTT", "Chiết khấu thanh toán cho khách hàng"],
  "4050": ["5113.VANCHUYEN", "Doanh thu vận chuyển"],
  "4900": ["5212", "Hàng bán bị trả lại"],
  "4110": ["711.PHELIEU", "Thu nhập bán phế liệu"],
  "4120": ["515.TYGIA", "Lãi chênh lệch tỷ giá"],
  "4130": ["711.XOANO", "Thu nhập xóa nợ phải trả"],
  "4140": ["711.THANHLY", "Thu nhập thanh lý tài sản"],
  "5010": ["632", "Giá vốn hàng bán"],
  "5050": ["6272", "Chi phí vật liệu sản xuất chung"],
  "5060": ["622.PHANBO", "Phân bổ nhân công và máy - trung gian demo"],
  "5070": ["627.PHANBO", "Phân bổ sản xuất chung - trung gian demo"],
  "5080": ["515.CKTT", "Chiết khấu thanh toán được hưởng"],
  "5210": ["632.CLGIA", "Chênh lệch giá mua"],
  "5220": ["632.CLNVL", "Chênh lệch sử dụng nguyên vật liệu"],
  "5230": ["632.CLNC", "Chênh lệch nhân công và máy"],
  "5240": ["632.CLSXC", "Chênh lệch sản xuất chung"],
  "5250": ["632.CLLO", "Chênh lệch cỡ lô"],
  "5260": ["632.CLGIACONG", "Chênh lệch gia công"],
  "5310": ["632.KIEMKE", "Chênh lệch kiểm kê"],
  "5320": ["632.PHEPHAM", "Phế phẩm và chi phí chất lượng"],
  "6010": ["6277.BAOTRI", "Chi phí bảo trì"],
  "6020": ["641.HOAHONG", "Hoa hồng bán hàng"],
  "6030": ["641.QUANGCAO", "Quảng cáo và tiếp thị"],
  "6040": ["641.VANCHUYEN", "Vận chuyển bán hàng"],
  "6050": ["642.NOKHO", "Chi phí nợ khó đòi"],
  "6060": ["6421", "Chi phí nhân viên quản lý"],
  "6070": ["6427.DIENNUOC", "Thuê mặt bằng và điện nước quản lý"],
  "6080": ["6427.TUVAN", "Dịch vụ chuyên môn"],
  "6090": ["6428.CONGTAC", "Công tác phí"],
  "6100": ["6428.BAOHIEM", "Chi phí bảo hiểm"],
  "6110": ["6427.NGANHANG", "Phí ngân hàng"],
  "6310": ["6274", "Chi phí khấu hao tài sản cố định"],
  "6320": ["811.THANHLY", "Chi phí thanh lý tài sản"],
  "7010": ["635.LAIVAY", "Chi phí lãi vay"],
  "7040": ["6427.DICHVU", "Phí dịch vụ"],
  "7050": ["811.LAMTRON", "Chênh lệch làm tròn demo"],
  "7060": ["635.TYGIA", "Lỗ chênh lệch tỷ giá"],
  "7070": ["8211", "Chi phí thuế TNDN hiện hành"],
  "7080": ["642.NGHIENCUU", "Chi phí nghiên cứu và phát triển"],
  "7090": ["8212", "Chi phí thuế TNDN hoãn lại"]
};

export async function applyVietnameseAccounting(
  client: PoolClient,
  options: { companyId: string; companyGroupId: string; userId: string }
): Promise<{
  mapped: number;
  added: number;
  postedJournals: number;
  gaps: string[];
}> {
  const { companyId, companyGroupId } = options;
  const scope = await client.query(
    `SELECT id FROM company WHERE id = $1 AND "companyGroupId" = $2`,
    [companyId, companyGroupId]
  );
  if (scope.rowCount !== 1)
    throw new Error("FMCG accounting company/group mismatch");
  const mapping = Object.entries(VIETNAMESE_ACCOUNT_MAPPING);
  const source = await client.query<{ id: string; number: string }>(
    `SELECT id, number FROM account WHERE "companyGroupId" = $1 AND NOT "isGroup"`,
    [companyGroupId]
  );
  const byNumber = new Map(source.rows.map((row) => [row.number, row.id]));
  for (const [legacy, [number]] of mapping) {
    if (!byNumber.has(legacy))
      throw new Error(`Missing bootstrap account ${legacy}`);
    if (byNumber.has(number) && byNumber.get(number) !== byNumber.get(legacy)) {
      throw new Error(`Vietnamese account collision ${number}`);
    }
  }
  // One tenant-scoped bulk update. The caller supplies the surrounding transaction.
  await client.query(
    `UPDATE account a SET number = m.number, name = m.name
     FROM jsonb_to_recordset($2::jsonb) AS m(id text, number text, name text)
     WHERE a.id = m.id AND a."companyGroupId" = $1`,
    [
      companyGroupId,
      JSON.stringify(
        mapping.map(([legacy, [number, name]]) => ({
          id: byNumber.get(legacy),
          number,
          name
        }))
      )
    ]
  );
  // Additional leaves preserve the source account's compatible class/type and ancestry.
  const additions = [
    ["1332", "Thuế GTGT được khấu trừ của tài sản cố định", "1331"],
    ["3334", "Thuế thu nhập doanh nghiệp phải trả", "33311"],
    ["3335", "Thuế thu nhập cá nhân phải trả", "3341"],
    ["3382", "Kinh phí công đoàn", "3341"],
    ["3383", "Bảo hiểm xã hội", "3341"],
    ["3384", "Bảo hiểm y tế", "3341"],
    ["3386", "Bảo hiểm thất nghiệp", "3341"],
    ["621", "Chi phí nguyên liệu, vật liệu trực tiếp", "6272"],
    ["622", "Chi phí nhân công trực tiếp", "622.PHANBO"],
    ["6271", "Chi phí nhân viên phân xưởng", "622.PHANBO"],
    ["6277", "Chi phí dịch vụ mua ngoài sản xuất chung", "6272"]
  ];
  const added = await client.query(
    `INSERT INTO account (number, name, "isGroup", "accountType", "incomeBalance", class,
      "parentId", "companyGroupId", "createdBy", "consolidatedRate")
     SELECT m.number, m.name, false, a."accountType", a."incomeBalance", a.class,
       a."parentId", a."companyGroupId", a."createdBy", a."consolidatedRate"
     FROM jsonb_to_recordset($2::jsonb) AS m(number text, name text, template text)
     JOIN account a ON a.number = m.template AND a."companyGroupId" = $1
     WHERE NOT EXISTS (SELECT 1 FROM account e WHERE e.number = m.number AND e."companyGroupId" = $1)`,
    [
      companyGroupId,
      JSON.stringify(
        additions.map(([number, name, template]) => ({
          number,
          name,
          template
        }))
      )
    ]
  );
  // Natural-balance amounts must be converted to debit signs before summing.
  const closingAccounts = await addTt99ClosingAccounts(
    client,
    companyGroupId,
    options.userId
  );
  const balance = await client.query<{ journalId: string }>(
    `SELECT j.id AS "journalId" FROM journal j JOIN "journalLine" l ON l."journalId" = j.id
     JOIN account a ON a.id = l."accountId"
     WHERE j."companyId" = $1 AND j.status <> 'Draft'
     GROUP BY j.id HAVING abs(sum(CASE WHEN a.class IN ('Asset', 'Expense') THEN l.amount ELSE -l.amount END)) > 0.00000001`,
    [companyId]
  );
  if (balance.rows.length)
    throw new Error(
      `Unbalanced FMCG journals: ${balance.rows.map((row) => row.journalId).join(", ")}`
    );
  const count = await client.query<{ count: string }>(
    `SELECT count(*) FROM journal WHERE "companyId" = $1 AND status = 'Posted'`,
    [companyId]
  );
  return {
    mapped: mapping.length,
    added: (added.rowCount ?? 0) + closingAccounts.added,
    postedJournals: Number(count.rows[0]?.count ?? 0),
    gaps: [
      "Company-specific analytical suffixes require accountant policy review; source chart verified against official Appendix II",
      "Per-partner statutory advance offsetting must be verified before official financial statements",
      "TT99 B01/B02/B03/B09 engine integration and disclosure completeness require separate report QA",
      "Demo payroll accrual only; no statutory payroll, insurance or PIT engine"
    ]
  };
}

/** Configure the independent demo before any journals exist. Never reclassify live posted accounts. */
export async function prepareVietnameseAccounting(
  client: PoolClient,
  options: { companyId: string; companyGroupId: string; userId: string }
): Promise<void> {
  const { companyId, companyGroupId } = options;
  const ownership = await client.query<{ companies: string; journals: string }>(
    `SELECT (SELECT count(*) FROM company WHERE "companyGroupId" = $2) AS companies,
      (SELECT count(*) FROM journal WHERE "companyId" = $1) AS journals
     FROM company WHERE id = $1 AND "companyGroupId" = $2`,
    [companyId, companyGroupId]
  );
  if (
    ownership.rows[0]?.companies !== "1" ||
    ownership.rows[0]?.journals !== "0"
  ) {
    throw new Error(
      "Vietnamese preparation requires a new isolated company group without journals"
    );
  }
  const corrections = [
    { number: "2220", template: "1150" },
    { number: "4040", template: "7060" },
    { number: "5080", template: "4120" },
    { number: "3300", template: "2140" }
  ];
  const fixed = await client.query(
    `UPDATE account a SET class = t.class, "accountType" = t."accountType",
      "incomeBalance" = t."incomeBalance", "parentId" = t."parentId", "consolidatedRate" = t."consolidatedRate"
     FROM jsonb_to_recordset($2::jsonb) AS m(number text, template text)
     JOIN account t ON t.number = m.template AND t."companyGroupId" = $1
     WHERE a.number = m.number AND a."companyGroupId" = $1`,
    [companyGroupId, JSON.stringify(corrections)]
  );
  if (fixed.rowCount !== corrections.length)
    throw new Error("Missing Vietnamese bootstrap configuration accounts");
}

/** Valued physical opening stock and a synthetic gross-payroll/cost close for exactly 3,000 workers. */
export async function postFmcgPlantAccounting(
  client: PoolClient,
  options: { companyId: string; companyGroupId: string; userId: string }
): Promise<{
  workers: number;
  grossPayrollVnd: number;
  openingStockVnd: number;
  journalIds: string[];
}> {
  const { companyId, companyGroupId, userId } = options;
  const scope = await client.query(
    `SELECT id FROM company WHERE id = $1 AND "companyGroupId" = $2`,
    [companyId, companyGroupId]
  );
  if (scope.rowCount !== 1)
    throw new Error("FMCG plant posting company/group mismatch");
  const period = await client.query<{ id: string; today: string }>(
    `SELECT id, company_today($1)::text AS today FROM "accountingPeriod"
     WHERE "companyId" = $1 AND "startDate" <= company_today($1) AND "endDate" >= company_today($1)
       AND "closeStatus" = 'Open'`,
    [companyId]
  );
  if (period.rowCount !== 1)
    throw new Error("FMCG posting requires today's open accounting period");
  const accountingPeriod = period.rows[0]!;
  const accounts = await client.query<{
    id: string;
    number: string;
    class: string;
  }>(
    `SELECT id, number, class FROM account WHERE "companyGroupId" = $1 AND active AND NOT "isGroup"`,
    [companyGroupId]
  );
  const accountByNumber = new Map(
    accounts.rows.map((account) => [account.number, account])
  );
  type Line = {
    account: string;
    debit: number;
    credit: number;
    description: string;
  };
  const post = async (description: string, lines: Line[]): Promise<string> => {
    if (
      lines.some(
        (line) =>
          line.debit < 0 ||
          line.credit < 0 ||
          !Number.isFinite(line.debit) ||
          !Number.isFinite(line.credit)
      )
    ) {
      throw new Error(
        "FMCG debit and credit amounts must be finite and nonnegative"
      );
    }
    const debitTotal = lines.reduce((sum, line) => sum + line.debit, 0);
    const creditTotal = lines.reduce((sum, line) => sum + line.credit, 0);
    if (!Number.isFinite(debitTotal) || debitTotal !== creditTotal)
      throw new Error("Unbalanced FMCG posting request");
    const journal = await client.query<{ id: string }>(
      `INSERT INTO journal ("journalEntryId", description, "postingDate", "accountingPeriodId", "sourceType", status,
        "companyId", "createdBy", "postedBy", "postedAt")
       VALUES (get_next_sequence('journalEntry', $1), $2, $3, $4, 'Manual', 'Posted', $1, $5, $5, now()) RETURNING id`,
      [
        companyId,
        description,
        accountingPeriod.today,
        accountingPeriod.id,
        userId
      ]
    );
    const journalId = journal.rows[0]!.id;
    const payload = lines.map((line, index) => {
      const account = accountByNumber.get(line.account);
      if (!account)
        throw new Error(`Missing FMCG posting leaf ${line.account}`);
      const debitSign = line.debit - line.credit;
      return {
        accountId: account.id,
        amount: ["Asset", "Expense"].includes(account.class)
          ? debitSign
          : -debitSign,
        description: line.description,
        reference: `${journalId}-${index + 1}`
      };
    });
    await client.query(
      `INSERT INTO "journalLine" ("journalId", "accountId", amount, description, quantity, "journalLineReference", "companyId", "createdBy")
       SELECT $1, p."accountId", p.amount, p.description, 1, p.reference, $2, $3
       FROM jsonb_to_recordset($4::jsonb) AS p("accountId" text, amount numeric, description text, reference text)`,
      [journalId, companyId, userId, JSON.stringify(payload)]
    );
    return journalId;
  };
  const workers = await client.query<{ locationId: string; count: string }>(
    `SELECT ej."locationId", count(*) FROM "employeeJob" ej JOIN "user" u ON u.id = ej.id
     JOIN employee e ON e.id = ej.id AND e."companyId" = ej."companyId"
     WHERE ej."companyId" = $1 AND u.email LIKE '%@workers.fmcg.invalid'
       AND ej.tags @> ARRAY['FMCG-SYNTHETIC-WORKER']::text[] GROUP BY ej."locationId"`,
    [companyId]
  );
  const workerCount = workers.rows.reduce(
    (sum, row) => sum + Number(row.count),
    0
  );
  if (
    workers.rowCount !== 3 ||
    workers.rows.some((row) => Number(row.count) !== 1000) ||
    workerCount !== 3000
  ) {
    throw new Error(
      "Payroll requires exactly three plants with 1,000 synthetic workers each"
    );
  }
  // Pure fictional gross amount, NOT a statutory minimum/rate or net payroll calculation.
  const syntheticGrossPerWorkerVnd = 10000000;
  const grossPayrollVnd = workerCount * syntheticGrossPerWorkerVnd;
  const journalIds = [
    await post(
      "FMCG mô phỏng: lương gộp 3.000 công nhân, 10.000.000 VND/người",
      [
        {
          account: "622",
          debit: grossPayrollVnd,
          credit: 0,
          description: "Chi phí nhân công trực tiếp - 3.000 người"
        },
        {
          account: "3341",
          debit: 0,
          credit: grossPayrollVnd,
          description: "Phải trả lương gộp - chưa tính khấu trừ"
        }
      ]
    )
  ];
  journalIds.push(
    await post(
      "FMCG mô phỏng: kết chuyển nhân công trực tiếp vào sản phẩm dở dang",
      [
        {
          account: "154",
          debit: grossPayrollVnd,
          credit: 0,
          description: "Kết chuyển chi phí nhân công trực tiếp"
        },
        {
          account: "622",
          debit: 0,
          credit: grossPayrollVnd,
          description: "Kết chuyển chi phí nhân công trực tiếp"
        }
      ]
    )
  );
  const productionCosts = await client.query<{
    number: string;
    balance: string;
  }>(
    `SELECT a.number, sum(l.amount)::text AS balance FROM "journalLine" l
     JOIN journal j ON j.id = l."journalId" AND j."companyId" = l."companyId"
     JOIN account a ON a.id = l."accountId" AND a."companyGroupId" = $2
     WHERE j."companyId" = $1 AND j.status <> 'Draft'
       AND j."postingDate" >= make_date(extract(year FROM company_today($1))::int, 1, 1)
       AND j."postingDate" <= company_today($1)
       AND a.class = 'Expense' AND (a.number IN ('621', '622') OR a.number LIKE '627%')
     GROUP BY a.number HAVING sum(l.amount) <> 0`,
    [companyId, companyGroupId]
  );
  const closeLines: Line[] = [];
  for (const cost of productionCosts.rows) {
    const amount = Number(cost.balance);
    const positive = amount > 0;
    closeLines.push(
      {
        account: "154",
        debit: positive ? amount : 0,
        credit: positive ? 0 : -amount,
        description: `Kết chuyển ${cost.number} theo số phát sinh thực tế`
      },
      {
        account: cost.number,
        debit: positive ? 0 : -amount,
        credit: positive ? amount : 0,
        description: "Kết chuyển chi phí sản xuất trong kỳ"
      }
    );
  }
  if (closeLines.length) {
    journalIds.push(
      await post(
        "FMCG mô phỏng: kết chuyển 621/627 vào 154 theo phát sinh trong kỳ",
        closeLines
      )
    );
  }
  const stock = await client.query<{
    item_id: string;
    quantity: string;
    entity_id: string;
    unitCost: string;
  }>(
    `SELECT s.item_id, s.quantity, s.entity_id, coalesce(c."unitCost", c."standardCost")::text AS "unitCost"
     FROM fmcg_scale_stock s JOIN "itemCost" c ON c."itemId" = s.item_id AND c."companyId" = $1`,
    [companyId]
  );
  const inventoryLines: Line[] = [];
  let openingStockVnd = 0;
  for (const row of stock.rows) {
    const quantity = Number(row.quantity);
    const cost = Math.round(quantity * Number(row.unitCost));
    if (!Number.isFinite(cost) || cost <= 0)
      throw new Error(`Missing positive stock cost ${row.item_id}`);
    openingStockVnd += cost;
  }
  if (openingStockVnd > 0) {
    await client.query(
      `INSERT INTO "costLedger" ("itemId", quantity, "remainingQuantity", "nominalCost", cost, "costLedgerType", "itemLedgerType", "documentType", "documentId", "postingDate", "companyId")
       SELECT s.item_id, s.quantity, s.quantity, round(s.quantity * coalesce(c."unitCost", c."standardCost")),
        round(s.quantity * coalesce(c."unitCost", c."standardCost")), 'Direct Cost', 'Positive Adjmt.', 'Inventory Receipt', s.entity_id, $2, $1
       FROM fmcg_scale_stock s JOIN "itemCost" c ON c."itemId" = s.item_id AND c."companyId" = $1`,
      [companyId, accountingPeriod.today]
    );
    inventoryLines.push(
      {
        account: "152",
        debit: openingStockVnd,
        credit: 0,
        description: "Nguyên vật liệu tồn đầu tại các nhà máy bổ sung"
      },
      {
        account: "421",
        debit: 0,
        credit: openingStockVnd,
        description: "Nguồn số dư đầu mô phỏng"
      }
    );
    journalIds.push(
      await post(
        "FMCG mô phỏng: giá trị tồn kho đầu của nhà máy bổ sung",
        inventoryLines
      )
    );
  }
  return { workers: workerCount, grossPayrollVnd, openingStockVnd, journalIds };
}

/** Explicit fictional maturity and partner identities for gross statutory presentation.
 * Allocations are account profile metadata keyed by line ID; posted journal lines remain immutable.
 * Metadata does not suggest the fiction is a reviewed real customer balance.
 */
export async function classifyFmcgAccounting(
  client: PoolClient,
  options: { companyId: string; companyGroupId: string; userId: string }
): Promise<{
  classifiedAccounts: number;
  classifiedControlLines: number;
  unresolvedControlLines: number;
  classifiedCashFlowLines: number;
}> {
  const { companyId, companyGroupId } = options;
  const scope = await client.query(
    `SELECT id FROM company WHERE id = $1 AND "companyGroupId" = $2`,
    [companyId, companyGroupId]
  );
  if (scope.rowCount !== 1)
    throw new Error("FMCG classification company/group mismatch");
  const classifiedAccounts = await client.query(
    `UPDATE account SET "customFields" = coalesce("customFields", '{}'::jsonb) || jsonb_build_object('tt99',
      jsonb_build_object('synthetic', true, 'maturity', CASE
        WHEN number LIKE '211%' OR number LIKE '213%' OR number LIKE '214%' OR number LIKE '221%'
          OR number IN ('243','347','3411.DAIHAN','3388.HUUTRI') THEN 'noncurrent' ELSE 'current' END))
     WHERE "companyGroupId" = $1 AND NOT "isGroup"`,
    [companyGroupId]
  );
  const classifiedControlLines = await client.query<{ lineCount: number }>(
    `WITH scoped AS (
       SELECT l.id, a.id AS "accountId", a.number, coalesce(si."customerId", p."customerId") AS customer,
         coalesce(pi."supplierId", r."supplierId", p."supplierId") AS supplier
       FROM "journalLine" l JOIN journal j ON j.id = l."journalId" AND j."companyId" = $1
       JOIN account a ON a.id = l."accountId" AND a."companyGroupId" = $2
       LEFT JOIN "salesInvoice" si ON si.id = l."documentId" AND si."companyId" = $1
       LEFT JOIN "purchaseInvoice" pi ON pi.id = l."documentId" AND pi."companyId" = $1
       LEFT JOIN receipt r ON r.id = l."documentId" AND r."companyId" = $1
       LEFT JOIN payment p ON p."journalId" = j.id AND p."companyId" = $1
       WHERE l."companyId" = $1 AND (a.number LIKE '131%' OR a.number LIKE '331%')
     ), defaults AS (
       SELECT (SELECT id FROM customer WHERE "companyId" = $1 ORDER BY id LIMIT 1) AS customer,
         (SELECT id FROM supplier WHERE "companyId" = $1 ORDER BY id LIMIT 1) AS supplier
     ), allocations AS (
       SELECT s."accountId", count(*)::int AS "lineCount", jsonb_object_agg(s.id,
        jsonb_build_object('counterpartyId', CASE WHEN s.number LIKE '131%' THEN coalesce(s.customer, d.customer) ELSE coalesce(s.supplier, d.supplier) END,
        'counterpartyType', CASE WHEN s.number LIKE '131%' THEN 'customer' ELSE 'supplier' END,
        'maturity', 'current', 'synthetic', true,
        'source', CASE WHEN s.customer IS NULL AND s.supplier IS NULL THEN 'Explicit fictional opening/control allocation' ELSE 'Company-scoped source document' END)) AS data
       FROM scoped s CROSS JOIN defaults d GROUP BY s."accountId"
     )
     UPDATE account a SET "customFields" = jsonb_set(a."customFields", '{tt99,controlAllocations}', x.data)
     FROM allocations x WHERE a.id = x."accountId" AND a."companyGroupId" = $2 RETURNING x."lineCount"`,
    [companyId, companyGroupId]
  );
  const unresolved = await client.query<{ count: string }>(
    `SELECT count(*) FROM "journalLine" l JOIN account a ON a.id = l."accountId"
     WHERE l."companyId" = $1 AND a."companyGroupId" = $2 AND (a.number LIKE '131%' OR a.number LIKE '331%')
       AND coalesce(l."customFields"->'tt99'->>'counterpartyId',
         a."customFields"->'tt99'->'controlAllocations'->l.id->>'counterpartyId') IS NULL`,
    [companyId, companyGroupId]
  );
  const cashFlow = await client.query<{ lineCount: number }>(
    `WITH supported_payments AS (
      SELECT p.id, p."journalId", CASE WHEN p."customerId" IS NOT NULL THEN '01' ELSE '02' END AS code
      FROM payment p WHERE p."companyId" = $1 AND p.status = 'Posted'
        AND (p."customerId" IS NOT NULL OR (p."supplierId" IS NOT NULL
          AND EXISTS (SELECT 1 FROM "invoiceSettlement" s WHERE s."companyId" = $1 AND s."paymentId" = p.id AND s."targetPurchaseInvoiceId" IS NOT NULL)
          AND NOT EXISTS (
            SELECT 1 FROM "invoiceSettlement" s JOIN "purchaseInvoiceLine" il ON il."invoiceId" = s."targetPurchaseInvoiceId" AND il."companyId" = $1
            WHERE s."companyId" = $1 AND s."paymentId" = p.id
              AND il."invoiceLineType" NOT IN ('Part','Material','Service','Consumable','Fixture','Tool','Comment')
          )))
     ), allocations AS (
       SELECT a.id AS "accountId", count(*)::int AS "lineCount", jsonb_object_agg(l.id,
        jsonb_build_object('cashFlowCode', p.code, 'synthetic', true,
          'source', CASE WHEN p.code = '01' THEN 'Customer payment source'
            ELSE 'Verified goods/service supplier invoice settlement; fictional operating purchase advance for any unapplied portion' END)) AS data
       FROM supported_payments p JOIN "journalLine" l ON l."journalId" = p."journalId" AND l."companyId" = $1
       JOIN account a ON a.id = l."accountId" AND a."companyGroupId" = $2
       WHERE a.number LIKE '111%' OR a.number LIKE '112%' GROUP BY a.id
     ) UPDATE account a SET "customFields" = jsonb_set(a."customFields", '{tt99,cashFlowAllocations}', x.data)
      FROM allocations x WHERE a.id = x."accountId" AND a."companyGroupId" = $2 RETURNING x."lineCount"`,
    [companyId, companyGroupId]
  );
  return {
    classifiedAccounts: classifiedAccounts.rowCount ?? 0,
    classifiedControlLines: classifiedControlLines.rows.reduce(
      (sum, row) => sum + row.lineCount,
      0
    ),
    unresolvedControlLines: Number(unresolved.rows[0]?.count ?? 0),
    classifiedCashFlowLines: cashFlow.rows.reduce(
      (sum, row) => sum + row.lineCount,
      0
    )
  };
}
