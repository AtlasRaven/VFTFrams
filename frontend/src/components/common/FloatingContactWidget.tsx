"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  X,
  Headphones,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const FloatingContactWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const showPopup = isOpen || isHovered;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Contact Card (on Hover or Click) */}
      {showPopup && (
        <div className="mb-3 w-80 rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#2E7D32] flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                  Tư Vấn Nông Sản VFT Farms
                </h4>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang hoạt động (7h - 21h)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 sm:hidden"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Channels */}
          <div className="py-3 space-y-2">
            {/* Hotline */}
            <a
              href="tel:02432029199"
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-[#2E7D32] transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-gray-800 group-hover:text-[#2E7D32]">
                    Hotline: 024.3202.9199
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Gọi miễn phí tư vấn đơn hàng
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity">
                Gọi ngay
              </span>
            </a>

            {/* Zalo Chat */}
            <a
              href="https://zalo.me/0910000009"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  Z
                </div>
                <div>
                  <span className="text-xs font-bold block text-gray-800 group-hover:text-blue-700">
                    Chat Zalo CSKH
                  </span>
                  <span className="text-[10px] text-gray-500">
                    0910.000.009 (Tư vấn nhanh)
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Email Support */}
            <a
              href="mailto:hotro@vftfarms.vn"
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-gray-800 group-hover:text-purple-700">
                    Gửi Email Hỗ Trợ
                  </span>
                  <span className="text-[10px] text-gray-500">
                    hotro@vftfarms.vn
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Farm Address Note */}
          <div className="pt-2.5 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#2E7D32] shrink-0" />
              <span>Nông trại: Đơn Dương, Lâm Đồng & Cai Lậy, Tiền Giang</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#2E7D32] shrink-0" />
              <span>Giao hàng hỏa tốc 2 giờ nội thành</span>
            </p>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-linear-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        aria-label="Liên hệ hỗ trợ VFT Farms"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold hidden sm:inline">Hỗ Trợ 24/7</span>
      </button>
    </div>
  );
};
