---
title: 'FMCG ba nhà máy và kế toán Việt Nam trong Carbon'
type: 'feature'
created: '2026-10-05'
status: 'in-progress'
baseline_commit: 'd4fd55db19344a4d2a6d84352a41f0b61fc77616'
route: 'dispatch'
review_loop_iteration: 0
context: ['.ai/docs/fmcg-tt99.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Cần dữ liệu giả lập đủ ERP/MES cho một công ty FMCG và bổ sung hạch toán, báo cáo Việt Nam trực tiếp vào Carbon.

**Approach:** Tạo công ty demo riêng: đồ uống tại Bình Dương, thực phẩm đóng gói tại Đồng Nai, chăm sóc cá nhân tại Long An; mỗi nhà máy 1.000 công nhân. Dùng VND và biểu mẫu Thông tư 99/2025/TT-BTC đã được người dùng xác nhận.

## Boundaries & Constraints

**Always:** Dữ liệu nhân sự giả, không tạo tài khoản đăng nhập cho công nhân. Giữ dữ liệu công ty hiện có; kiểm tra phạm vi công ty và quyền truy cập hiện hành. Nạp trong một transaction, chạy lại chỉ xác minh. Bút toán đã ghi sổ bất biến. Ghi rõ trạng thái thuyết minh, nguồn pháp lý và các hạn chế kiểm thử.

**Never:** Reset database; bỏ qua quyền hoặc trigger; dùng dữ liệu cá nhân thật; coi dữ liệu demo là báo cáo pháp lý đã được duyệt. Không triển khai production.

## I/O & Edge-Case Matrix

| Tình huống | Đầu vào | Kết quả | Xử lý lỗi |
|---|---|---|---|
| Chạy thử | Database localhost, người quản trị hiện có | Đủ dữ liệu và đối soát, sau đó rollback | Lỗi bất kỳ rollback toàn bộ |
| Nạp | Phê duyệt đặc tả, chạy `seed-fmcg.ts --apply` | Công ty demo riêng, 3.000 công nhân | Không sửa công ty cũ |
| Chạy lại | Công ty demo đã tồn tại | Xác minh, không nhân đôi | Tên công ty trùng không rõ chủ sở hữu: dừng |
| Báo cáo thiếu căn cứ | Thuyết minh hoặc phân loại chưa xác nhận | Hiển thị cảnh báo và báo cáo dự thảo | Chặn xuất bộ báo cáo hoàn chỉnh |

</frozen-after-approval>

## Code Map

- `packages/database/src/datasets/data/fmcg/`: dữ liệu của 12 tầng nghiệp vụ hiện hữu.
- `packages/database/src/seed-fmcg.ts`: bootstrap công ty hiện hữu, transaction và xác minh.
- `packages/database/src/datasets/fmcg-*.ts`: mở rộng nhà máy, chấm công, số dư, kế toán và kiểm tra.
- `packages/server-functions/src/post-purchase-invoice/`: VAT đầu vào khấu trừ; giữ hành vi cũ cho công ty khác.
- `apps/erp/app/modules/accounting/vietnamese-reports.ts`: bộ tính báo cáo; nguồn biểu mẫu lưu trong manifest.
- `apps/erp/app/routes/x+/reports+/vietnamese*`: route được bảo vệ, bộ lọc kỳ và xuất CSV có kiểm soát.

## Tasks & Acceptance

**Execution:**
- [x] Hoàn thiện dữ liệu ERP/MES, kế toán Việt Nam, kiểm tra và hướng dẫn.
- [x] Nạp công ty demo sau checkpoint phê duyệt đặc tả; chạy xác minh chỉ đọc.
- [x] Kiểm tra localhost và lập biên bản bằng chứng.

**Acceptance Criteria:**
- Đúng ba nhà máy và 1.000 công nhân mỗi nhà máy, có ca, phân công, chấm công và thực thi MES.
- Có vật tư, BOM, quy trình, mua/bán, kho/lô, sản xuất, chất lượng, kế hoạch và các tầng nghiệp vụ Carbon; ngoại lệ CAD phải có lý do.
- Sổ cái VND cân đối; hạch toán VAT, lương, chi phí sản xuất và công nợ có căn cứ dữ liệu demo.
- Có B01-DN, B02-DN, B03-DN và B09-DN theo nguồn chính thức. Không tự xác nhận 101 mục thuyết minh hoặc chính sách kế toán còn chờ rà soát.
- Thực hiện các kiểm tra nhỏ nhất phù hợp; không coi full ERP typecheck bị giới hạn bộ nhớ là đạt.

## Implementation Notes

2026-10-05: Người dùng duyệt đặc tả và cho phép tiếp tục nạp bằng câu trả lời “Duyệt & Tiếp tục nạp”. Phê duyệt này áp dụng triển khai local và dữ liệu demo; không xác nhận chính sách hoặc thuyết minh pháp lý.

Đã COMMIT công ty `db1g4fag00h4ahs096gg`, chạy lại `--verify` đạt. MRP và scheduler ba nhà máy đạt; 33 test cuối đạt. Kiểm tra SQL chỉ đọc độc lập xác nhận ba ca và 6.000 lượt chấm công mỗi nhà máy. Bằng chứng và hướng dẫn xem `.ai/runs/2026-10-05-fmcg-demo.md`.

ERP đã hoàn tất khởi động sau lần tải mã đầu: `/login` HTTP 200, lần kiểm tra kế tiếp cũng HTTP 200. MES `/login` HTTP 200. Chưa ghi nhận kiểm thử trình duyệt đã đăng nhập.

Đã chuẩn bị mã và chạy thử rollback: 39 mặt hàng, 13 BOM/quy trình, 24 lệnh sản xuất, 18.000 lượt chấm công và 18.000 phân công cho công nhân. Kiểm tra độ phủ 255 bảng không có lỗi, sáu bảng CAD không áp dụng có giải thích. Chưa nạp công ty demo vào database.

Build ERP đạt 5/5 tác vụ. Typecheck database và server-functions đạt; test VAT và báo cáo đạt. B01 cân đối 75.224.703.020 VND; B03 khớp tiền cuối kỳ 15.249.989.800 VND trong lần chạy thử. 101 mục B09 còn OPEN; số liệu năm đang hoạt động chưa là báo cáo quyết toán. Chưa kiểm thử bằng trình duyệt đã đăng nhập.

## Spec Change Log

## Review Triage Log

## Verification

- `pnpm db:check:datasets`: bộ dữ liệu áp dụng thành công trong transaction rollback.
- `seed-fmcg.ts` chạy thử và `--verify`: đúng quy mô, không có worker trong auth, bút toán cân đối.
- `scripts/verify-fmcg-reports.ts`: đối chiếu sổ cái, B01 và B03; thuyết minh OPEN tiếp tục chặn phát hành.
- Test báo cáo, route và VAT; typecheck theo package; `local.cmd build`: kiểm tra hành vi và build thực tế.
- HTTP ERP/MES localhost; kiểm thử đăng nhập thực tế chỉ được ghi nhận khi có bằng chứng.
