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
          {/* Hotline */}
          <a
            href="tel:02432029199"
            className="flex items-center gap-2 group transition-colors"
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

          {/* Account Dropdown */}
          <AccountDropdown />
        </div>
      </div>
    </div>
  );
};
