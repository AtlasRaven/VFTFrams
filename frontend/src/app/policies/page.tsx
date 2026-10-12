import React from 'react';
import Link from 'next/link';
import { MOCK_POLICIES } from '../../data/mockData';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Cam kết minh bạch & uy tín</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Chính Sách & Quy Định VFT Farms
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Thông tin chi tiết về các cam kết chất lượng, phương thức mua hàng, thanh toán, vận chuyển và bảo mật dành cho quý khách hàng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_POLICIES.map((policy) => (
          <Link
            key={policy.id}
            href={`/policies/${policy.slug}`}
            className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#2E7D32] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                {policy.title}
              </h2>
              <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed">
                {policy.content}
              </p>
            </div>

            <div className="flex items-center text-xs font-bold text-[#2E7D32] pt-2 border-t border-gray-100">
              <span>Đọc chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
