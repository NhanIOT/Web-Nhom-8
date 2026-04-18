# Web-Nhom-8

# BookGroup8 – Website Bán Sách Trực Tuyến

**BookGroup8** là đồ án môn **Thiết kế Web** – một website thương mại điện tử bán sách trực tuyến được phát triển bởi nhóm sinh viên Đại học Kinh tế Quốc dân. Dự án mô phỏng đầy đủ trải nghiệm mua sắm của người dùng, từ xem sản phẩm, tìm kiếm, quản lý giỏ hàng đến đăng nhập/đăng ký, với giao diện hiện đại và responsive trên mọi thiết bị.

---

## Tính năng nổi bật

### Trang chủ

- **Hero Carousel** – 5 banner tự động chuyển, hỗ trợ điều hướng và vuốt cảm ứng.
- **Flash Sale** – Đồng hồ đếm ngược 2 giờ, sản phẩm giảm giá cuộn ngang.
- **Danh mục sản phẩm** – 12 danh mục phổ biến, hiển thị dạng lưới cuộn.
- **Phiếu quà tặng (Gift Card)** – 4 mẫu phiếu quà tặng bắt mắt.
- **Xu hướng mua sắm & Tabs** – Chuyển đổi giữa các bộ sưu tập sách.
- **Bảng xếp hạng bán chạy** – Top 5 sách theo tuần, kèm ảnh lớn và chi tiết khi chọn.
- **Combo Trending & Gợi ý cho bạn** – Hàng chục đầu sách được đề xuất.

### Người dùng & Tài khoản

- **Đăng ký / Đăng nhập** – Form với validate trực quan, hỗ trợ hiện/ẩn mật khẩu.
- **Dropdown Tài khoản** – Truy cập nhanh đơn hàng, sản phẩm yêu thích, cài đặt.
- **Đăng nhập qua Google/Facebook** (giao diện mô phỏng).

### Giỏ hàng & Tìm kiếm

- **Thêm vào giỏ hàng** – Từ mọi thẻ sản phẩm (Flash Sale, sản phẩm thường).
- **Panel giỏ hàng trượt** – Xem, xóa sản phẩm, tính tổng tiền tự động.
- **Lưu giỏ hàng** – Sử dụng `localStorage`, không mất khi tải lại trang.
- **Tìm kiếm realtime** – Gợi ý sản phẩm khi gõ, highlight từ khóa, dropdown thông minh.

### Responsive & Tiện ích

- **Hamburger menu** cho thiết bị di động.
- **Sticky Header** + Banner tự ẩn khi cuộn.
- **Marquee thương hiệu** – Logo đối tác chạy vô hạn.
- **Lazy load ảnh** – Tối ưu tốc độ tải trang.
- **Nút cuộn lên đầu trang** & **Toast thông báo** tinh tế.

---

## Công nghệ sử dụng

| Công nghệ                         | Vai trò                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| **HTML5**                         | Cấu trúc các trang web, sử dụng thẻ ngữ nghĩa.                                             |
| **CSS3**                          | Tạo style, layout với Grid/Flexbox, animations, CSS Variables (theme system).              |
| **JavaScript (ES6)**              | Toàn bộ logic tương tác, quản lý trạng thái giỏ hàng, carousel, tìm kiếm, validate form... |
| **LocalStorage / SessionStorage** | Lưu trữ giỏ hàng và thời gian Flash Sale.                                                  |
| **Figma**                         | Thiết kế mockup và wireframe.                                                              |
| **Git & GitHub**                  | Quản lý phiên bản và lưu trữ mã nguồn.                                                     |

---

## Cấu trúc thư mục

```

BookGroup8/
│
├── index.html # Trang chủ
├── gioithieu.html # Trang giới thiệu nhóm
├── sanpham.html # Trang danh sách sản phẩm (khung)
├── lienhe.html # Trang liên hệ (khung)
├── dangnhap.html # Trang đăng nhập
├── dangky.html # Trang đăng ký
│
├── CSS/
│ ├── themes.css # Biến màu, font, reset CSS
│ ├── default.css # Container và reset bổ sung
│ ├── banner.css # Thanh banner khuyến mãi
│ ├── header.css # Header + navigation
│ ├── footer.css # Footer 4 cột
│ ├── main.css # Style nội dung chính trang chủ
│ ├── newsletter.css # Form đăng ký nhận bản tin
│ ├── gioithieu.css # Style trang giới thiệu
│ ├── dangnhap.css # Style trang đăng nhập
│ ├── dangky.css # Style trang đăng ký
│ └── responsive.css # Media queries tổng hợp
│
├── JAVASCRIPT/
│ ├── index.js # Logic trang chủ và các tiện ích dùng chung
│ ├── gioithieu.js # Logic trang giới thiệu
│ ├── sanpham.js # Logic trang sản phẩm
│ ├── lienhe.js # Logic trang liên hệ
│ ├── dangnhap.js # Validate & xử lý đăng nhập
│ └── dangky.js # Validate & xử lý đăng ký
│
└── asset/
├── icon/ # Các icon SVG (header, footer, danh mục...)
└── img/ # Hình ảnh banner, sản phẩm, đối tác
├── Phong/
├── Element_offers/
├── Ngoaingu/
├── Kinhte/
├── ... (các danh mục sách khác)

```

## Hướng dẫn chạy dự án

1. **Clone repository về máy:**

   ```bash
   git clone https://github.com/NhanIOT/Web-Nhom-8
   cd bookgroup8

   ```

2. **Mở file HTML:**
   Cách đơn giản nhất: nhấp đúp vào index.html để mở bằng trình duyệt.
   Hoặc sử dụng Live Server trong Visual Studio Code để có trải nghiệm tốt nhất (tự động reload khi sửa code).

3. **Khám phá:**

Dùng thử các tính năng: thêm sách vào giỏ, tìm kiếm, xem bảng xếp hạng, chuyển tab, đăng nhập/đăng ký (mô phỏng).
Lưu ý: Dự án hiện chỉ hoạt động ở phía Frontend. Các chức năng đăng nhập, thanh toán mới dừng ở mức mô phỏng (alert/toast). Giỏ hàng được lưu trên trình duyệt của bạn.

---

**Thành viên nhóm**
| STT | Họ và tên | Vai trò | Nhiệm vụ chính | Mức độ đóng góp |
|-----|-------------------|-------------|----------------------------------------------------------------------------------------|-----------------|
| 1 | Nguyễn Thiện Nhân | Trưởng nhóm | Thiết kế giao diện tổng thể, lập trình tất cả file (HTML, CSS, JS), quản lý mã nguồn. | 100% |
| 2 | Ngô Phương Thảo | Thành viên | Làm báo cáo, slide | 90% |
| 3 | Lưu Hoàng Hiệp | Thành viên | Tìm kiếm dữ liệu, hỗ trợ code | 95% |
| 4 | Vũ Văn Thắng | Thành viên | Thuyết trình, hỗ trợ code | 90% |

---

**Kế hoạch phát triển (Roadmap)**
Hoàn thiện giao diện trang chủ và các chức năng Frontend cốt lõi.
Xây dựng hệ thống theme với CSS Variables.
Responsive đầy đủ cho mobile, tablet, desktop.
Phát triển trang danh sách sản phẩm (sanpham.html) với bộ lọc.
Xây dựng trang chi tiết sản phẩm.
Tích hợp Backend (Node.js/PHP) và cơ sở dữ liệu thực.
Thêm tính năng thanh toán trực tuyến (VNPay, MoMo).
Xây dựng trang quản trị (Admin Dashboard).
**Giấy phép**
Dự án được thực hiện cho mục đích học tập thuộc môn Thiết kế Web – Đại học Kinh tế Quốc dân. Mã nguồn có thể được sử dụng tự do cho mục đích tham khảo và phi thương mại.
**Liên hệ**
Email nhóm: thiennhann0006@gmail.com

GitHub: [Vào trang github này để thấy toàn bộ source code nhé](https://github.com/NhanIOT/Web-Nhom-8)

Cảm ơn bạn đã ghé thăm BookGroup8! Chúc bạn có những trải nghiệm mua sắm thú vị.
