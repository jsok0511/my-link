"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { profileData } from "@/data/profile";

interface TopBarProps {
  onShowToast: (msg: string) => void;
}

export default function TopBar({ onShowToast }: TopBarProps) {
  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        onShowToast("프로필 링크를 복사했어요");
      }
    } catch {
      onShowToast("링크를 복사했어요");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-[56px] px-5 sm:px-8 backdrop-blur-md bg-white/85 border-b border-[#E5E8EB] flex items-center justify-between transition-colors">
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-[17px] text-[#191F28] tracking-tight">
            {profileData.name}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-[#E8F3FF] text-[#3182F6] text-[12px] font-semibold px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3182F6] animate-pulse" />
            <span>{profileData.statusBadge}</span>
          </span>
        </div>

        {/* Right: Share Action Button */}
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-[#F2F4F6] active:scale-95 transition-all"
          title="프로필 링크 공유하기"
          aria-label="공유"
        >
          <Share2 className="w-[19px] h-[19px]" />
        </button>
      </div>
    </header>
  );
}
