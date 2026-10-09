"use client";

import React from "react";
import { SocialLink } from "@/types/mylink";
import { LinkIcon } from "./LinkIcon";

interface SocialBarProps {
  socials: SocialLink[];
  onSocialClick?: (platform: string, url: string) => void;
  className?: string;
}

export function SocialBar({ socials, onSocialClick, className = "" }: SocialBarProps) {
  const activeSocials = socials.filter((s) => s.enabled && s.url);

  if (activeSocials.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
      {activeSocials.map((social) => {
        const handleClick = () => {
          if (onSocialClick) {
            onSocialClick(social.platform, social.url);
          }
        };

        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            onClick={handleClick}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5E8EB] bg-white text-[#4E5968] shadow-xs transition-all duration-150 hover:border-[#D1D6DB] hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-95 cursor-pointer"
          >
            <LinkIcon name={social.platform} className="h-[18px] w-[18px]" />
          </a>
        );
      })}
    </div>
  );
}
