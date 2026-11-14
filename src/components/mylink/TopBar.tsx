"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, Check, UserRound, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { useGoogleAuth } from "@/lib/use-google-auth";
import { useCurrentUserProfileData } from "@/lib/use-mylink-queries";
import { safeDecodeDisplayName } from "@/lib/firestore-users";
import { GoogleIcon } from "./GoogleIcon";
import { ProfileDropdown } from "./ProfileDropdown";

interface TopBarProps {
  onShowToast: (msg: string) => void;
  className?: string;
}

export function TopBar({ onShowToast, className = "" }: TopBarProps) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const user = useMyLinkStore((state) => state.user);
  const authLoading = useMyLinkStore((state) => state.authLoading);
  const { profile, profileDoc } = useCurrentUserProfileData();
  const { isSigningIn, handleSignIn } = useGoogleAuth({ onShowToast });

  const myDisplayName = (
    profileDoc?.displayName ||
    profile.displayName ||
    user?.displayName ||
    ""
  ).trim();
  const personalPageHref = myDisplayName
    ? `/${encodeURIComponent(myDisplayName)}`
    : null;
  const isOnPersonalPage = Boolean(
    myDisplayName &&
      safeDecodeDisplayName(pathname).toLowerCase() ===
        `/${myDisplayName.toLowerCase()}`
  );
  const isOnStatsPage = pathname === "/stats";

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
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 no-underline transition-opacity hover:opacity-80"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#3182F6]" />
          <span className="text-[15px] font-bold tracking-tight text-[#191F28]">
            MYLINK
          </span>
        </Link>

        {/* Right Actions: Stats + Personal Page + Share + Auth / Profile Dropdown */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {!authLoading && user && (
            <Link
              href="/stats"
              className={`flex h-8 items-center gap-1 rounded-xl px-2 sm:px-2.5 text-[13px] transition-all active:scale-95 no-underline ${
                isOnStatsPage
                  ? "bg-[#E8F3FF] font-semibold text-[#3182F6]"
                  : "font-medium text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>통계</span>
            </Link>
          )}

          {!authLoading && user && personalPageHref && (
            <Link
              href={personalPageHref}
              className={`flex h-8 items-center gap-1 rounded-xl px-2 sm:px-2.5 text-[13px] transition-all active:scale-95 no-underline ${
                isOnPersonalPage
                  ? "bg-[#E8F3FF] font-semibold text-[#3182F6]"
                  : "font-medium text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]"
              }`}
            >
              <UserRound className="h-3.5 w-3.5" />
              <span>내 페이지</span>
            </Link>
          )}

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            aria-label="페이지 공유"
            className="flex h-8 items-center gap-1.5 rounded-xl px-2 sm:px-2.5 text-[13px] font-medium text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#059669]" />
                <span className="hidden min-[400px]:inline text-[#059669]">복사됨</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden min-[400px]:inline">공유</span>
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
            <ProfileDropdown onShowToast={onShowToast} onShare={handleShare} />
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
