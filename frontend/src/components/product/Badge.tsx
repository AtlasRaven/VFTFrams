import React from 'react';
import { CertificationType } from '../../types';

interface BadgeProps {
  certification?: CertificationType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ certification, className = '' }) => {
  if (!certification) return null;

  const isVietGAP = certification === 'VietGAP';
  const isVfSC = certification === 'VfSC';

  const badgeStyles = isVietGAP
    ? 'bg-[#E0E0E0] text-[#1B5E20] border border-[#BDBDBD] font-bold shadow-xs'
    : isVfSC
    ? 'bg-[#2E7D32] text-white font-bold shadow-xs'
    : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] tracking-wide uppercase font-semibold transition-all ${badgeStyles} ${className}`}
    >
      {certification}
    </span>
  );
};
