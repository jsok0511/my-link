"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { LinkIcon } from "./LinkIcon";

export interface LinkCardProps {
  id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  isExternal?: boolean;
  onClick?: (title: string, url: string) => void;
  className?: string;
}

export function LinkCard({
  title,
  url,
  description,
  icon = "link",
  badge,
  isExternal = true,
  onClick,
  className = "",
}: LinkCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(title, url);
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white p-0 transition-all duration-200 hover:border-[#3182F6] hover:shadow-sm active:scale-[0.98] ${className}`}
    >
      <a
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        className="flex items-center justify-between gap-3.5 p-4 no-underline cursor-pointer"
      >
        {/* Left: 44x44px Round Icon Box */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-[#333D4B] transition-colors duration-150 group-hover:bg-[#E8F3FF] group-hover:text-[#3182F6]">
          <LinkIcon name={icon} className="h-5 w-5 transition-transform duration-150 group-hover:scale-105" />
        </div>

        {/* Center: Title & Description */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] sm:text-[16px] font-semibold text-[#191F28] transition-colors group-hover:text-[#191F28]">
              {title}
            </span>
            {badge && (
              <Badge
                variant="secondary"
                className="shrink-0 rounded-full border-0 bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6] hover:bg-[#E8F3FF]"
              >
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="mt-0.5 truncate text-[13px] text-[#8B95A1] group-hover:text-[#6B7684] transition-colors">
              {description}
            </p>
          )}
        </div>

        {/* Right: Chevron Arrow */}
        <div className="shrink-0 text-[#B0B8C1] transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-[#3182F6]">
          <ChevronRight className="h-5 w-5" />
        </div>
      </a>
    </Card>
  );
}
