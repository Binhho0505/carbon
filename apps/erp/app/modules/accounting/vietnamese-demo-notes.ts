// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { round } from "@carbon/database/precision";
import {
  VIETNAMESE_NOTE_DEFINITIONS,
  type VietnameseReportInput,
  type VietnameseReportResult
} from "./vietnamese-reports";

export type VietnameseDemoNoteContext = {
  fictionalDemo: true;
  workerCount: number;
  plants: { name: string; workerCount: number; productGroup: string }[];
  assetRegisterCount?: number;
  inventoryItemCount?: number;
};

const SOURCE =
  "Phụ lục IV, B09-DN, TT99/2025/TT-BTC; Công báo 1577–1582; .ai/docs/fmcg-tt99-source-manifest.json";
const DISCLAIMER =
  "DỮ LIỆU GIẢ LẬP — chuẩn bị cho phát hành bản demo; không phải hồ sơ nộp cơ quan quản lý.";

/** Builds evidence-labelled disclosures exclusively for the fictional seed company. */
export function buildVietnameseDemoNotes(
  input: VietnameseReportInput,
  reports: VietnameseReportResult,
  context: VietnameseDemoNoteContext
) {
  if (
    context.fictionalDemo !== true ||
    !input.company.name.includes("Dữ liệu giả lập 3 nhà máy")
  ) {
    throw new Error("Chỉ được chuẩn bị thuyết minh cho công ty FMCG giả lập.");
  }
  if (input.company.currencyCode !== "VND")
    throw new Error("Bộ demo yêu cầu đơn vị tiền tệ VND.");
  if (
    context.plants.length !== 3 ||
    context.workerCount !==
      context.plants.reduce((sum, plant) => sum + plant.workerCount, 0)
  ) {
    throw new Error("Số lao động và cơ cấu nhà máy chưa đối chiếu.");
  }
  const money = (amount: number) =>
    `${new Intl.NumberFormat("vi-VN").format(round(amount))} VND`;
  const balances = new Map<string, number>();
  for (const row of [...input.openingBalances, ...input.journalLines]) {
    balances.set(
      row.accountNumber,
      (balances.get(row.accountNumber) ?? 0) + row.amount
    );
  }
  const ledger = (prefixes: string[]) => {
    const selected = [...balances].filter(([account]) =>
      prefixes.some((prefix) => account.startsWith(prefix))
    );
    return selected.length
      ? selected
          .map(
            ([account, amount]) =>
              `TK ${account}: ${money(amount)} (dư Nợ dương/Có âm)`
          )
          .join("; ")
      : "Không có số dư tài khoản thuộc nhóm này trong sổ đã ghi nhận của bộ demo";
  };
  const form = (name: string, codes: string[]) =>
    codes
      .map((code) => {
        const line = reports.forms
          .find((report) => report.code === name)
          ?.lines.find((row) => row.code === code);
        if (!line || line.current === null || line.previous === null)
          throw new Error(`Thiếu số đối chiếu ${name}/${code}`);
        return `${line.label} [${code}]: cuối/kỳ này ${money(line.current)}, đầu/kỳ so sánh ${money(line.previous)}`;
      })
      .join("; ");
  const control = (prefix: string) => {
    const rows = (input.controlBalances ?? []).filter((row) =>
      row.accountNumber.startsWith(prefix)
    );
    return `${rows.length} nhóm đối tượng/kỳ hạn; phải thu/trả trước dư Nợ ${money(rows.filter((row) => row.amount > 0).reduce((sum, row) => sum + row.amount, 0))}; phải trả/nhận trước dư Có ${money(-rows.filter((row) => row.amount < 0).reduce((sum, row) => sum + row.amount, 0))}. Không bù trừ khác đối tượng; định danh đối tác là giả lập.`;
  };
  const cashJournals = new Set(
    input.journalLines
      .filter((line) => /^(111|112|113)/.test(line.accountNumber))
      .map((line) => line.journalId)
  );
  const assetMovement = (prefix: string) => {
    const opening = input.openingBalances
      .filter((row) => row.accountNumber.startsWith(prefix))
      .reduce((sum, row) => sum + row.amount, 0);
    const rows = input.journalLines.filter((row) =>
      row.accountNumber.startsWith(prefix)
    );
    const increases = rows
      .filter((row) => row.amount > 0)
      .reduce((sum, row) => sum + row.amount, 0);
    const decreases = -rows
      .filter((row) => row.amount < 0)
      .reduce((sum, row) => sum + row.amount, 0);
    return `Biến động TK ${prefix}: đầu kỳ ${money(opening)}; phát sinh Nợ ${money(increases)}; phát sinh Có ${money(decreases)}; cuối kỳ ${money(opening + increases - decreases)}. Đây là biến động GL, không tự thay thế bảng tăng giảm tài sản theo từng nhóm và nguyên nhân.`;
  };
  const evidence: Record<string, string> = {
    "I.1":
      "Giả định mô phỏng: một doanh nghiệp tư nhân trong nước; không dựng giấy đăng ký, danh tính chủ sở hữu hoặc vốn pháp định. Vốn ghi sổ được trình bày tại V.27.",
    "I.2": "Sản xuất và phân phối hàng tiêu dùng nhanh (FMCG).",
    "I.3":
      "Ba nhóm sản phẩm của kịch bản: đồ uống, thực phẩm đóng gói và chăm sóc cá nhân; mã ngành đăng ký pháp lý không được mô phỏng.",
    "I.4":
      "Giả định phục vụ demo: chu kỳ sản xuất, bán hàng dưới 12 tháng; theo dõi lô, hạn dùng, nguyên liệu, bán thành phẩm và thành phẩm qua ERP/MES.",
    "I.5":
      "Kỳ đầu vận hành mô phỏng; số dư đầu kỳ là bút toán mở sổ giả lập. Tồn kho, lương và sản xuất được mô phỏng; dữ liệu chấm công không phải chứng từ thanh toán lương thực tế.",
    "I.6":
      context.plants
        .map(
          (plant) =>
            `${plant.name}: ${plant.productGroup}, ${plant.workerCount} lao động`
        )
        .join("; ") +
      ". Ba nhà máy thuộc cùng một công ty; không giả định công ty con hoặc liên kết.",
    "I.7": `Tổng ${context.workerCount} công nhân giả lập; ${context.plants.map((plant) => `${plant.name} ${plant.workerCount}`).join("; ")}. Đây là số lượng tại thời điểm trích xuất, không tự suy thành số lao động bình quân năm. Các công nhân không có tài khoản đăng nhập.`,
    "I.8":
      "Cột so sánh được tính từ dữ liệu sổ kỳ trước hiện có; số 0 có nghĩa không có phát sinh được mô phỏng, không phải chứng nhận doanh nghiệp thực tế không phát sinh.",
    "I.9":
      "Không tạo giấy phép, chứng nhận an toàn thực phẩm, môi trường, kiểm toán hoặc xác nhận thuế. Các hồ sơ pháp lý không thuộc dữ liệu giả lập.",
    "II.1": `Giả định năm kế toán 01/01–31/12; báo cáo demo từ ${input.period.startDate} đến ${input.period.endDate}; so sánh ${input.period.priorStartDate}–${input.period.priorEndDate}. Báo cáo giữa năm không tự chuyển thành BCTC cả năm.`,
    "II.2":
      "Đơn vị tiền tệ ghi sổ và trình bày: VND. Số tiền hiển thị từ giá trị chính xác lưu trong sổ; giá trị chưa làm tròn được dùng để đối soát.",
    "III.1":
      "Biểu mẫu được triển khai theo TT99/2025/TT-BTC, Phụ lục IV B01-DN/B02-DN/B03-DN/B09-DN. Tài khoản chi tiết mở thêm phục vụ demo, không thay đổi mã chỉ tiêu gốc.",
    "III.2":
      "Phần mềm đối chiếu biểu mẫu TT99 và tính cân đối trên dữ liệu giả lập. Không tuyên bố tuân thủ đầy đủ chuẩn mực, không thay thế kiểm toán hoặc trách nhiệm người ký BCTC.",
    "V.1": form("B01-DN", ["111", "112"]),
    "V.2": form("B01-DN", ["120", "260"]),
    "V.3": form("B01-DN", ["131", "211", "312", "332"]) + "; " + control("131"),
    "V.4": form("B01-DN", ["133", "135", "214", "215"]),
    "V.5": form("B01-DN", ["137"]),
    "V.6":
      form("B01-DN", ["136", "216"]) +
      ". Không có đánh giá tuổi nợ/khả năng thu hồi độc lập; dự phòng chỉ là số đã ghi sổ, không suy diễn toàn bộ nợ đều tốt.",
    "V.7":
      form("B01-DN", ["141", "142"]) +
      "; " +
      ledger(["151", "152", "153", "154", "155", "156", "157", "2294"]) +
      `. Danh mục demo ${context.inventoryItemCount ?? "chưa cung cấp số lượng"} mặt hàng; không tự khẳng định giá trị thuần có thể thực hiện bằng giá vốn.`,
    "V.8": form("B01-DN", ["251", "252"]),
    "V.9":
      form("B01-DN", ["222", "223"]) +
      "; " +
      assetMovement("211") +
      " " +
      assetMovement("2141"),
    "V.10":
      form("B01-DN", ["228", "229"]) +
      "; " +
      assetMovement("213") +
      " " +
      assetMovement("2143"),
    "V.11":
      form("B01-DN", ["225", "226"]) +
      "; " +
      assetMovement("212") +
      " " +
      assetMovement("2142"),
    "V.12": form("B01-DN", ["150", "230"]),
    "V.13": form("B01-DN", ["241", "242"]) + "; " + ledger(["217", "2147"]),
    "V.14": form("B01-DN", ["161", "271"]) + "; " + ledger(["242"]),
    "V.15": form("B01-DN", ["165", "273", "274"]),
    "V.16":
      form("B01-DN", ["321", "339"]) +
      "; " +
      ledger(["341"]) +
      ". Kỳ hạn theo phân loại tài khoản demo; không có hợp đồng vay hoặc bảng tài sản bảo đảm thực tế.",
    "V.17":
      form("B01-DN", ["311", "331", "132", "212"]) + "; " + control("331"),
    "V.18": form("B01-DN", ["313"]),
    "V.19":
      form("B01-DN", ["163", "314", "333"]) +
      "; " +
      ledger(["133", "333"]) +
      ". Thuế ghi sổ không phải số đã quyết toán với cơ quan thuế.",
    "V.20": form("B01-DN", ["316", "334"]),
    "V.21":
      form("B01-DN", ["315", "317", "320", "335", "336", "338"]) +
      ". Lương là bút toán mô phỏng; chưa tính bảng lương cá nhân, PIT, bảo hiểm bắt buộc hay các khoản khấu trừ. Không coi số phải trả này là bảng lương đủ điều kiện thanh toán.",
    "V.22": form("B01-DN", ["319", "337"]),
    "V.23":
      ledger(["343"]) +
      ". Kịch bản không tạo hợp đồng phát hành trái phiếu; số dư nếu có phải được rà soát riêng.",
    "V.24": form("B01-DN", ["341"]),
    "V.25": form("B01-DN", ["322", "343"]),
    "V.26": form("B01-DN", ["272", "342"]),
    "V.27":
      form("B01-DN", ["411", "412", "414", "418", "419", "420"]) +
      ". Không dựng danh sách cổ đông, số cổ phiếu hoặc nghị quyết phân phối lợi nhuận.",
    "V.28": form("B01-DN", ["416"]),
    "V.29": form("B01-DN", ["417"]),
    "V.30":
      "Kịch bản seed không mô phỏng tài sản thuê ngoài bảng, hàng nhận giữ hộ, cam kết ngoại tệ hoặc nghĩa vụ bảo lãnh ngoài bảng. Sổ GL không đủ chứng minh không có các nghĩa vụ này ở một doanh nghiệp thực tế.",
    "V.31":
      "Kịch bản không tạo tài sản của bên khác bị giới hạn sử dụng; đây là giới hạn phạm vi mô phỏng, không phải kết luận pháp lý về quyền sử dụng tài sản.",
    "V.32": `Đối soát số liệu: ${reports.checks
      .filter((check) => check.passed)
      .map((check) => check.label)
      .join("; ")}. Các kiểm tra chưa đạt: ${
      reports.checks
        .filter((check) => !check.passed && check.id !== "notes")
        .map((check) => check.detail)
        .join("; ") || "không có"
    }.`,
    "VII.1": form("B02-DN", ["01", "10"]),
    "VII.2": form("B02-DN", ["02"]) + "; " + ledger(["521"]),
    "VII.3": form("B02-DN", ["11"]),
    "VII.4": form("B02-DN", ["21"]),
    "VII.5": form("B02-DN", ["22"]),
    "VII.6": form("B02-DN", ["23", "24"]),
    "VII.7": form("B02-DN", ["31"]),
    "VII.8": form("B02-DN", ["32"]),
    "VII.9": form("B02-DN", ["25", "26"]),
    "VII.10":
      ledger(["621", "622", "623", "627"]) +
      ". Số trên là số dư sau kết chuyển, không phải tổng chi phí theo yếu tố. Phát sinh Nợ các tài khoản sản xuất trong kỳ: " +
      money(
        input.journalLines
          .filter(
            (line) =>
              /^(621|622|623|627)/.test(line.accountNumber) && line.amount > 0
          )
          .reduce((sum, line) => sum + line.amount, 0)
      ) +
      "; chỉ tiêu này không tự phân loại toàn bộ chi phí theo yếu tố ngoài sản xuất.",
    "VII.11":
      form("B02-DN", ["50", "51", "52", "60"]) +
      ". Không dùng lợi nhuận kế toán để tự suy ra thu nhập chịu thuế hoặc nghĩa vụ quyết toán.",
    "VIII.1":
      "Kịch bản không tạo tiền bị phong tỏa/hạn chế sử dụng; không suy từ số dư tiền rằng doanh nghiệp thực tế không có hạn chế.",
    "VIII.2":
      "Các bút toán mở sổ, trích lương, khấu hao, vốn hóa chi phí vào sản phẩm dở dang và khoản phải trả là giao dịch phi tiền tệ nếu không có dòng TK tiền. Tổng số bút toán kỳ này không có TK 111/112/113: " +
      new Set(
        input.journalLines
          .filter((line) => !cashJournals.has(line.journalId))
          .map((line) => line.journalId)
      ).size +
      ". Không tự đưa các bút toán này vào lưu chuyển tiền.",
    "VIII.3": form("B03-DN", ["33"]),
    "VIII.4": form("B03-DN", ["34", "35"]),
    "VIII.5":
      "Ba nhà máy cùng một pháp nhân; kịch bản không có mua hoặc thanh lý công ty con. Không lập lưu chuyển tiền hợp nhất từ dữ liệu này.",
    "IX.1":
      "Không mô phỏng hồ sơ kiện tụng, bảo lãnh hoặc cam kết vốn ngoài sổ. Không có bằng chứng đủ để kết luận pháp nhân thực tế không có nợ tiềm tàng.",
    "IX.2": `Thuyết minh căn cứ dữ liệu đến ${input.period.endDate}; không giả định các sự kiện sau ngày báo cáo, không tự xác nhận không có sự kiện điều chỉnh.`,
    "IX.3":
      "Nhà cung cấp/khách hàng là định danh giả lập; không tạo danh tính chủ sở hữu, người quản lý hoặc quan hệ kiểm soát. Danh sách bên liên quan thực tế không thể suy ra từ GL.",
    "IX.4":
      context.plants
        .map((plant) => `${plant.name}: ${plant.productGroup}`)
        .join("; ") +
      ". GL chưa có đủ phân bổ mọi doanh thu/chi phí theo từng nhà máy; không phân bổ tùy ý để tạo báo cáo bộ phận.",
    "IX.5": `So sánh ${input.period.priorStartDate}–${input.period.priorEndDate}; số dư đầu kỳ lấy từ sổ trước ${input.period.startDate}. Không điều chỉnh hồi tố ngoài những bút toán hiện có.`,
    "IX.6":
      "Giả định hoạt động liên tục chỉ là điều kiện mô phỏng. Không có đánh giá thanh khoản, kế hoạch vốn, xác nhận chủ sở hữu hoặc quyết định quản trị của doanh nghiệp thực tế.",
    "IX.7":
      "Giả định trọng yếu: chu kỳ dưới 12 tháng, phân loại kỳ hạn công nợ theo metadata demo, phương pháp tính giá/khấu hao theo cấu hình Carbon. Giá trị thuần tồn kho, khả năng thu hồi nợ và chênh lệch tạm thời thuế chưa được thẩm định độc lập.",
    "IX.8":
      "Dùng bộ demo để kiểm thử hạch toán, truy xuất ERP/MES và đối soát biểu mẫu. Khi thay bằng dữ liệu thật phải bổ sung chứng từ, ước tính, duyệt nội dung và người ký có thẩm quyền.",
    "X.1":
      "Không sửa mã hoặc tên chỉ tiêu gốc B01-DN, B02-DN, B03-DN và 101 mục B09-DN trong bản demo.",
    "X.2":
      "Bổ sung trạng thái DEMO_PREPARED, nguồn dữ liệu và nhãn giả lập trong metadata; các metadata này không phải chỉ tiêu bổ sung của biểu mẫu pháp định.",
    "X.3":
      "Nhãn giả lập và provenance nhằm ngăn nhầm bản demo với hồ sơ pháp định; không sửa cấu trúc mẫu TT99."
  };
  const policies = [
    "Không chuyển đổi toàn bộ BCTC sang ngoại tệ; ghi sổ và trình bày VND.",
    "Chứng từ ngoại tệ theo tỷ giá cấu hình trong dữ liệu demo; Carbon lưu ngoại tệ trên một đơn vị VND. Không coi tỷ giá giả lập là tỷ giá ngân hàng được xác nhận.",
    "Không mô phỏng hợp đồng phải chiết khấu dòng tiền hoặc lãi suất thực tế; không tự gán tỷ lệ chiết khấu.",
    "Phân loại TK tiền và tương đương tiền theo metadata tài khoản; không tự xếp mọi khoản đầu tư ngắn hạn thành tương đương tiền.",
    "Nhóm đầu tư được đối chiếu các chỉ tiêu B01 120/260; số dư 0 không thay thế xác nhận quyền sở hữu hoặc giá trị hợp lý.",
    "Trình bày công nợ theo đối tượng và kỳ hạn; tách dư Nợ/Có TK 131/331, không bù trừ giữa các đối tượng. Dự phòng theo số đã ghi sổ.",
    "Theo dõi tồn kho liên tục, lô và hạn dùng; giá vốn từ cost ledger/giá cấu hình Carbon. Chi phí sản xuất 621/622/627 kết chuyển 154; chỉ chuyển 155 khi có sản lượng thực nhập kho. Không khẳng định đã kiểm kê hoặc kiểm tra giá trị thuần.",
    `TSCĐ theo nguyên giá và khấu hao được cấu hình trong Carbon; sổ tài sản ${context.assetRegisterCount ?? "chưa cung cấp số lượng"} bản ghi. Không tạo biên bản nghiệm thu hoặc tự suy tuổi thọ từ GL.`,
    "Kịch bản FMCG chế biến nguyên liệu mua ngoài, không mô phỏng trang trại/chăn nuôi; nếu phát sinh TK tài sản sinh học cần bổ sung chính sách chuyên biệt.",
    "Kịch bản không có hợp đồng hợp tác kinh doanh BCC; không giả lập phân chia lợi nhuận liên doanh.",
    "Chi phí chờ phân bổ theo TK 242 và metadata kỳ hạn; không dùng tổng dư 242 để tự quyết thời gian phân bổ.",
    "Phải trả người bán theo chứng từ và đối tượng; VAT đầu vào có thể khấu trừ được tách vào tài khoản tài sản thay vì cộng vào giá vốn.",
    "Cổ tức/lợi nhuận phải trả theo số đã ghi sổ; không dựng nghị quyết chia lợi nhuận hoặc người thụ hưởng thực tế.",
    "Chi phí phải trả theo bút toán đã ghi nhận; không tự tạo nghĩa vụ chưa có chứng từ.",
    "Doanh thu chờ phân bổ theo số dư và kỳ hạn cấu hình; không tự ghi nhận trước doanh thu của hợp đồng chưa hoàn thành.",
    "Dự phòng theo số đã ghi sổ; không tự đặt tỷ lệ dự phòng cho khoản mục không có đánh giá nghĩa vụ hoặc rủi ro.",
    "Thuế hoãn lại theo số đã ghi sổ; không có bảng chênh lệch tạm thời được thẩm định nên không tự tính tài sản thuế hoãn lại.",
    "Vay và thuê tài chính tách ngắn/dài hạn theo metadata; không xác nhận kỳ hạn/điều kiện thực tế nếu không có hợp đồng.",
    "Chỉ phản ánh chi phí đi vay đã ghi sổ; không tự vốn hóa khi chưa có đánh giá tài sản đủ điều kiện.",
    "Không mô phỏng trái phiếu chuyển đổi hoặc định giá cấu phần vốn/nợ; số dư nếu có cần hồ sơ riêng.",
    "Vốn chủ sở hữu theo bút toán mở sổ và giao dịch đã ghi nhận; không suy danh tính cổ đông hoặc số lượng cổ phiếu.",
    "Doanh thu và thu nhập khác theo chứng từ đã ghi sổ; tách 511/515/711. Không giả định hóa đơn đồng nghĩa đã hoàn tất mọi điều kiện ghi nhận.",
    "Giảm trừ doanh thu theo TK 521, loại bút toán kết chuyển trùng; không tự bù trừ vào doanh thu tài chính.",
    "Giá vốn theo TK 632 và các bút toán thực tế; không chuyển chi phí sản xuất dở dang thành giá vốn khi chưa bán thành phẩm.",
    "Chi phí tài chính theo TK 635; lãi vay tách theo phân loại chỉ tiêu khi dữ liệu có đủ thông tin.",
    "Chi phí bán hàng TK 641 và quản lý TK 642 theo sổ; không tùy ý phân bổ toàn bộ chi phí nhà máy vào các khoản này.",
    "Lãi/lỗ thanh lý theo chứng từ đã ghi nhận; không giả lập biên bản thanh lý, giá thị trường hoặc quyền chuyển nhượng.",
    "Chi phí thuế TNDN hiện hành/hoãn lại theo TK 8211/8212. Không tuyên bố tờ khai hoặc quyết toán thuế đã nộp.",
    "Chính sách demo không thay thế chính sách được người có thẩm quyền ban hành. Các ước tính, pháp lý và phê duyệt thực tế không được tạo giả."
  ];
  policies.forEach((policy, index) => {
    evidence[`IV.${index + 1}`] = `Giả định/chính sách mô phỏng: ${policy}`;
  });
  const disclosures = VIETNAMESE_NOTE_DEFINITIONS.map(([code, label]) => {
    if (!evidence[code]) throw new Error(`Thiếu nội dung ${code}`);
    return {
      code,
      label,
      status: "DEMO_PREPARED" as const,
      provenance: SOURCE,
      content: `${DISCLAIMER}\n${label}: ${evidence[code]}`
    };
  });
  return {
    status: "DEMO_PREPARED" as const,
    statutorySubmission: false as const,
    source: SOURCE,
    notes: Object.fromEntries(
      disclosures.map((row) => [row.code, row.content])
    ),
    disclosures
  };
}
