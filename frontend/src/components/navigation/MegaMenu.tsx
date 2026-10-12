'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../data/mockData';

export const MegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="absolute left-1/2 -translate-x-1/4 top-full mt-0.5 w-[760px] max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-3 gap-6">
            {MOCK_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <Link
                  href={`/products?category=${cat.id}`}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between text-sm font-bold text-gray-900 border-b border-gray-100 pb-1 hover:text-[#2E7D32] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-[#2E7D32] rounded-full inline-block group-hover:h-4 transition-all" />
                    {cat.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#2E7D32] -translate-x-1 group-hover:translate-x-0 transition-all" />
                </Link>

                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <ul className="space-y-1.5 pl-3">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/products?category=${sub.id}`}
                          onClick={() => setIsOpen(false)}
                          className="text-xs text-gray-600 hover:text-[#2E7D32] hover:font-medium transition-colors block py-0.5"
                        >
                          • {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 pl-3 italic">
                    Đặc sản tươi sạch tuyển chọn
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Banner bottom promo inside Mega Menu */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-[#F1F8E9] -mx-6 -mb-6 p-4 rounded-b-lg">
            <div className="flex items-center gap-2 text-xs text-[#2E7D32] font-semibold">
              <Sparkles className="w-4 h-4 text-[#4CAF50]" />
              <span>Nông sản tươi thu hoạch trong ngày – Đạt chuẩn kiểm định VietGAP & VfSC</span>
            </div>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#2E7D32] hover:text-[#1B5E20] font-bold underline"
            >
              Xem tất cả sản phẩm &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
