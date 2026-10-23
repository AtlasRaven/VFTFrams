-- ==============================================================================
-- RESTORE CLEAN UTF-8 SEED DATA (PERFECT VIETNAMESE ACCENTS)
-- ==============================================================================

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM news WHERE id > 4;
DELETE FROM products WHERE id > 8;
DELETE FROM categories WHERE id > 23;
DELETE FROM users WHERE id > 12;

-- Reset sequences to current MAX
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products));
SELECT setval('orders_id_seq', 1, false);
SELECT setval('order_items_id_seq', 1, false);
SELECT setval('news_id_seq', (SELECT COALESCE(MAX(id), 1) FROM news));

-- 1. USERS
INSERT INTO users (full_name, email, phone_number, password_hash, role) VALUES
-- Staff & Managers
('Lê Hoàng Nam', 'staff.nam@vftfarms.vn', '0920000010', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'),
('Trần Bích Ngọc', 'staff.ngoc@vftfarms.vn', '0920000011', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'),
('Vũ Đình Trọng', 'staff.trong@vftfarms.vn', '0920000012', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'),
('Nguyễn Hải Yến', 'staff.yen@vftfarms.vn', '0920000013', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'),
('Phạm Quốc Bảo', 'staff.bao@vftfarms.vn', '0920000014', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'STAFF'),
('Đỗ Thùy Trang', 'admin.trang@vftfarms.vn', '0910000015', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'ADMIN'),
-- Customers (Khách hàng khắp các tỉnh thành)
('Ngô Thanh Vân', 'khach.van@gmail.com', '0903111222', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Đặng Quốc Huy', 'khach.huy@gmail.com', '0903222333', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Bùi Phương Linh', 'khach.linh@gmail.com', '0903333444', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Vương Kiến Quốc', 'khach.quoc@gmail.com', '0903444555', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Lý Tiểu Long', 'khach.long@gmail.com', '0903555666', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Hoàng Thị Hạnh', 'khach.hanh@gmail.com', '0903666777', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Dương Minh Châu', 'khach.chau@gmail.com', '0903777888', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Mai Văn Hùng', 'khach.hung@gmail.com', '0903888999', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Trịnh Kim Oanh', 'khach.oanh@gmail.com', '0903999000', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Lâm Khánh Chi', 'khach.chi@gmail.com', '0904000111', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Hồ Gia Bảo', 'khach.bao@gmail.com', '0904111222', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Tô Mỹ Uyên', 'khach.uyen@gmail.com', '0904222333', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Đoàn Văn Hậu', 'khach.hau@gmail.com', '0904333444', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Quang Hải', 'khach.hai@gmail.com', '0904444555', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Phan Văn Đức', 'khach.duc@gmail.com', '0904555666', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Quế Ngọc Hải', 'khach.ngochai@gmail.com', '0904666777', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Lương Xuân Trường', 'khach.truong@gmail.com', '0904777888', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Công Phượng', 'khach.phuong@gmail.com', '0904888999', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Tuấn Anh', 'khach.tuananh@gmail.com', '0904999000', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Hà Đức Chinh', 'khach.chinh@gmail.com', '0905000111', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Tiến Linh', 'khach.linhtien@gmail.com', '0905111222', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Vũ Văn Thanh', 'khach.thanh@gmail.com', '0905222333', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Phong Hồng Duy', 'khach.duy@gmail.com', '0905333444', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Đỗ Duy Mạnh', 'khach.duymanh@gmail.com', '0905444555', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Trần Đình Trọng', 'khach.dinhtrong@gmail.com', '0905555666', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Bùi Tấn Trường', 'khach.tantruong@gmail.com', '0905666777', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Phạm Tuấn Hải', 'khach.tuanhai@gmail.com', '0905777888', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Thành Chung', 'khach.thanhchung@gmail.com', '0905888999', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Bùi Hoàng Việt Anh', 'khach.vietanh@gmail.com', '0905999000', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Thanh Bình', 'khach.thanhbinh@gmail.com', '0906000111', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Hồ Tấn Tài', 'khach.tantai@gmail.com', '0906111222', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nhâm Mạnh Dũng', 'khach.manhdung@gmail.com', '0906222333', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Khuất Văn Khang', 'khach.vankhang@gmail.com', '0906333444', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER'),
('Nguyễn Thái Sơn', 'khach.thaison@gmail.com', '0906444555', '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO', 'CUSTOMER')
ON CONFLICT (email) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Rau Mầm Dinh Dưỡng', 'rau-mam-dinh-duong', 'Các loại mầm củ cải, mầm hướng dương tươi thu hoạch trong ngày', 11),
('Rau Gia Vị & Thảo Mộc', 'rau-gia-vi-thao-moc', 'Húng quế, ngò rí, tía tô, bạc hà, thì là hữu cơ', 12),
('Khoai & Củ Dinh Dưỡng', 'khoai-cu-dinh-duong', 'Khoai lang mật Đà Lạt, khoai tây tím, củ mài, sắn dây', 13),
('Bí & Bầu Hữu Cơ', 'bi-bau-huu-co', 'Bí đỏ hồ lô, bầu sao, mướp hương organic', 14),
('Ớt & Tiêu Tự Nhiên', 'ot-tieu-tu-nhien', 'Ớt chuông Đà Lạt 3 màu, tiêu đen Phú Quốc nguyên hạt', 15),
('Cà Chua Đa Dạng', 'ca-chua-da-dang', 'Cà chua socola, cà chua bi cherry vàng, cà chua beef', 16),
('Hành & Tỏi Bản Địa', 'hanh-toi-ban-dia', 'Tỏi cô đơn Lý Sơn, hành tím Vĩnh Châu, hành boa-rô', 17),
('Ngô & Bắp Ngọt', 'ngo-bap-ngot', 'Bắp nếp tím dẻo, bắp ngọt Mỹ không biến đổi gen', 18),
('Đậu Que & Đậu Hà Lan', 'dau-que-dau-ha-lan', 'Đậu cô-ve, đậu Hà Lan, đậu bắp xanh giòn', 19),
('Măng Tươi & Đọt Mây', 'mang-tuoi-dot-may', 'Măng trúc rừng, măng tây xanh VietGAP, đọt mây Tây Nguyên', 20),
('Dưa Lưới & Dưa Gang', 'dua-luoi-dua-gang', 'Dưa lưới Taki Nhật Bản, dưa gang mật Tiền Giang', 21),
('Bưởi & Cam Mọng Nước', 'buoi-cam-mong-nuoc', 'Bưởi da xanh Bến Tre, cam sành Hàm Yên organic', 22),
('Chuối & Thanh Long', 'chuoi-thanh-long', 'Chuối ngự tiến vua, thanh long ruột đỏ Bình Thuận', 23),
('Xoài & Đu Đủ Cát Chu', 'xoai-du-du-cat-chu', 'Xoài cát Hòa Lộc, đu đủ ruột đỏ tự nhiên', 24),
('Bơ & Sầu Riêng Lâm Đồng', 'bo-sau-rieng-lam-dong', 'Bơ 034 dẻo, sầu riêng Ri6 chín cây không ngâm thuốc', 25),
('Nho & Táo Xanh Ninh Thuận', 'nho-tao-xanh-ninh-thuan', 'Nho đỏ Ba Mọi, táo xanh giòn ngọt tự nhiên', 26),
('Nấm Linh Chi & Đông Trùng', 'nam-linh-chi-dong-trung', 'Nấm dược liệu quý trồng theo chuẩn phòng sạch VFT', 27),
('Mộc Nhĩ & Nấm Hương Khô', 'moc-nhi-nam-huong-kho', 'Nấm hương rừng Sa Pa, mộc nhĩ đen tự nhiên sấy lạnh', 28),
('Hạt Điều & Mắc Ca', 'hat-dieu-mac-ca', 'Hạt điều rang củi Bình Phước, mắc ca nứt vỏ Lâm Đồng', 29),
('Gạo Hữu Cơ ST25', 'gao-huu-co-st25', 'Gạo ngon nhất thế giới ST25 sinh thái lúa tôm', 30),
('Gạo Lứt & Hạt Quinoa', 'gao-lut-hat-quinoa', 'Gạo lứt đỏ Điện Biên, hạt diêm mạch organic bổ dưỡng', 31),
('Đậu Đỗ & Mè Hạt', 'dau-do-me-hat', 'Đậu đen xanh lòng, đậu xanh hạt tiêu, mè đen thuần chủng', 32),
('Mật Ong Rừng & Phấn Hoa', 'mat-ong-rung-phan-hoa', 'Mật ong hoa bạc hà Hà Giang, phấn hoa rừng tự nhiên', 33),
('Trà Xanh & Trà Oolong', 'tra-xanh-tra-oolong', 'Trà Shan Tuyết cổ thụ Suối Giàng, trà Oolong Bảo Lộc', 34),
('Trà Thảo Mộc Sấy Lạnh', 'tra-thao-moc-say-lanh', 'Trà hoa cúc chi, trà atiso đỏ, trà hoa đậu biếc', 35),
('Nước Ép Trái Cây Lên Men', 'nuoc-ep-trai-cay-len-men', 'Kombucha hoa quả nhiệt đới, giấm táo hữu cơ VFT', 36),
('Sữa Hạt & Dinh Dưỡng Thực Vật', 'sua-hat-thuc-vat', 'Bột sữa hạt sen mè đen, ngũ cốc nguyên cám', 37),
('Dầu Thực Vật Ép Lạnh', 'dau-thuc-vat-ep-lanh', 'Dầu mè đen ép nguội, dầu phộng nguyên chất, dầu dừa tinh khiết', 38),
('Muối Khoáng & Đường Mía', 'muoi-khoang-duong-mia', 'Muối hầm Sa Huỳnh, đường phèn kết tinh thủ công', 39),
('Nước Mắm Truyền Thống', 'nuoc-mam-truyen-thong', 'Nước mắm nhỉ cốt cá cơm Phú Quốc 40 độ đạm', 40),
('Tương & Chao Lên Men', 'tuong-chao-len-men', 'Tương bần truyền thống, chao môn béo ngậy thủ công', 41),
('Bún Miến Khô Hữu Cơ', 'bun-mien-kho-huu-co', 'Bún gạo lứt huyết rồng, miến dong Na Rì sạch', 42),
('Bánh & Snack Nông Sản', 'banh-snack-nong-san', 'Chuối sấy giòn không đường, mít sấy thăng hoa VFT', 43),
('Trái Cây Sấy Dẻo', 'trai-cay-say-deo', 'Xoài sấy dẻo ít đường, vỏ bưởi sấy chanh dây', 44),
('Gia Vị Ướp Hữu Cơ', 'gia-vi-uop-huu-co', 'Bột sả, bột gừng, bột nghệ nếp đỏ sẻ Quảng Nam', 45),
('Chế Phẩm Sinh Học Vi Sinh VFT', 'che-pham-sinh-hoc-vft', 'Men vi sinh ủ phân hữu cơ, chế phẩm bảo vệ thực vật sinh học', 46),
('Hạt Giống Bản Địa F1', 'hat-giong-ban-dia', 'Hạt giống rau muống lá tre, cải mơ hoàng mai, ngò rí', 47),
('Dụng Cụ Làm Vườn Mini', 'dung-cu-lam-vuon-mini', 'Chậu xơ dừa, đất sạch hữu cơ cao cấp VFT Soil', 48)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS
INSERT INTO products (category_id, name, slug, image_url, unit, specification, price, sale_price, stock_quantity, certification, origin, is_featured, is_best_seller, description)
VALUES
(1, 'Xà Lách Mỡ Butterhead Thủy Canh', 'xa-lach-mo-butterhead-thuy-canh', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 500g', 45000, 39000, 85.50, 'VietGAP', 'VFT Farms Đà Lạt', true, true, 'Lá mềm mướt, ngọt thanh, trồng trong nhà màng công nghệ cao.'),
(1, 'Cải Bó Xôi Chân Vịt (Spinach)', 'cai-bo-xoi-chan-vit-spinach', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 'Bó', 'Bó 400g', 32000, NULL, 6.00, 'Organic', 'Nông Trại Hữu Cơ Đơn Dương', true, false, 'Giàu sắt và folate, thu hái sáng sớm, lượng tồn kho thấp.'),
(1, 'Cải Thìa Bạch Ngọc', 'cai-thia-bach-ngoc', 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 1kg', 28000, 25000, 140.00, 'VietGAP', 'HTX Rau Sạch Củ Chi', false, true, 'Thân bẹ trắng muốt, giòn ngọt, thích hợp xào tỏi và nấu canh.'),
(2, 'Cà Rốt Baby Hữu Cơ', 'ca-rot-baby-huu-co', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', 'Túi', 'Túi 500g', 38000, 32000, 48.00, 'Organic', 'VFT Farms Đà Lạt', true, true, 'Củ nhỏ xinh, giòn rụm, ngọt lịm, dùng ép nước hoặc ăn sống.'),
(2, 'Củ Dền Đỏ Hữu Cơ', 'cu-den-do-huu-co', 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 1kg', 42000, NULL, 0.00, 'Organic', 'VFT Farms Đà Lạt', false, false, 'Màu đỏ thẫm tự nhiên, giàu chất chống oxy hóa. Tạm hết hàng.'),
(3, 'Nấm Bào Ngư Xám Tươi', 'nam-bao-ngu-xam-tuoi', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp 300g', 28000, 24000, 92.00, 'VietGAP', 'Trang Trại Nấm Củ Chi', false, true, 'Mùi thơm dịu, dai giòn tự nhiên, thu hoạch mỗi ngày.'),
(3, 'Nấm Mối Đen Sinh Học', 'nam-moi-den-sinh-hoc', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp 250g', 85000, 75000, 12.00, 'HACCP', 'VFT Bio Tech Farm', true, true, 'Vị ngọt đậm đà, thịt nấm giòn ngọt như thịt gà, số lượng có hạn.'),
(4, 'Dưa Leo Baby Bao Tử', 'dua-leo-baby-bao-tu', 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp 500g', 30000, NULL, 64.00, 'VietGAP', 'VFT Farms Tiền Giang', false, false, 'Vỏ mỏng không hạt, giòn tan thanh mát.'),
(5, 'Khoai Lang Mật Nướng Đà Lạt', 'khoai-lang-mat-nuong-da-lat', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 1kg', 35000, 29000, 210.00, 'VietGAP', 'Lâm Đồng, VN', false, true, 'Ruột vàng óng, ứa mật khi nướng hoặc hấp.'),
(6, 'Húng Quế & Bạc Hà Hữu Cơ', 'hung-que-bac-ha-huu-co', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80', 'Gói', 'Gói 150g', 15000, NULL, 50.00, 'Organic', 'Vườn Dược Liệu VFT', false, false, 'Mùi thơm nồng đặc trưng, xua đuổi côn trùng tự nhiên.'),
(1, 'Ớt Chuông Đà Lạt 3 Màu', 'ot-chuong-da-lat-3-mau', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80', 'Kg', 'Hộp 3 trái (600g)', 55000, 48000, 75.00, 'VietGAP', 'VFT Farms Đà Lạt', true, true, 'Đỏ, vàng, xanh giòn ngọt, giàu vitamin C.'),
(1, 'Cà Chua Cherry Vàng Hoàng Gia', 'ca-chua-cherry-vang-hoang-gia', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp 500g', 48000, 42000, 38.00, 'VfSC', 'VFT Farms Lâm Đồng', true, true, 'Quả tròn vàng mọng, vị ngọt dịu bùng nổ trong miệng.'),
(1, 'Măng Tây Xanh Thượng Hạng', 'mang-tay-xanh-thuong-hang', 'https://images.unsplash.com/photo-1515471204630-4100c50cf0f2?auto=format&fit=crop&w=600&q=80', 'Bó', 'Bó 500g', 65000, 58000, 18.00, 'VietGAP', 'Ninh Thuận, VN', true, true, 'Ngọn măng non mập mạp, giàu chất xơ và kali.'),
(2, 'Bắp Nếp Tím Nương Dẻo', 'bap-nep-tim-nuong-deo', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80', 'Trái', 'Bắp 3 trái', 25000, 20000, 110.00, 'Organic', 'Vùng Núi Tây Bắc', false, false, 'Hạt tím đậm dẻo thơm, nhiều chất chống oxy hóa Anthocyanin.'),
(2, 'Bí Đỏ Hồ Lô Dẻo Thơm', 'bi-do-ho-lo-deo-thom', 'https://images.unsplash.com/photo-1570586437503-903009b33cb7?auto=format&fit=crop&w=600&q=80', 'Trái', 'Trái 1.2kg - 1.5kg', 32000, NULL, 42.00, 'VietGAP', 'Đồng Nai, VN', false, false, 'Thịt quả đặc ruột dẻo quánh, nấu canh súp béo ngậy.'),
(2, 'Hành Tây Tím Đà Lạt', 'hanh-tay-tim-da-lat', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 1kg', 36000, 30000, 95.00, 'VietGAP', 'VFT Farms Đà Lạt', false, false, 'Vị cay ngọt dịu, ít hăng, trộn salad cực ngon.'),
(2, 'Gừng Sẻ Rừng Hữu Cơ', 'gung-se-rung-huu-co', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 500g', 45000, NULL, 30.00, 'Organic', 'Quảng Nam, VN', false, false, 'Củ nhỏ nhiều nhánh, cay thơm nồng nàn.'),
(2, 'Nghệ Nếp Đỏ Giàu Curcumin', 'nghe-nep-do-giau-curcumin', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 500g', 40000, 35000, 25.00, 'Organic', 'Nghệ An, VN', false, false, 'Màu đỏ cam đậm, hàm lượng curcumin cao gấp 3 lần nghệ thường.'),
(3, 'Tỏi Đen Lên Men Tự Nhiên', 'toi-den-len-men-tu-nhien', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hũ 250g', 180000, 155000, 20.00, 'HACCP', 'Lý Sơn, VN', true, true, 'Lên men 60 ngày theo công nghệ Nhật Bản, ngọt dẻo thơm.'),
(4, 'Dưa Lưới Huỳnh Long Ruột Cam', 'dua-luoi-huynh-long-ruot-cam', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', 'Trái', 'Trái 1.5kg', 115000, 99000, 35.00, 'VietGAP', 'Tiền Giang, VN', true, true, 'Vân lưới đều tăm tắp, độ ngọt 14-16 brix thơm lừng.'),
(4, 'Bưởi Da Xanh Ruột Hồng Bến Tre', 'buoi-da-xanh-ruot-hong-ben-tre', 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=600&q=80', 'Trái', 'Trái 1.4kg - 1.8kg', 75000, 65000, 52.00, 'VietGAP', 'Bến Tre, VN', true, true, 'Tép bưởi mọng nước không múi lép, ngọt thanh không chua.'),
(4, 'Cam Sành Hàm Yên Mọng Nước', 'cam-sanh-ham-yen-mong-nuoc', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 2kg', 60000, 48000, 80.00, 'VietGAP', 'Tuyên Quang, VN', false, true, 'Vỏ mỏng nhiều nước, thích hợp vắt cam nguyên chất mỗi ngày.'),
(4, 'Thanh Long Ruột Đỏ Châu Thành', 'thanh-long-ruot-do-chau-thanh', 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=600&q=80', 'Kg', 'Túi 1.5kg', 55000, 45000, 45.00, 'VietGAP', 'Long An, VN', false, false, 'Đỏ đậm ngọt lịm, giàu vitamin C và chất xơ tự nhiên.'),
(4, 'Chuối Ngự Tiến Vua Chín Cây', 'chuoi-ngu-tien-vua-chin-cay', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', 'Nải', 'Nải 1kg', 35000, 28000, 60.00, 'Organic', 'Hà Nam, VN', false, true, 'Quả nhỏ xinh xắn, vỏ mỏng tanh, thơm nức mũi.'),
(4, 'Bơ Sáp 034 Lâm Đồng Cơm Vàng', 'bo-sap-034-lam-dong-com-vang', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80', 'Kg', 'Kg (2-3 trái)', 80000, 69000, 40.00, 'VietGAP', 'Lâm Đồng, VN', true, true, 'Dài 25-35cm, cơm vàng béo ngậy dẻo quánh, hạt lép.'),
(4, 'Nho Đỏ Ba Mọi Ninh Thuận', 'nho-do-ba-moi-ninh-thuan', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp 1kg', 95000, 82000, 28.00, 'VietGAP', 'Ninh Thuận, VN', true, true, 'Chùm nho căng mọng, vị ngọt thanh mát xen lẫn chua dịu.'),
(4, 'Sầu Riêng Ri6 Chín Tự Nhiên', 'sau-rieng-ri6-chin-tu-nhien', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=600&q=80', 'Trái', 'Trái 2.5kg - 3.2kg', 320000, 285000, 15.00, 'VietGAP', 'Bến Tre, VN', true, true, 'Cơm vàng hạt lép, béo ngậy mùi thơm đặc trưng, cam kết bao ăn.'),
(4, 'Mít Thái Siêu Sớm Cắt Lát', 'mit-thai-sieu-som-cat-lat', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp 500g', 38000, 32000, 40.00, 'VietGAP', 'Tiền Giang, VN', false, false, 'Múi dày cùi giòn, vị ngọt thanh không gắt.'),
(5, 'Gạo Hữu Cơ Sinh Thái ST25 VFT', 'gao-huu-co-sinh-thai-st25-vft', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Túi', 'Túi 5kg', 195000, 175000, 180.00, 'Organic', 'Sóc Trăng, VN', true, true, 'Gạo ngon nhất thế giới, cơm dẻo thơm hương lá dứa tự nhiên.'),
(5, 'Gạo Lứt Huyết Rồng Điện Biên', 'gao-lut-huyet-rong-dien-bien', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Túi', 'Túi 2kg', 85000, 75000, 90.00, 'Organic', 'Điện Biên, VN', false, true, 'Giàu sắt, magie và vitamin B, thích hợp cho người ăn kiêng.'),
(5, 'Hạt Điều Rang Củi Bình Phước', 'hat-dieu-rang-cui-binh-phuoc', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'Hũ', 'Hũ 500g', 145000, 125000, 65.00, 'HACCP', 'Bình Phước, VN', true, true, 'Hạt loại A cồ nguyên hạt rang củi giòn bùi béo ngậy.'),
(5, 'Hạt Mắc Ca Nứt Vỏ Lâm Đồng', 'hat-mac-ca-nut-vo-lam-dong', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80', 'Hũ', 'Hũ 500g', 160000, 139000, 45.00, 'Organic', 'Lâm Đồng, VN', true, true, 'Tặng kèm dụng cụ tách vỏ, giàu axit béo Omega-3 quý giá.'),
(5, 'Đậu Đen Xanh Lòng Thuần Chủng', 'dau-den-xanh-long-thuan-chung', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80', 'Túi', 'Túi 1kg', 65000, 55000, 70.00, 'Organic', 'Đắk Lắk, VN', false, false, 'Hạt nhỏ chắc ruột xanh biếc, nấu chè thanh nhiệt mát gan.'),
(6, 'Mật Ong Hoa Bạc Hà Mèo Vạc', 'mat-ong-hoa-bac-ha-meo-vac', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', 'Chai', 'Chai thủy tinh 500ml', 250000, 219000, 30.00, 'Organic', 'Hà Giang, VN', true, true, 'Màu vàng chanh sóng sánh, mùi thơm mát dịu của hoa bạc hà núi cao.'),
(6, 'Trà Shan Tuyết Cổ Thụ Suối Giàng', 'tra-shan-tuyet-co-thu-suoi-giang', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 'Hộp', 'Hộp thiếc 200g', 220000, 195000, 25.00, 'Organic', 'Yên Bái, VN', true, true, 'Búp trà phủ lớp lông tuyết trắng muốt, nước vàng óng vị ngọt hậu sâu.'),
(6, 'Trà Hoa Cúc Chi Sấy Lạnh', 'tra-hoa-cuc-chi-say-lanh', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', 'Hũ', 'Hũ 100g', 85000, 72000, 55.00, 'Organic', 'Hưng Yên, VN', false, true, 'Bông cúc vàng nguyên vẹn, giúp an thần ngủ ngon giấc.'),
(6, 'Kombucha Lên Men Hoa Quả Nhiệt Đới', 'kombucha-len-men-hoa-qua-nhiet-doi', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', 'Chai', 'Chai 330ml', 45000, 38000, 120.00, 'HACCP', 'VFT Bio Lab', false, true, 'Thức uống lên men giàu lợi khuẩn Probiotics tốt cho hệ tiêu hóa.'),
(6, 'Dầu Mè Đen Nguyên Chất Ép Nguội', 'dau-me-den-nguyen-chat-ep-nguoi', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 'Chai', 'Chai thủy tinh 250ml', 110000, 95000, 40.00, 'Organic', 'Quảng Nam, VN', false, false, 'Ép cơ học không gia nhiệt, giữ trọn vẹn vitamin E và dinh dưỡng.'),
(6, 'Nước Mắm Nhĩ Cá Cơm Phú Quốc 40 Độ Đạm', 'nuoc-mam-nhi-ca-com-phu-quoc', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'Chai', 'Chai thủy tinh 520ml', 95000, 85000, 60.00, 'HACCP', 'Phú Quốc, VN', true, true, 'Ủ chượp thùng gỗ 18 tháng, màu cánh gián đậm đà thuần khiết.'),
(6, 'Bún Gạo Lứt Huyết Rồng Sấy Sạch', 'bun-gao-lut-huyet-rong-say-sach', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', 'Gói', 'Gói 500g', 38000, 32000, 85.00, 'Organic', 'Bình Định, VN', false, true, 'Sợi bún dai giòn tự nhiên không hàn the phẩm màu.'),
(6, 'Xoài Cát Sấy Dẻo Không Đường', 'xoai-cat-say-deo-khong-duong', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 'Túi', 'Túi zip 200g', 65000, 55000, 75.00, 'HACCP', 'Đồng Tháp, VN', true, true, 'Vị chua ngọt dẻo dai tự nhiên, giữ trọn hương vị xoài tươi.'),
(1, 'Chế Phẩm Sinh Học Vi Sinh VFT Bio-Grow', 'che-pham-sinh-hoc-vft-bio-grow', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80', 'Chai', 'Chai 1 lít', 120000, 105000, 50.00, 'HACCP', 'VFT Bio Tech', true, false, 'Kích thích rễ bung khỏe, cải tạo đất bạc màu hữu hiệu.'),
(1, 'Hạt Giống Xà Lách Lô Lô Xanh F1', 'hat-giong-xa-lach-lo-lo-xanh-f1', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80', 'Gói', 'Gói 5g (khoảng 1000 hạt)', 25000, 20000, 150.00, 'VietGAP', 'VFT Seeds', false, false, 'Tỷ lệ nảy mầm > 90%, kháng sâu bệnh mạnh mẽ.'),
(1, 'Đất Sạch Hữu Cơ Vi Sinh VFT Soil', 'dat-sach-huu-co-vi-sinh-vft-soil', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80', 'Bao', 'Bao 20dm3 (khoảng 10kg)', 55000, 48000, 110.00, 'VietGAP', 'VFT Eco Lab', false, true, 'Phối trộn sẵn phân trùn quế, mụn dừa và nấm đối kháng Trichoderma.')
ON CONFLICT (slug) DO NOTHING;

-- 4. ORDERS
INSERT INTO orders (order_code, user_id, recipient_name, recipient_phone, shipping_address, notes, subtotal, shipping_fee, total_amount, payment_method, payment_status, order_status, proof_image_url, proof_note, created_at) VALUES
('ORD-2026-0001', 1, 'Ngô Thanh Vân', '0903111222', '120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'Giao giờ hành chính lên lầu 4', 320000, 0, 320000, 'COD', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chụp kiện hàng và khách ký nhận đầy đủ tại quầy lễ tân', NOW() - INTERVAL '15 days'),
('ORD-2026-0002', 2, 'Đặng Quốc Huy', '0903222333', '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'Để trước cửa bảo vệ nếu không nghe máy', 195000, 25000, 220000, 'BANK_TRANSFER', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Gửi bác bảo vệ ca trực sáng ký biên bản bàn giao thùng xốp lạnh', NOW() - INTERVAL '14 days'),
('ORD-2026-0003', 3, 'Bùi Phương Linh', '0903333444', '88 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh', 'Bọc kĩ rau mầm giúp mình', 285000, 0, 285000, 'VNPAY', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Đã chụp đối chiếu mã đơn trên hóa đơn đóng gói kèm tem VietGAP', NOW() - INTERVAL '13 days'),
('ORD-2026-0004', 4, 'Vương Kiến Quốc', '0903444555', '12 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. HCM', 'Giao trước 11h sáng để kịp nấu cơm', 410000, 0, 410000, 'COD', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Khách đã thanh toán tiền mặt 410k, có hình ảnh phiếu thu', NOW() - INTERVAL '12 days'),
('ORD-2026-0005', 5, 'Lý Tiểu Long', '0903555666', '72 Hoàng Hoa Thám, Phường 7, Quận Bình Thạnh, TP. HCM', 'Nhà có chuông cổng màu xanh', 150000, 25000, 175000, 'MOMO', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Giao tận tay người nhận có chụp ảnh kèm thùng hàng nguyên vẹn', NOW() - INTERVAL '11 days'),
('ORD-2026-0006', 6, 'Hoàng Thị Hạnh', '0903666777', '215 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP. HCM', 'Cần hóa đơn VAT gửi qua email', 520000, 0, 520000, 'BANK_TRANSFER', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Đã chụp phiếu xuất kho và chữ ký kế toán nhận hàng', NOW() - INTERVAL '10 days'),
('ORD-2026-0007', 7, 'Dương Minh Châu', '0903777888', '140 Pasteur, Bến Nghé, Quận 1, TP. HCM', 'Hàng tươi sống giao sớm', 290000, 25000, 315000, 'COD', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã thu tiền COD đủ và gửi ảnh chụp túi nông sản sạch', NOW() - INTERVAL '9 days'),
('ORD-2026-0008', 8, 'Mai Văn Hùng', '0903888999', '55 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP. HCM', 'Gọi trước khi đến 15 phút', 680000, 0, 680000, 'VNPAY', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Đã giao 3 thùng xốp sầu riêng Ri6 và bơ sáp an toàn', NOW() - INTERVAL '8 days'),
('ORD-2026-0009', 9, 'Trịnh Kim Oanh', '0903999000', '18bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP. HCM', '', 210000, 25000, 235000, 'COD', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Giao hàng thành công có chữ ký biên nhận', NOW() - INTERVAL '7 days'),
('ORD-2026-0010', 10, 'Lâm Khánh Chi', '0904000111', '33 Lê Văn Sỹ, Phường 13, Quận 3, TP. HCM', 'Giao cổng số 2', 340000, 0, 340000, 'MOMO', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chụp ảnh gói hàng tại bàn giao nhận chung cư', NOW() - INTERVAL '6 days'),

-- Trạng thái SHIPPING (Đang giao hàng)
('ORD-2026-0011', 11, 'Hồ Gia Bảo', '0904111222', '102 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. HCM', 'Giao gấp buổi trưa', 450000, 0, 450000, 'COD', 'PENDING', 'SHIPPING', NULL, 'Shipper Nguyễn Văn Bình đang di chuyển giao hàng', NOW() - INTERVAL '3 hours'),
('ORD-2026-0012', 12, 'Tô Mỹ Uyên', '0904222333', '26 Phạm Ngọc Thạch, Phường 6, Quận 3, TP. HCM', 'Gọi số bàn 028.382211', 185000, 25000, 210000, 'BANK_TRANSFER', 'PAID', 'SHIPPING', NULL, 'Đã xuất kho bãi Quận 3 lúc 14:00', NOW() - INTERVAL '2 hours'),
('ORD-2026-0013', 13, 'Đoàn Văn Hậu', '0904333444', '48 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, TP. HCM', '', 390000, 0, 390000, 'VNPAY', 'PAID', 'SHIPPING', NULL, 'Đang trên xe chuyên dụng bảo ôn nhiệt độ 16 độ C', NOW() - INTERVAL '1 hours'),
('ORD-2026-0014', 14, 'Nguyễn Quang Hải', '0904444555', '99 Võ Thị Sáu, Phường 6, Quận 3, TP. HCM', 'Khách dặn bấm chuông ngoài', 270000, 25000, 295000, 'COD', 'PENDING', 'SHIPPING', NULL, 'Shipper Trần Văn Tùng đang giao', NOW() - INTERVAL '40 minutes'),
('ORD-2026-0015', 15, 'Phan Văn Đức', '0904555666', '15 Nguyễn Thị Diệu, Phường 6, Quận 3, TP. HCM', 'Kèm thêm đá gel giữ lạnh', 620000, 0, 620000, 'MOMO', 'PAID', 'SHIPPING', NULL, 'Đã rời trạm trung chuyển trung tâm', NOW() - INTERVAL '30 minutes'),
('ORD-2026-0016', 16, 'Quế Ngọc Hải', '0904666777', '180 Cao Thắng, Phường 12, Quận 10, TP. HCM', 'Giao trước 17h chiều', 310000, 0, 310000, 'COD', 'PENDING', 'SHIPPING', NULL, 'Shipper đang trên đường vận chuyển', NOW() - INTERVAL '25 minutes'),
('ORD-2026-0017', 17, 'Lương Xuân Trường', '0904777888', '290 Lý Thường Kiệt, Phường 14, Quận 10, TP. HCM', '', 540000, 0, 540000, 'BANK_TRANSFER', 'PAID', 'SHIPPING', NULL, 'Đơn hàng đang giao', NOW() - INTERVAL '20 minutes'),
('ORD-2026-0018', 18, 'Nguyễn Công Phượng', '0904888999', '14 Nguyễn Văn Cừ, Phường Cầu Kho, Quận 1, TP. HCM', 'Để trước cửa phòng 402', 225000, 25000, 250000, 'VNPAY', 'PAID', 'SHIPPING', NULL, 'Đang điều phối giao hàng', NOW() - INTERVAL '15 minutes'),

-- Trạng thái PROCESSING (Đang đóng gói)
('ORD-2026-0019', 19, 'Nguyễn Tuấn Anh', '0904999000', '77 Nguyễn Thái Bình, Phường 4, Tân Bình, TP. HCM', 'Chọn quả cà chua vàng mọng giúp', 320000, 0, 320000, 'COD', 'PENDING', 'PROCESSING', NULL, 'Nhân viên kho đang phân loại và hút chân không', NOW() - INTERVAL '2 hours'),
('ORD-2026-0020', 20, 'Hà Đức Chinh', '0905000111', '104 Phổ Quang, Phường 2, Tân Bình, TP. HCM', '', 190000, 25000, 215000, 'MOMO', 'PAID', 'PROCESSING', NULL, 'Đang bọc túi xốp chống sốc cho dưa lưới Huỳnh Long', NOW() - INTERVAL '1 hours'),
('ORD-2026-0021', 21, 'Nguyễn Tiến Linh', '0905111222', '58 Bạch Đằng, Phường 2, Tân Bình, TP. HCM', 'Cần gấp trước 18h', 470000, 0, 470000, 'BANK_TRANSFER', 'PAID', 'PROCESSING', NULL, 'Đã chuẩn bị xong hàng, chờ bàn giao đội giao vận', NOW() - INTERVAL '50 minutes'),
('ORD-2026-0022', 22, 'Vũ Văn Thanh', '0905222333', '12 Thăng Long, Phường 4, Tân Bình, TP. HCM', 'Lựa măng tây non mập', 360000, 0, 360000, 'VNPAY', 'PAID', 'PROCESSING', NULL, 'Đang dán tem mã QR truy xuất SHA-256', NOW() - INTERVAL '35 minutes'),
('ORD-2026-0023', 23, 'Nguyễn Phong Hồng Duy', '0905333444', '85 Cộng Hòa, Phường 4, Tân Bình, TP. HCM', '', 240000, 25000, 265000, 'COD', 'PENDING', 'PROCESSING', NULL, 'Đang sơ chế kiểm tra lá sâu trước khi đóng gói', NOW() - INTERVAL '20 minutes'),
('ORD-2026-0024', 24, 'Đỗ Duy Mạnh', '0905444555', '39 Trường Chinh, Phường 11, Tân Bình, TP. HCM', 'Giao kèm hóa đơn', 580000, 0, 580000, 'BANK_TRANSFER', 'PAID', 'PROCESSING', NULL, 'Đang xếp thùng lạnh bảo ôn', NOW() - INTERVAL '10 minutes'),

-- Trạng thái CONFIRMED (Đã xác nhận)
('ORD-2026-0025', 25, 'Trần Đình Trọng', '0905555666', '12 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. HCM', 'Khách yêu cầu gọi trước', 420000, 0, 420000, 'COD', 'PENDING', 'CONFIRMED', NULL, 'Nhân viên CSKH đã liên hệ xác nhận đơn qua điện thoại', NOW() - INTERVAL '3 hours'),
('ORD-2026-0026', 26, 'Bùi Tấn Trường', '0905666777', '68 Phan Xích Long, Phường 2, Phú Nhuận, TP. HCM', '', 210000, 25000, 235000, 'VNPAY', 'PAID', 'CONFIRMED', NULL, 'Đã nhận chuyển khoản VNPAY thành công', NOW() - INTERVAL '2 hours'),
('ORD-2026-0027', 27, 'Phạm Tuấn Hải', '0905777888', '115 Hoa Lan, Phường 2, Phú Nhuận, TP. HCM', 'Giao sáng mai', 380000, 0, 380000, 'MOMO', 'PAID', 'CONFIRMED', NULL, 'Đã lên lịch xuất kho ca sáng', NOW() - INTERVAL '1 hours'),
('ORD-2026-0028', 28, 'Nguyễn Thành Chung', '0905888999', '204 Hoa Sứ, Phường 7, Phú Nhuận, TP. HCM', '', 175000, 25000, 200000, 'COD', 'PENDING', 'CONFIRMED', NULL, 'Chờ kho chính duyệt xuất hàng', NOW() - INTERVAL '45 minutes'),
('ORD-2026-0029', 29, 'Bùi Hoàng Việt Anh', '0905999000', '42 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP. HCM', 'Đơn đặt định kỳ hàng tuần', 630000, 0, 630000, 'BANK_TRANSFER', 'PAID', 'CONFIRMED', NULL, 'Đã xác nhận thanh toán ngân hàng', NOW() - INTERVAL '30 minutes'),
('ORD-2026-0030', 30, 'Nguyễn Thanh Bình', '0906000111', '88 Huỳnh Văn Bánh, Phường 15, Phú Nhuận, TP. HCM', '', 295000, 25000, 320000, 'COD', 'PENDING', 'CONFIRMED', NULL, 'Đã chuyển phiếu in kho đóng gói', NOW() - INTERVAL '15 minutes'),

-- Trạng thái PENDING (Chờ xác nhận)
('ORD-2026-0031', 31, 'Hồ Tấn Tài', '0906111222', '15 Thảo Điền, Phường Thảo Điền, TP. Thủ Đức, TP. HCM', 'Nhà trong hẻm xe hơi vào được', 480000, 0, 480000, 'COD', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '50 minutes'),
('ORD-2026-0032', 32, 'Nhâm Mạnh Dũng', '0906222333', '24 Quốc Hương, Phường Thảo Điền, TP. Thủ Đức, TP. HCM', '', 220000, 25000, 245000, 'BANK_TRANSFER', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '40 minutes'),
('ORD-2026-0033', 33, 'Khuất Văn Khang', '0906333444', '89 Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP. HCM', 'Chọn rau tươi mới hái', 310000, 0, 310000, 'COD', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '30 minutes'),
('ORD-2026-0034', 34, 'Nguyễn Thái Sơn', '0906444555', '50 Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. HCM', 'Khách chuyển khoản sau', 160000, 25000, 185000, 'BANK_TRANSFER', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '25 minutes'),
('ORD-2026-0035', 1, 'Ngô Thanh Vân', '0903111222', '120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. HCM', 'Đặt thêm nấm bào ngư và gạo ST25', 510000, 0, 510000, 'VNPAY', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '20 minutes'),
('ORD-2026-0036', 2, 'Đặng Quốc Huy', '0903222333', '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. HCM', '', 390000, 0, 390000, 'COD', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '15 minutes'),
('ORD-2026-0037', 3, 'Bùi Phương Linh', '0903333444', '88 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. HCM', '', 180000, 25000, 205000, 'MOMO', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '10 minutes'),
('ORD-2026-0038', 4, 'Vương Kiến Quốc', '0903444555', '12 Điện Biên Phủ, Phường 15, Bình Thạnh, TP. HCM', 'Giao buổi tối sau 18h', 335000, 0, 335000, 'COD', 'PENDING', 'PENDING', NULL, NULL, NOW() - INTERVAL '5 minutes'),

-- Trạng thái CANCELLED (Đã hủy - ví dụ khách đổi ý hoặc sai địa chỉ)
('ORD-2026-0039', 5, 'Lý Tiểu Long', '0903555666', '72 Hoàng Hoa Thám, Phường 7, Bình Thạnh, TP. HCM', 'Khách bận đi công tác đột xuất', 260000, 25000, 285000, 'COD', 'FAILED', 'CANCELLED', NULL, 'Khách hàng hủy đơn, hệ thống đã tự động hoàn trả tồn kho sản phẩm', NOW() - INTERVAL '4 days'),
('ORD-2026-0040', 6, 'Hoàng Thị Hạnh', '0903666777', '215 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP. HCM', 'Đặt trùng 2 đơn liền nhau', 420000, 0, 420000, 'BANK_TRANSFER', 'REFUNDED', 'CANCELLED', NULL, 'Đã hoàn tiền 100% qua tài khoản ngân hàng của khách', NOW() - INTERVAL '3 days'),
('ORD-2026-0041', 7, 'Dương Minh Châu', '0903777888', '140 Pasteur, Bến Nghé, Quận 1, TP. HCM', 'Khách đổi sang mua combo tuần', 315000, 0, 315000, 'MOMO', 'REFUNDED', 'CANCELLED', NULL, 'Đã hủy và hoàn tiền ví điện tử MoMo', NOW() - INTERVAL '2 days'),
('ORD-2026-0042', 8, 'Mai Văn Hùng', '0903888999', '55 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP. HCM', 'Sai số điện thoại không liên lạc được', 190000, 25000, 215000, 'COD', 'FAILED', 'CANCELLED', NULL, 'Hủy tự động do không liên lạc được khách sau 3 lần gọi', NOW() - INTERVAL '1 days'),
('ORD-2026-0043', 9, 'Trịnh Kim Oanh', '0903999000', '18bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP. HCM', 'Thay đổi địa chỉ nhận hàng xa hơn', 280000, 0, 280000, 'COD', 'FAILED', 'CANCELLED', NULL, 'Hủy đơn cũ theo yêu cầu khách để tạo đơn mới', NOW() - INTERVAL '12 hours'),

-- Thêm các đơn hàng giao thành công khác để đạt đủ 50 đơn
('ORD-2026-0044', 10, 'Lâm Khánh Chi', '0904000111', '33 Lê Văn Sỹ, Phường 13, Quận 3, TP. HCM', 'Giao hỏa tốc 2 giờ', 490000, 0, 490000, 'VNPAY', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chụp kiện hàng và chữ ký người nhận thành công', NOW() - INTERVAL '5 days'),
('ORD-2026-0045', 11, 'Hồ Gia Bảo', '0904111222', '102 Nguyễn Du, Bến Nghé, Quận 1, TP. HCM', '', 230000, 25000, 255000, 'COD', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Thu tiền mặt tại sảnh tòa nhà', NOW() - INTERVAL '4 days'),
('ORD-2026-0046', 12, 'Tô Mỹ Uyên', '0904222333', '26 Phạm Ngọc Thạch, Quận 3, TP. HCM', '', 365000, 0, 365000, 'BANK_TRANSFER', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Đã chụp biên bản bàn giao đầy đủ hàng', NOW() - INTERVAL '3 days'),
('ORD-2026-0047', 13, 'Đoàn Văn Hậu', '0904333444', '48 Trần Hưng Đạo, Quận 1, TP. HCM', '', 415000, 0, 415000, 'MOMO', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Giao hàng thành công', NOW() - INTERVAL '2 days'),
('ORD-2026-0048', 14, 'Nguyễn Quang Hải', '0904444555', '99 Võ Thị Sáu, Quận 3, TP. HCM', '', 280000, 0, 280000, 'VNPAY', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'Khách xác nhận nhận hàng hài lòng', NOW() - INTERVAL '1 days'),
('ORD-2026-0049', 15, 'Phan Văn Đức', '0904555666', '15 Nguyễn Thị Diệu, Quận 3, TP. HCM', '', 530000, 0, 530000, 'COD', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1566576912321-d58ddd743088?auto=format&fit=crop&w=600&q=80', 'Giao hàng thành công kèm quà tặng hạt giống VFT', NOW() - INTERVAL '18 hours'),
('ORD-2026-0050', 16, 'Quế Ngọc Hải', '0904666777', '180 Cao Thắng, Quận 10, TP. HCM', '', 345000, 0, 345000, 'BANK_TRANSFER', 'PAID', 'DELIVERED', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'Đã chuyển hàng hoàn tất', NOW() - INTERVAL '8 hours')
ON CONFLICT (order_code) DO NOTHING;

-- 5. ORDER ITEMS
-- 5. ORDER_ITEMS (Gán chi tiết sản phẩm cho các đơn hàng)
INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
SELECT o.id, p.id, p.name, COALESCE(p.sale_price, p.price), 2, COALESCE(p.sale_price, p.price) * 2
FROM orders o
CROSS JOIN LATERAL (
    SELECT id, name, price, sale_price FROM products ORDER BY RANDOM() LIMIT 2
) p
WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id);



-- 6. NEWS
INSERT INTO news (title, slug, summary, content, thumbnail_url, category, is_published, views, author_id) VALUES
('Ứng dụng men vi sinh VFT Bio trong cải tạo đất phèn mặn', 'ung-dung-men-vi-sinh-vft-bio-trong-cai-tao-dat-phen-man', 'Giải pháp sinh học bền vững giúp hàng ngàn hecta đất canh tác đồng bằng sông Cửu Long hồi sinh màu mỡ.', '<h2>Thực trạng đất phèn mặn tại miền Tây</h2><p>Đất đai bị thoái hóa do biến đổi khí hậu và lạm dụng phân bón vô cơ. Vi sinh vật có ích bị tiêu diệt khiến rễ cây khó hấp thụ dinh dưỡng.</p><h3>Hiệu quả vượt trội của men VFT</h3><p>Công nghệ vi sinh đa chủng VFT giúp phân giải độc tố phèn, cố định đạm tự nhiên và tăng độ tơi xốp cho đất chỉ sau 3 tuần sử dụng.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 185, 1),
('Khai trương nông trại sinh thái trải nghiệm VFT Eco Farm Tiền Giang', 'khai-truong-nong-trai-sinh-thai-vft-eco-farm-tien-giang', 'Điểm đến lý tưởng cho các gia đình trải nghiệm tự tay thu hoạch dưa lưới, rau quả sạch chuẩn organic vào cuối tuần.', '<h2>Trải nghiệm nông nghiệp xanh thực thụ</h2><p>Với diện tích hơn 15 hecta, VFT Eco Farm Tiền Giang mở cửa đón khách tham quan, học tập mô hình canh tác tuần hoàn không rác thải.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 420, 1),
('Thông báo lịch thu hoạch và trả đơn rau sạch dịp Tết Nguyên Đán 2026', 'thong-bao-lich-thu-hoach-tet-nguyen-dan-2026', 'Chi tiết khung giờ giao nhận và cam kết bình ổn giá toàn bộ mặt hàng rau củ quả trong tuần cao điểm cận Tết.', '<h2>Cam kết bình ổn giá và nguồn cung dồi dào</h2><p>VFT Farms cam kết không tăng giá bất kỳ sản phẩm nào trong dịp Tết, đảm bảo nguồn rau sạch cho mâm cơm gia đình Việt.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 530, 1),
('Lợi ích bất ngờ của nấm mối đen đối với sức khỏe tim mạch và đề kháng', 'loi-ich-bat-ngo-cua-nam-moi-den-doi-voi-suc-khoe', 'Nấm mối đen được mệnh danh là vàng đen trong ẩm thực dưỡng sinh nhờ hàm lượng beta-glucan và khoáng chất dồi dào.', '<h2>Giá trị dinh dưỡng của nấm mối đen</h2><p>Chứa nhiều axit amin thiết yếu, vitamin nhóm B và chất chống oxy hóa giúp hạ cholesterol xấu và tăng cường miễn dịch.</p>', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 275, 1),
('Gạo ST25 sinh thái VFT Farms đạt chứng nhận Hữu cơ Quốc tế USDA', 'gao-st25-sinh-thai-dat-chung-nhan-usda', 'Thành quả tự hào khẳng định chất lượng hạt gạo Việt Nam trên bản đồ nông sản sạch thế giới.', '<h2>Quy trình kiểm định khắt khe</h2><p>Vượt qua hơn 500 chỉ tiêu về dư lượng thuốc bảo vệ thực vật và kim loại nặng để đạt chứng nhận USDA danh giá.</p>', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 610, 1),
('5 Cách phân biệt cà chua chín tự nhiên và cà chua ủ hóa chất', '5-cach-phan-biet-ca-chua-chin-tu-nhien', 'Mẹo nhận biết cà chua an toàn qua cuống lá, độ mềm và màu sắc hạt bên trong quả.', '<h2>Quan sát cuống và hạt cà chua</h2><p>Cà chua chín tự nhiên cuống luôn tươi xanh bám chặt, ruột quả có hạt màu vàng xanh và lớp thạch trong suốt.</p>', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 340, 1),
('Chương trình Ngày Hội Nông Dân Số: Kết nối chuỗi giá trị nông nghiệp 4.0', 'ngay-hoi-nong-dan-so-ket-noi-chuoi-gia-tri-4-0', 'VFT Farms đồng hành cùng hơn 300 hợp tác xã nông nghiệp ứng dụng mã băm SHA-256 truy xuất nguồn gốc.', '<h2>Chuyển đổi số trong canh tác nông nghiệp</h2><p>Ứng dụng cảm biến IoT theo dõi độ ẩm đất và nhật ký canh tác điện tử minh bạch trên chuỗi khối.</p>', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 195, 1),
('Thông báo chính sách ưu đãi thành viên VIP VFT Green Club', 'thong-bao-chinh-sach-vip-vft-green-club', 'Tích điểm đổi quà nông sản, miễn phí vận chuyển trọn năm và ưu tiên giao hỏa tốc cho thành viên thân thiết.', '<h2>Đặc quyền thành viên Green Club</h2><p>Giảm thêm 5% cho mọi hóa đơn và nhận giỏ quà nông sản đặc sản vùng miền mỗi quý.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 150, 1),
('Bảo quản quả bơ sáp 034 đúng cách để không bị thối đầu hay đắng', 'bao-quan-bo-sap-034-dung-cach', 'Cách ủ bơ chín đều tự nhiên bằng khăn ẩm và cách cấp đông bơ dùng cả năm làm sinh tố.', '<h2>Bí quyết ủ bơ chín ngon nhất</h2><p>Không cho bơ vào túi nilon kín. Đặt bơ nơi thoáng mát, lót khăn giấy ẩm để vỏ bơ chín đều từ cuống đến đuôi.</p>', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 410, 1),
('Nâng cấp hệ thống kho lạnh trung tâm tại TP. Hồ Chí Minh lên 500 tấn', 'nang-cap-kho-lanh-trung-tam-tphcm-500-tan', 'Đảm bảo nông sản luôn được bảo quản trong điều kiện tối ưu từ 14 - 18 độ C ngay sau khi rời vườn.', '<h2>Hiện đại hóa chuỗi cung ứng lạnh Cold Chain</h2><p>Trang bị hệ thống kiểm soát nhiệt ẩm tự động 24/7 giúp rau củ giữ nguyên độ tươi ngon khi tới tay người tiêu dùng.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 280, 1),
('Hướng dẫn làm phân bón hữu cơ từ rác nhà bếp siêu đơn giản', 'huong-dan-lam-phan-bon-huu-co-tai-nha', 'Tận dụng vỏ rau củ quả thừa ủ cùng men vi sinh VFT để bón cây ban công xanh mướt.', '<h2>Quy trình ủ phân không mùi hôi</h2><p>Sử dụng thùng xốp có lỗ thoát khí, bổ sung men Trichoderma VFT để phân hủy rác hữu cơ chỉ trong 15 ngày.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 365, 1),
('Thông báo tuyển dụng Kỹ sư Nông nghiệp Công nghệ cao làm việc tại Đà Lạt', 'thong-bao-tuyen-dung-ky-su-nong-nghiep-da-lat', 'Gia nhập đội ngũ nghiên cứu và phát triển mô hình nhà kính tự động hóa tại VFT Farms Lâm Đồng.', '<h2>Môi trường làm việc chuyên nghiệp</h2><p>Chế độ đãi ngộ hấp dẫn, cơ hội tham gia các dự án hợp tác nông nghiệp sạch cùng đối tác Israel và Nhật Bản.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 110, 1),
('Tại sao nên ăn rau củ quả đúng mùa vụ tự nhiên?', 'tai-sao-nen-an-rau-cu-dung-mua-vu', 'Những giá trị dinh dưỡng cao nhất và hạn chế tối đa nguy cơ tồn dư hóa chất khi lựa chọn nông sản thuận tự nhiên.', '<h2>Thuận tự nhiên là bài thuốc tốt nhất</h2><p>Rau củ chính vụ sinh trưởng trong điều kiện khí hậu phù hợp nhất nên tích lũy nhiều vitamin và khoáng chất tự nhiên nhất.</p>', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 290, 1),
('VFT Farms tài trợ 1000 cây giống bản địa cho dự án phủ xanh đồi trọc Tây Bắc', 'vft-farms-tai-tro-1000-cay-giong-tay-bac', 'Hành động thiết thực bảo vệ môi trường sinh thái và tạo sinh kế bền vững cho đồng bào vùng cao.', '<h2>Trách nhiệm xã hội vì một Việt Nam xanh</h2><p>Chuyến đi ý nghĩa của cán bộ nhân viên VFT Farms kết hợp trao tặng cây giống bản địa và chuyển giao kỹ thuật ủ phân sinh học.</p>', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 480, 1),
('Cảnh giác chiêu trò mạo danh thương hiệu VFT Farms bán hàng kém chất lượng', 'canh-giac-mao-danh-thuong-hieu-vft-farms', 'Khuyến cáo quý khách hàng chỉ mua hàng qua website chính thức và quét mã SHA-256 để kiểm định.', '<h2>Cách nhận biết kênh phân phối chính thức</h2><p>Mọi sản phẩm VFT Farms đều có hóa đơn mã đơn #ORD-... và mã xác thực nguồn gốc mật mã học SHA-256 duy nhất.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 520, 1),
('Nước ép cần tây: Uống sao cho đúng cách để thải độc và sáng da', 'nuoc-ep-can-tay-dung-cach-thai-doc', 'Liều lượng phù hợp và thời điểm vàng trong ngày giúp cơ thể hấp thu trọn vẹn chất chống oxy hóa từ cần tây.', '<h2>Uống vào buổi sáng khi bụng đói</h2><p>Một ly 250ml nước ép cần tây nguyên chất trước bữa ăn sáng 30 phút giúp kích thích nhu động ruột và cân bằng điện giải.</p>', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 460, 1),
('Mô hình nuôi trùn quế xử lý phụ phẩm nông nghiệp khép kín tại VFT', 'mo-hinh-nuoi-trun-que-khep-kin-tai-vft', 'Cách VFT Farms biến toàn bộ vỏ rau củ quả thải loại thành phân trùn quế giàu dinh dưỡng cho vụ mùa sau.', '<h2>Kinh tế tuần hoàn trong nông nghiệp</h2><p>Không có gì bị vứt bỏ. Phân trùn quế giúp cây trồng tăng sức đề kháng tự nhiên với nấm bệnh trong đất.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 215, 1),
('Thông báo nâng cấp tổng đài hỗ trợ khách hàng miễn phí 1800 6868', 'thong-bao-nang-cap-tong-dai-mien-phi-1800-6868', 'Kênh hỗ trợ giải đáp khiếu nại, tư vấn dinh dưỡng và chăm sóc đơn hàng hoạt động liên tục từ 7h00 đến 21h00.', '<h2>Nâng cao chất lượng phục vụ khách hàng</h2><p>Tổng đài miễn hoàn toàn cước gọi cho người dùng trên toàn quốc, kết nối trực tiếp với chuyên viên tư vấn.</p>', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', true, 175, 1),
('Tự trồng rau mầm tại nhà: Thu hoạch sau 5 ngày siêu dễ', 'tu-trong-rau-mam-tai-nha-5-ngay', 'Hướng dẫn chi tiết từ khâu ngâm hạt, chuẩn bị giá thể xơ dừa đến cách tưới ẩm cho rau mầm xanh mướt.', '<h2>Rau mầm củ cải trắng và hướng dương</h2><p>Hàm lượng dinh dưỡng trong rau mầm cao gấp 5 lần rau trưởng thành. Thích hợp cho các bữa ăn healthy tại nhà.</p>', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', true, 395, 1),
('Đoàn chuyên gia Nông nghiệp Nhật Bản tham quan mô hình VietGAP VFT Farms', 'doan-chuyen-gia-nhat-ban-tham-quan-vft-farms', 'Đánh giá cao hệ thống truy xuất nguồn gốc SHA-256 và mở ra cơ hội xuất khẩu nông sản sạch sang thị trường Tokyo.', '<h2>Đạt chuẩn chất lượng xuất khẩu</h2><p>Các chuyên gia đánh giá cao tính minh bạch và độ ngọt tự nhiên của dưa lưới Huỳnh Long và ớt chuông Đà Lạt.</p>', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', true, 580, 1),
('Kế hoạch khảo sát mở rộng vùng trồng dược liệu quý tại Sa Pa (Bản nháp)', 'ke-hoach-khao-sat-vung-trong-sa-pa-draft', 'Nội dung dự thảo chiến lược phát triển cây thuốc bản địa và hợp tác cùng bà con dân tộc thiểu số Tây Bắc.', '<h2>Dự thảo chiến lược nội bộ</h2><p>Đang trong quá trình khảo sát thực địa thổ nhưỡng và khí hậu vùng núi Hoàng Liên Sơn.</p>', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80', 'TIN_TRANG_TRAI', false, 15, 1),
('Nghiên cứu ứng dụng công nghệ enzym sinh học trong khử khuẩn rau quả (Bản nháp)', 'nghien-cuu-ung-dung-enzym-sinh-hoc-draft', 'Tài liệu kỹ thuật nội bộ về giải pháp rửa rau bằng nước ion kiềm và enzym lên men từ dứa.', '<h2>Tài liệu nghiên cứu R&D</h2><p>Thử nghiệm trong phòng thí nghiệm cho thấy hiệu quả tiêu diệt vi khuẩn E.coli và Salmonella lên tới 99.8% mà không làm dập nát tế bào lá rau.</p>', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80', 'KIEN_THUC', false, 28, 1),
('Dự thảo quy chế thưởng dành cho Nhân viên Giao vận xuất sắc quý I (Bản nháp)', 'du-thao-quy-che-thuong-giao-van-draft', 'Bảng tiêu chí đánh giá tỷ lệ giao đúng giờ và tỷ lệ chụp ảnh làm chứng đơn hàng đạt chuẩn.', '<h2>Nội dung lưu hành nội bộ</h2><p>Khen thưởng các cá nhân đạt điểm đánh giá 5 sao từ khách hàng và tỷ lệ hoàn tất đơn hàng đạt 100%.</p>', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'THONG_BAO', false, 8, 1)
ON CONFLICT (slug) DO NOTHING;

-- Diverse user statuses (active & locked)
UPDATE users SET is_active = false WHERE id IN (15, 25, 35, 45, 50);

-- Resync all sequences to MAX(id)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items));
SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));
