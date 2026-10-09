"use client";

import React from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div
      onClick={onClose}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="bg-[#191F28] text-white px-5 py-3.5 rounded-[14px] shadow-[0_8px_24px_rgba(25,31,40,0.16)] flex items-center gap-2.5 font-medium text-[15px]">
        {/* Green Check Icon (20px circle + white check) */}
        <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </div>
        <span>{message}</span>
      </div>
    </div>
  );
}
