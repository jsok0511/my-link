"use client";

import React, { useState, useMemo } from "react";
import { ContentBlock, LinkItem, HeaderItem } from "@/types/mylink";
import { LinkCard } from "./LinkCard";
import { LinkDeleteDialog } from "./LinkDeleteDialog";
import { SectionHeader } from "./SectionHeader";
import { CategoryFilter, LinkCategoryFilter } from "./CategoryFilter";

interface LinkListProps {
  blocks: ContentBlock[];
  onLinkClick?: (title: string, url: string) => void;
  onLinkUpdated?: (link: LinkItem) => void;
  onLinkDeleted?: (link: LinkItem) => void;
  showCategoryFilter?: boolean;
  className?: string;
}

export function LinkList({
  blocks,
  onLinkClick,
  onLinkUpdated,
  onLinkDeleted,
  showCategoryFilter = true,
  className = "",
}: LinkListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<LinkCategoryFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);

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
          <p className="text-[14px] font-medium text-[#8B95A1] break-keep">
            {blocks.length === 0
              ? "아직 등록된 링크가 없어요. 위 버튼을 눌러 첫 번째 링크를 추가해 보세요!"
              : "해당 카테고리에 등록된 링크가 없어요."}
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
                category={link.category}
                isEditing={editingId === link.id}
                onClick={onLinkClick}
                onEditStart={() => setEditingId(link.id)}
                onEditCancel={() => setEditingId(null)}
                onEditSuccess={(updatedLink) => {
                  setEditingId(null);
                  onLinkUpdated?.(updatedLink);
                }}
                onDeleteRequest={() => setDeletingLink(link)}
              />
            );
          })}
        </div>
      )}

      <LinkDeleteDialog
        link={deletingLink}
        onClose={() => setDeletingLink(null)}
        onSuccess={(deletedLink) => {
          if (editingId === deletedLink.id) {
            setEditingId(null);
          }
          onLinkDeleted?.(deletedLink);
        }}
      />
    </div>
  );
}
