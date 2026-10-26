"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  QrCode,
  Copy,
  Check,
  CreditCard,
  Building2,
  ShieldCheck,
  Download,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export const VFT_BANK_INFO = {
  bankId: "MB",
  bankName: "Ngân Hàng TMCP Quân Đội (MB Bank)",
  accountNo: "0910000009",
  accountName: "CONG TY CO PHAN VFT FARMS",
};

interface VietQRDisplayProps {
  amount: number;
  orderCode: string;
  isConfirmedOrder?: boolean;
}

export function VietQRDisplay({
  amount,
  orderCode,
  isConfirmedOrder = false,
}: VietQRDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const qrUrl = `https://img.vietqr.io/image/${VFT_BANK_INFO.bankId}-${VFT_BANK_INFO.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    orderCode,
  )}&accountName=${encodeURIComponent(VFT_BANK_INFO.accountName)}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50/50 rounded-3xl border-2 border-[#2E7D32]/30 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-emerald-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
              <span>Thanh Toán Chuyển Khoản VietQR</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] tracking-wider">
                Tự động
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử bất kỳ (24/7)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>Xác nhận tức thì</span>
        </div>
      </div>

      {/* Main Content Grid: QR Left + Bank Details Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: QR Code Image */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-56 h-72 sm:w-60 sm:h-76 bg-white p-3 rounded-2xl border-2 border-emerald-300 shadow-md flex items-center justify-center overflow-hidden">
            <img
              src={qrUrl}
              alt="Mã VietQR chuyển khoản VFT Farms"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-gray-500 text-center font-medium">
            Mã QR đã chứa sẵn số tiền{" "}
            <strong className="text-gray-800">
              {amount.toLocaleString("vi-VN")}đ
            </strong>{" "}
            & nội dung chuyển
          </p>
        </div>

        {/* Right Column: Bank Details & Quick Copy */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Bank Name */}
          <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Ngân Hàng Thụ Hưởng
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#2E7D32]" />
                {VFT_BANK_INFO.bankName}
              </span>
            </div>
          </div>

          {/* Account Number */}
          <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Số Tài Khoản
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-mono font-black text-[#2E7D32] tracking-wider">
                {VFT_BANK_INFO.accountNo}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(VFT_BANK_INFO.accountNo, "acc")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-emerald-50 text-[#2E7D32] hover:bg-emerald-100"
              >
                {copiedField === "acc" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Name */}
          <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Chủ Tài Khoản
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-800 uppercase">
              {VFT_BANK_INFO.accountName}
            </span>
          </div>

          {/* Amount */}
          <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Số Tiền Cần Chuyển
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-black text-rose-600">
                {amount.toLocaleString("vi-VN")} đ
              </span>
              <button
                type="button"
                onClick={() => handleCopy(String(amount), "amount")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                {copiedField === "amount" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-rose-600" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transfer Memo */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
              Nội Dung Chuyển Khoản (Bắt buộc)
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-black text-amber-900">
                {orderCode}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(orderCode, "memo")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-amber-100 text-amber-900 hover:bg-amber-200"
              >
                {copiedField === "memo" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-700" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Footer */}
      <div className="pt-2 border-t border-emerald-100 flex items-start gap-2 text-xs text-gray-500">
        <Sparkles className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isConfirmedOrder
            ? "Hệ thống sẽ tự động duyệt đơn ngay khi nhận được tín hiệu thanh toán từ ngân hàng. Bạn có thể theo dõi đơn tại trang Lịch sử đơn hàng."
            : "Mã QR và nội dung chuyển khoản chính xác của đơn hàng sẽ được tạo tự động ngay khi bạn bấm Xác Nhận Đặt Hàng."}
        </p>
      </div>
    </div>
  );
}
