"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { RoleGuard } from "../../../../../components/auth/RoleGuard";
import { NewsForm } from "../../../../../components/admin/NewsForm";
import { newsService } from "../../../../../services/news.service";
import type { NewsArticle } from "../../../../../types";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

function EditNewsContent() {
  const params = useParams();
  const idStr = params?.id as string;
  const id = Number(idStr);

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("Mã bài viết không hợp lệ.");
      setIsLoading(false);
      return;
    }

    newsService
      .getById(id)
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => {
        console.error("Lỗi tải bài viết:", err);
        setError("Không tìm thấy bài viết hoặc bài viết đã bị xóa.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
          <p className="text-sm font-semibold">Đang tải thông tin bài viết #{id}...</p>
        </div>
      ) : error || !article ? (
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">{error || "Lỗi tải bài viết"}</h3>
          <Link
            href="/admin/news"
            className="inline-block bg-[#2E7D32] text-white px-5 py-2 rounded-xl text-xs font-bold"
          >
            Quay lại danh sách tin tức
          </Link>
        </div>
      ) : (
        <NewsForm initialData={article} isEdit={true} />
      )}
    </div>
  );
}

export default function EditNewsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "STAFF"]}>
      <Suspense fallback={<div className="py-24 text-center text-gray-500">Đang tải bài viết...</div>}>
        <EditNewsContent />
      </Suspense>
    </RoleGuard>
  );
}
