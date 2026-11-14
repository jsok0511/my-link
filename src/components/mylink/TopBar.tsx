"use client";

import React, { useState } from "react";
import { Share2, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { useGoogleAuth } from "@/lib/use-google-auth";
import { GoogleIcon } from "./GoogleIcon";

interface TopBarProps {
  onShowToast: (msg: string) => void;
  className?: string;
}

export function TopBar({ onShowToast, className = "" }: TopBarProps) {
  const [copied, setCopied] = useState(false);
  const user = useMyLinkStore((state) => state.user);
  const authLoading = useMyLinkStore((state) => state.authLoading);
  const { isSigningIn, isSigningOut, handleSignIn, handleSignOut } = useGoogleAuth({
    onShowToast,
  });

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.share && /mobile/i.test(navigator.userAgent)) {
          await navigator.share({
            title: "마이링크 (MyLink)",
            url: window.location.href,
          });
          onShowToast("링크를 공유했어요");
          return;
        }

        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        onShowToast("링크 주소가 복사되었어요");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      onShowToast("링크 복사에 실패했어요");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-[#E5E8EB] bg-[#F9FAFB]/85 backdrop-blur-md transition-colors ${className}`}
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-4 sm:max-w-lg">
        {/* Brand Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#3182F6]" />
          <span className="text-[15px] font-bold tracking-tight text-[#191F28]">
            MYLINK
          </span>
        </div>

        {/* Right Actions: Share + Auth */}
        <div className="flex items-center gap-1.5">
          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#059669]" />
                <span className="text-[#059669]">복사됨</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>공유</span>
              </>
            )}
          </Button>

          {/* Google Auth Controls */}
          {authLoading ? (
            <div
              aria-label="로그인 상태 확인 중"
              className="h-8 w-20 animate-pulse rounded-xl bg-[#E5E8EB]"
            />
          ) : user ? (
            <div className="flex items-center gap-1.5">
              <div className="flex h-8 items-center gap-1.5 rounded-xl border border-[#E5E8EB] bg-white pl-1.5 pr-2.5">
                <Avatar className="h-5 w-5 rounded-full">
                  {user.photoURL ? (
                    <AvatarImage
                      src={user.photoURL}
                      alt={user.displayName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-[#E8F3FF] text-[10px] font-bold text-[#3182F6]">
                    {user.displayName.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[76px] truncate text-[12px] font-semibold text-[#333D4B]">
                  {user.displayName}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSigningOut}
                onClick={handleSignOut}
                aria-label="로그아웃"
                title="로그아웃"
                className="flex h-8 items-center gap-1 rounded-xl px-2 text-[12px] font-medium text-[#6B7684] hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-95 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSigningIn}
              onClick={handleSignIn}
              className="flex h-8 items-center gap-1.5 rounded-xl border-[#E5E8EB] bg-white px-2.5 text-[13px] font-semibold text-[#191F28] shadow-2xs hover:bg-[#F2F4F6] active:scale-95 transition-all cursor-pointer"
            >
              <GoogleIcon className="h-3.5 w-3.5" />
              <span>{isSigningIn ? "로그인 중..." : "로그인"}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
