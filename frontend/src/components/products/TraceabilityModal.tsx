"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  X,
  Copy,
  Check,
  Calendar,
  MapPin,
  Award,
  Hash,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { productService } from "../../services/api";
import type { TraceabilityInfo } from "../../types";

interface TraceabilityModalProps {
  productId: number | null;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  productId,
  productName,
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<TraceabilityInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !productId) {
      setData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    productService
      .getTraceability(productId)
      .then((res) => {
        if (isMounted) {
          setData(res);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "Không thể tải thông tin truy xuất nguồn gốc nông sản.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, productId]);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    if (!data?.hashSHA256) return;
    navigator.clipboard.writeText(data.hashSHA256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[11px] font-bold tracking-wider uppercase">
                Chứng Thư Minh Bạch
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-1">
                Truy Xuất Nguồn Gốc Nông Sản
              </h3>
              <p className="text-xs text-emerald-100/90 line-clamp-1">
                {productName || data?.productName || "Nông sản sạch VFT Farms"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
              <p className="text-sm font-medium">
                Đang đối soát mã băm mật mã học SHA-256...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Lỗi truy xuất</p>
                <p className="text-xs mt-0.5 text-red-600">{error}</p>
              </div>
            </div>
          ) : data ? (
            <>
              {/* Product Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-[#2E7D32] shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-gray-500 uppercase">
                      Tiêu Chuẩn Canh Tác
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {data.certification}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-gray-500 uppercase">
                      Vùng Nông Trại
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {data.origin || "Lâm Đồng, Việt Nam"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-gray-500 uppercase">
                      Mã Lô Thu Hoạch
                    </span>
                    <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">
                      {data.batchCode}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-gray-500 uppercase">
                      Thời Điểm Xác Thực
                    </span>
                    <p className="text-xs font-semibold text-gray-900 mt-0.5">
                      {new Date(data.verifiedAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Standard Description */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
                  Quy Trình Thu Hoạch & Đóng Gói
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  {data.harvestStandard}
                </p>
              </div>

              {/* Cryptographic SHA-256 Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Mã Băm Bảo Chứng Mật Mã Học (SHA-256):</span>
                  </label>
                  <button
                    onClick={handleCopyHash}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép hash</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-emerald-400 font-mono text-[11px] sm:text-xs break-all select-all shadow-inner leading-relaxed">
                  {data.hashSHA256}
                </div>

                <p className="text-[11px] text-gray-500 italic leading-snug">
                  * Chuỗi băm SHA-256 được tính toán trực tiếp từ cơ sở dữ liệu
                  gốc của VFT Farms. Bất kỳ sự thay đổi thông số sản phẩm nào đều
                  làm thay đổi chuỗi hash này.
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            Bảo chứng toàn vẹn bởi VFT Farms
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
