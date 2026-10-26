"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout, CheckCircle2, ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { authService } from "../../services/api";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const session = await authService.login({
          email: formData.email.trim(),
          password: formData.password,
        });
        login(session.accessToken, session.user, session.refreshToken);
        setMessage(`Đăng nhập thành công. Xin chào ${session.user.fullName}!`);
        router.replace(session.user.role === "ADMIN" ? "/admin" : "/");
        return;
      }

      await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        password: formData.password,
      });
      setMessage(
        "Đăng ký tài khoản Khách Hàng (CUSTOMER) thành công! Quyền STAFF hoặc ADMIN chỉ được cấp bởi Quản trị viên.",
      );
      setFormData({ fullName: "", email: "", phone: "", password: "" });
      setMode("login");
    } catch (submitError) {
      if (axios.isAxiosError<{ message?: string | string[] }>(submitError)) {
        const apiMessage = submitError.response?.data.message;
        setError(
          Array.isArray(apiMessage)
            ? apiMessage.join(", ")
            : apiMessage || "Không thể kết nối máy chủ. Vui lòng thử lại.",
        );
      } else if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            {mode === "login" ? "Đăng Nhập Tài Khoản" : "Tạo Tài Khoản Mới"}
          </h1>
          <p className="text-xs text-gray-500">
            Cửa hàng nông sản & thực phẩm tươi sạch VFT Farms
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage(null);
              setError(null);
            }}
            className={`py-2 rounded-md transition-all cursor-pointer ${
              mode === "login"
                ? "bg-white text-[#2E7D32] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMessage(null);
              setError(null);
            }}
            className={`py-2 rounded-md transition-all cursor-pointer ${
              mode === "register"
                ? "bg-white text-[#2E7D32] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {message && (
          <div className="bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2E7D32]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Vai trò tài khoản: Khách Hàng (CUSTOMER)</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Tài khoản đăng ký trực tuyến sẽ mặc định có vai trò <strong>Khách Hàng</strong>. Các vai trò <strong>Nhân Viên (STAFF)</strong> hoặc <strong>Quản Trị Viên (ADMIN)</strong> chỉ được tạo hoặc cấp quyền bởi Quản trị viên hệ thống.
              </p>
            </div>
          )}

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="0912345678"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3 rounded-lg font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>
              {isSubmitting
                ? "Đang xử lý..."
                : mode === "login"
                  ? "Đăng Nhập"
                  : "Tạo Tài Khoản"}
            </span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500">
          Bằng việc tiếp tục, bạn đồng ý với{" "}
          <Link
            href="/policies/chinh-sach-ban-hang"
            className="text-[#2E7D32] underline"
          >
            Điều khoản & Chính sách bán hàng
          </Link>{" "}
          của VFT Farms.
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-gray-500">Đang tải...</div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
