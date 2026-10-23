-- ==============================================================================
-- VFT Farms E-Commerce Database Seed Data
-- ==============================================================================

-- Local/demo accounts only. All sample accounts use VftDemo@2026.
-- Never run against production.

INSERT INTO users (full_name, email, phone_number, password_hash, role) VALUES
-- ============================================================================
-- 1. ADMIN ACCOUNTS (Quản trị viên)
-- ============================================================================
(
    'Admin01', 'Admin01@gmail.com', '0910000009',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'ADMIN'
),
(
    'Admin', 'admin00@gmail.com', '0910000000',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'ADMIN'
),
(
    'Bùi Tiến Dũng', 'admin01@example.test', '0910000001',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'ADMIN'
),
(
    'Đặng Thu Thảo', 'admin02@example.test', '0910000002',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'ADMIN'
),

-- ============================================================================
-- 2. STAFF ACCOUNTS (Nhân viên)
-- ============================================================================
(
    'Nguyễn Văn Huy', 'staff01@example.test', '0920000001',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'
),
(
    'Phan Thị Mai', 'staff02@example.test', '0920000002',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'
),
(
    'Đỗ Đức Mạnh', 'staff03@example.test', '0920000003',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'
),

-- ============================================================================
-- 3. CUSTOMER ACCOUNTS (Khách hàng)
-- ============================================================================
(
    'Nguyễn Minh Anh', 'demo.user01@example.test', '0900000001',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'
),
(
    'Trần Hoàng Nam', 'demo.user02@example.test', '0900000002',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'
),
(
    'Lê Thu Hà', 'demo.user03@example.test', '0900000003',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'
),
(
    'Phạm Quốc Bảo', 'demo.user04@example.test', '0900000004',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'
),
(
    'Võ Ngọc Lan', 'demo.user05@example.test', '0900000005',
    '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'
)

ON CONFLICT (email) DO NOTHING;

-- 2. Insert Categories (Parent & Child for Mega Menu)
INSERT INTO categories (id, parent_id, name, slug, description, sort_order) VALUES
-- Parent Categories
(1, NULL, 'Rau củ', 'rau-cu', 'Nông sản rau củ tươi sạch canh tác theo chuẩn VietGAP', 1),
(2, NULL, 'Thịt', 'thit', 'Thịt sạch chăn nuôi tự nhiên an toàn sinh học', 2),
(3, NULL, 'Thuỷ hải sản', 'thuy-hai-san', 'Hải sản tươi sống tự nhiên đánh bắt và nuôi trồng chuẩn', 3),
(4, NULL, 'Trái cây', 'trai-cay', 'Trái cây đặc sản nhiệt đới và theo mùa', 4),
(5, NULL, 'Trứng sữa', 'trung-sua', 'Trứng gà ta, sữa tươi thanh trùng nguyên chất', 5),
(6, NULL, 'Chế biến', 'che-bien', 'Thực phẩm chế biến sẵn sạch lành', 6),

-- Child Categories - Rau củ
(10, 1, 'Rau ăn lá', 'rau-an-la', 'Cải thảo, xà lách, rau muống, cải bó xôi...', 1),
(11, 1, 'Củ quả', 'cu-qua', 'Bí nụ, cà chua, cà rốt, khoai tây...', 2),
(12, 1, 'Rau gia vị', 'rau-gia-vi', 'Hành, ngò, húng quế, sả, ớt...', 3),

-- Child Categories - Thịt
(20, 2, 'Thịt bò', 'thit-bo', 'Thịt bò tươi mềm đạt chuẩn vệ sinh thực phẩm', 1),
(21, 2, 'Thịt lợn', 'thit-lon', 'Thịt lợn thảo mộc, thịt ba chỉ, sườn non', 2),
(22, 2, 'Thịt gà', 'thit-ga', 'Thịt gà ta thả đồi, gà tươi nguyên con', 3),
(23, 2, 'Thịt vịt', 'thit-vit', 'Vịt cỏ sạch thơm ngon', 4)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Products (Accurate to images and specs)
INSERT INTO products (
    id, category_id, name, slug, image_url, unit, specification, 
    price, sale_price, stock_quantity, certification, origin, 
    is_featured, is_best_seller, description
) VALUES
(
    1, 10, 'Bắp cải VietGAP', 'bap-cai-vietgap', 
    '/images/products/cabbage.jpg', 'Kg', 'Túi 1.2kg', 
    33000, 30000, 193.46, 'VietGAP', 'HTX Nông Nghiệp VFT Farms', 
    true, true, 'Bắp cải tươi giòn ngọt tự nhiên, đạt tiêu chuẩn kiểm nghiệm an toàn VietGAP.'
),
(
    2, 10, 'Bắp cải 1.2kg túi hút chân không', 'bap-cai-1-2kg-tui', 
    '/images/products/cabbage.jpg', 'Túi', '1.2kg', 
    38000, 35000, 85.00, 'VfSC', 'VFT Farms Farm 1', 
    true, true, 'Bắp cải chọn lọc đóng gói quy cách 1.2kg tiện lợi cho gia đình.'
),
(
    3, 11, 'Bí nụ tươi sạch', 'bi-nu-tuoi-sach', 
    '/images/products/baby-pumpkin.jpg', 'Kg', 'Túi 300g', 
    45000, 42000, 120.50, 'VietGAP', 'HTX Nông Nghiệp VFT Farms', 
    true, true, 'Bí nụ non ngọt, chế biến các món xào tỏi hoặc nấu canh thanh mát bổ dưỡng.'
),
(
    4, 11, 'Cà chua cherry chín mọng', 'ca-chua-cherry', 
    '/images/products/tomato.jpg', 'Hộp', 'Hộp 500g', 
    29000, 26000, 154.20, 'VfSC', 'VFT Farms Farm 2', 
    true, true, 'Cà chua cherry ngọt thanh, giòn rụm, giàu vitamin C và chất chống oxy hóa.'
),
(
    5, 10, 'Rau cải ngọt canh tác tự nhiên', 'rau-cai-ngot', 
    '/images/products/greens.jpg', 'Kg', 'Túi 500g', 
    22000, 19000, 78.30, 'VietGAP', 'HTX Nông Nghiệp VFT Farms', 
    true, true, 'Rau cải ngọt mềm ngọt, không tồn dư thuốc bảo vệ thực vật.'
),
(
    6, 11, 'Cà rốt Đà Lạt chuẩn VietGAP', 'ca-rot-da-lat', 
    '/images/products/carrot.jpg', 'Kg', 'Túi 1kg', 
    32000, 28000, 142.10, 'VietGAP', 'Đà Lạt Farm VFT', 
    true, true, 'Cà rốt đỏ cam tươi ngon mọng nước, giàu Beta-Carotene bổ dưỡng.'
),
(
    7, 21, 'Thịt ba chỉ lợn sạch thảo mộc', 'thit-ba-chi-lon-sach', 
    '/images/products/pork.jpg', 'Kg', 'Khay 500g', 
    165000, 150000, 62.40, 'VfSC', 'Trang trại Chăn nuôi VFT', 
    true, true, 'Thịt lợn ăn cám thảo mộc, mỡ giòn thịt thơm ngậy không mùi hôi.'
),
(
    8, 20, 'Thịt bò Úc tươi mềm cao cấp', 'thit-bo-uc-tuoi', 
    '/images/products/beef.jpg', 'Kg', 'Khay 500g', 
    280000, 265000, 45.00, 'VietGAP', 'Hợp tác xã VFT Quốc Tế', 
    true, true, 'Bò tươi lát mềm thích hợp xào, nhúng lẩu hoặc nướng thơm phức.'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Policies
INSERT INTO policies (id, title, slug, content, type, sort_order) VALUES
(
    1, 'Cam kết dịch vụ', 'cam-ket-dich-vu',
    'VFT Farms cam kết 100% sản phẩm nông sản và thực phẩm phân phối đều đạt chứng nhận an toàn VietGAP, VfSC hoặc canh tác hữu cơ tự nhiên. Hoàn tiền 100% nếu phát hiện hàng kém chất lượng.',
    'CAM_KET', 1
),
(
    2, 'Chính sách bán hàng', 'chinh-sach-ban-hang',
    'Mọi đơn hàng được tiếp nhận và xử lý nhanh chóng trong vòng 30 phút. Khách hàng có thể mua sắm tiện lợi trực tiếp trên Website hoặc qua Tổng đài hỗ trợ 02432029199.',
    'BAN_HANG', 2
),
(
    3, 'Hình thức & chính sách thanh toán', 'hinh-thuc-thanh-toan',
    'Hỗ trợ thanh toán linh hoạt: COD (Tiền mặt khi nhận hàng), Chuyển khoản ngân hàng trực tiếp qua VietQR, Ví điện tử MoMo, VNPay.',
    'THANH_TOAN', 3
),
(
    4, 'Chính sách đổi trả hàng', 'chinh-sach-doi-tra',
    'Khách hàng được quyền kiểm tra hàng trước khi thanh toán. Đổi trả ngay lập tức trong 24h nếu sản phẩm bị hư hỏng, dập nát do quá trình vận chuyển hoặc không đúng quy cách.',
    'DOI_TRA', 4
),
(
    5, 'Chính sách giao hàng', 'chinh-sach-giao-hang',
    'Giao hàng nhanh nội thành trong vòng 2 giờ cho các đơn hàng tươi sống. Miễn phí giao hàng cho hóa đơn từ 300.000đ.',
    'GIAO_HANG', 5
),
(
    6, 'Chính sách bảo mật', 'chinh-sach-bao-mat',
    'VFT Farms cam kết bảo mật tuyệt đối mọi thông tin cá nhân của khách hàng theo tiêu chuẩn an toàn bảo mật dữ liệu.',
    'BAO_MAT', 6
)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence counters
SELECT setval(
    'users_id_seq',
    COALESCE((SELECT MAX(id) FROM users), 1),
    EXISTS (SELECT 1 FROM users)
);
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('policies_id_seq', (SELECT MAX(id) FROM policies));
SELECT setval('news_id_seq', COALESCE((SELECT MAX(id) FROM news), 1), EXISTS (SELECT 1 FROM news));

