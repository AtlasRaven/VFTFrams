"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { orderService, userService } from "../../services/api";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  MapPin,
  QrCode,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
} from "lucide-react";
import type { Order, UserAddress } from "../../types";
import { VietQRDisplay } from "../../components/payment/VietQRDisplay";

export default function CheckoutPage() {
  const { items, getTotalAmount, clearCart } = useCartStore();
  const subtotal = getTotalAmount();
  const shippingFee = subtotal >= 150000 || subtotal === 0 ? 0 : 25000;
  const totalAmount = subtotal + shippingFee;

  const { user, token, hasHydrated } = useAuthStore();

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    shippingAddress: "",
    notes: "",
    paymentMethod: "COD" as Order["paymentMethod"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [submittedPaymentMethod, setSubmittedPaymentMethod] =
    useState<Order["paymentMethod"]>("COD");
  const [orderError, setOrderError] = useState<string | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "custom">("custom");
  const [saveAddressToBook, setSaveAddressToBook] = useState(true);
  const [autoFilledNotice, setAutoFilledNotice] = useState<string | null>(null);

  // Sync profile info directly into textfields immediately upon hydration
  const syncFromProfile = useCallback((addrs?: UserAddress[]) => {
    if (!user) return;

    let targetName = user.fullName || "";
    let targetPhone = user.phoneNumber || "";
    let targetAddress = "";

    const list = addrs !== undefined ? addrs : savedAddresses;
    if (list && list.length > 0) {
      const def = list.find((a) => a.isDefault) || list[0];
      setSelectedAddressId(def.id);
      targetAddress = [def.streetAddress, def.ward, def.district, def.province]
        .filter(Boolean)
        .join(", ");
      if (def.recipientName) targetName = def.recipientName;
      if (def.phoneNumber) targetPhone = def.phoneNumber;
    } else {
      setSelectedAddressId("custom");
    }

    setFormData((prev) => ({
      ...prev,
      recipientName: targetName,
      recipientPhone: targetPhone,
      shippingAddress: targetAddress || prev.shippingAddress,
    }));

    setAutoFilledNotice(
      `Đã tự động điền thông tin đặt hàng từ hồ sơ tài khoản "${user.fullName}".`,
    );
  }, [user, savedAddresses]);

  // Auto-fill shipping info from user profile and saved addresses on load
  useEffect(() => {
    if (!hasHydrated || !user) return;

    // Immediately prefill name and phone from auth store
    setFormData((prev) => ({
      ...prev,
      recipientName: prev.recipientName || user.fullName || "",
      recipientPhone: prev.recipientPhone || user.phoneNumber || "",
    }));

    // Fetch user's saved addresses and fresh profile
    userService
      .getAddresses()
      .then((addrs) => {
        setSavedAddresses(addrs || []);
        syncFromProfile(addrs || []);
      })
      .catch((err) => {
        console.warn("Lỗi tải sổ địa chỉ:", err);
        syncFromProfile([]);
      });
  }, [hasHydrated, user, syncFromProfile]);

  const handleSelectAddress = (addrId: number | "custom") => {
    setSelectedAddressId(addrId);
    if (addrId === "custom") {
      setFormData((prev) => ({
        ...prev,
        recipientName: user?.fullName || prev.recipientName,
        recipientPhone: user?.phoneNumber || prev.recipientPhone,
        shippingAddress: "",
      }));
      return;
    }

    const selected = savedAddresses.find((a) => a.id === addrId);
    if (selected) {
      const fullAddr = [
        selected.streetAddress,
        selected.ward,
        selected.district,
        selected.province,
      ]
        .filter(Boolean)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        recipientName: selected.recipientName || user?.fullName || prev.recipientName,
        recipientPhone: selected.phoneNumber || user?.phoneNumber || prev.recipientPhone,
        shippingAddress: fullAddr,
      }));
      setAutoFilledNotice(`Đang sử dụng địa chỉ đã lưu của ${selected.recipientName}.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setOrderError(null);
    setIsSubmitting(true);
    setSubmittedPaymentMethod(formData.paymentMethod);
    try {
      const order = await orderService.create({
        recipientName: formData.recipientName.trim(),
        recipientPhone: formData.recipientPhone.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        notes: formData.notes.trim(),
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

      // If user is authenticated and opted to save custom address to book
      if (
        user &&
        saveAddressToBook &&
        (selectedAddressId === "custom" || savedAddresses.length === 0) &&
        formData.shippingAddress.trim()
      ) {
        userService
          .addAddress({
            recipientName: formData.recipientName.trim(),
            phoneNumber: formData.recipientPhone.trim(),
            streetAddress: formData.shippingAddress.trim(),
            isDefault: savedAddresses.length === 0,
          })
          .catch((addrErr) => console.warn("Lưu địa chỉ vào sổ phụ thất bại:", addrErr));
      }

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

        {/* Bank Transfer VietQR Payment Card if Payment Method is BANK_TRANSFER */}
        {submittedPaymentMethod === "BANK_TRANSFER" && (
          <div className="pt-2 text-left max-w-xl mx-auto">
            <VietQRDisplay
              amount={totalAmount}
              orderCode={createdOrderCode}
              isConfirmedOrder={true}
            />
          </div>
        )}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/orders"
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition-colors"
          >
            Theo Dõi Đơn Hàng Của Tôi
          </Link>
          <Link
            href="/products"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl text-sm transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
          <Link
            href="/"
            className="border border-gray-200 text-gray-600 hover:text-gray-900 font-semibold py-3 px-6 rounded-xl text-sm transition-colors"
          >
            Về Trang Chủ
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
          <div className="border-b border-gray-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              Thông Tin Giao Hàng
            </h2>
            <div className="flex items-center gap-2">
              {user && (
                <button
                  type="button"
                  onClick={() => syncFromProfile()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                  title="Điền lại thông tin mặc định từ hồ sơ cá nhân"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Điền lại từ hồ sơ</span>
                </button>
              )}
              {autoFilledNotice && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Tự động điền</span>
                </span>
              )}
            </div>
          </div>

          {/* Guest notification banner */}
          {!user && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bạn đã có tài khoản VFT Farms? Đăng nhập để tự động điền họ tên, số điện thoại và sổ địa chỉ.</span>
              </span>
              <Link
                href="/auth?mode=login&redirect=/checkout"
                className="px-3.5 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs shrink-0 text-center transition-colors shadow-xs"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {/* Profile Autofill Banner & Saved Address Cards */}
          {user && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  {autoFilledNotice ||
                    `Đang sử dụng thông tin tài khoản: ${user.fullName}`}
                </span>
                <Link
                  href="/profile"
                  className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Quản lý sổ địa chỉ</span>
                  <span>→</span>
                </Link>
              </div>

              {savedAddresses.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-200/70">
                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Chọn địa chỉ nhận hàng có sẵn:</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {savedAddresses.map((addr) => {
                      const fullAddr = [
                        addr.streetAddress,
                        addr.ward,
                        addr.district,
                        addr.province,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      const isSelected = selectedAddressId === addr.id;

                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr.id)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? "bg-white border-[#2E7D32] ring-1 ring-[#2E7D32] shadow-xs"
                              : "bg-white/80 border-emerald-200 hover:border-emerald-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="checkoutAddressChoice"
                            checked={isSelected}
                            onChange={() => handleSelectAddress(addr.id)}
                            className="mt-0.5 text-[#2E7D32] focus:ring-[#2E7D32] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 truncate">
                                {addr.recipientName || user.fullName}
                              </span>
                              <span className="text-gray-500">
                                {addr.phoneNumber || user.phoneNumber}
                              </span>
                              {addr.isDefault && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[#2E7D32] text-[10px] font-bold border border-emerald-300">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 truncate mt-0.5 text-[11px]">
                              {fullAddr}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <div
                      onClick={() => handleSelectAddress("custom")}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedAddressId === "custom"
                          ? "bg-white border-[#2E7D32] ring-1 ring-[#2E7D32] shadow-xs"
                          : "bg-white/80 border-emerald-200 hover:border-emerald-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkoutAddressChoice"
                        checked={selectedAddressId === "custom"}
                        onChange={() => handleSelectAddress("custom")}
                        className="text-[#2E7D32] focus:ring-[#2E7D32] cursor-pointer"
                      />
                      <span className="font-semibold text-gray-800 flex items-center gap-1.5 text-xs">
                        <Plus className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Sử dụng địa chỉ nhận hàng khác / nhập mới</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và tên người nhận *
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
                Số điện thoại liên hệ *
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
              onChange={(e) => {
                setFormData({ ...formData, shippingAddress: e.target.value });
                if (selectedAddressId !== "custom") {
                  setSelectedAddressId("custom");
                }
              }}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            />
          </div>

          {/* Option to save address to user's address book */}
          {user && (selectedAddressId === "custom" || savedAddresses.length === 0) && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <input
                type="checkbox"
                id="saveAddressBookCheckbox"
                checked={saveAddressToBook}
                onChange={(e) => setSaveAddressToBook(e.target.checked)}
                className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32] cursor-pointer"
              />
              <label
                htmlFor="saveAddressBookCheckbox"
                className="text-xs font-medium text-emerald-900 cursor-pointer"
              >
                Lưu địa chỉ này vào sổ địa chỉ tài khoản của tôi để sử dụng cho lần mua sắm tiếp theo
              </label>
            </div>
          )}

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

            {/* VietQR Preview Box if BANK_TRANSFER is selected */}
            {formData.paymentMethod === "BANK_TRANSFER" && (
              <div className="pt-2 animate-in fade-in">
                <VietQRDisplay
                  amount={totalAmount}
                  orderCode="VFT THANHTOAN"
                  isConfirmedOrder={false}
                />
              </div>
            )}
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
