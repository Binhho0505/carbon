# Kế toán TT99 trên Carbon local

Phạm vi: công ty FMCG giả lập, một pháp nhân và ba nhà máy; không phải ba pháp nhân độc lập. Mã nguồn được triển khai trên local. Các biểu mẫu năm hỗ trợ doanh nghiệp hoạt động liên tục; báo cáo và thuyết minh demo/nháp không phải hồ sơ đã ký để nộp cơ quan quản lý.

## Mở module

1. Chạy `.cc1-agentic/local.cmd background` khi ERP/MES chưa chạy.
2. Mở `http://localhost:3000`, đăng nhập bằng tài khoản local đã có, chọn công ty **FMCG Việt Nam — Dữ liệu giả lập 3 nhà máy**. Có thể chọn ngôn ngữ **Tiếng Việt** trong bộ chọn ngôn ngữ hiện có.
3. Trong màn hình Báo cáo, mở **Kế toán Việt Nam — Kết chuyển TT99**, hoặc truy cập `/x/accounting/vietnamese`.
4. Mở **Báo cáo tài chính Việt Nam (Thông tư 99)** hoặc `/x/reports/vietnamese` để xem B01-DN, B02-DN, B03-DN và B09-DN.

## Kết chuyển

Chọn khoảng ngày và xem trước các dòng Nợ/Có. Module yêu cầu VND, tài khoản ghi sổ hợp lệ, chi phí sản xuất đã phân bổ và ngày kết chuyển nằm trong một kỳ `Open`.

Các bước: giảm trừ doanh thu 521 vào 511; doanh thu/chi phí vào 911; kết quả vào 4212. Chỉ bấm xác nhận ghi sổ sau khi người phụ trách đã đối soát. Toàn bộ bước được ghi trong một giao dịch; bản xem trước lỗi thời bị chặn. Kết chuyển không tự khóa hoặc đóng kỳ. Khi cùng kỳ đã ghi sổ nhưng phát sinh thay đổi, module yêu cầu đối soát thay vì sinh trùng bút toán. Bút toán đã ghi không bị sửa; sử dụng quy trình đảo bút toán hiện có khi cần.

Khoảng kết chuyển phải nằm trong một năm tài chính bắt đầu từ 01/01/2026 trở đi. Nếu còn doanh thu/chi phí năm trước chưa xử lý, module chặn và yêu cầu đối soát lịch sử; không cộng chúng vào lợi nhuận năm nay. Đọc kết quả kinh doanh tại B02-DN TT99; số dư các tài khoản doanh thu/chi phí về 0 sau khi kết chuyển.

Trạng thái hiện tại của demo: đã nạp và kiểm tra các tài khoản 911, 4211, 4212. Kiểm thử ghi sổ dùng database thật đã rollback; sổ demo không bị kết chuyển tự động.

## 101 thuyết minh

Chọn B09-DN, chỉnh sửa nội dung, rồi **Lưu thuyết minh nháp**. Mỗi lần lưu tạo phiên bản mới trong document/storage riêng của công ty, giữ phiên bản cũ. Phiên bản gắn với kỳ, digest sổ và người tạo. Nếu sổ thay đổi trong lúc sửa, cần tải lại để lưu trên số liệu hiện hành.

CSV quản trị chỉ được tải từ bản DRAFT đã lưu còn khớp sổ và đạt kiểm tra số học/phân loại. File ghi rõ **DRAFT — không dùng nộp báo cáo chính thức**. Xuất demo dùng gói `DEMO_PREPARED` riêng. Xuất chính thức không tự mở bằng việc lưu bản nháp hoặc ghi sổ kết chuyển; còn cần rà soát nội dung, thẩm quyền và chữ ký. Kỳ ngắn hơn năm tài chính không được coi là bộ biểu mẫu năm.

Công nợ 131/331 phải có đối tượng và kỳ hạn cho các số dư cần trình bày. Các dòng thiếu đối tượng vẫn bị chặn ngay cả khi cộng gộp bằng 0, để tránh che khuất số dư Nợ/Có của những đối tượng khác nhau.

## Dữ liệu và bản sao local

Mã nguồn: `D:/Code/carbon`. Cơ sở dữ liệu và storage lưu trong Docker volume hiện có. Bản sao trước/sau cấu hình và storage đi kèm ở `.cc1-agentic/backups/`, có README và SHA256; không đưa lên Git. Gói báo cáo demo mới ở `.cc1-agentic/releases/TT99-demo-2026-10-05-9a575e04cd81/`; các phiên bản cũ được giữ.

CLI cấu hình có tính lặp lại:

```text
node --env-file=.env.local --import tsx packages/database/src/configure-tt99-local.ts --company db1g4fag00h4ahs096gg --verify
```

Mặc định CLI chạy thử rồi rollback; `--apply` mới thêm tài khoản còn thiếu. CLI chỉ chấp nhận database localhost, nhân viên đang hoạt động có quyền tạo/cập nhật kế toán trong công ty VND. Không chạy các công cụ seed/reset để khởi động lại ứng dụng.

## Phần cần người phụ trách kế toán xác nhận

Đối chiếu các tài khoản phân tích/điều chỉnh đặc thù Carbon, chính sách giá thành, thuế, tỷ giá và dữ liệu doanh nghiệp thật. Bộ demo có lương tổng giả lập; chưa phải công cụ tính PIT, bảo hiểm hoặc lương ròng theo pháp luật. Các biểu mẫu giữa niên độ và doanh nghiệp không hoạt động liên tục chưa thuộc phạm vi này. Kiểm thử kỹ thuật không thay thế việc ký/xác nhận báo cáo tài chính.
