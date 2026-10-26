"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
} from "lucide-react";
import { categoryService, productService } from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Category, CertificationType, Product } from "../../../types";

type ProductForm = {
  categoryId: string;
  name: string;
  slug: string;
  imageUrl: string;
  unit: string;
  specification: string;
  price: string;
  salePrice: string;
  stockQuantity: string;
  certification: CertificationType;
  origin: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  description: string;
};

const emptyForm: ProductForm = {
  categoryId: "",
  name: "",
  slug: "",
  imageUrl: "",
  unit: "Kg",
  specification: "",
  price: "",
  salePrice: "",
  stockQuantity: "0",
  certification: "VietGAP",
  origin: "",
  isFeatured: false,
  isBestSeller: false,
  description: "",
};

function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data.message;
    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
  }
  return "Không thể thực hiện thao tác. Vui lòng thử lại.";
}

function toProductInput(form: ProductForm): Omit<Product, "id"> {
  return {
    categoryId: Number(form.categoryId),
    name: form.name.trim(),
    slug: form.slug.trim(),
    imageUrl: form.imageUrl.trim(),
    unit: form.unit.trim(),
    specification: form.specification.trim(),
    price: Number(form.price),
    ...(form.salePrice !== "" ? { salePrice: Number(form.salePrice) } : {}),
    stockQuantity: Number(form.stockQuantity),
    certification: form.certification,
    origin: form.origin.trim(),
    isFeatured: form.isFeatured,
    isBestSeller: form.isBestSeller,
    description: form.description.trim(),
  };
}

export default function AdminProductsPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadData = useCallback(async () => {
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        productService.getAllForAdmin(),
        categoryService.getAllForAdmin(),
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token || !["ADMIN", "STAFF"].includes(user?.role ?? "")) {
      router.replace("/auth?mode=login");
      return;
    }

    let isCurrent = true;
    Promise.all([
      productService.getAllForAdmin(),
      categoryService.getAllForAdmin(),
    ])
      .then(([nextProducts, nextCategories]) => {
        if (!isCurrent) return;
        setProducts(nextProducts);
        setCategories(nextCategories);
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

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setForm({
      categoryId: String(product.categoryId),
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      unit: product.unit,
      specification: product.specification,
      price: String(product.price),
      salePrice: product.salePrice === undefined ? "" : String(product.salePrice),
      stockQuantity: String(product.stockQuantity),
      certification: product.certification ?? "VietGAP",
      origin: product.origin ?? "",
      isFeatured: product.isFeatured ?? false,
      isBestSeller: product.isBestSeller ?? false,
      description: product.description ?? "",
    });
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      const product = toProductInput(form);
      if (editingId === null) {
        await productService.create(product);
        setNotice("Đã thêm sản phẩm.");
      } else {
        await productService.update(editingId, {
          ...product,
          ...(form.salePrice === "" ? { salePrice: null } : {}),
        });
        setNotice("Đã cập nhật sản phẩm.");
      }
      resetForm();
      await loadData();
    } catch (saveError) {
      setError(errorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }
    setError(null);
    setNotice(null);
    try {
      await productService.delete(product.id);
      setNotice("Đã xóa sản phẩm.");
      if (editingId === product.id) resetForm();
      await loadData();
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  };

  if (!hasHydrated || isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-gray-500">
        Đang tải sản phẩm...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Quản lý sản phẩm
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Thêm, cập nhật và xóa sản phẩm trong PostgreSQL.
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
        className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
      >
        <h2 className="text-lg font-bold sm:col-span-2 lg:col-span-3">
          {editingId === null ? "Thêm sản phẩm" : "Sửa sản phẩm"}
        </h2>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Danh mục
          <select
            required
            value={form.categoryId}
            onChange={(event) =>
              setForm({ ...form, categoryId: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Tên sản phẩm
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Slug
          <input
            required
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <div className="space-y-1.5 text-sm font-medium text-gray-700">
          <div className="flex items-center justify-between">
            <span>Hình ảnh nông sản</span>
            <span className="text-xs text-emerald-700 font-normal">Hỗ trợ 3 tệp: .jpg, .png, .webp</span>
          </div>
          <div className="flex gap-2">
            <input
              required
              placeholder="Nhập URL ảnh hoặc bấm Tải tệp..."
              value={form.imageUrl}
              onChange={(event) =>
                setForm({ ...form, imageUrl: event.target.value })
              }
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <label className="cursor-pointer px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors">
              <span>Tải tệp ảnh</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
                  const fileName = file.name.toLowerCase();
                  if (!validExtensions.some((ext) => fileName.endsWith(ext))) {
                    alert("Chỉ chấp nhận tệp định dạng .jpg, .png hoặc .webp");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (typeof ev.target?.result === "string") {
                      setForm((prev) => ({ ...prev, imageUrl: ev.target?.result as string }));
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
          {form.imageUrl && (
            <div className="mt-1 flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={form.imageUrl}
                alt="Xem trước ảnh nông sản"
                className="w-12 h-12 rounded object-cover border border-gray-200"
              />
              <span className="text-xs text-gray-600 truncate max-w-xs font-mono">
                {form.imageUrl.startsWith("data:") ? "Ảnh tải từ máy tính (Data URL)" : form.imageUrl}
              </span>
            </div>
          )}
        </div>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Đơn vị
          <input
            required
            value={form.unit}
            onChange={(event) => setForm({ ...form, unit: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Quy cách
          <input
            required
            value={form.specification}
            onChange={(event) =>
              setForm({ ...form, specification: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Giá
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Giá khuyến mãi (để trống nếu không có)
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.salePrice}
            onChange={(event) =>
              setForm({ ...form, salePrice: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Tồn kho
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.stockQuantity}
            onChange={(event) =>
              setForm({ ...form, stockQuantity: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Chứng nhận
          <select
            value={form.certification}
            onChange={(event) =>
              setForm({
                ...form,
                certification: event.target.value as CertificationType,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="VietGAP">VietGAP</option>
            <option value="VfSC">VfSC</option>
            <option value="Organic">Organic</option>
            <option value="HACCP">HACCP</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          Xuất xứ
          <input
            required
            value={form.origin}
            onChange={(event) => setForm({ ...form, origin: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2 lg:col-span-3">
          Mô tả
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap gap-5 text-sm font-medium text-gray-700 sm:col-span-2 lg:col-span-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) =>
                setForm({ ...form, isFeatured: event.target.checked })
              }
            />
            Sản phẩm nổi bật
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(event) =>
                setForm({ ...form, isBestSeller: event.target.checked })
              }
            />
            Bán chạy
          </label>
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={isSaving || categories.length === 0}
            className="rounded-lg bg-[#2E7D32] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSaving
              ? "Đang lưu..."
              : editingId === null
                ? "Thêm sản phẩm"
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

      {/* Search & Category Filter Toolbar */}
      {(() => {
        const filteredProducts = products.filter((p) => {
          if (categoryFilter !== "ALL" && p.categoryId !== Number(categoryFilter)) {
            return false;
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            return (
              p.name.toLowerCase().includes(q) ||
              p.slug.toLowerCase().includes(q) ||
              (p.origin && p.origin.toLowerCase().includes(q))
            );
          }
          return true;
        });

        const totalPages = Math.ceil(filteredProducts.length / limit) || 1;
        const paginatedProducts = filteredProducts.slice(
          (page - 1) * limit,
          page * limit,
        );

        return (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Tìm theo tên sản phẩm, slug, xuất xứ..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 font-medium text-gray-700 cursor-pointer"
                  >
                    <option value="ALL">Tất cả 10 danh mục ({products.length} SP)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Hiển thị <span className="text-[#2E7D32] font-bold">{filteredProducts.length}</span> / {products.length} sản phẩm
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3">Danh mục</th>
                    <th className="px-4 py-3">Giá</th>
                    <th className="px-4 py-3">Tồn kho</th>
                    <th className="px-4 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        {categories.find((category) => category.id === product.categoryId)
                          ?.name ?? `#${product.categoryId}`}
                      </td>
                      <td className="px-4 py-3">
                        {product.salePrice !== undefined && (
                          <span className="mr-2 text-gray-400 line-through">
                            {product.price.toLocaleString("vi-VN")}₫
                          </span>
                        )}
                        <span className="font-semibold">
                          {(product.salePrice ?? product.price).toLocaleString("vi-VN")}₫
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.stockQuantity} {product.unit}
                      </td>
                      <td className="space-x-3 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="font-semibold text-[#2E7D32] hover:underline"
                        >
                          Sửa
                        </button>
                        {user?.role === "ADMIN" && (
                          <button
                            type="button"
                            onClick={() => void handleDelete(product)}
                            className="font-semibold text-red-600 hover:underline"
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Không tìm thấy sản phẩm nào phù hợp.
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
                      {Math.min(page * limit, filteredProducts.length)}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-bold text-gray-900">
                      {filteredProducts.length}
                    </span>{" "}
                    sản phẩm
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 400, behavior: "smooth" });
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
                            window.scrollTo({ top: 400, behavior: "smooth" });
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
                        window.scrollTo({ top: 400, behavior: "smooth" });
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
          </>
        );
      })()}
    </main>
  );
}
