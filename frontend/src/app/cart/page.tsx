'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/useCartStore';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } = useCartStore();
  const subtotal = getTotalAmount();
  const shippingFee = subtotal >= 300000 || subtotal === 0 ? 0 : 25000;
  const totalAmount = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h1>
        <p className="text-sm text-gray-500">
          Hãy khám phá các loại rau củ, trái cây và thực phẩm sạch tươi ngon của VFT Farms.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-block bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Giỏ Hàng Của Bạn ({items.length} món)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
        >
          Xóa toàn bộ giỏ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {items.map((item) => {
            const price = item.product.salePrice ?? item.product.price;
            return (
              <div key={item.product.id} className="p-5 flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-base font-bold text-gray-900 hover:text-[#2E7D32] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Quy cách: {item.product.specification}
                    </p>
                    <div className="text-sm font-bold text-[#2E7D32] mt-1 sm:hidden">
                      {price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-l transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-r transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-base font-extrabold text-[#2E7D32] hidden sm:block min-w-[100px] text-right">
                    {(price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span className="font-semibold text-gray-900">{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold">
                {shippingFee === 0 ? <strong className="text-[#2E7D32]">Miễn phí</strong> : `${shippingFee.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#2E7D32] pt-3 border-t border-gray-100">
              <span>Tổng thanh toán:</span>
              <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3.5 px-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Tiến hành đặt đơn</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
