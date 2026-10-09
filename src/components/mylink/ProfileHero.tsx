"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SocialBar } from "./SocialBar";
import { ProfileData } from "@/types/mylink";

interface ProfileHeroProps {
  profile: ProfileData;
  onSocialClick?: (platform: string, url: string) => void;
  className?: string;
}

export function ProfileHero({ profile, onSocialClick, className = "" }: ProfileHeroProps) {
  return (
    <section className={`flex flex-col items-center text-center pt-6 pb-4 px-4 ${className}`}>
      {/* 88x88 Avatar */}
      <div className="relative mb-3.5">
        <Avatar className="h-[88px] w-[88px] rounded-full border-2 border-white shadow-sm ring-1 ring-[#E5E8EB]">
          {profile.avatarUrl ? (
            <AvatarImage
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-[#E8F3FF] text-[22px] font-bold text-[#3182F6]">
            {profile.avatarFallback || profile.displayName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Username Handle */}
      <h1 className="text-[20px] font-bold tracking-tight text-[#191F28]">
        {profile.displayName}
      </h1>
      <p className="mt-0.5 text-[13px] font-normal text-[#8B95A1]">
        @{profile.username.replace(/^@/, "")}
      </p>

      {/* Bio Description */}
      {profile.bio && (
        <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-[#4E5968] break-keep px-2">
          {profile.bio}
        </p>
      )}

      {/* Tags Badges */}
      {profile.tags && profile.tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 max-w-md">
          {profile.tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="rounded-full border-0 bg-[#F2F4F6] px-3 py-1 text-[12px] font-medium text-[#4E5968] hover:bg-[#E5E8EB] transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Social Icons Bar */}
      {profile.socials && profile.socials.length > 0 && (
        <div className="mt-5 w-full">
          <SocialBar socials={profile.socials} onSocialClick={onSocialClick} />
        </div>
      )}
    </section>
  );
}
