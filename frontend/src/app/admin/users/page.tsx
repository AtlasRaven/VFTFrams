"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { userService } from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";
import type { User } from "../../../types";
import {
  ShieldAlert,
  UserCheck,
  UserCog,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AccountForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: User["role"];
  isActive: boolean;
};

const emptyForm: AccountForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: "CUSTOMER",
  isActive: true,
};

function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data.message;
    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
  }
  return "Không thể thực hiện thao tác. Vui lòng thử lại.";
}

export default function AdminUsersPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Bộ lọc tìm kiếm & Tab phân loại Role
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadUsers = useCallback(async () => {
    try {
      setUsers(await userService.getAll());
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token || currentUser?.role !== "ADMIN") {
      router.replace("/auth?mode=login");
      return;
    }

    let isCurrent = true;
    userService
      .getAll()
      .then((accounts) => {
        if (isCurrent) setUsers(accounts);
      })
      .catch((loadError: unknown) => {
        if (isCurrent) setError(errorMessage(loadError));
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [hasHydrated, router, token, currentUser?.role]);

  const startEditing = (account: User) => {
    setEditingId(account.id);
    setForm({
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
      password: "",
      role: account.role,
      isActive: account.isActive ?? true,
    });
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      if (editingId === null) {
        await userService.create({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          role: form.role,
        });
        setNotice(
          `Đã tạo tài khoản thành công với vai trò ${
            form.role === "ADMIN"
              ? "Quản trị viên (ADMIN)"
              : form.role === "STAFF"
                ? "Nhân viên (STAFF)"
                : "Khách hàng (CUSTOMER)"
          }.`,
        );
      } else {
        const { password, ...account } = form;
        await userService.update(editingId, {
          ...account,
          fullName: account.fullName.trim(),
          email: account.email.trim(),
          phoneNumber: account.phoneNumber.trim(),
          ...(password ? { password } : {}),
        });
        setNotice("Đã cập nhật thông tin và quyền hạn tài khoản thành công.");
      }
      resetForm();
      await loadUsers();
    } catch (saveError) {
      setError(errorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (account: User) => {
    if (account.id === currentUser?.id) {
      setError("Không thể xóa tài khoản Quản trị viên đang đăng nhập.");
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${account.email}?`)) {
      return;
    }
    setError(null);
    setNotice(null);
    try {
      await userService.delete(account.id);
      setNotice(`Đã xóa tài khoản ${account.email}.`);
      if (editingId === account.id) resetForm();
      await loadUsers();
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  };

  // Lọc danh sách theo vai trò và từ khóa tìm kiếm
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole =
        selectedRoleTab === "ALL" ? true : u.role === selectedRoleTab;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phoneNumber.includes(q);
      return matchRole && matchSearch;
    });
  }, [users, selectedRoleTab, searchTerm]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      customer: users.filter((u) => u.role === "CUSTOMER").length,
      staff: users.filter((u) => u.role === "STAFF").length,
      admin: users.filter((u) => u.role === "ADMIN").length,
    };
  }, [users]);

  const totalPages = Math.ceil(filteredUsers.length / limit) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  if (!hasHydrated || isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-gray-500">
        Đang tải danh sách tài khoản...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Quản Lý Người Dùng & Phân Quyền Vai Trò
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý tài khoản khách hàng, nhân viên và quản trị viên trong hệ thống VFT Farms.
        </p>
      </div>

      {/* Business Policy Callout */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldAlert className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm text-[#2E7D32]">
            Quy định phân quyền vai trò (Role-Based Access Control)
          </p>
          <p className="text-gray-700 leading-relaxed">
            • Tài khoản tạo mới tự do ngoài giao diện công khai (<code>/auth</code>) luôn dừng ở vai trò mặc định:{" "}
            <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              CUSTOMER (Khách hàng)
            </span>
            .<br />
            • Các vai trò đặc quyền{" "}
            <span className="font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
              STAFF (Nhân viên)
            </span>{" "}
            và{" "}
            <span className="font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
              ADMIN (Quản trị viên)
            </span>{" "}
            chỉ được cấp hoặc bổ nhiệm bởi tài khoản có vai trò <strong>ADMIN</strong> tại trang quản trị này.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Account Creation / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:grid-cols-2"
      >
        <div className="sm:col-span-2 border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editingId === null ? "Cấp Tài Khoản Mới" : "Chỉnh Sửa & Phân Quyền Tài Khoản"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {editingId === null
                ? "Admin có thể chỉ định vai trò STAFF hoặc ADMIN cho tài khoản này."
                : `Đang chỉnh sửa người dùng #${editingId}`}
            </p>
          </div>
          {editingId !== null && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">
              Đang chỉnh sửa
            </span>
          )}
        </div>

        <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-gray-700">
          Họ và tên <span className="text-red-500">*</span>
          <input
            required
            minLength={2}
            value={form.fullName}
            onChange={(event) =>
              setForm({ ...form, fullName: event.target.value })
            }
            placeholder="Nguyễn Văn A"
            className="w-full text-sm font-normal rounded-lg border border-gray-300 px-3.5 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </label>

        <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-gray-700">
          Email <span className="text-red-500">*</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="nhanvien@vftfarms.vn"
            className="w-full text-sm font-normal rounded-lg border border-gray-300 px-3.5 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </label>

        <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-gray-700">
          Số điện thoại <span className="text-red-500">*</span>
          <input
            required
            type="tel"
            value={form.phoneNumber}
            onChange={(event) =>
              setForm({ ...form, phoneNumber: event.target.value })
            }
            placeholder="0912345678"
            className="w-full text-sm font-normal rounded-lg border border-gray-300 px-3.5 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </label>

        <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-gray-700">
          {editingId === null
            ? "Mật khẩu ban đầu *"
            : "Mật khẩu mới (để trống nếu giữ nguyên)"}
          <input
            required={editingId === null}
            minLength={8}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            placeholder="Tối thiểu 8 ký tự"
            className="w-full text-sm font-normal rounded-lg border border-gray-300 px-3.5 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </label>

        <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-gray-700 sm:col-span-2">
          Phân Quyền Vai Trò (Role) <span className="text-red-500">*</span>
          <select
            value={form.role}
            disabled={editingId === currentUser?.id}
            onChange={(event) =>
              setForm({ ...form, role: event.target.value as User["role"] })
            }
            className="w-full text-sm font-medium rounded-lg border border-gray-300 px-3.5 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] bg-white cursor-pointer"
          >
            <option value="CUSTOMER">Khách Hàng (CUSTOMER) - Mua hàng, xem đơn cá nhân</option>
            <option value="STAFF">Nhân Viên (STAFF) - Duyệt đơn, kiểm kho, viết tin tức</option>
            <option value="ADMIN">Quản Trị Viên (ADMIN) - Toàn quyền cấu hình & phân quyền người dùng</option>
          </select>
          {editingId === currentUser?.id && (
            <p className="text-[11px] text-gray-400 font-normal mt-1">
              Bạn không thể tự thay đổi vai trò Admin của chính tài khoản đang đăng nhập.
            </p>
          )}
        </label>

        {editingId !== null && (
          <label className="flex items-center gap-2.5 text-xs font-bold text-gray-700 sm:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              disabled={editingId === currentUser?.id}
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
            />
            <span>Kích hoạt tài khoản (Bỏ tích để khóa tài khoản không cho đăng nhập)</span>
          </label>
        )}

        <div className="flex gap-2 sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSaving
              ? "Đang lưu..."
              : editingId === null
                ? "Cấp Tài Khoản"
                : "Lưu Thay Đổi"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 hover:bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors cursor-pointer"
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { label: "Tất cả", value: "ALL", count: counts.all },
            { label: "Khách hàng", value: "CUSTOMER", count: counts.customer },
            { label: "Nhân viên", value: "STAFF", count: counts.staff },
            { label: "Quản trị viên", value: "ADMIN", count: counts.admin },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedRoleTab(tab.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedRoleTab === tab.value
                  ? "bg-[#2E7D32] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedRoleTab === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-bold">Người dùng</th>
              <th className="px-4 py-3 font-bold">Số điện thoại</th>
              <th className="px-4 py-3 font-bold">Vai trò (Role)</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map((account) => {
              const isSelf = account.id === currentUser?.id;
              return (
                <tr
                  key={account.id}
                  className={`hover:bg-gray-50/80 transition-colors ${
                    editingId === account.id ? "bg-emerald-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {account.avatarUrl ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 shadow-xs">
                          <Image
                            src={account.avatarUrl}
                            alt={account.fullName}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {account.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{account.fullName}</span>
                          {isSelf && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-semibold">
                              Bạn
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-gray-700 font-medium">
                    {account.phoneNumber || "—"}
                  </td>

                  <td className="px-4 py-3.5">
                    {account.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-1 rounded-full font-bold">
                        <UserCog className="w-3.5 h-3.5" />
                        <span>ADMIN</span>
                      </span>
                    ) : account.role === "STAFF" ? (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>STAFF</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>CUSTOMER</span>
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {account.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Hoạt động</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Đã khóa</span>
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => startEditing(account)}
                      className="font-bold text-[#2E7D32] hover:underline text-xs cursor-pointer"
                    >
                      Phân quyền / Sửa
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => void handleDelete(account)}
                        className="font-bold text-red-600 hover:underline text-xs cursor-pointer"
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500 text-xs">
                  Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Hiển thị{" "}
              <span className="font-bold text-gray-900">
                {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, filteredUsers.length)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-bold text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              tài khoản
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trang trước</span>
              </button>

              <div className="flex items-center gap-1 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === p
                        ? "bg-[#2E7D32] text-white shadow-xs"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-xs"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
              >
                <span>Trang sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
