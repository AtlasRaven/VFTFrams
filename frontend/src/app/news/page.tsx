"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Search,
  Calendar,
  Eye,
  ArrowRight,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Tag,
  Clock,
  User,
} from "lucide-react";
import { newsService } from "../../services/news.service";
import type { NewsArticle, NewsCategory } from "../../types";

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: "ALL", label: "Tất cả bài viết" },
  { key: "TIN_TRANG_TRAI", label: "Tin trang trại" },
  { key: "KIEN_THUC", label: "Kiến thức thực phẩm" },
  { key: "THONG_BAO", label: "Thông báo" },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newsService.getAll({
        page,
        limit: 9,
        category: category !== "ALL" ? category : undefined,
        search: debouncedSearch || undefined,
      });
      setArticles(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      console.error("Lỗi khi tải tin tức:", err);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [page, category, debouncedSearch]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const renderCategoryBadge = (cat: NewsCategory) => {
    switch (cat) {
      case "TIN_TRANG_TRAI":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-[#2E7D32]">
            <Sparkles className="w-3 h-3" />
            Tin Trang Trại
          </span>
        );
      case "KIEN_THUC":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
            <BookOpen className="w-3 h-3" />
            Kiến Thức Nông Nghiệp
          </span>
        );
      case "THONG_BAO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            <Tag className="w-3 h-3" />
            Thông Báo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
            {cat}
          </span>
        );
    }
  };

  const featuredArticle = articles.length > 0 && page === 1 && !debouncedSearch ? articles[0] : null;
  const gridArticles = featuredArticle ? articles.slice(1) : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#174D30] via-[#23683A] to-[#3C8C4A] p-8 sm:p-12 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
            <Newspaper className="h-4 w-4 text-emerald-300" />
            <span>Cẩm Nang & Tin Tức VFT Farms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Nông Nghiệp Sạch & Sống Khỏe Mỗi Ngày
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            Khám phá quy trình canh tác hữu cơ chuẩn VietGAP, công nghệ minh
            bạch nguồn gốc SHA-256 và những bí quyết dinh dưỡng từ nông trại.
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
      </div>

      {/* Toolbar: Search & Category Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setCategory(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                category === tab.key
                  ? "bg-[#2E7D32] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="h-64 sm:h-80 w-full bg-gray-100 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse space-y-4 p-4"
              >
                <div className="h-44 bg-gray-200 rounded-xl" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-full bg-gray-200 rounded" />
                <div className="h-4 w-4/5 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-4">
          <p className="text-sm font-semibold text-gray-800">{error}</p>
          <button
            onClick={loadNews}
            className="inline-flex items-center gap-2 bg-[#2E7D32] text-white px-5 py-2 rounded-xl text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tải lại</span>
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
            <Newspaper className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-800">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {debouncedSearch
                ? `Không có kết quả nào phù hợp với từ khóa "${debouncedSearch}".`
                : "Chưa có bài viết nào trong danh mục này."}
            </p>
          </div>
          {(debouncedSearch || category !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategory("ALL");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Article Hero Card */}
          {featuredArticle && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 group hover:border-[#81C784]/60 transition-all">
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[300px] overflow-hidden bg-gray-100">
                <Image
                  src={featuredArticle.thumbnailUrl}
                  alt={featuredArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {renderCategoryBadge(featuredArticle.category)}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {featuredArticle.views} lượt xem
                    </span>
                  </div>

                  <Link href={`/news/${featuredArticle.slug}`}>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[#2E7D32] transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>
                      {new Date(featuredArticle.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/news/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] group-hover:translate-x-1 transition-all"
                  >
                    <span>Đọc bài viết</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid Articles */}
          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {gridArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#81C784]/60 transition-all flex flex-col justify-between group"
                >
                  <Link
                    href={`/news/${article.slug}`}
                    className="block relative h-48 w-full overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={article.thumbnailUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        {renderCategoryBadge(article.category)}
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </span>
                      </div>

                      <Link href={`/news/${article.slug}`}>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32] hover:underline"
                      >
                        <span>Chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    page === p
                      ? "bg-[#2E7D32] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
