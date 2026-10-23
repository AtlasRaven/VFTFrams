"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { userService } from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";
import type { User } from "../../../types";

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
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
    if (!token || user?.role !== "ADMIN") {
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
  }, [hasHydrated, router, token, user?.role]);

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
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          role: form.role,
        });
        setNotice("Đã tạo tài khoản.");
      } else {
        const { password, ...account } = form;
        await userService.update(editingId, {
          ...account,
          ...(password ? { password } : {}),
        });
        setNotice("Đã cập nhật tài khoản.");
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
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${account.email}?`)) {
      return;
    }
    setError(null);
    setNotice(null);
    try {
      await userService.delete(account.id);
      setNotice("Đã xóa tài khoản.");
      if (editingId === account.id) resetForm();
      await loadUsers();
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  };

  if (!hasHydrated || isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-gray-500">
        Đang tải tài khoản...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Quản lý tài khoản
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tạo, cập nhật trạng thái, đổi vai trò hoặc xóa tài khoản trong
          PostgreSQL.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          {notice}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <h2 className="text-lg font-bold sm:col-span-2">
          {editingId === null ? "Thêm tài khoản" : "Sửa tài khoản"}
        </h2>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Họ và tên
          <input
            required
            minLength={2}
            value={form.fullName}
            onChange={(event) =>
              setForm({ ...form, fullName: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Số điện thoại
          <input
            required
            value={form.phoneNumber}
            onChange={(event) =>
              setForm({ ...form, phoneNumber: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          {editingId === null ? "Mật khẩu" : "Mật khẩu mới (để trống nếu giữ nguyên)"}
          <input
            required={editingId === null}
            minLength={8}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Vai trò
          <select
            value={form.role}
            onChange={(event) =>
              setForm({ ...form, role: event.target.value as User["role"] })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="CUSTOMER">Khách hàng</option>
            <option value="STAFF">Nhân viên</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
        </label>
        {editingId !== null && (
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
            />
            Tài khoản đang hoạt động
          </label>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#2E7D32] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSaving
              ? "Đang lưu..."
              : editingId === null
                ? "Thêm tài khoản"
                : "Lưu thay đổi"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Tài khoản</th>
              <th className="px-4 py-3">Điện thoại</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((account) => (
              <tr key={account.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">
                    {account.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{account.email}</p>
                </td>
                <td className="px-4 py-3">{account.phoneNumber}</td>
                <td className="px-4 py-3">{account.role}</td>
                <td className="px-4 py-3">
                  {account.isActive ? "Hoạt động" : "Đã khóa"}
                </td>
                <td className="space-x-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => startEditing(account)}
                    className="font-semibold text-[#2E7D32] hover:underline"
                  >
                    Sửa
                  </button>
                  {account.id !== user?.id && (
                    <button
                      type="button"
                      onClick={() => void handleDelete(account)}
                      className="font-semibold text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Chưa có tài khoản nào trong database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
