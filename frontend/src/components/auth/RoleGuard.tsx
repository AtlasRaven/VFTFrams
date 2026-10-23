"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import type { User } from "../../types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<User["role"]>;
  fallbackUrl?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackUrl = "/auth?mode=login",
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace(fallbackUrl);
    }
  }, [hasHydrated, isAuthenticated, user, router, fallbackUrl]);

  if (!hasHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
        <p className="text-sm text-gray-500 font-medium">
          Đang xác thực quyền truy cập VFT Farms...
        </p>
      </div>
    );
  }

  // Nếu người dùng không nằm trong danh sách quyền được cho phép
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Truy Cập Bị Từ Chối (403)
          </h2>
          <p className="text-sm text-gray-600">
            Tài khoản của bạn ({user.fullName} - vai trò:{" "}
            <span className="font-semibold text-red-600">{user.role}</span>)
            không có quyền truy cập khu vực này.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.replace(user.role === "ADMIN" ? "/admin" : "/")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chính
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * HOC: withRoleGuard
 * Bọc bất kỳ Page Component nào để bảo vệ quyền truy cập
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Array<User["role"]>,
) {
  return function ProtectedPage(props: P) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
