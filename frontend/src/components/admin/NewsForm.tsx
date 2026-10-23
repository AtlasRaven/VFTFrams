"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Edit3,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { newsService } from "../../services/news.service";
import type { NewsArticle, NewsCategory } from "../../types";

interface NewsFormProps {
  initialData?: NewsArticle;
  isEdit?: boolean;
}

function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const NewsForm: React.FC<NewsFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEdit);
  const [category, setCategory] = useState<NewsCategory>(
    initialData?.category || "TIN_TRANG_TRAI",
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || "",
  );
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [content, setContent] = useState(initialData?.content || "");

  const [activeTab, setActiveTab] = useState<"WRITE" | "PREVIEW">("WRITE");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync title to slug if autoSlug enabled
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Helper to insert formatting tags into textarea
  const insertTag = (prefix: string, suffix: string, defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length,
      );
    }, 0);
  };

  const handleInsertHeading2 = () =>
    insertTag("<h2>", "</h2>", "Tiêu đề mục lớn");
  const handleInsertHeading3 = () =>
    insertTag("<h3>", "</h3>", "Tiêu đề mục nhỏ");
  const handleInsertBold = () => insertTag("<strong>", "</strong>", "in đậm");
  const handleInsertItalic = () => insertTag("<em>", "</em>", "in nghiêng");
  const handleInsertQuote = () =>
    insertTag("<blockquote>\n  ", "\n</blockquote>", "Đoạn trích dẫn...");
  const handleInsertList = () =>
    insertTag(
      "<ul>\n  <li>",
      "</li>\n  <li>Ý thứ hai</li>\n</ul>",
      "Ý thứ nhất",
    );
  const handleInsertOrderedList = () =>
    insertTag(
      "<ol>\n  <li>",
      "</li>\n  <li>Bước thứ hai</li>\n</ol>",
      "Bước thứ nhất",
    );
  const handleInsertImage = () => {
    const url = prompt(
      "Nhập URL ảnh nông sản muốn chèn vào bài viết:",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    );
    if (url) {
      insertTag(`<img src="${url}" alt="`, '" />', "Mô tả hình ảnh");
    }
  };
  const handleInsertLink = () => {
    const url = prompt("Nhập đường dẫn liên kết:", "https://");
    if (url) {
      insertTag(`<a href="${url}" target="_blank">`, "</a>", "Văn bản liên kết");
    }
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết.");
      return;
    }
    if (!summary.trim()) {
      setError("Vui lòng nhập đoạn tóm tắt bài viết.");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bài viết.");
      return;
    }
    if (!thumbnailUrl.trim()) {
      setError("Vui lòng nhập đường dẫn ảnh bìa (thumbnail).");
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      category,
      thumbnailUrl: thumbnailUrl.trim(),
      summary: summary.trim(),
      content: content.trim(),
      isPublished,
    };

    try {
      if (isEdit && initialData) {
        await newsService.update(initialData.id, payload);
      } else {
        await newsService.create(payload);
      }
      router.push("/admin/news");
      router.refresh();
    } catch (err: unknown) {
      console.error("Lỗi khi lưu bài viết:", err);
      setError("Không thể lưu bài viết. Vui lòng kiểm tra lại thông tin và kết nối máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {isEdit ? "Chỉnh Sửa Bài Viết" : "Soạn Thảo Bài Viết Mới"}
            </h1>
            <p className="text-xs text-gray-500">
              {isEdit
                ? `Cập nhật nội dung cho bài #${initialData?.id}`
                : "Tạo bài viết nông nghiệp sạch, tin tức hoặc thông báo hệ thống"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-gray-500" />
            )}
            <span>Lưu Nháp</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-xs font-bold text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Xuất Bản Ngay</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Lưu bài viết không thành công</p>
            <p className="mt-0.5 text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Tiêu Đề Bài Viết <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ví dụ: Quy trình canh tác hữu cơ chuẩn VietGAP tại VFT Farms..."
            className="w-full px-4 py-3 text-sm sm:text-base font-bold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
        </div>

        {/* Slug & Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Đường dẫn SEO (Slug)
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-[11px] font-semibold text-[#2E7D32] hover:underline cursor-pointer"
              >
                {autoSlug ? "Tự động tạo từ tiêu đề" : "Chỉnh sửa thủ công"}
              </button>
            </div>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-mono text-gray-600 focus-within:bg-white focus-within:border-[#2E7D32]">
              <span className="text-gray-400 select-none">/news/</span>
              <input
                type="text"
                value={slug}
                readOnly={autoSlug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="duong-dan-bai-viet"
                className="flex-1 bg-transparent px-1 focus:outline-none text-gray-900 font-mono"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Danh Mục Bài Viết <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsCategory)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 cursor-pointer"
            >
              <option value="TIN_TRANG_TRAI">Tin trang trại (Vườn ươm, Nông trại)</option>
              <option value="KIEN_THUC">Kiến thức thực phẩm (Mẹo, Dinh dưỡng, SHA-256)</option>
              <option value="THONG_BAO">Thông báo hệ thống (Chính sách, Vận chuyển)</option>
            </select>
          </div>
        </div>

        {/* Thumbnail URL & Live Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Ảnh Bìa Thumbnail <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Hỗ trợ 3 tệp: .jpg, .png, .webp
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... hoặc bấm Tải ảnh"
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
                <label className="cursor-pointer px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors shrink-0">
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
                          setThumbnailUrl(ev.target.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
              <p className="text-[11px] text-gray-400">
                Nhập link ảnh chất lượng cao hoặc tải trực tiếp ảnh .jpg, .png, .webp từ máy tính.
              </p>
            </div>

            {thumbnailUrl && (
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                <Image
                  src={thumbnailUrl}
                  alt="Xem trước ảnh bìa"
                  fill
                  unoptimized
                  sizes="112px"
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Đoạn Tóm Tắt (Summary) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">
              {summary.length} ký tự
            </span>
          </div>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Mô tả ngắn gọn khoảng 2-3 câu nội dung chính của bài viết để hiển thị trên thẻ card tin tức..."
            className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
        </div>

        {/* Content with Rich Text Toolbar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Nội Dung Bài Viết (HTML / Rich Text) <span className="text-rose-500">*</span>
            </label>

            {/* Tab switch: Write vs Preview */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("WRITE")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "WRITE"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Soạn Thảo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("PREVIEW")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "PREVIEW"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Xem Trước
              </button>
            </div>
          </div>

          {activeTab === "WRITE" ? (
            <div className="rounded-2xl border border-gray-200 overflow-hidden focus-within:border-[#2E7D32] focus-within:ring-2 focus-within:ring-[#2E7D32]/20">
              {/* Toolbar */}
              <div className="bg-gray-50/90 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={handleInsertHeading2}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-gray-200 text-gray-700 font-bold flex items-center gap-1 cursor-pointer"
                  title="Tiêu đề H2"
                >
                  <Heading2 className="w-4 h-4" />
                  <span>H2</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertHeading3}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-gray-200 text-gray-700 font-bold flex items-center gap-1 cursor-pointer"
                  title="Tiêu đề H3"
                >
                  <Heading3 className="w-4 h-4" />
                  <span>H3</span>
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  type="button"
                  onClick={handleInsertBold}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                  title="In đậm (Bold)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertItalic}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                  title="In nghiêng (Italic)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertQuote}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                  title="Trích dẫn (Quote)"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  type="button"
                  onClick={handleInsertList}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                  title="Danh sách gạch đầu dòng"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertOrderedList}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                  title="Danh sách có thứ tự"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-gray-200 text-gray-700 flex items-center gap-1 cursor-pointer"
                  title="Chèn ảnh"
                >
                  <ImageIcon className="w-4 h-4 text-[#2E7D32]" />
                  <span>Ảnh</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-gray-200 text-gray-700 flex items-center gap-1 cursor-pointer"
                  title="Chèn liên kết"
                >
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                  <span>Link</span>
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài viết HTML (hoặc sử dụng thanh công cụ phía trên để định dạng tiêu đề, danh sách, trích dẫn)..."
                className="w-full p-4 text-xs sm:text-sm font-mono leading-relaxed bg-white focus:outline-none resize-y"
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 min-h-[350px]">
              {content.trim() ? (
                <div
                  className="prose prose-sm max-w-none text-gray-800 
                    [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:pt-2
                    [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#2E7D32]
                    [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-gray-700
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:text-sm
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:text-sm
                    [&>blockquote]:border-l-4 [&>blockquote]:border-[#2E7D32] [&>blockquote]:pl-4 [&>blockquote]:italic
                    [&>img]:rounded-xl [&>img]:shadow-xs"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Chưa có nội dung để xem trước. Hãy nhập nội dung ở tab "Soạn Thảo".
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
