"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Tag,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { newsService } from "../../../services/news.service";
import { RoleGuard } from "../../../components/auth/RoleGuard";
import { useAuthStore } from "../../../store/useAuthStore";
import type { NewsArticle, NewsCategory } from "../../../types";

export default function AdminNewsPage() {
  const { user } = useAuthStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notice
  const [notice, setNotice] = useState<string | null>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newsService.getAllForAdmin({
        page,
        limit: 15,
        category: categoryFilter !== "ALL" ? categoryFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      setArticles(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      console.error("Lỗi tải tin tức cho admin:", err);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [page, categoryFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTogglePublish = async (article: NewsArticle) => {
    try {
      const updated = await newsService.update(article.id, {
        isPublished: !article.isPublished,
      });
      setNotice(
        `Đã chuyển bài viết "${article.title}" sang trạng thái ${
          updated.isPublished ? "XUẤT BẢN" : "BẢN NHÁP"
        }.`,
      );
      await loadData();
    } catch (err) {
      console.error("Lỗi đổi trạng thái:", err);
      alert("Không thể đổi trạng thái bài viết.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await newsService.delete(deleteTarget.id);
      setNotice(`Đã xóa bài viết "${deleteTarget.title}" thành công.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error("Lỗi xóa bài viết:", err);
      alert("Không thể xóa bài viết. Vui lòng kiểm tra quyền ADMIN.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCategoryBadge = (cat: NewsCategory) => {
    switch (cat) {
      case "TIN_TRANG_TRAI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#2E7D32]">
            Tin Trang Trại
          </span>
        );
      case "KIEN_THUC":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
            Kiến Thức
          </span>
        );
      case "THONG_BAO":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            Thông Báo
          </span>
        );
      default:
        return <span>{cat}</span>;
    }
  };

  // Filter client-side by status if selected
  const displayArticles = articles.filter((a) => {
    if (statusFilter === "PUBLISHED") return a.isPublished;
    if (statusFilter === "DRAFT") return !a.isPublished;
    return true;
  });

  return (
    <RoleGuard allowedRoles={["ADMIN", "STAFF"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href="/admin" className="hover:text-[#2E7D32]">
                Khu vực Quản trị
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Quản lý Tin tức</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-[#2E7D32]" />
              <span>Quản Lý Tin Tức & Cẩm Nang Nông Nghiệp</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Đăng tải bài viết hướng dẫn, tin tức nông trại sinh thái và thông báo chính sách.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/news/create"
              className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Viết bài mới</span>
            </Link>
          </div>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{notice}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Toolbar: Search & Filters */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm tiêu đề, nội dung bài viết..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 font-medium text-gray-700 cursor-pointer"
            >
              <option value="ALL">Tất cả danh mục</option>
              <option value="TIN_TRANG_TRAI">Tin trang trại</option>
              <option value="KIEN_THUC">Kiến thức thực phẩm</option>
              <option value="THONG_BAO">Thông báo</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 font-medium text-gray-700 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp</option>
            </select>
          </div>

          <div className="text-xs font-semibold text-gray-500">
            Tổng cộng: <span className="text-[#2E7D32]">{total}</span> bài viết
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
              <p className="text-sm font-semibold">Đang tải danh sách bài viết...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">{error}</p>
              <button
                onClick={loadData}
                className="bg-[#2E7D32] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Tải lại
              </button>
            </div>
          ) : displayArticles.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-sm font-bold text-gray-700">
                Không tìm thấy bài viết nào
              </h4>
              <p className="text-xs text-gray-400">
                Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút "Viết bài mới".
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ảnh Bìa</th>
                    <th className="py-3.5 px-4">Tiêu Đề & Slug</th>
                    <th className="py-3.5 px-4">Danh Mục</th>
                    <th className="py-3.5 px-4">Lượt Xem</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4">Ngày Đăng</th>
                    <th className="py-3.5 px-4 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {displayArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Thumbnail */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shadow-xs shrink-0">
                          <Image
                            src={article.thumbnailUrl}
                            alt={article.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="py-3.5 px-4 align-top max-w-[280px]">
                        <Link
                          href={`/news/${article.slug}`}
                          target="_blank"
                          className="font-bold text-gray-900 hover:text-[#2E7D32] line-clamp-2 block leading-snug"
                        >
                          {article.title}
                        </Link>
                        <span className="font-mono text-[10px] text-gray-400 mt-1 block truncate">
                          /{article.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {renderCategoryBadge(article.category)}
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          {article.views}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(article)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            article.isPublished
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          }`}
                          title="Click để chuyển trạng thái"
                        >
                          {article.isPublished ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Xuất bản</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Bản nháp</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 align-middle text-gray-500 whitespace-nowrap">
                        {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/news/${article.id}/edit`}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-emerald-50 transition-colors"
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {user?.role === "ADMIN" && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(article)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-gray-500 font-medium">
                    Trang{" "}
                    <span className="font-bold text-gray-900">{page}</span> /{" "}
                    <span className="font-bold text-gray-900">{totalPages}</span>{" "}
                    (Tổng số:{" "}
                    <span className="font-bold text-[#2E7D32]">{total}</span> bài
                    viết)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 300, behavior: "smooth" });
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
                            window.scrollTo({ top: 300, behavior: "smooth" });
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
                        window.scrollTo({ top: 300, behavior: "smooth" });
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
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-gray-900">
                  Xác nhận xóa bài viết
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bạn có chắc chắn muốn xóa bài viết{" "}
                  <strong className="text-gray-900">"{deleteTarget.title}"</strong>
                  ? Thao tác này không thể hoàn tác.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(null)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <span>Xác nhận xóa</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
