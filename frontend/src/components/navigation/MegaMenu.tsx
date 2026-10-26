'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { categoryService } from '../../services/api';
import { MOCK_CATEGORIES } from '../../data/mockData';
import type { Category } from '../../types';

export const MegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.slice(0, 10));
        }
      })
      .catch((err) => {
        console.warn('Lỗi tải danh mục MegaMenu:', err);
      });
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/products"
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#2E7D32] py-2 transition-colors"
      >
        <span>Sản phẩm</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 w-[900px] max-w-[95vw] bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              10 Danh Mục Nông Nghiệp Sạch
            </h4>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#2E7D32] hover:underline"
            >
              Xem tất cả 100 sản phẩm &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                onClick={() => setIsOpen(false)}
                className="group p-3 rounded-lg border border-gray-100 hover:border-[#2E7D32] hover:bg-[#F1F8E9] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 bg-[#2E7D32] rounded-full inline-block group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors leading-tight">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug">
                    {cat.description || 'Nông sản sạch chất lượng cao'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-[#2E7D32] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Xem 10 sản phẩm &rsaquo;
                </div>
              </Link>
            ))}
          </div>

          {/* Banner bottom promo inside Mega Menu */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-[#F1F8E9] -mx-6 -mb-6 p-4 rounded-b-xl">
            <div className="flex items-center gap-2 text-xs text-[#2E7D32] font-semibold">
              <Sparkles className="w-4 h-4 text-[#4CAF50]" />
              <span>100 Nông sản đạt chuẩn kiểm nghiệm an toàn VietGAP, VfSC, Organic & HACCP</span>
            </div>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#2E7D32] hover:text-[#1B5E20] font-bold underline"
            >
              Khám phá ngay &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
