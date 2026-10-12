'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/navigation';
import NextLink from 'next/link';
import { User, ChevronDown, LogIn, UserPlus, Package } from 'lucide-react';

export const AccountDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-gray-700 hover:text-[#2E7D32] text-sm font-medium py-1 px-2 rounded transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <User className="w-4 h-4 text-gray-600" />
        <span className="hidden sm:inline">Tài khoản</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <NextLink
            href="/auth?mode=login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
          >
            <LogIn className="w-4 h-4 text-[#2E7D32]" />
            <span>Đăng nhập</span>
          </NextLink>

          <NextLink
            href="/auth?mode=register"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
          >
            <UserPlus className="w-4 h-4 text-[#2E7D32]" />
            <span>Đăng ký</span>
          </NextLink>

          <div className="border-t border-gray-100 my-1" />

          <NextLink
            href="/checkout"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
          >
            <Package className="w-4 h-4 text-[#2E7D32]" />
            <span>Đơn hàng</span>
          </NextLink>
        </div>
      )}
    </div>
  );
};
