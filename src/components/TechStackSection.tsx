"use client";

import React from "react";
import { techStackCategories } from "@/data/profile";

export default function TechStackSection() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-8">
      <div className="mb-3 px-1 flex items-center justify-between">
        <h2 className="text-[17px] sm:text-[18px] font-bold text-[#191F28] tracking-tight">
          기술 스택 & 도구
        </h2>
        <span className="text-[13px] font-medium text-[#8B95A1]">
          자주 사용하는 기술
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {techStackCategories.map((cat, idx) => (
          <div
            key={idx}
            className="tds-card p-5 bg-white flex flex-col justify-between"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#E5E8EB]">
                <span className="text-lg">{cat.emoji}</span>
                <h3 className="font-bold text-[15px] sm:text-[16px] text-[#191F28]">
                  {cat.category}
                </h3>
              </div>

              {/* Stack Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className={`text-[12px] sm:text-[13px] px-3 py-1.5 rounded-full transition-colors ${
                      item.highlight
                        ? "bg-[#E8F3FF] text-[#3182F6] font-semibold"
                        : "bg-[#F2F4F6] text-[#333D4B] font-medium"
                    }`}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
