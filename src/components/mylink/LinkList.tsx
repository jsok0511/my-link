"use client";

import React, { useState, useMemo } from "react";
import { ContentBlock, LinkItem, HeaderItem } from "@/types/mylink";
import { LinkCard } from "./LinkCard";
import { SectionHeader } from "./SectionHeader";
import { CategoryFilter, LinkCategoryFilter } from "./CategoryFilter";

interface LinkListProps {
  blocks: ContentBlock[];
  onLinkClick?: (title: string, url: string) => void;
  showCategoryFilter?: boolean;
  className?: string;
}

export function LinkList({
  blocks,
  onLinkClick,
  showCategoryFilter = true,
  className = "",
}: LinkListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<LinkCategoryFilter>("all");

  // 카테고리 필터링 로직
  const filteredBlocks = useMemo(() => {
    // 1. 활성화된 블록만 필터링
    const enabledBlocks = blocks.filter((b) => b.enabled);

    if (selectedCategory === "all") {
      return enabledBlocks;
    }

    // 특정 카테고리 선택 시:
    // 해당 카테고리의 링크 블록만 추출
    return enabledBlocks.filter(
      (block) => block.type === "link" && block.category === selectedCategory
    );
  }, [blocks, selectedCategory]);

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Category Pills Filter */}
      {showCategoryFilter && (
        <div className="mb-2">
          <CategoryFilter
            currentCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      {/* Render Blocks */}
      {filteredBlocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E8EB] bg-white py-12 px-4 text-center">
          <p className="text-[14px] font-medium text-[#8B95A1]">
            해당 카테고리에 등록된 링크가 없어요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBlocks.map((block) => {
            if (block.type === "header") {
              const header = block as HeaderItem;
              return (
                <SectionHeader
                  key={header.id}
                  title={header.title}
                />
              );
            }

            const link = block as LinkItem;
            return (
              <LinkCard
                key={link.id}
                id={link.id}
                title={link.title}
                url={link.url}
                description={link.description}
                icon={link.icon}
                badge={link.badge}
                onClick={onLinkClick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
