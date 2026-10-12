'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_POLICIES } from '../../../data/mockData';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

function PolicyDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const policy = MOCK_POLICIES.find((p) => p.slug === slug);

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết chính sách</h2>
        <Link href="/policies" className="text-[#2E7D32] font-semibold underline">
          Quay lại danh mục chính sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#2E7D32]">Trang chủ</Link>
        <span>/</span>
        <Link href="/policies" className="hover:text-[#2E7D32]">Chính sách</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{policy.title}</span>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-5 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Quy định VFT Farms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {policy.title}
          </h1>
        </div>

        {/* Content body */}
        <div className="prose max-w-none text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
          <p>{policy.content}</p>

          <div className="bg-[#F1F8E9] p-5 rounded-xl border border-emerald-100 my-6">
            <h3 className="text-sm font-bold text-[#2E7D32] flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cam kết chất lượng từ VFT Farms</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Mọi sản phẩm trước khi giao đến tay khách hàng đều trải qua quy trình kiểm định ngoại quan và đóng gói bảo quản mát nghiêm ngặt. Nếu có bất kỳ thắc mắc nào, quý khách vui lòng liên hệ hotline 02432029199 để được hỗ trợ tức thì.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem các chính sách khác</span>
          </Link>

          <Link
            href="/products"
            className="bg-[#2E7D32] text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-[#1B5E20] transition-colors"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PolicyDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Đang tải chính sách...</div>}>
      <PolicyDetailContent />
    </Suspense>
  );
}
