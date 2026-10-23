import { Injectable } from '@nestjs/common';

export interface PolicyItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'CAM_KET' | 'BAN_HANG' | 'THANH_TOAN' | 'DOI_TRA' | 'GIAO_HANG' | 'BAO_MAT';
  sortOrder: number;
}

@Injectable()
export class PoliciesService {
  private policies: PolicyItem[] = [
    {
      id: 1,
      title: 'Cam kết dịch vụ',
      slug: 'cam-ket-dich-vu',
      content: 'VFT Farms cam kết 100% sản phẩm nông sản và thực phẩm phân phối đều đạt chứng nhận an toàn VietGAP, VfSC hoặc canh tác hữu cơ tự nhiên. Hoàn tiền 100% nếu phát hiện hàng kém chất lượng.',
      type: 'CAM_KET',
      sortOrder: 1,
    },
    {
      id: 2,
      title: 'Chính sách bán hàng',
      slug: 'chinh-sach-ban-hang',
      content: 'Mọi đơn hàng được tiếp nhận và xử lý nhanh chóng trong vòng 30 phút. Khách hàng có thể mua sắm tiện lợi trực tiếp trên Website hoặc qua Tổng đài hỗ trợ 02432029199.',
      type: 'BAN_HANG',
      sortOrder: 2,
    },
    {
      id: 3,
      title: 'Hình thức & chính sách thanh toán',
      slug: 'hinh-thuc-thanh-toan',
      content: 'Hỗ trợ thanh toán linh hoạt: COD (Tiền mặt khi nhận hàng), Chuyển khoản ngân hàng trực tiếp qua VietQR, Ví điện tử MoMo, VNPay.',
      type: 'THANH_TOAN',
      sortOrder: 3,
    },
    {
      id: 4,
      title: 'Chính sách đổi trả hàng',
      slug: 'chinh-sach-doi-tra',
      content: 'Khách hàng được quyền kiểm tra hàng trước khi thanh toán. Đổi trả ngay lập tức trong 24h nếu sản phẩm bị hư hỏng, dập nát do quá trình vận chuyển hoặc không đúng quy cách.',
      type: 'DOI_TRA',
      sortOrder: 4,
    },
    {
      id: 5,
      title: 'Chính sách giao hàng',
      slug: 'chinh-sach-giao-hang',
      content: 'Giao hàng nhanh nội thành trong vòng 2 giờ cho các đơn hàng tươi sống. Miễn phí giao hàng cho hóa đơn từ 300.000đ.',
      type: 'GIAO_HANG',
      sortOrder: 5,
    },
    {
      id: 6,
      title: 'Chính sách bảo mật',
      slug: 'chinh-sach-bao-mat',
      content: 'VFT Farms cam kết bảo mật tuyệt đối mọi thông tin cá nhân của khách hàng theo tiêu chuẩn an toàn bảo mật dữ liệu.',
      type: 'BAO_MAT',
      sortOrder: 6,
    },
  ];

  findAll() {
    return this.policies;
  }

  findBySlug(slug: string) {
    return this.policies.find((p) => p.slug === slug);
  }
}
