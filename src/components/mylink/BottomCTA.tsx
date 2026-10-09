"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface BottomCTAProps {
  onAction?: () => void;
  className?: string;
}

export function BottomCTA({ onAction, className = "" }: BottomCTAProps) {
  const handleClick = () => {
    if (onAction) {
      onAction();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className={`w-full pt-8 pb-12 px-4 text-center ${className}`}>
      {/* Primary 52px TDS Button */}
      <Button
        onClick={handleClick}
        className="h-[52px] w-full rounded-2xl bg-[#3182F6] text-[15px] sm:text-[16px] font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#1B64DA] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="h-4 w-4" />
        <span>나만의 마이링크 무료로 만들기</span>
      </Button>

      {/* Footer Copyright */}
      <p className="mt-4 text-[12px] font-medium text-[#8B95A1]">
        © 2026 MyLink. Built with shadcn/ui & TDS.
      </p>
    </footer>
  );
}
