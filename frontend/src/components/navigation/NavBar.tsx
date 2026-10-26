'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { PolicyDropdown } from './PolicyDropdown';
import { useCartStore } from '../../store/useCartStore';
import { categoryService } from '../../services/api';
import { MOCK_CATEGORIES } from '../../data/mockData';
import type { Category } from '../../types';

export const NavBar: React.FC = () => {
  const { toggleDrawer, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Lấy các danh mục gốc (không có parentId)
          const roots = data.filter((c) => !c.parentId);
          setCategories(roots.length > 0 ? roots : data.slice(0, 8));
        }
      })
      .catch((err) => {
        console.warn('Lỗi tải danh mục NavBar:', err);
      });
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Green Categories Button */}
          <div className="relative">
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-5 py-2.5 rounded-md flex items-center gap-2.5 text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4 stroke-[2.5]" />
              <span>DANH MỤC</span>
            </button>

            {/* Quick Category Dropdown for this button */}
            {categoryMenuOpen && (
              <div
                className="absolute left-0 top-full mt-1 w-64 bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 max-h-[460px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setCategoryMenuOpen(false)}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    onClick={() => setCategoryMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] font-medium transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-xs">&rsaquo;</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Center: Main Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-800 hover:text-[#2E7D32] transition-colors py-2"
            >
              Trang chủ
            </Link>

            {/* Mega Menu on Hover */}
            <MegaMenu />

            {/* Policy Dropdown on Hover */}
            <PolicyDropdown />

            <Link
              href="/#gioi-thieu"
              className="text-sm font-semibold text-gray-800 hover:text-[#2E7D32] transition-colors py-2"
            >
              Giới thiệu
            </Link>

            <Link
              href="/news"
              className="text-sm font-semibold text-gray-800 hover:text-[#2E7D32] transition-colors py-2"
            >
              Tin tức
            </Link>

            <Link
              href="/#lien-he"
              className="text-sm font-semibold text-gray-800 hover:text-[#2E7D32] transition-colors py-2"
            >
              Liên hệ
            </Link>
          </div>

          {/* Right: Cart Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Cart Button: Gray bag icon with green badge */}
            <button
              onClick={toggleDrawer}
              aria-label="Xem giỏ hàng"
              className="relative p-2.5 rounded-full text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.8] text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-[#2E7D32] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs border-2 border-white">
                {totalItems}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Trang chủ
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Tất cả sản phẩm
          </Link>
          <Link
            href="/policies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Chính sách
          </Link>
          <Link
            href="/news"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Tin tức & Cẩm nang
          </Link>
          <Link
            href="/#gioi-thieu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Giới thiệu
          </Link>
          <Link
            href="/#lien-he"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Liên hệ
          </Link>
        </div>
      )}
    </nav>
  );
};
