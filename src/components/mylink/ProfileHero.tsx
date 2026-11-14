"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SocialBar } from "./SocialBar";
import { ProfileEditForm } from "./ProfileEditForm";
import { ProfileData } from "@/types/mylink";

interface ProfileHeroProps {
  profile: ProfileData;
  editable?: boolean;
  onProfileUpdated?: () => void;
  onSocialClick?: (platform: string, url: string) => void;
  className?: string;
}

export function ProfileHero({
  profile,
  editable = false,
  onProfileUpdated,
  onSocialClick,
  className = "",
}: ProfileHeroProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleText = profile.username
    ? profile.username.includes("@")
      ? profile.username
      : `@${profile.username}`
    : "";

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

      {editable && isEditing ? (
        <Card className="mt-1 w-full rounded-2xl border border-[#3182F6] bg-white p-4 text-left ring-2 ring-[#3182F6]/10 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#191F28]">프로필 수정</span>
            {handleText && (
              <span className="truncate text-[12px] text-[#8B95A1]">{handleText}</span>
            )}
          </div>

          <ProfileEditForm
            variant="inline"
            idPrefix="inline-profile"
            onCancel={() => setIsEditing(false)}
            onSuccess={() => {
              setIsEditing(false);
              onProfileUpdated?.();
            }}
          />
        </Card>
      ) : (
        <>
          {/* Name & Email/Handle */}
          <h1 className="text-[20px] font-bold tracking-tight text-[#191F28]">
            {profile.displayName}
          </h1>
          {handleText && (
            <p className="mt-0.5 text-[13px] font-normal text-[#8B95A1]">
              {handleText}
            </p>
          )}

          {/* Bio Description */}
          <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-[#4E5968] break-keep px-2">
            {profile.bio || "나만의 링크를 한곳에 모아 관리하고 공유해 보세요."}
          </p>

          {/* Inline Edit Trigger */}
          {editable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-3 h-8 gap-1.5 rounded-full border-[#E5E8EB] bg-white px-3 text-[12px] font-semibold text-[#4E5968] shadow-2xs hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-[#6B7684]" />
              <span>프로필 수정</span>
            </Button>
          )}
        </>
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
