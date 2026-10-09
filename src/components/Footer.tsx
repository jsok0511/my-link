"use client";

import React from "react";
import { ChevronUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full max-w-3xl mx-auto px-4 mt-8 pb-32 pt-8 border-t border-[#E5E8EB] text-center text-[#8B95A1] text-[13px] leading-relaxed">
      <div className="flex flex-col items-center gap-3">
        <p className="break-keep">
          토스 디자인 시스템(TDS)의 컬러, 타이포그래피 및 컴포넌트 원칙을 준수하여 제작했어요.
        </p>

        <div className="flex items-center gap-4 text-[12px] text-[#8B95A1]">
          <span>© 2026 이지성 (Lee Ji-seong)</span>
          <span>•</span>
          <a
            href="https://github.com/jsok0511/my-link"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#191F28] transition-colors"
          >
            오픈소스 저장소
          </a>
          <span>•</span>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-0.5 hover:text-[#191F28] transition-colors"
          >
            <span>위로 이동</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
