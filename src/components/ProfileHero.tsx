"use client";

import React, { useState } from "react";
import { profileData } from "@/data/profile";
import { Copy, Check, Mail, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface ProfileHeroProps {
  onShowToast: (msg: string) => void;
}

export default function ProfileHero({ onShowToast }: ProfileHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileData.email);
      setCopied(true);
      onShowToast("이메일 주소를 복사했어요");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast("이메일 복사에 실패했어요");
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 pt-6 sm:pt-8">
      <div className="tds-card p-6 sm:p-8 bg-white">
        {/* Top Info & Avatar */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#8B95A1] mb-1">
              <span>{profileData.location}</span>
              <span>•</span>
              <span>{profileData.handle}</span>
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#191F28] tracking-tight leading-snug">
              안녕하세요, <br className="sm:hidden" />
              개발자 {profileData.name}이에요
            </h1>
          </div>

          {/* Profile Avatar */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E8F3FF] border-2 border-white shadow-[0_2px_8px_rgba(49,130,246,0.15)] flex items-center justify-center shrink-0 text-[#3182F6] font-bold text-lg sm:text-xl">
            {profileData.avatarText}
          </div>
        </div>

        {/* Roles Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {profileData.roles.map((role, idx) => (
            <span
              key={idx}
              className="inline-flex items-center bg-[#F2F4F6] text-[#333D4B] text-[13px] font-medium px-3 py-1.5 rounded-full"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Bio Copy */}
        <p className="text-[15px] sm:text-[16px] text-[#4E5968] leading-relaxed mb-6 break-keep">
          {profileData.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#E5E8EB]">
          {/* Coffee Chat CTA (Primary Blue) */}
          <a
            href={`mailto:${profileData.email}`}
            className="tds-btn-primary px-5 flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
          >
            <Mail className="w-4 h-4" />
            <span>커피챗 제안하기</span>
          </a>

          {/* Copy Email Button (Secondary) */}
          <button
            onClick={handleCopyEmail}
            className="tds-btn-secondary px-4 flex items-center gap-2 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#059669]" />
                <span className="text-[#059669]">복사 완료</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#4E5968]" />
                <span>이메일 복사</span>
              </>
            )}
          </button>

          {/* GitHub Button (Secondary) */}
          <a
            href={profileData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tds-btn-secondary px-4 flex items-center gap-2 text-sm"
          >
            <GithubIcon className="w-4 h-4 fill-[#191F28]" />
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8B95A1]" />
          </a>
        </div>
      </div>
    </section>
  );
}
