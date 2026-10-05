// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { EPSILON, round } from "@carbon/database/precision";
import { parseDate } from "@internationalized/date";

/** Appendix IV, Circular 99/2025/TT-BTC, official Gazette parts 1577–1582.
 * Form codes and equations are TT99, including biological assets, B01 280/420,
 * and B02 21–26. Classification requires accounting judgement and disclosures;
 * this calculator never replaces those facts with an inferred compliance claim.
 */
export type VietnameseJournalLine = {
  journalId: string;
  postingDate: string;
  accountNumber: string;
  accountName?: string;
  accountClass?: string;
  /** Positive debit, negative credit, already in company base currency. */
  amount: number;
  description?: string;
  sourceType?: string;
  cashFlowCode?: string;
  partyId?: string;
};

export type VietnameseOpeningBalance = {
  accountNumber: string;
  amount: number;
};
export type VietnameseControlBalance = VietnameseOpeningBalance & {
  partyId: string;
  maturity: "current" | "noncurrent";
};
export type VietnameseReportInput = {
  company: { id: string; name: string; currencyCode: string };
  period: {
    startDate: string;
    endDate: string;
    priorStartDate: string;
    priorEndDate: string;
  };
  openingBalances: VietnameseOpeningBalance[];
  priorOpeningBalances?: VietnameseOpeningBalance[];
  journalLines: VietnameseJournalLine[];
  priorJournalLines?: VietnameseJournalLine[];
  controlBalances?: VietnameseControlBalance[];
  openingControlBalances?: VietnameseControlBalance[];
  priorControlBalances?: VietnameseControlBalance[];
  accountClassifications?: Record<
    string,
    { balanceSheetCode?: string; incomeStatementCode?: string }
  >;
  notes?: Record<string, string>;
};
export type VietnameseReportLine = {
  code: string;
  label: string;
  current: number | null;
  previous: number | null;
  note?: string;
};
export type VietnameseReportForm = {
  code: "B01-DN" | "B02-DN" | "B03-DN" | "B09-DN";
  title: string;
  columns: string[];
  lines: VietnameseReportLine[];
};
export type VietnameseReportResult = {
  forms: VietnameseReportForm[];
  checks: { id: string; label: string; passed: boolean; detail: string }[];
  warnings: string[];
  blocked: boolean;
};

type Values = Map<string, number>;
type Definition = readonly [string, string];

const B01: Definition[] = [
  ["100", "Tài sản ngắn hạn"],
  ["110", "Tiền và các khoản tương đương tiền"],
  ["111", "Tiền"],
  ["112", "Các khoản tương đương tiền"],
  ["120", "Đầu tư tài chính ngắn hạn"],
  ["121", "Chứng khoán kinh doanh"],
  ["122", "Dự phòng giảm giá chứng khoán kinh doanh"],
  ["123", "Đầu tư nắm giữ đến ngày đáo hạn ngắn hạn"],
  ["124", "Dự phòng đầu tư nắm giữ đến ngày đáo hạn ngắn hạn"],
  ["125", "Đầu tư ngắn hạn khác"],
  ["126", "Dự phòng tổn thất các khoản đầu tư ngắn hạn khác"],
  ["130", "Các khoản phải thu ngắn hạn"],
  ["131", "Phải thu ngắn hạn của khách hàng"],
  ["132", "Trả trước cho người bán ngắn hạn"],
  ["133", "Phải thu nội bộ ngắn hạn"],
  ["134", "Phải thu theo tiến độ hợp đồng xây dựng"],
  ["135", "Phải thu ngắn hạn khác"],
  ["136", "Dự phòng phải thu ngắn hạn khó đòi"],
  ["137", "Tài sản thiếu chờ xử lý"],
  ["140", "Hàng tồn kho"],
  ["141", "Hàng tồn kho"],
  ["142", "Dự phòng giảm giá hàng tồn kho"],
  ["150", "Tài sản sinh học ngắn hạn"],
  ["151", "Súc vật nuôi lấy sản phẩm một lần ngắn hạn"],
  ["152", "Cây trồng theo mùa vụ hoặc lấy sản phẩm một lần ngắn hạn"],
  ["153", "Dự phòng tổn thất tài sản sinh học ngắn hạn"],
  ["160", "Tài sản ngắn hạn khác"],
  ["161", "Chi phí chờ phân bổ ngắn hạn"],
  ["162", "Thuế GTGT được khấu trừ"],
  ["163", "Thuế và các khoản khác phải thu Nhà nước"],
  ["164", "Giao dịch mua bán lại trái phiếu Chính phủ"],
  ["165", "Tài sản ngắn hạn khác"],
  ["200", "Tài sản dài hạn"],
  ["210", "Các khoản phải thu dài hạn"],
  ["211", "Phải thu dài hạn của khách hàng"],
  ["212", "Trả trước cho người bán dài hạn"],
  ["213", "Vốn kinh doanh ở đơn vị trực thuộc"],
  ["214", "Phải thu nội bộ dài hạn"],
  ["215", "Phải thu dài hạn khác"],
  ["216", "Dự phòng phải thu dài hạn khó đòi"],
  ["220", "Tài sản cố định"],
  ["221", "Tài sản cố định hữu hình"],
  ["222", "Nguyên giá TSCĐ hữu hình"],
  ["223", "Hao mòn lũy kế TSCĐ hữu hình"],
  ["224", "Tài sản cố định thuê tài chính"],
  ["225", "Nguyên giá TSCĐ thuê tài chính"],
  ["226", "Hao mòn lũy kế TSCĐ thuê tài chính"],
  ["227", "Tài sản cố định vô hình"],
  ["228", "Nguyên giá TSCĐ vô hình"],
  ["229", "Hao mòn lũy kế TSCĐ vô hình"],
  ["230", "Tài sản sinh học dài hạn"],
  ["231", "Súc vật nuôi cho sản phẩm định kỳ"],
  ["232", "Súc vật nuôi cho sản phẩm định kỳ chưa trưởng thành"],
  ["233", "Súc vật nuôi cho sản phẩm định kỳ trưởng thành"],
  ["234", "Nguyên giá súc vật nuôi cho sản phẩm định kỳ"],
  ["235", "Khấu hao lũy kế súc vật nuôi cho sản phẩm định kỳ"],
  ["236", "Súc vật nuôi lấy sản phẩm một lần dài hạn"],
  ["237", "Cây trồng theo mùa vụ hoặc lấy sản phẩm một lần dài hạn"],
  ["238", "Dự phòng tổn thất tài sản sinh học dài hạn"],
  ["240", "Bất động sản đầu tư"],
  ["241", "Nguyên giá bất động sản đầu tư"],
  ["242", "Hao mòn lũy kế bất động sản đầu tư"],
  ["250", "Tài sản dở dang dài hạn"],
  ["251", "Chi phí sản xuất, kinh doanh dở dang dài hạn"],
  ["252", "Chi phí xây dựng cơ bản dở dang"],
  ["260", "Đầu tư tài chính dài hạn"],
  ["261", "Đầu tư vào công ty con"],
  ["262", "Đầu tư vào công ty liên doanh, liên kết"],
  ["263", "Đầu tư góp vốn vào đơn vị khác"],
  ["264", "Dự phòng tổn thất đầu tư vào đơn vị khác dài hạn"],
  ["265", "Đầu tư nắm giữ đến ngày đáo hạn dài hạn"],
  ["266", "Dự phòng đầu tư nắm giữ đến ngày đáo hạn dài hạn"],
  ["270", "Tài sản dài hạn khác"],
  ["271", "Chi phí chờ phân bổ dài hạn"],
  ["272", "Tài sản thuế thu nhập hoãn lại"],
  ["273", "Thiết bị, vật tư, phụ tùng thay thế dài hạn"],
  ["274", "Tài sản dài hạn khác"],
  ["280", "Tổng cộng tài sản"],
  ["300", "Nợ phải trả"],
  ["310", "Nợ ngắn hạn"],
  ["311", "Phải trả người bán ngắn hạn"],
  ["312", "Người mua trả tiền trước ngắn hạn"],
  ["313", "Phải trả cổ tức, lợi nhuận"],
  ["314", "Thuế và các khoản phải nộp Nhà nước ngắn hạn"],
  ["315", "Phải trả người lao động"],
  ["316", "Chi phí phải trả ngắn hạn"],
  ["317", "Phải trả nội bộ ngắn hạn"],
  ["318", "Phải trả theo tiến độ hợp đồng xây dựng ngắn hạn"],
  ["319", "Doanh thu chờ phân bổ ngắn hạn"],
  ["320", "Phải trả ngắn hạn khác"],
  ["321", "Vay và nợ thuê tài chính ngắn hạn"],
  ["322", "Dự phòng phải trả ngắn hạn"],
  ["323", "Quỹ khen thưởng, phúc lợi"],
  ["324", "Quỹ bình ổn giá"],
  ["325", "Giao dịch mua bán lại trái phiếu Chính phủ"],
  ["330", "Nợ dài hạn"],
  ["331", "Phải trả người bán dài hạn"],
  ["332", "Người mua trả tiền trước dài hạn"],
  ["333", "Thuế và các khoản phải nộp Nhà nước dài hạn"],
  ["334", "Chi phí phải trả dài hạn"],
  ["335", "Phải trả nội bộ về vốn kinh doanh"],
  ["336", "Phải trả nội bộ dài hạn"],
  ["337", "Doanh thu chờ phân bổ dài hạn"],
  ["338", "Phải trả dài hạn khác"],
  ["339", "Vay và nợ thuê tài chính dài hạn"],
  ["340", "Trái phiếu chuyển đổi"],
  ["341", "Cổ phiếu ưu đãi"],
  ["342", "Thuế thu nhập hoãn lại phải trả"],
  ["343", "Dự phòng phải trả dài hạn"],
  ["344", "Quỹ phát triển khoa học và công nghệ"],
  ["400", "Vốn chủ sở hữu"],
  ["411", "Vốn góp của chủ sở hữu"],
  ["411a", "Cổ phiếu phổ thông có quyền biểu quyết"],
  ["411b", "Cổ phiếu ưu đãi"],
  ["412", "Thặng dư vốn"],
  ["413", "Quyền chọn chuyển đổi trái phiếu"],
  ["414", "Vốn khác của chủ sở hữu"],
  ["415", "Cổ phiếu mua lại của chính mình"],
  ["416", "Chênh lệch đánh giá lại tài sản"],
  ["417", "Chênh lệch tỷ giá hối đoái"],
  ["418", "Quỹ đầu tư phát triển"],
  ["419", "Quỹ khác thuộc vốn chủ sở hữu"],
  ["420", "Lợi nhuận sau thuế chưa phân phối"],
  ["420a", "LNST chưa phân phối lũy kế đến cuối kỳ trước"],
  ["420b", "LNST chưa phân phối kỳ này"],
  ["440", "Tổng cộng nguồn vốn"]
];

const B02: Definition[] = [
  ["01", "Doanh thu bán hàng và cung cấp dịch vụ"],
  ["02", "Các khoản giảm trừ doanh thu"],
  ["10", "Doanh thu thuần về bán hàng và cung cấp dịch vụ"],
  ["11", "Giá vốn hàng bán"],
  ["20", "Lợi nhuận gộp về bán hàng và cung cấp dịch vụ"],
  ["21", "Lãi/lỗ của hoạt động bán, thanh lý bất động sản đầu tư"],
  ["22", "Doanh thu hoạt động tài chính"],
  ["23", "Chi phí tài chính"],
  ["24", "Trong đó: Chi phí đi vay"],
  ["25", "Chi phí bán hàng"],
  ["26", "Chi phí quản lý doanh nghiệp"],
  ["30", "Lợi nhuận thuần từ hoạt động kinh doanh"],
  ["31", "Thu nhập khác"],
  ["32", "Chi phí khác"],
  ["40", "Lợi nhuận khác"],
  ["50", "Tổng lợi nhuận kế toán trước thuế"],
  ["51", "Chi phí thuế TNDN hiện hành"],
  ["52", "Chi phí thuế TNDN hoãn lại"],
  ["60", "Lợi nhuận sau thuế thu nhập doanh nghiệp"],
  ["70", "Lãi cơ bản trên cổ phiếu"],
  ["71", "Lãi suy giảm trên cổ phiếu"]
];
const B03: Definition[] = [
  ["01", "Tiền thu từ bán hàng, cung cấp dịch vụ và doanh thu khác"],
  ["02", "Tiền chi trả cho người cung cấp hàng hóa và dịch vụ"],
  ["03", "Tiền chi trả cho người lao động"],
  ["04", "Chi phí đi vay đã trả"],
  ["05", "Thuế thu nhập doanh nghiệp đã nộp"],
  ["06", "Tiền thu khác từ hoạt động kinh doanh"],
  ["07", "Tiền chi khác cho hoạt động kinh doanh"],
  ["20", "Lưu chuyển tiền thuần từ hoạt động kinh doanh"],
  ["21", "Tiền chi để mua sắm, xây dựng TSCĐ và các tài sản dài hạn khác"],
  ["22", "Tiền thu từ thanh lý, nhượng bán TSCĐ và các tài sản dài hạn khác"],
  ["23", "Tiền chi cho vay, mua các công cụ nợ của đơn vị khác"],
  ["24", "Tiền thu hồi cho vay, bán lại các công cụ nợ của đơn vị khác"],
  ["25", "Tiền chi đầu tư góp vốn vào đơn vị khác"],
  ["26", "Tiền thu hồi đầu tư góp vốn vào đơn vị khác"],
  ["27", "Tiền thu lãi cho vay, cổ tức và lợi nhuận được chia"],
  ["30", "Lưu chuyển tiền thuần từ hoạt động đầu tư"],
  ["31", "Tiền thu từ phát hành cổ phiếu, nhận vốn góp của chủ sở hữu"],
  ["32", "Tiền trả lại vốn góp, mua lại cổ phiếu đã phát hành"],
  ["33", "Tiền thu từ đi vay"],
  ["34", "Tiền trả nợ gốc vay"],
  ["35", "Tiền trả nợ gốc thuê tài chính"],
  ["36", "Cổ tức, lợi nhuận đã trả cho chủ sở hữu"],
  ["40", "Lưu chuyển tiền thuần từ hoạt động tài chính"],
  ["50", "Lưu chuyển tiền thuần trong kỳ"],
  ["60", "Tiền và tương đương tiền đầu kỳ"],
  ["61", "Ảnh hưởng của thay đổi tỷ giá hối đoái quy đổi ngoại tệ"],
  ["70", "Tiền và tương đương tiền cuối kỳ"]
];

/** Complete policy-section headings; numerical item disclosures additionally
 * remain required in V/VI/VII and cannot be replaced by a generated GL total. */
export const VIETNAMESE_NOTE_DEFINITIONS: Definition[] = [
  ["I.1", "Hình thức sở hữu vốn"],
  ["I.2", "Lĩnh vực kinh doanh"],
  ["I.3", "Ngành nghề kinh doanh"],
  ["I.4", "Chu kỳ sản xuất, kinh doanh thông thường"],
  ["I.5", "Đặc điểm hoạt động ảnh hưởng đến BCTC"],
  ["I.6", "Cấu trúc doanh nghiệp"],
  ["I.7", "Số lượng người lao động"],
  ["I.8", "Khả năng so sánh thông tin"],
  ["I.9", "Thông tin khác theo pháp luật có liên quan"],
  ["II.1", "Kỳ kế toán năm"],
  ["II.2", "Đơn vị tiền tệ kế toán"],
  ["III.1", "Chế độ kế toán áp dụng"],
  ["III.2", "Tuyên bố tuân thủ chuẩn mực và chế độ kế toán"],
  ...[
    "Chuyển đổi BCTC lập bằng ngoại tệ",
    "Tỷ giá hối đoái áp dụng",
    "Lãi suất thực tế dùng chiết khấu dòng tiền",
    "Tiền và tương đương tiền",
    "Đầu tư tài chính",
    "Nợ phải thu",
    "Hàng tồn kho",
    "TSCĐ và khấu hao",
    "Tài sản sinh học",
    "Hợp đồng hợp tác kinh doanh",
    "Chi phí chờ phân bổ",
    "Phải trả người bán",
    "Phải trả cổ tức, lợi nhuận",
    "Chi phí phải trả",
    "Doanh thu chờ phân bổ",
    "Dự phòng phải trả",
    "Thuế TNDN hoãn lại",
    "Vay và nợ thuê tài chính",
    "Ghi nhận và vốn hóa chi phí đi vay",
    "Trái phiếu chuyển đổi",
    "Vốn chủ sở hữu",
    "Doanh thu và thu nhập khác",
    "Giảm trừ doanh thu",
    "Giá vốn hàng bán",
    "Chi phí tài chính",
    "Chi phí bán hàng và quản lý doanh nghiệp",
    "Bán, thanh lý TSCĐ và BĐSĐT",
    "Chi phí thuế TNDN hiện hành và hoãn lại",
    "Chính sách kế toán khác"
  ].map((label, i) => [`IV.${i + 1}`, label] as const),
  ...[
    "Tiền và các khoản tương đương tiền",
    "Các khoản đầu tư tài chính",
    "Phải thu của khách hàng",
    "Phải thu khác",
    "Tài sản thiếu chờ xử lý",
    "Nợ xấu",
    "Hàng tồn kho",
    "Tài sản dở dang dài hạn",
    "Tăng, giảm TSCĐ hữu hình",
    "Tăng, giảm TSCĐ vô hình",
    "Tăng, giảm TSCĐ thuê tài chính",
    "Tài sản sinh học",
    "Tăng, giảm bất động sản đầu tư",
    "Chi phí chờ phân bổ",
    "Tài sản khác",
    "Vay và nợ thuê tài chính",
    "Phải trả người bán",
    "Phải trả cổ tức, lợi nhuận",
    "Thuế và các khoản phải nộp Nhà nước",
    "Chi phí phải trả",
    "Phải trả khác",
    "Doanh thu chờ phân bổ",
    "Trái phiếu phát hành",
    "Cổ phiếu ưu đãi phân loại là nợ phải trả",
    "Dự phòng phải trả",
    "Tài sản thuế TNDN hoãn lại và thuế TNDN hoãn lại phải trả",
    "Vốn chủ sở hữu",
    "Chênh lệch đánh giá lại tài sản",
    "Chênh lệch tỷ giá",
    "Các khoản mục ngoài Báo cáo tình hình tài chính",
    "Tài sản của bên khác bị giới hạn sử dụng và nghĩa vụ liên quan",
    "Thông tin giải trình khác về tình hình tài chính"
  ].map((label, i) => [`V.${i + 1}`, label] as const),
  // Annual B09-DN in the official Gazette labels these sections VII–X.
  // B09-DNKLT has different numbering; do not substitute its headings here.
  ...[
    "Tổng doanh thu bán hàng và cung cấp dịch vụ",
    "Các khoản giảm trừ doanh thu",
    "Giá vốn hàng bán",
    "Lãi/lỗ của hoạt động bán, thanh lý BĐSĐT",
    "Doanh thu hoạt động tài chính",
    "Chi phí tài chính",
    "Thu nhập khác",
    "Chi phí khác",
    "Chi phí bán hàng và chi phí quản lý doanh nghiệp",
    "Chi phí sản xuất, kinh doanh theo yếu tố",
    "Chi phí thuế thu nhập doanh nghiệp"
  ].map((label, i) => [`VII.${i + 1}`, label] as const),
  ...[
    "Tiền do doanh nghiệp nắm giữ nhưng không được sử dụng",
    "Giao dịch không bằng tiền ảnh hưởng lưu chuyển tiền tệ tương lai",
    "Số tiền đi vay thực thu trong kỳ",
    "Số tiền đã thực trả gốc vay trong kỳ",
    "Mua và thanh lý công ty con trong kỳ"
  ].map((label, i) => [`VIII.${i + 1}`, label] as const),
  ...[
    "Nợ tiềm tàng và cam kết",
    "Sự kiện sau ngày kết thúc kỳ kế toán",
    "Thông tin các bên liên quan",
    "Báo cáo theo bộ phận",
    "Thông tin so sánh",
    "Đánh giá giả định hoạt động liên tục",
    "Giả định và ước tính quan trọng",
    "Các biện pháp và giải pháp khác"
  ].map((label, i) => [`IX.${i + 1}`, label] as const),
  ["X.1", "Tên các chỉ tiêu có sửa đổi, bổ sung"],
  ["X.2", "Nội dung các chỉ tiêu có sửa đổi, bổ sung"],
  ["X.3", "Lý do thay đổi biểu mẫu và chỉ tiêu"]
];

const B01_TOTALS: Record<string, string[]> = {
  "110": ["111", "112"],
  "120": ["121", "122", "123", "124", "125", "126"],
  "130": ["131", "132", "133", "134", "135", "136", "137"],
  "140": ["141", "142"],
  "150": ["151", "152", "153"],
  "160": ["161", "162", "163", "164", "165"],
  "100": ["110", "120", "130", "140", "150", "160"],
  "210": ["211", "212", "213", "214", "215", "216"],
  "221": ["222", "223"],
  "224": ["225", "226"],
  "227": ["228", "229"],
  "220": ["221", "224", "227"],
  "233": ["234", "235"],
  "231": ["232", "233"],
  "230": ["231", "236", "237", "238"],
  "240": ["241", "242"],
  "250": ["251", "252"],
  "260": ["261", "262", "263", "264", "265", "266"],
  "270": ["271", "272", "273", "274"],
  "200": ["210", "220", "230", "240", "250", "260", "270"],
  "280": ["100", "200"],
  "310": Array.from({ length: 15 }, (_, i) => String(311 + i)),
  "330": Array.from({ length: 14 }, (_, i) => String(331 + i)),
  "300": ["310", "330"],
  "420": ["420a", "420b"],
  "400": Array.from({ length: 10 }, (_, i) => String(411 + i)),
  "440": ["300", "400"]
};
const get = (values: Values, code: string) => values.get(code) ?? 0;
const add = (values: Values, code: string, amount: number) =>
  values.set(code, get(values, code) + amount);
const isCash = (number: string) => /^(111|112|113)/.test(number);
const isReportCash = (
  number: string,
  classifications: VietnameseReportInput["accountClassifications"]
) => {
  const code = classifications?.[number]?.balanceSheetCode;
  return code ? code === "111" || code === "112" : isCash(number);
};
const cashTotal = (
  balances: Values,
  classifications?: VietnameseReportInput["accountClassifications"]
) =>
  [...balances].reduce(
    (total, [number, amount]) =>
      total + (isReportCash(number, classifications) ? amount : 0),
    0
  );

function closingBalances(
  opening: VietnameseOpeningBalance[],
  lines: VietnameseJournalLine[]
): Values {
  const balances: Values = new Map();
  for (const row of [...opening, ...lines])
    add(balances, row.accountNumber, row.amount);
  return balances;
}

/** Unambiguous default account mappings. Maturity, restrictions, cash-equivalent
 * eligibility and party netting are never determined from a prefix alone. */
function defaultBalanceCode(number: string, amount: number): string | null {
  if (isCash(number)) return "111";
  const prefixes: [string, string][] = [
    ["2291", "122"],
    ["2293", "136"],
    ["2294", "142"],
    ["1381", "137"],
    ["1383", "163"],
    ["2141", "223"],
    ["2142", "226"],
    ["2143", "229"],
    ["2147", "242"],
    ["211", "222"],
    ["212", "225"],
    ["213", "228"],
    ["217", "241"],
    ["221", "261"],
    ["222", "262"],
    ["243", "272"],
    ["3387", "319"],
    ["338", "320"],
    ["334", "315"],
    ["335", "316"],
    ["353", "323"],
    ["357", "324"],
    ["347", "342"],
    ["356", "344"],
    ["4111", "411"],
    ["4112", "412"],
    ["4113", "413"],
    ["4118", "414"],
    ["419", "415"],
    ["412", "416"],
    ["413", "417"],
    ["414", "418"],
    ["418", "419"],
    ["4211", "420a"],
    ["4212", "420b"],
    ["421", "420a"],
    ["121", "121"],
    ["133", "162"]
  ];
  if (/^15[1-8]/.test(number)) return "141";
  if (number.startsWith("333")) return amount >= 0 ? "163" : "314";
  if (/^(334|338)/.test(number) && amount > 0) return "135";
  if (/^(1388|141|244)/.test(number)) return "135";
  for (const [prefix, code] of prefixes)
    if (number.startsWith(prefix)) return code;
  return null;
}

function balanceSheet(
  opening: VietnameseOpeningBalance[],
  lines: VietnameseJournalLine[],
  controls: VietnameseControlBalance[] | undefined,
  classifications: VietnameseReportInput["accountClassifications"],
  warnings: Set<string>,
  label: string
): Values {
  const balances = closingBalances(opening, lines);
  const values: Values = new Map();
  let unclosedIncome = 0;
  if (
    controls === undefined &&
    [...balances.keys()].some((number) => /^(131|331)/.test(number))
  ) {
    warnings.add(
      `${label}: Thiếu chi tiết công nợ từng đối tác; số dư sổ cái bằng không cũng không chứng minh không có công nợ đối ứng.`
    );
  }
  for (const [number, amount] of balances) {
    if (Math.abs(amount) <= EPSILON) continue;
    if (/^(5|6|7|8|9)/.test(number)) {
      if (/^(621|622|623|627|631|911)/.test(number))
        warnings.add(
          `${label}: TK ${number} chưa kết chuyển; phải đối chiếu giá thành và kết quả kinh doanh.`
        );
      unclosedIncome -= amount;
      continue;
    }
    if (/^(131|331)/.test(number) && controls !== undefined) continue;
    if (/^(131|331)/.test(number)) {
      warnings.add(
        `${label}: TK ${number} thiếu số dư chi tiết từng đối tác và kỳ hạn; không được bù trừ công nợ.`
      );
      add(
        values,
        number.startsWith("131")
          ? amount >= 0
            ? "131"
            : "312"
          : amount >= 0
            ? "132"
            : "311",
        Math.abs(amount)
      );
      continue;
    }
    const explicit = classifications?.[number]?.balanceSheetCode;
    const code = explicit ?? defaultBalanceCode(number, amount);
    if (
      !code ||
      !B01.some(([id]) => id === code) ||
      Object.hasOwn(B01_TOTALS, code)
    ) {
      warnings.add(
        `${label}: TK ${number} chưa có phân loại B01-DN hợp lệ (kỳ hạn, hạn chế sử dụng hoặc mục đích tài sản).`
      );
      continue;
    }
    if (!explicit && /^(1388|244|335|3387)/.test(number))
      warnings.add(
        `${label}: TK ${number} cần xác nhận kỳ hạn trước khi chốt phân loại.`
      );
    add(values, code, Number(code.slice(0, 3)) >= 300 ? -amount : amount);
  }
  if (controls) {
    const byAccount: Values = new Map();
    for (const control of controls) {
      if (!/^(131|331)/.test(control.accountNumber) || !control.partyId) {
        warnings.add(
          `${label}: Chi tiết công nợ thiếu đối tác hoặc dùng tài khoản ngoài 131/331.`
        );
        continue;
      }
      add(byAccount, control.accountNumber, control.amount);
      if (
        Math.abs(control.amount) > EPSILON &&
        control.maturity !== "current" &&
        control.maturity !== "noncurrent"
      ) {
        warnings.add(
          `${label}: Chi tiết công nợ TK ${control.accountNumber} của đối tác ${control.partyId} chưa xác nhận kỳ hạn ngắn hạn hoặc dài hạn.`
        );
        continue;
      }
      const long = control.maturity === "noncurrent";
      const code = control.accountNumber.startsWith("131")
        ? control.amount >= 0
          ? long
            ? "211"
            : "131"
          : long
            ? "332"
            : "312"
        : control.amount >= 0
          ? long
            ? "212"
            : "132"
          : long
            ? "331"
            : "311";
      add(values, code, Math.abs(control.amount));
    }
    for (const [number, amount] of balances)
      if (
        /^(131|331)/.test(number) &&
        Math.abs(amount - get(byAccount, number)) > EPSILON
      )
        warnings.add(
          `${label}: Chi tiết công nợ TK ${number} không khớp sổ cái.`
        );
  }
  add(values, "420b", unclosedIncome);
  if (Math.abs(unclosedIncome) > EPSILON)
    warnings.add(
      `${label}: Kết quả chưa kết chuyển được trình bày tạm ở 420b; cần khóa sổ và xác nhận kỳ lợi nhuận.`
    );
  const computed = new Set<string>();
  const totalOf = (code: string): number => {
    const children = B01_TOTALS[code];
    if (!children || computed.has(code)) return get(values, code);
    const total = children.reduce((sum, child) => sum + totalOf(child), 0);
    values.set(code, total);
    computed.add(code);
    return total;
  };
  for (const code of Object.keys(B01_TOTALS)) totalOf(code);
  return values;
}

function incomeStatement(
  lines: VietnameseJournalLine[],
  classifications: VietnameseReportInput["accountClassifications"],
  warnings: Set<string>,
  label: string
): Values {
  const values: Values = new Map();
  const closing = new Set(
    lines
      .filter((line) => line.accountNumber.startsWith("911"))
      .map((line) => line.journalId)
  );
  // The 521-to-511 transfer is neither new gross revenue nor a second return.
  const reductionTransfers = new Set(
    lines
      .filter((line) => line.accountNumber.startsWith("521") && line.amount < 0)
      .map((line) => line.journalId)
      .filter((id) =>
        lines.some(
          (line) =>
            line.journalId === id &&
            line.accountNumber.startsWith("511") &&
            line.amount > 0
        )
      )
  );
  for (const line of lines) {
    const number = line.accountNumber;
    // Manufacturing cost collectors transfer to inventory, not directly to B02.
    // Their net closing balances are checked by balanceSheet; gross movements
    // remain valid activity after 621/622/623/627/631 have fully closed.
    if (/^(621|622|623|627|631)/.test(number)) continue;
    if (
      closing.has(line.journalId) ||
      reductionTransfers.has(line.journalId) ||
      !/^[5678]/.test(number)
    )
      continue;
    const code =
      classifications?.[number]?.incomeStatementCode ??
      (number.startsWith("511")
        ? "01"
        : number.startsWith("521")
          ? "02"
          : number.startsWith("632")
            ? "11"
            : number.startsWith("515")
              ? "22"
              : number.startsWith("635")
                ? "23"
                : number.startsWith("641")
                  ? "25"
                  : number.startsWith("642")
                    ? "26"
                    : number.startsWith("711")
                      ? "31"
                      : number.startsWith("811")
                        ? "32"
                        : number.startsWith("8211")
                          ? "51"
                          : number.startsWith("8212")
                            ? "52"
                            : null);
    if (!code) {
      warnings.add(
        `${label}: Phát sinh TK ${number} cần kết chuyển hoặc phân loại B02-DN.`
      );
      continue;
    }
    add(
      values,
      code,
      ["01", "21", "22", "31"].includes(code) ? -line.amount : line.amount
    );
    if (code === "24") add(values, "23", line.amount);
    if (
      number.startsWith("635") &&
      !classifications?.[number]?.incomeStatementCode
    )
      warnings.add(
        `${label}: TK ${number} cần chi tiết chi phí đi vay để lập chỉ tiêu 24.`
      );
  }
  values.set("10", get(values, "01") - get(values, "02"));
  values.set("20", get(values, "10") - get(values, "11"));
  values.set(
    "30",
    get(values, "20") +
      get(values, "21") +
      get(values, "22") -
      get(values, "23") -
      get(values, "25") -
      get(values, "26")
  );
  values.set("40", get(values, "31") - get(values, "32"));
  values.set("50", get(values, "30") + get(values, "40"));
  values.set("60", get(values, "50") - get(values, "51") - get(values, "52"));
  return values;
}

const CASH_CODES = new Set([
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "61"
]);
function inferCashCode(
  counter: VietnameseJournalLine[],
  amount: number
): string | null {
  const every = (prefix: RegExp) =>
    counter.length > 0 &&
    counter.every((line) => prefix.test(line.accountNumber));
  if (amount > 0 && every(/^131/)) return "01";
  if (amount < 0 && every(/^334/)) return "03";
  if (amount < 0 && every(/^3334/)) return "05";
  if (amount > 0 && every(/^4111/)) return "31";
  if (every(/^3411/)) return amount > 0 ? "33" : "34";
  if (amount < 0 && every(/^3412/)) return "35";
  if (amount < 0 && every(/^(211|212|213|241)/)) return "21";
  return null;
}

function cashFlow(
  opening: VietnameseOpeningBalance[],
  lines: VietnameseJournalLine[],
  classifications: VietnameseReportInput["accountClassifications"],
  warnings: Set<string>,
  label: string
): Values {
  const values: Values = new Map();
  const journals = new Map<string, VietnameseJournalLine[]>();
  for (const line of lines) {
    const group = journals.get(line.journalId) ?? [];
    group.push(line);
    journals.set(line.journalId, group);
  }
  for (const [id, group] of journals) {
    const cash = group.filter((line) =>
      isReportCash(line.accountNumber, classifications)
    );
    const movement = cash.reduce((sum, line) => sum + line.amount, 0);
    if (
      cash.some((line) => line.amount > EPSILON) &&
      cash.some((line) => line.amount < -EPSILON) &&
      group.some(
        (line) =>
          !isReportCash(line.accountNumber, classifications) &&
          Math.abs(line.amount) > EPSILON
      )
    ) {
      warnings.add(
        `${label}: Bút toán ${id} gộp thu và chi với tài khoản ngoài tiền; cần tách hoặc phân bổ từng luồng tiền, không bù trừ tự động.`
      );
      continue;
    }
    if (Math.abs(movement) <= EPSILON) continue; // cash-to-cash transfers excluded.
    const explicit = [
      ...new Set(
        group
          .map((line) => line.cashFlowCode)
          .filter((code): code is string => Boolean(code))
      )
    ];
    const code =
      explicit.length === 1
        ? explicit[0]!
        : explicit.length === 0
          ? inferCashCode(
              group.filter(
                (line) => !isReportCash(line.accountNumber, classifications)
              ),
              movement
            )
          : null;
    if (!code || !CASH_CODES.has(code)) {
      warnings.add(
        `${label}: Bút toán ${id} có lưu chuyển tiền ${round(movement)} chưa được phân loại B03-DN; không tự đưa vào hoạt động kinh doanh.`
      );
      continue;
    }
    add(values, code, movement);
  }
  for (const [total, codes] of [
    ["20", ["01", "02", "03", "04", "05", "06", "07"]],
    ["30", ["21", "22", "23", "24", "25", "26", "27"]],
    ["40", ["31", "32", "33", "34", "35", "36"]]
  ] as const)
    values.set(
      total,
      codes.reduce((sum, code) => sum + get(values, code), 0)
    );
  values.set("50", get(values, "20") + get(values, "30") + get(values, "40"));
  values.set("60", cashTotal(closingBalances(opening, []), classifications));
  values.set("70", get(values, "50") + get(values, "60") + get(values, "61"));
  const closing = cashTotal(closingBalances(opening, lines), classifications);
  if (Math.abs(closing - get(values, "70")) > EPSILON)
    warnings.add(
      `${label}: B03-DN cuối kỳ không khớp tiền trên sổ cái; chênh lệch ${round(closing - get(values, "70"))}.`
    );
  return values;
}

function reportLines(
  definitions: Definition[],
  current: Values,
  previous: Values
): VietnameseReportLine[] {
  return definitions.map(([code, label]) => ({
    code,
    label,
    current: round(get(current, code)),
    previous: round(get(previous, code))
  }));
}

export function buildVietnameseReports(
  input: VietnameseReportInput
): VietnameseReportResult {
  const warnings = new Set<string>();
  for (const date of Object.values(input.period)) parseDate(date);
  if (
    input.period.startDate > input.period.endDate ||
    input.period.priorStartDate > input.period.priorEndDate
  )
    throw new Error("Kỳ báo cáo không hợp lệ");
  if (input.company.currencyCode !== "VND")
    warnings.add(
      "Bộ biểu mẫu này yêu cầu dữ liệu quy đổi sang VND với tỷ giá và chính sách đã xác nhận."
    );
  const selected = input.journalLines.filter(
    (line) =>
      line.postingDate >= input.period.startDate &&
      line.postingDate <= input.period.endDate
  );
  const prior = (input.priorJournalLines ?? []).filter(
    (line) =>
      line.postingDate >= input.period.priorStartDate &&
      line.postingDate <= input.period.priorEndDate
  );
  for (const line of [
    ...selected,
    ...prior,
    ...input.openingBalances,
    ...(input.priorOpeningBalances ?? []),
    ...(input.controlBalances ?? []),
    ...(input.openingControlBalances ?? []),
    ...(input.priorControlBalances ?? [])
  ])
    if (!Number.isFinite(line.amount))
      throw new Error("Số tiền sổ cái phải hữu hạn");
  for (const line of [...selected, ...prior]) parseDate(line.postingDate);
  if (!input.priorOpeningBalances || !input.priorJournalLines)
    warnings.add("Thiếu số liệu kỳ so sánh; cột kỳ trước chưa được xác nhận.");
  const currentB01 = balanceSheet(
    input.openingBalances,
    selected,
    input.controlBalances,
    input.accountClassifications,
    warnings,
    "Kỳ này"
  );
  const previousB01 = balanceSheet(
    input.openingBalances,
    [],
    input.openingControlBalances,
    input.accountClassifications,
    warnings,
    "Đầu kỳ"
  );
  const currentB02 = incomeStatement(
    selected,
    input.accountClassifications,
    warnings,
    "Kỳ này"
  );
  const previousB02 = incomeStatement(
    prior,
    input.accountClassifications,
    warnings,
    "Kỳ trước"
  );
  const currentB03 = cashFlow(
    input.openingBalances,
    selected,
    input.accountClassifications,
    warnings,
    "Kỳ này"
  );
  const previousB03 = cashFlow(
    input.priorOpeningBalances ?? [],
    prior,
    input.accountClassifications,
    warnings,
    "Kỳ trước"
  );
  const noteLines: VietnameseReportLine[] = VIETNAMESE_NOTE_DEFINITIONS.map(
    ([code, label]) => {
      const note = input.notes?.[code]?.trim();
      if (!note || /^(OPEN|DRAFT|PROPOSED)\b/.test(note))
        warnings.add(
          `B09-DN ${code}: Chưa có thuyết minh được xác nhận (nếu không áp dụng phải nêu lý do).`
        );
      return {
        code,
        label,
        current: null,
        previous: null,
        note: note || "OPEN — Chưa có thuyết minh được xác nhận"
      };
    }
  );
  const trial = [
    ...closingBalances(input.openingBalances, selected).values()
  ].reduce((sum, amount) => sum + amount, 0);
  const journalTotals: Values = new Map();
  for (const line of selected) add(journalTotals, line.journalId, line.amount);
  const imbalance = [...journalTotals].filter(
    ([, amount]) => Math.abs(amount) > EPSILON
  );
  const priorTrial = [
    ...closingBalances(input.priorOpeningBalances ?? [], prior).values()
  ].reduce((sum, amount) => sum + amount, 0);
  const priorJournalTotals: Values = new Map();
  for (const line of prior)
    add(priorJournalTotals, line.journalId, line.amount);
  const priorImbalance = [...priorJournalTotals].filter(
    ([, amount]) => Math.abs(amount) > EPSILON
  );
  const checks = [
    {
      id: "ledger",
      label: "Sổ cái cân đối Nợ/Có",
      passed: Math.abs(trial) <= EPSILON && imbalance.length === 0,
      detail: `Chênh lệch tổng ${round(trial)}; ${imbalance.length} bút toán không cân.`
    },
    {
      id: "comparative-ledger",
      label: "Sổ cái kỳ so sánh cân đối Nợ/Có",
      passed: Math.abs(priorTrial) <= EPSILON && priorImbalance.length === 0,
      detail: `Chênh lệch ${round(priorTrial)}; ${priorImbalance.length} bút toán không cân.`
    },
    {
      id: "balance-sheet",
      label: "B01-DN: 280 = 440",
      passed:
        Math.abs(get(currentB01, "280") - get(currentB01, "440")) <= EPSILON,
      detail: `${round(get(currentB01, "280"))} = ${round(get(currentB01, "440"))}`
    },
    {
      id: "cash-flow",
      label: "B03-DN: 70 khớp tiền cuối kỳ",
      passed:
        Math.abs(
          get(currentB03, "70") -
            cashTotal(
              closingBalances(input.openingBalances, selected),
              input.accountClassifications
            )
        ) <= EPSILON,
      detail: `70 = 50 + 60 + 61; ${round(get(currentB03, "70"))}`
    },
    {
      id: "opening-balance-sheet",
      label: "B01-DN đầu kỳ: 280 = 440",
      passed:
        Math.abs(get(previousB01, "280") - get(previousB01, "440")) <= EPSILON,
      detail: `${round(get(previousB01, "280"))} = ${round(get(previousB01, "440"))}`
    },
    {
      id: "comparative-cash-flow",
      label: "B03-DN kỳ trước: 70 khớp tiền cuối kỳ",
      passed:
        Math.abs(
          get(previousB03, "70") -
            cashTotal(
              closingBalances(input.priorOpeningBalances ?? [], prior),
              input.accountClassifications
            )
        ) <= EPSILON,
      detail: `70 = 50 + 60 + 61; ${round(get(previousB03, "70"))}`
    },
    {
      id: "notes",
      label: "B09-DN: Đủ thuyết minh được xác nhận",
      passed: ![...warnings].some((warning) => warning.startsWith("B09-DN")),
      detail: `${noteLines.length} mục thuyết minh và chính sách cần xác nhận.`
    }
  ];
  return {
    forms: [
      {
        code: "B01-DN",
        title: "Báo cáo tình hình tài chính",
        columns: ["Cuối kỳ", "Đầu kỳ"],
        lines: reportLines(B01, currentB01, previousB01)
      },
      {
        code: "B02-DN",
        title: "Báo cáo kết quả hoạt động kinh doanh",
        columns: ["Kỳ này", "Kỳ trước"],
        lines: reportLines(B02, currentB02, previousB02).map((line) =>
          ["70", "71"].includes(line.code)
            ? {
                ...line,
                current: null,
                previous: null,
                note: "Chỉ áp dụng công ty cổ phần; cần dữ liệu cổ phiếu và pha loãng."
              }
            : line
        )
      },
      {
        code: "B03-DN",
        title: "Báo cáo lưu chuyển tiền tệ — phương pháp trực tiếp",
        columns: ["Kỳ này", "Kỳ trước"],
        lines: reportLines(B03, currentB03, previousB03)
      },
      {
        code: "B09-DN",
        title: "Bản thuyết minh báo cáo tài chính",
        columns: ["Nội dung được xác nhận"],
        lines: noteLines
      }
    ],
    checks,
    warnings: [...warnings],
    blocked: warnings.size > 0 || checks.some((check) => !check.passed)
  };
}
