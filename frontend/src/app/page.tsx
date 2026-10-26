'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroBanner } from '../components/common/HeroBanner';
import { ProductSlider } from '../components/product/ProductSlider';
import { ProductCard } from '../components/product/ProductCard';
import { productService, categoryService } from '../services/api';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import type { Product, Category } from '../types';
import { ShieldCheck, Truck, Clock, RefreshCw, Award, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>(() =>
    MOCK_PRODUCTS.filter((p) => p.isBestSeller),
  );
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() =>
    MOCK_PRODUCTS.filter((p) => p.isFeatured),
  );
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    // 1. Tải nông sản bán chạy từ Backend API
    productService
      .getAll({ isBestSeller: true, limit: 12 })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBestSellers(data);
        }
      })
      .catch((err) => console.warn('Lỗi tải sản phẩm bán chạy:', err));

    // 2. Tải nông sản tươi mới nổi bật từ Backend API
    productService
      .getAll({ isFeatured: true, limit: 12 })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data);
        }
      })
      .catch((err) => console.warn('Lỗi tải sản phẩm nổi bật:', err));

    // 3. Tải 10 danh mục nông nghiệp từ Backend API
    categoryService
      .getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.slice(0, 10));
        }
      })
      .catch((err) => console.warn('Lỗi tải danh mục trang chủ:', err));
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Hero Banner Carousel */}
      <HeroBanner />

      {/* Trust & Guarantee Banner */}
      <section className="bg-white border-y border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Chuẩn VietGAP & VfSC</h4>
                <p className="text-xs text-gray-500">100% kiểm định an toàn</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Giao nhanh 2 giờ</h4>
                <p className="text-xs text-gray-500">Miễn phí đơn từ 300k</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Đổi trả trong 24h</h4>
                <p className="text-xs text-gray-500">Bảo đảm độ tươi ngon</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Thu hoạch mỗi ngày</h4>
                <p className="text-xs text-gray-500">Tươi mới từ nông trại</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section "Bán chạy" (Slider & Center "Xem thêm") */}
      <ProductSlider
        title="Bán chạy"
        products={bestSellers}
        viewAllLink="/products"
      />

      {/* Categories Grid Highlights */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Danh Mục Sản Phẩm Nổi Bật
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Khám phá thực phẩm tươi lành được phân loại chuyên biệt
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-[#2E7D32] shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] group-hover:bg-[#2E7D32] text-[#2E7D32] group-hover:text-white flex items-center justify-center font-bold text-lg transition-colors">
                  {cat.name.charAt(0)}
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-[#2E7D32] transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[11px] text-gray-400">
                  10 nông sản
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of all fresh products */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Nông Sản Tươi Mới Thu Hoạch
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Các mặt hàng tươi ngon cung ứng mỗi ngày từ các trang trại chuẩn hóa
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1"
            >
              <span>Xem tất cả</span> &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* About VFT Farms Highlight Section */}
      <section className="py-12 bg-[#F1F8E9] border-t border-emerald-100" id="gioi-thieu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
                Về Chúng Tôi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
                VFT Farms - Hành Trình Kiến Tạo Chuỗi Nông Sản Sạch
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tại VFT Farms, chúng tôi tin rằng bữa ăn gia đình bắt đầu từ sự an lành của từng nhành rau, trái ngọt. Được nuôi trồng theo tiêu chuẩn canh tác nghiêm ngặt của Bộ Nông nghiệp, kiểm định dư lượng hóa chất và vi sinh định kỳ, chúng tôi tự hào đồng hành cùng sức khỏe của hàng triệu người tiêu dùng Việt Nam.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-[#2E7D32]" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">Kiểm định VietGAP định kỳ</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-[#2E7D32]" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">Liên kết cùng 50+ Hợp tác xã</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                Quy Trình Kiểm Soát Chất Lượng
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>Chọn giống & đất trồng:</strong> Đất và nguồn nước được kiểm nghiệm không kim loại nặng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span><strong>Canh tác an toàn:</strong> Sử dụng phân bón hữu cơ sinh học, tuân thủ nghiêm thời gian cách ly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span><strong>Đóng gói & bảo quản mát:</strong> Sơ chế chuẩn vệ sinh, giữ trọn độ tươi ngon tự nhiên.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
