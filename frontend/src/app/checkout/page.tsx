"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useCartStore } from "../../store/useCartStore";
import { orderService } from "../../services/api";
import { CheckCircle2, ShoppingBag, ArrowLeft } from "lucide-react";
import type { Order } from "../../types";

export default function CheckoutPage() {
  const { items, getTotalAmount, clearCart } = useCartStore();
  const subtotal = getTotalAmount();
  const shippingFee = subtotal >= 150000 || subtotal === 0 ? 0 : 25000;
  const totalAmount = subtotal + shippingFee;

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    shippingAddress: "",
    notes: "",
    paymentMethod: "COD" as Order["paymentMethod"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setOrderError(null);
    setIsSubmitting(true);
    try {
      const order = await orderService.create({
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        shippingAddress: formData.shippingAddress,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.product.salePrice ?? item.product.price,
          quantity: item.quantity,
          totalPrice:
            (item.product.salePrice ?? item.product.price) * item.quantity,
        })),
      });

      setCreatedOrderCode(order.orderCode);
      clearCart();
    } catch (err) {
      console.error("Order creation error:", err);
      if (axios.isAxiosError<{ message?: string | string[] }>(err)) {
        const message = err.response?.data.message;
        setOrderError(
          Array.isArray(message)
            ? message.join(", ")
            : message ||
                "Không thể kết nối máy chủ. Đơn hàng chưa được ghi nhận.",
        );
      } else if (err instanceof Error) {
        setOrderError(err.message);
      } else {
        setOrderError("Không thể đặt hàng. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrderCode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Cảm ơn bạn đã lựa chọn thực phẩm sạch VFT Farms. Mã đơn hàng của bạn
          là{" "}
          <strong className="text-[#2E7D32] text-base">
            {createdOrderCode}
          </strong>
          . Chúng tôi sẽ liên hệ xác nhận và giao hàng nhanh chóng!
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/"
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-lg text-sm shadow-md transition-colors"
          >
            Về Trang Chủ
          </Link>
          <Link
            href="/products"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg text-sm transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-sm text-gray-500">
          Vui lòng chọn sản phẩm trước khi tiến hành thanh toán.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#2E7D32] text-white font-bold py-2.5 px-6 rounded-lg text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem sản phẩm</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Đặt Hàng & Thanh Toán
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Vui lòng điền thông tin người nhận để VFT Farms giao nông sản tươi sớm
          nhất
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {orderError && (
          <p
            role="alert"
            className="lg:col-span-12 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {orderError}
          </p>
        )}
        {/* Left Form: Delivery Information */}
        <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Thông Tin Giao Hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại *
              </label>
              <input
                type="tel"
                required
                value={formData.recipientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, recipientPhone: e.target.value })
                }
                placeholder="0912345678"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Địa chỉ nhận hàng chi tiết *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddress: e.target.value })
              }
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Ghi chú cho đơn hàng
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Giao giờ hành chính, dặn bảo vệ nhận giúp..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-[#2E7D32]">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={() =>
                    setFormData({ ...formData, paymentMethod: "COD" })
                  }
                  className="text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <div>
                  <span className="text-sm font-bold text-gray-800 block">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="text-xs text-gray-500">
                    Kiểm tra thực phẩm trước khi thanh toán tiền mặt
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-[#2E7D32]">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === "BANK_TRANSFER"}
                  onChange={() =>
                    setFormData({ ...formData, paymentMethod: "BANK_TRANSFER" })
                  }
                  className="text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <div>
                  <span className="text-sm font-bold text-gray-800 block">
                    Chuyển khoản VietQR siêu tốc
                  </span>
                  <span className="text-xs text-gray-500">
                    Quét mã QR qua ứng dụng ngân hàng bất kỳ
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Đơn Hàng ({items.length} món)
            </h2>

            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => {
                const itemPrice = item.product.salePrice ?? item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="py-3 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="rounded bg-gray-50 p-1"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          x{item.quantity} ({item.product.specification})
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-800">
                      {(itemPrice * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#2E7D32]">Miễn phí</strong>
                  ) : (
                    `${shippingFee.toLocaleString("vi-VN")}đ`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#2E7D32] pt-2 border-t border-gray-100">
                <span>Tổng thanh toán:</span>
                <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3.5 rounded-lg font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý đơn hàng..." : "Xác Nhận Đặt Hàng"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
