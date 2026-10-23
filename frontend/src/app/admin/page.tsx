"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowUpRight, Leaf, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import type { User } from "../../types";
import { authService } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token || user?.role !== "ADMIN") {
      router.replace("/auth?mode=login");
      return;
    }

    let isCurrent = true;
    authService
      .getAdminDashboard()
      .then((dashboard) => {
        if (isCurrent) setAdmin(dashboard.user);
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          logout();
          router.replace("/");
          return;
        }
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          router.replace("/auth?mode=login");
          return;
        }
        setError("Không thể tải dữ liệu quản trị. Vui lòng thử lại sau.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [hasHydrated, logout, router, token, user?.role]);

  if (!hasHydrated || isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-sm text-gray-500">
        Đang xác thực quyền quản trị...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-white"
        >
          Tải lại
        </button>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#174D30] via-[#23683A] to-[#3C8C4A] p-7 text-white shadow-lg sm:p-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Khu vực quản trị VFT Farms
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Xin chào, {admin.fullName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
              Phiên đăng nhập đã được xác thực. Bạn đang truy cập bằng tài khoản
              được cấp quyền quản trị.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold">{admin.fullName}</p>
              <p className="mt-0.5 text-xs text-white/75">{admin.email}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#D8F3DC]">
                Quản trị viên
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-gray-900">
                Thông tin quyền truy cập
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Quyền được máy chủ xác thực từ phiên đăng nhập
              </p>
            </div>
          </div>
          <dl className="mt-5 divide-y divide-gray-100 text-sm">
            <div className="flex justify-between py-3">
              <dt className="text-gray-500">Vai trò</dt>
              <dd className="font-semibold text-[#2E7D32]">ADMIN</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-800">{admin.email}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-gray-500">Điện thoại</dt>
              <dd className="font-medium text-gray-800">{admin.phoneNumber}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F8E9] text-[#558B2F]">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-gray-900">Cửa hàng VFT Farms</h2>
              <p className="mt-1 text-xs text-gray-500">
                Truy cập nhanh tới các khu vực đang hoạt động
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C8E6C9] hover:bg-[#F7FCF7] hover:text-[#2E7D32]"
          >
            Xem cửa hàng
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C8E6C9] hover:bg-[#F7FCF7] hover:text-[#2E7D32]"
          >
            Danh mục sản phẩm
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/orders"
            className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C8E6C9] hover:bg-[#F7FCF7] hover:text-[#2E7D32]"
          >
            Quản lý đơn hàng
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/news"
            className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C8E6C9] hover:bg-[#F7FCF7] hover:text-[#2E7D32]"
          >
            Quản lý tin tức & bài viết
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/products"
            className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C8E6C9] hover:bg-[#F7FCF7] hover:text-[#2E7D32]"
          >
            Quản lý sản phẩm
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/users"
            className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C8E6C9] hover:bg-[#F7FCF7] hover:text-[#2E7D32]"
          >
            Quản lý tài khoản
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
