"use client";

import React from "react";
import { Mail } from "lucide-react";
import { profileData } from "@/data/profile";

export default function BottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* Top Protection Gradient (white to transparent) */}
      <div className="h-8 bg-gradient-to-t from-[#F9FAFB] to-transparent" />

      {/* Button Container */}
      <div className="bg-[#F9FAFB]/90 backdrop-blur-sm px-4 pb-4 sm:pb-6 pt-1 flex justify-center pointer-events-auto">
        <div className="w-full max-w-3xl">
          <a
            href={`mailto:${profileData.email}`}
            className="w-full h-[56px] bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold text-[17px] rounded-[16px] shadow-[0_4px_16px_rgba(49,130,246,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Mail className="w-5 h-5" />
            <span>커피챗 제안하기</span>
          </a>
        </div>
      </div>
    </div>
  );
}
