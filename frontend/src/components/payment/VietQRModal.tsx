"use client";

import React from "react";
import { X } from "lucide-react";
import { VietQRDisplay } from "./VietQRDisplay";

interface VietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  amount: number;
}

export function VietQRModal({
  isOpen,
  onClose,
  orderCode,
  amount,
}: VietQRModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 my-8 max-h-[90vh] overflow-y-auto border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <VietQRDisplay
          amount={amount}
          orderCode={orderCode}
          isConfirmedOrder={true}
        />
      </div>
    </div>
  );
}
