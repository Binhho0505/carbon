# Bộ thuyết minh TT99 demo — 2026-10-05

Người dùng yêu cầu hoàn thiện 101 mục cho phát hành trong ngữ cảnh công ty FMCG giả lập đã được duyệt và nạp. Đã chuẩn bị và lưu vào native document/storage của công ty `db1g4fag00h4ahs096gg`; trạng thái `DEMO_PREPARED`, `statutorySubmission: false`.

Đủ 101 mã B09 theo định nghĩa biểu mẫu đã đối chiếu nguồn chính thức. Nội dung riêng cho từng mục: thông tin ba nhà máy/công nhân, chính sách mô phỏng, số liệu B01/B02/B03 và GL, công nợ theo đối tượng/kỳ hạn, biến động tài sản, sản xuất, thông tin so sánh. Không dựng giấy phép, danh tính chủ sở hữu, xác nhận kiểm toán/thuế hoặc chữ ký. III.2 nêu rõ giới hạn tuyên bố tuân thủ.

Gói hiện hành: `.cc1-agentic/releases/TT99-demo-2026-10-05-d2513020d4f3/`. Gồm JSON 101 mục, B01/B02/B03/B09 CSV, Markdown B09, HTML đọc/in và manifest ghi hash từng file. Các phiên bản trước được giữ nguyên. SHA256 bundle `d2513020d4f3c545c11e6be4dc85ca81d9d693212c352b8a906271a924728aa0`; digest sổ `8ac94364428c93fd87fbe60c9c5db817c1ede3b620a892281f1aa313f52e7bb1`.

Publisher chỉ chấp nhận database/API localhost và công ty FMCG giả lập đúng quy mô. Chứng từ tải lên bằng tài khoản local có membership, storage riêng/private và read/write group của người tạo; mỗi file được tải lại và kiểm tra SHA256. Chạy lại cùng phiên bản không nạp trùng, không ghi đè bản phát hành khác.

Kiểm thử cuối: 23 test nội dung, binding và route đạt, gồm hồi quy mã CF trùng và mã khác nhau. Kiểm thử tích hợp opt-in xác thực người dùng local, xác minh quyền xem kế toán và membership qua RLS, thực thi SQL và đọc storage thật: loader đủ 101 mục, digest khớp và demoExportReady=true; bốn CSV demo trả Response 200, bốn xuất chuẩn bị chặn Response 409. Root đã chạy lại test tích hợp và đạt sau khi bổ sung đóng riêng phiên fixture. Đây là kiểm thử adapter server, không phải trình duyệt đã đăng nhập.

Tích hợp phát hiện loader gắn mã CF01 cả dòng tiền và dòng công nợ, trong khi snapshot chỉ gắn dòng tiền. Đã chuẩn hóa digest theo tập mã CF phân biệt trong từng bút toán, đúng cách bộ tính dùng; giữ thay đổi số tiền và thay đổi mã phân loại thực sự làm vô hiệu gói. Test riêng kiểm tra mã trùng tương đương và mã xung đột khác hash.

Không tắt bảo vệ bot: POST đăng nhập tự động bị Turnstile chặn. Không thay đổi authentication/RBAC hoặc tạo cookie giả. Full ERP typecheck chưa đạt do giới hạn bộ nhớ từ các lượt trước; database typecheck cuối đã đạt. Biome 10 file không lỗi, hai cảnh báo console của CLI. ERP/MES `/login` đều HTTP 200. Build cuối sau chuẩn hóa digest đạt 5/5 tác vụ, 2 phút 23,692 giây.

Archive cuối: `TT99-demo-2026-10-05-d2513020d4f3.zip`, 48.373 bytes; SHA256 `05FB8147B52C261B09194CC9F4B2F9FE9668EDDF625C393C02524480D7F35299`. Không ghi đè archive cũ.

Sử dụng: chọn công ty demo, mở `/x/reports/vietnamese?startDate=2026-01-01&endDate=2026-10-05`, chọn B09-DN và “Xuất CSV demo”. Thuyết minh tự tải từ document đúng công ty/kỳ/digest; thay đổi sổ hoặc sửa text làm mất điều kiện xuất demo đến khi chuẩn bị lại. Xuất chính thức vẫn chặn cho gói DEMO_PREPARED, kể cả nếu cảnh báo khóa sổ sau này được xử lý.

Số học B01/B03/sổ đạt; vẫn giữ cảnh báo lợi nhuận chưa kết chuyển. Bộ này phục vụ phát hành demo nội bộ, không phải hồ sơ nộp cơ quan quản lý. Chưa có xác nhận kế toán, chữ ký có thẩm quyền hoặc approval pháp lý cho doanh nghiệp thật. Không push hoặc triển khai production.
