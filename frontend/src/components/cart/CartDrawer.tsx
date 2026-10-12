'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalAmount,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2E7D32]" />
              <h2 className="text-base font-bold text-gray-900">
                {totalItems} sản phẩm
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Đóng giỏ hàng"
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-75" />
                </div>
                <p className="text-gray-600 font-medium text-base mb-1">
                  Giỏ hàng của bạn đang trống
                </p>
                <p className="text-gray-400 text-xs mb-6 max-w-xs">
                  Hãy thêm nông sản tươi sạch vào giỏ để tận hưởng bữa ăn an lành mỗi ngày!
                </p>
                <button
                  onClick={closeDrawer}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.product.id} className="py-4 flex gap-4 items-center">
                    {/* Thumbnail */}
                    <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">
                        Quy cách: {item.product.specification}
                      </p>
                      <div className="text-sm font-bold text-[#2E7D32]">
                        {price.toLocaleString('vi-VN')}đ
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-l transition-colors"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-gray-800 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-r transition-colors"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-5 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Tổng cộng:</span>
                <span className="text-xl font-black text-[#2E7D32]">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="text-[11px] text-gray-500 text-center">
                (Đã bao gồm thuế GTGT & chưa tính phí giao hàng nếu có)
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-base font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Đặt đơn</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
