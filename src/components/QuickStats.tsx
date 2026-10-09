"use client";

import React from "react";
import { quickStats } from "@/data/profile";

export default function QuickStats() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-6">
      <div className="mb-3 px-1">
        <h2 className="text-[17px] sm:text-[18px] font-bold text-[#191F28] tracking-tight">
          숫자로 보는 활동
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[20px] p-4 sm:p-5 border border-[#E5E8EB] flex flex-col justify-between"
          >
            <span className="text-[13px] font-medium text-[#8B95A1]">
              {stat.label}
            </span>

            <div className="my-1.5">
              <span className="text-[22px] sm:text-[24px] font-bold text-[#191F28] tracking-tight tabular-nums">
                {stat.value}
              </span>
            </div>

            <p className="text-[12px] text-[#6B7684] leading-tight break-keep">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
