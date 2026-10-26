"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Eye,
  User,
  ArrowLeft,
  Share2,
  Clock,
  Sparkles,
  BookOpen,
  Tag,
  ShoppingBag,
  Check,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { newsService } from "../../../services/news.service";
import type { NewsArticle, NewsCategory } from "../../../types";

function NewsDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [topArticles, setTopArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    newsService
      .getBySlug(slug)
      .then(async (data) => {
        setArticle(data);
        // Load related & top articles
        try {
          const listRes = await newsService.getAll({ limit: 6 });
          const others = listRes.items.filter((item: NewsArticle) => item.id !== data.id);
          setRelatedArticles(
            others.filter((item: NewsArticle) => item.category === data.category).slice(0, 3),
          );
          setTopArticles(
            [...others].sort((a: NewsArticle, b: NewsArticle) => b.views - a.views).slice(0, 4),
          );
        } catch {
          // ignore related load error
        }
      })
      .catch((err) => {
        console.error("Lỗi tải chi tiết bài viết:", err);
        setError("Không tìm thấy bài viết hoặc bài viết đã bị gỡ.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderCategoryBadge = (cat: NewsCategory) => {
    switch (cat) {
      case "TIN_TRANG_TRAI":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#2E7D32]">
            <Sparkles className="w-3.5 h-3.5" />
            Tin Trang Trại
          </span>
        );
      case "KIEN_THUC":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
            <BookOpen className="w-3.5 h-3.5" />
            Kiến Thức Nông Nghiệp
          </span>
        );
      case "THONG_BAO":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            <Tag className="w-3.5 h-3.5" />
            Thông Báo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {cat}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
        <p className="text-sm font-medium">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {error || "Bài viết không tồn tại"}
        </h2>
        <p className="text-xs text-gray-500">
          Đường dẫn có thể đã thay đổi hoặc bài viết chưa được xuất bản.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 bg-[#2E7D32] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang tin tức</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-[#2E7D32] transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/news" className="hover:text-[#2E7D32] transition-colors">
          Tin tức & Cẩm nang
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Main Grid: Article Body & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Article Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
            {/* Meta Header */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {renderCategoryBadge(article.category)}

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  <User className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {article.authorName || "Ban biên tập VFT Farms"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  {article.views} lượt xem
                </span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F5E9]/50 border border-emerald-100 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed italic">
              {article.summary}
            </div>

            {/* Hero Thumbnail */}
            <div className="relative w-full aspect-video sm:aspect-2/1 rounded-2xl overflow-hidden bg-gray-100 shadow-xs">
              <Image
                src={article.thumbnailUrl}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
                priority
              />
            </div>

            {/* HTML Content Body */}
            <div
              className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed space-y-4 
                [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-black [&>h2]:text-gray-900 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-gray-100
                [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#2E7D32]
                [&>p]:text-sm [&>p]:sm:text-base [&>p]:text-gray-700 [&>p]:leading-relaxed
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-sm
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:text-sm
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#2E7D32] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
                [&>img]:rounded-2xl [&>img]:shadow-sm"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Post footer */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Xem thêm các bài viết khác</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Viewed Articles */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
              <Eye className="w-4 h-4 text-[#2E7D32]" />
              <span>Được Quan Tâm Nhiều Nhất</span>
            </h3>

            <div className="space-y-4">
              {topArticles.map((top, idx) => (
                <Link
                  key={top.id}
                  href={`/news/${top.slug}`}
                  className="group flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-[#2E7D32] font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                      {top.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 flex items-center gap-2">
                      <span>{new Date(top.createdAt).toLocaleDateString("vi-VN")}</span>
                      <span>•</span>
                      <span>{top.views} lượt xem</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span>Bài Viết Cùng Chủ Đề</span>
              </h3>

              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="group flex gap-3 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={rel.thumbnailUrl}
                        alt={rel.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 block">
                        {new Date(rel.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div className="rounded-3xl bg-linear-to-br from-[#174D30] to-[#2E7D32] text-white p-6 shadow-sm space-y-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              Nông Sản Sạch VFT
            </span>
            <h4 className="text-lg font-black leading-snug">
              Mua Sắm Rau Củ Tươi Chuẩn VietGAP Ngay Hôm Nay
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Giao hàng nhanh nội thành 2 giờ. Truy xuất nguồn gốc mã hash
              SHA-256 minh bạch cho từng đơn hàng.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white text-[#174D30] font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Xem thực phẩm sạch</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsDetailPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-500">Đang tải bài viết...</div>}>
      <NewsDetailContent />
    </Suspense>
  );
}

