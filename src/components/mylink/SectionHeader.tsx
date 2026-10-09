import React from "react";

interface SectionHeaderProps {
  title: string;
  badge?: string;
  className?: string;
}

export function SectionHeader({ title, badge, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between px-1 pt-4 pb-2 ${className}`}>
      <h2 className="text-[14px] font-semibold tracking-tight text-[#6B7684]">
        {title}
      </h2>
      {badge && (
        <span className="text-[12px] font-medium text-[#8B95A1]">
          {badge}
        </span>
      )}
    </div>
  );
}
