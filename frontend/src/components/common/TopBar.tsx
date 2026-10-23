'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Sprout } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { AccountDropdown } from '../navigation/AccountDropdown';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-100 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] group-hover:bg-[#C8E6C9] transition-colors shadow-xs">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#2E7D32] leading-none">
                Vft Farms
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">
                Nông sản & Thực phẩm sạch
              </span>
            </div>
          </Link>

          {/* Mobile hotline & account buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <AccountDropdown />
          </div>
        </div>

        {/* Center: Unified Search Bar */}
        <div className="w-full md:flex-1 md:max-w-xl lg:max-w-2xl px-0 md:px-4">
          <SearchBar />
        </div>

        {/* Right: Hotline & Account Dropdown */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          {/* Hotline with Hover Popover */}
          <div className="relative group">
            <a
              href="tel:02432029199"
              className="flex items-center gap-2 group transition-colors py-1 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-all shadow-xs">
                <Phone className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-medium leading-none">
                  Hotline hỗ trợ
                </span>
                <span className="text-sm font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                  02432029199
                </span>
              </div>
            </a>

            {/* Hover Popover */}
            <div className="absolute right-0 top-full pt-2 w-72 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="rounded-2xl bg-white p-4 shadow-xl border border-gray-100 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900">Liên Hệ Trực Tiếp</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online 24/7
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <a
                    href="tel:02432029199"
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-gray-700 hover:text-[#2E7D32] transition-colors"
                  >
                    <span>Tổng đài miễn phí:</span>
                    <strong className="text-emerald-700">024.3202.9199</strong>
                  </a>
                  <a
                    href="https://zalo.me/0910000009"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    <span>Zalo CSKH nhanh:</span>
                    <strong className="text-blue-700">0910.000.009</strong>
                  </a>
                  <a
                    href="mailto:hotro@vftfarms.vn"
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
                  >
                    <span>Email hỗ trợ:</span>
                    <strong className="text-purple-700">hotro@vftfarms.vn</strong>
                  </a>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                  Phục vụ giao nông sản tươi từ 7h00 - 21h00 mỗi ngày.
                </div>
              </div>
            </div>
          </div>

          {/* Account Dropdown */}
          <AccountDropdown />
        </div>
      </div>
    </div>
  );
};
