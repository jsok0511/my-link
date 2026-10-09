"use client";

import React from "react";
import { mainLinks } from "@/data/profile";
import { ChevronRight, Mail, FolderGit2 } from "lucide-react";
import { GithubIcon, VelogIcon } from "@/components/Icons";

interface LinksSectionProps {
  onShowToast: (msg: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="w-5 h-5 fill-[#333D4B]" />,
  blog: <VelogIcon className="w-5 h-5 fill-[#333D4B]" />,
  email: <Mail className="w-5 h-5 text-[#333D4B]" />,
  portfolio: <FolderGit2 className="w-5 h-5 text-[#333D4B]" />,
};

export default function LinksSection({ onShowToast }: LinksSectionProps) {
  const handleClick = (title: string) => {
    onShowToast(`${title}(으)로 이동해요`);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-8">
      <div className="mb-3 px-1 flex items-center justify-between">
        <h2 className="text-[17px] sm:text-[18px] font-bold text-[#191F28] tracking-tight">
          주요 채널 & 바로가기
        </h2>
        <span className="text-[13px] font-medium text-[#8B95A1]">
          {mainLinks.length}개
        </span>
      </div>

      {/* TDS Grouped List Card */}
      <div className="tds-card overflow-hidden bg-white divide-y divide-[#E5E8EB]">
        {mainLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.isExternal ? "_blank" : undefined}
            rel={link.isExternal ? "noopener noreferrer" : undefined}
            onClick={() => handleClick(link.title)}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#F9FAFB] active:bg-[#F2F4F6] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              {/* Icon Container (44px) */}
              <div className="w-11 h-11 rounded-[14px] bg-[#F2F4F6] flex items-center justify-center shrink-0 group-hover:bg-[#E8F3FF] transition-colors">
                {iconMap[link.iconName]}
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-[15px] sm:text-[16px] text-[#191F28] truncate">
                    {link.title}
                  </span>
                  {link.badge && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E8F3FF] text-[#3182F6] shrink-0">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#6B7684] truncate">
                  {link.subtitle}
                </p>
              </div>
            </div>

            {/* Right Chevron */}
            <div className="shrink-0 text-[#B0B8C1] group-hover:text-[#4E5968] group-hover:translate-x-0.5 transition-all ml-2">
              <ChevronRight className="w-5 h-5" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
