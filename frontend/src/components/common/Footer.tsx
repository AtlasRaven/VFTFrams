'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Smartphone } from 'lucide-react';
import { MOCK_POLICIES } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1B2E1D] text-gray-300 pt-14 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Vft Farms
              </span>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed pr-6">
              Hệ thống bán lẻ nông sản và thực phẩm sạch hàng đầu. Cam kết quy trình sản xuất và cung ứng minh bạch, đạt chứng nhận kiểm định an toàn VietGAP & VfSC mang sức khỏe trọn vẹn đến bữa ăn mọi nhà.
            </p>

            <div className="space-y-2 text-sm text-gray-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0 mt-1" />
                <span>Số 18, Đường Nông Nghiệp Xanh, TP. Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <a href="tel:02432029199" className="hover:text-white font-semibold">
                  02432029199
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <span>cskh@vftfarms.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Về chúng tôi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Về Chúng Tôi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#gioi-thieu" className="hover:text-[#81C784] transition-colors">
                  Giới thiệu VFT Farms
                </Link>
              </li>
              <li>
                <Link href="/#nong-trai" className="hover:text-[#81C784] transition-colors">
                  Chuỗi nông trại liên kết
                </Link>
              </li>
              <li>
                <Link href="/#quy-trinh" className="hover:text-[#81C784] transition-colors">
                  Quy trình kiểm định VietGAP
                </Link>
              </li>
              <li>
                <Link href="/#tin-tuc" className="hover:text-[#81C784] transition-colors">
                  Tin tức & Kiến thức dinh dưỡng
                </Link>
              </li>
              <li>
                <Link href="/#lien-he" className="hover:text-[#81C784] transition-colors">
                  Liên hệ hợp tác
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chính sách */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Chính Sách
            </h4>
            <ul className="space-y-2 text-sm">
              {MOCK_POLICIES.map((policy) => (
                <li key={policy.id}>
                  <Link
                    href={`/policies/${policy.slug}`}
                    className="hover:text-[#81C784] transition-colors"
                  >
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 & 5: Catalog & Mobile App QR Code */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tải Ứng Dụng
            </h4>
            <p className="text-xs text-gray-300">
              Quét mã QR để tải App VFT Farms trên iOS & Android, đặt hàng nhanh chóng với ngàn ưu đãi.
            </p>

            {/* QR Code and App badges */}
            <div className="bg-white p-2.5 rounded-lg inline-block shadow-md">
              <Image
                src="/images/qr-code.svg"
                alt="VFT Farms App QR Code"
                width={110}
                height={110}
                className="w-24 h-24"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-[#81C784] font-medium">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Hỗ trợ iOS 14+ & Android 9+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 VFT Farms (vftfarms.com). Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#81C784]">
              <ShieldCheck className="w-4 h-4" />
              <span>Chứng nhận chuỗi thực phẩm an toàn</span>
            </span>
            <Link href="/policies/chinh-sach-bao-mat" className="hover:text-white">
              Bảo mật dữ liệu
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
