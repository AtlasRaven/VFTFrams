'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ShieldCheck, FileText, CreditCard, RotateCcw, Truck, Lock } from 'lucide-react';
import { MOCK_POLICIES } from '../../data/mockData';

const POLICY_ICONS: Record<string, React.ReactNode> = {
  'cam-ket-dich-vu': <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />,
  'chinh-sach-ban-hang': <FileText className="w-4 h-4 text-[#2E7D32]" />,
  'hinh-thuc-thanh-toan': <CreditCard className="w-4 h-4 text-[#2E7D32]" />,
  'chinh-sach-doi-tra': <RotateCcw className="w-4 h-4 text-[#2E7D32]" />,
  'chinh-sach-giao-hang': <Truck className="w-4 h-4 text-[#2E7D32]" />,
  'chinh-sach-bao-mat': <Lock className="w-4 h-4 text-[#2E7D32]" />,
};

export const PolicyDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/policies"
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#2E7D32] py-2 transition-colors"
      >
        <span>Chính sách</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {isOpen && (
        <div className="absolute left-0 top-full mt-0.5 w-64 bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Chính sách VFT Farms
            </span>
          </div>

          {MOCK_POLICIES.map((policy) => (
            <Link
              key={policy.id}
              href={`/policies/${policy.slug}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
            >
              {POLICY_ICONS[policy.slug] || <FileText className="w-4 h-4 text-[#2E7D32]" />}
              <span className="truncate">{policy.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
