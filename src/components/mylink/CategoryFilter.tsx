"use client";

import React from "react";

export type LinkCategoryFilter = "all" | "dev" | "career" | "social" | "contact";

interface CategoryOption {
  id: LinkCategoryFilter;
  label: string;
}

const categories: CategoryOption[] = [
  { id: "all", label: "전체" },
  { id: "dev", label: "개발" },
  { id: "career", label: "커리어" },
  { id: "contact", label: "연락처" },
  { id: "social", label: "소셜" },
];

interface CategoryFilterProps {
  currentCategory: LinkCategoryFilter;
  onSelectCategory: (category: LinkCategoryFilter) => void;
  className?: string;
}

export function CategoryFilter({
  currentCategory,
  onSelectCategory,
  className = "",
}: CategoryFilterProps) {
  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1 ${className}`}
    >
      {categories.map((cat) => {
        const isActive = currentCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 active:scale-95 ${
              isActive
                ? "bg-[#191F28] text-white shadow-xs"
                : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB] hover:text-[#191F28]"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
