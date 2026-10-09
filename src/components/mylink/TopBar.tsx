"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

interface TopBarProps {
  onShowToast: (msg: string) => void;
  className?: string;
}

export function TopBar({ onShowToast, className = "" }: TopBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.share && /mobile/i.test(navigator.userAgent)) {
          await navigator.share({
            title: "마이링크 (MyLink)",
            url: window.location.href,
          });
          onShowToast("링크를 공유했어요");
          return;
        }

        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        onShowToast("링크 주소가 복사되었어요");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      onShowToast("링크 복사에 실패했어요");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-[#E5E8EB] bg-[#F9FAFB]/85 backdrop-blur-md transition-colors ${className}`}
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4 sm:max-w-lg">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#3182F6]" />
          <span className="text-[15px] font-bold tracking-tight text-[#191F28]">
            MYLINK
          </span>
        </div>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#059669]" />
              <span className="text-[#059669]">복사됨</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>공유</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
