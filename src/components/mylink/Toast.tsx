"use client";

import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
      <div className="flex items-center gap-2 rounded-full bg-[#191F28]/95 px-4 py-2.5 text-[14px] font-medium text-white shadow-lg backdrop-blur-md">
        <CheckCircle2 className="h-4 w-4 text-[#3182F6]" />
        <span>{message}</span>
      </div>
    </div>
  );
}
