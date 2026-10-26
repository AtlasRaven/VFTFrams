-- ====================================================================
-- CẬP NHẬT ẢNH CHO TẤT CẢ USERS VÀ ĐƠN HÀNG TRONG HỆ THỐNG
-- ====================================================================

BEGIN;

-- 1. Cập nhật ảnh đại diện (avatar_url) cho tất cả users chưa có ảnh
UPDATE users
SET avatar_url = CASE (id % 12)
  WHEN 0 THEN 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  WHEN 1 THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
  WHEN 2 THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
  WHEN 3 THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80'
  WHEN 4 THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'
  WHEN 5 THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80'
  WHEN 6 THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
  WHEN 7 THEN 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80'
  WHEN 8 THEN 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80'
  WHEN 9 THEN 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80'
  WHEN 10 THEN 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80'
  ELSE 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80'
END
WHERE avatar_url IS NULL OR avatar_url = '' OR avatar_url LIKE 'data:image%';

-- 2. Cập nhật ảnh chứng từ làm chứng cho tất cả các đơn hàng đã giao (DELIVERED) hoặc đang giao (SHIPPING)
UPDATE orders
SET 
  proof_image_url = CASE (id % 5)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80'
    ELSE 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80'
  END,
  proof_note = CASE 
    WHEN proof_note IS NOT NULL AND proof_note != '' THEN proof_note
    WHEN order_status = 'DELIVERED' THEN 'Khách đã kiểm tra tem QR truy xuất, thanh toán đầy đủ và ký nhận thùng hàng nông sản tươi.'
    WHEN order_status = 'SHIPPING' THEN 'Tài xế VFT Express đã bốc hàng lên xe lạnh lúc 07:30, đang vận chuyển đến khách.'
    ELSE proof_note
  END
WHERE order_status IN ('DELIVERED', 'SHIPPING') AND (proof_image_url IS NULL OR proof_image_url = '');

COMMIT;
