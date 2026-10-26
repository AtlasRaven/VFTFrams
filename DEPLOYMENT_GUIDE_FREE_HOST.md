# 🚀 HƯỚNG DẪN TRIỂN KHAI TOÀN BỘ PROJECT LÊN CLOUD HOST MIỄN PHÍ (FREE 100%)

Dự án **VFT Farms** (E-Commerce Nông Nghiệp Sạch) được thiết kế theo kiến trúc chuẩn Microservices/Monorepo tách biệt:
- **Frontend**: Next.js 16 (App Router, Tailwind CSS v4, Lucide React).
- **Backend**: NestJS 12 (TypeScript, RESTful API, RBAC Role-Based Access Control).
- **Database**: PostgreSQL 16 (Chuẩn 3NF, đầy đủ 100 sản phẩm, 10 danh mục, 52 tin tức, 55 tài khoản, 52 đơn hàng kèm ảnh làm chứng).

---

## 🏗️ 1. Kiến Trúc Hosting Miễn Phí Khuyên Dùng

| Thành phần | Nền tảng Free Hosting | Ưu điểm | Chi phí |
| :--- | :--- | :--- | :--- |
| **Database** | **Supabase** hoặc **Neon.tech** | PostgreSQL 16 bản quyền, 500MB lưu trữ, có sẵn SQL Editor trên Web, hỗ trợ SSL | **0đ (Free trọn đời)** |
| **Backend API** | **Render.com** (hoặc **Koyeb**) | Web Service Node.js / Docker, miễn phí SSL HTTPS, tự động deploy khi git push | **0đ (Free Tier)** |
| **Frontend Web** | **Vercel** | Nền tảng tối ưu tốt nhất cho Next.js, Edge Network toàn cầu, build cực nhanh | **0đ (Free Hobby)** |

---

## 🗄️ BƯỚC 1: Khởi Tạo Database PostgreSQL Miễn Phí (Supabase / Neon)

### Cách 1: Sử dụng Supabase (Khuyên dùng)
1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập bằng tài khoản GitHub hoặc Google.
2. Nhấn **New Project**:
   - **Name**: `vftfarms-db`
   - **Database Password**: Nhập mật khẩu an toàn (ví dụ: `VftFarms@2026Secure`).
   - **Region**: Chọn **Singapore (Southeast Asia)** để có tốc độ truy cập nhanh nhất tại Việt Nam.
3. Vào mục **SQL Editor** ở thanh menu bên trái:
   - Mở tệp [`backend/src/database/init_production_database.sql`](./backend/src/database/init_production_database.sql).
   - Sao chép (Ctrl + A $\rightarrow$ Ctrl + C) toàn bộ nội dung tệp này.
   - Dán vào SQL Editor trên Supabase và nhấn nút **RUN** (hoặc Ctrl + Enter).
   - *Kết quả*: Toàn bộ cấu trúc bảng, 10 danh mục, 100 sản phẩm, 52 tin tức, 55 tài khoản và 52 đơn hàng sẽ được khởi tạo trong 3 giây.
4. Lấy chuỗi kết nối **Connection String**:
   - Vào **Project Settings** $\rightarrow$ **Database** $\rightarrow$ **Connection String** $\rightarrow$ Chọn tab **URI** (chế độ Transaction hoặc Session Pooling port 5432 / 6543).
   - Ví dụ: `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`.

### Cách 2: Sử dụng Neon.tech (Serverless PostgreSQL)
1. Truy cập [https://neon.tech](https://neon.tech) $\rightarrow$ Đăng nhập bằng GitHub.
2. Tạo project mới $\rightarrow$ Vào **SQL Editor** $\rightarrow$ Dán file `init_production_database.sql` và nhấn **Run**.
3. Sao chép chuỗi `DATABASE_URL` từ Dashboard.

---

## ⚙️ BƯỚC 2: Triển Khai Backend NestJS Lên Render.com

1. Đẩy mã nguồn dự án của bạn lên **GitHub** (tạo repository mới, ví dụ: `github.com/your-username/VFTFrams_WebMVC`).
2. Truy cập [https://render.com](https://render.com) $\rightarrow$ Đăng nhập bằng GitHub.
3. Nhấn **New +** $\rightarrow$ Chọn **Web Service**:
   - Kết nối với Repository GitHub của bạn.
   - **Name**: `vftfarms-backend`
   - **Region**: `Singapore (Southeast Asia)`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: `Free` (0.1 CPU, 512 MB RAM)
4. Mục **Environment Variables** (Thêm các biến môi trường sau):
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `DATABASE_URL`: *Dán chuỗi kết nối lấy từ Bước 1 vào đây*
   - `JWT_SECRET`: `vftfarms_super_secure_jwt_key_2026_xyz`
   - `JWT_EXPIRES_IN`: `7d`
   - `JWT_REFRESH_SECRET`: `vftfarms_refresh_token_secure_key_2026`
   - `JWT_REFRESH_EXPIRES_IN`: `30d`
   - `CORS_ORIGIN`: `*`
5. Nhấn **Create Web Service**. Chờ Render build trong khoảng 2 phút.
6. Khi hoàn tất, bạn sẽ nhận được đường dẫn API Backend công khai, ví dụ:
   `https://vftfarms-backend.onrender.com` (Đường dẫn API: `https://vftfarms-backend.onrender.com/api/v1`).

---

## 🌐 BƯỚC 3: Triển Khai Frontend Next.js Lên Vercel

1. Truy cập [https://vercel.com](https://vercel.com) $\rightarrow$ Đăng nhập bằng GitHub.
2. Nhấn **Add New...** $\rightarrow$ **Project**:
   - Chọn Repository GitHub của dự án.
   - **Project Name**: `vftfarms-frontend` (hoặc tên tùy chọn).
   - **Framework Preset**: Tự động nhận diện là `Next.js`.
   - **Root Directory**: Nhấn nút **Edit** và chọn thư mục `frontend`.
3. Mở rộng mục **Environment Variables** và thêm biến sau:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://vftfarms-backend.onrender.com/api/v1` *(Lưu ý: Thay thế bằng URL Backend bạn nhận được ở Bước 2)*.
4. Nhấn nút **Deploy**.
   - Vercel sẽ tự động cài đặt gói, chạy Turbopack build 22 routes và triển khai lên CDN toàn cầu.
   - Sau khoảng 60 giây, bạn sẽ nhận được website hoàn chỉnh hoạt động trực tiếp, ví dụ: `https://vftfarms-frontend.vercel.app`.

---

## 🔐 4. Tài Khoản Mẫu Trải Nghiệm Hệ Thống

Sau khi import cơ sở dữ liệu từ `init_production_database.sql`, hệ thống đã có sẵn các tài khoản sau:

| Vai trò (Role) | Email đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `Admin01@gmail.com` | `Admin@123` | Toàn quyền cấu hình, phân trang mọi danh sách, quản lý người dùng, duyệt đơn, tạo tài khoản STAFF |
| **Nhân viên (STAFF)** | `staff01@example.test` | `123456` | Quản lý sản phẩm, điều phối đơn hàng, tải ảnh chứng từ làm chứng giao hàng, viết tin tức |
| **Khách hàng (CUSTOMER)** | `demo.user01@example.test` | `123456` | Mua sắm nông sản, truy xuất nguồn gốc SHA-256, xem lịch sử đơn hàng có phân trang, sửa thông tin cá nhân |

---

## ✨ 5. Các Tính Năng Nổi Bật Đã Được Tối Ưu Sẵn Sàng Cho Production

1. **Phân trang toàn diện (100% Lists Paginated)**:
   - Sản phẩm khách hàng: 12 sản phẩm/trang.
   - Tin tức cộng đồng: 9 bài viết/trang.
   - Lịch sử đơn hàng khách: 5 đơn/trang.
   - Quản trị đơn hàng Admin: 10 đơn/trang kèm ảnh làm chứng.
   - Quản trị nông sản Admin: 10 sản phẩm/trang với tìm kiếm & lọc danh mục.
   - Quản trị tài khoản Admin: 10 người dùng/trang với bộ lọc vai trò.
   - Quản trị tin tức Admin: 15 bài viết/trang.
2. **Cơ sở dữ liệu đầy đủ ảnh**:
   - 10 danh mục nông nghiệp sạch đạt chuẩn.
   - 100 sản phẩm có ảnh Unsplash & SVG chất lượng cao.
   - 55 tài khoản đều có ảnh đại diện (avatar).
   - Đơn hàng trạng thái `DELIVERED` & `SHIPPING` đều có ảnh chụp chứng từ làm chứng giao nhận.
3. **Cập nhật trạng thái thành công**:
   - Tích hợp thông báo badge, toast alert và modal xác nhận rõ ràng cho mọi thao tác thêm, sửa, xóa, hủy đơn, đổi trạng thái.
