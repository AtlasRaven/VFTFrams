"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  ChevronDown,
  LogIn,
  UserPlus,
  Package,
  LogOut,
  Shield,
  MapPin,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export const AccountDropdown: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, hasHydrated, logout } = useAuthStore();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!hasHydrated) {
    return (
      <button
        type="button"
        disabled
        className="flex cursor-wait items-center gap-1.5 rounded px-2 py-1 text-sm font-medium text-gray-500"
        aria-label="Đang tải tài khoản"
      >
        <UserIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Tài khoản</span>
      </button>
    );
  }

  // 1. STATE: NOT AUTHENTICATED (GUEST)
  if (!isAuthenticated || !user) {
    return (
      <div
        ref={dropdownRef}
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-gray-700 hover:text-[#2E7D32] text-sm font-medium py-1 px-2 rounded transition-colors cursor-pointer"
          aria-expanded={isOpen}
        >
          <UserIcon className="w-4 h-4 text-gray-600" />
          <span className="hidden sm:inline">Tài khoản</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Guest Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full z-50 w-52 pt-1">
            <div className="animate-in slide-in-from-top-1 rounded-xl border border-gray-100 bg-white py-2 shadow-xl fade-in duration-150">
              <Link
                href="/auth?mode=login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
              >
                <LogIn className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-medium">Đăng nhập</span>
              </Link>

              <Link
                href="/auth?mode=register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
              >
                <UserPlus className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-medium">Đăng ký</span>
              </Link>

              <div className="border-t border-gray-100 my-1" />

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
              >
                <Package className="w-4 h-4 text-[#2E7D32]" />
                <span>Theo dõi đơn hàng</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. STATE: AUTHENTICATED (LOGGED IN USER / ADMIN)
  const isAdmin = user.role === "ADMIN";
  const isStaff = user.role === "STAFF";

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false);
      }}
    >
      {/* Trigger: User Avatar Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
        aria-expanded={isOpen}
      >
        {/* Avatar Circle with Online Indicator */}
        <div className="relative">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${
              isAdmin
                ? "bg-linear-to-tr from-amber-600 to-amber-500 ring-2 ring-amber-300"
                : isStaff
                  ? "bg-linear-to-tr from-blue-600 to-blue-500 ring-2 ring-blue-300"
                  : "bg-linear-to-tr from-[#2E7D32] to-[#4CAF50] ring-2 ring-emerald-300"
            }`}
          >
            {getInitials(user.fullName)}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* User Name & Role Pill */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] max-w-[110px] truncate leading-tight">
            {user.fullName}
          </span>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider leading-none mt-0.5 ${
              isAdmin
                ? "text-amber-700"
                : isStaff
                  ? "text-blue-700"
                  : "text-emerald-700"
            }`}
          >
            {isAdmin ? "Quản trị viên" : isStaff ? "Nhân viên" : "Khách hàng"}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Modern Avatar Hover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-72 pt-2">
          <div className="animate-in slide-in-from-top-2 overflow-hidden rounded-2xl border border-gray-100 bg-white py-3 shadow-2xl fade-in duration-150">
            {/* Header Profile Card */}
            <div className="px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white shadow-sm shrink-0 ${
                    isAdmin
                      ? "bg-linear-to-tr from-amber-600 to-amber-500"
                      : isStaff
                        ? "bg-linear-to-tr from-blue-600 to-blue-500"
                        : "bg-linear-to-tr from-[#2E7D32] to-[#4CAF50]"
                  }`}
                >
                  {getInitials(user.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {user.fullName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isAdmin
                          ? "bg-amber-100 text-amber-800"
                          : isStaff
                            ? "bg-blue-100 text-blue-800"
                            : "bg-[#E8F5E9] text-[#2E7D32]"
                      }`}
                    >
                      {isAdmin && <Shield className="w-3 h-3 text-amber-600" />}
                      <span>
                        {isAdmin
                          ? "Quyền: ADMIN"
                          : isStaff
                            ? "Quyền: STAFF"
                            : "Khách Thân Thiết"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="p-2 bg-amber-50/60 border-b border-amber-100 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Quyền Quản Trị Hệ Thống</span>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-amber-100/80 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Bảng điều khiển quản trị</span>
                </Link>
              </div>
            )}

            {/* Regular User Nav Links */}
            <div className="p-2 space-y-0.5">
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] rounded-lg transition-colors"
              >
                <Package className="w-4 h-4 text-[#2E7D32]" />
                <span>Đơn hàng của tôi</span>
              </Link>

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#2E7D32]" />
                <span>Địa chỉ nhận hàng</span>
              </Link>

              <Link
                href="/policies"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-[#2E7D32]" />
                <span>Điều khoản & Chính sách</span>
              </Link>
            </div>

            {/* Logout Action */}
            <div className="pt-2 px-2 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
