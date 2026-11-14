"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Popover } from "@base-ui/react/popover";
import {
  BarChart3,
  ChevronDown,
  ExternalLink,
  Home,
  Link2,
  LogOut,
  Pencil,
  RefreshCw,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUserProfileData } from "@/lib/use-mylink-queries";
import { useGoogleAuth } from "@/lib/use-google-auth";
import { safeDecodeDisplayName } from "@/lib/firestore-users";
import { ProfileEditDialog } from "./ProfileEditDialog";

interface ProfileDropdownProps {
  onShowToast: (msg: string) => void;
  onShare: () => Promise<void>;
}

/**
 * Interactive header profile dropdown displaying user account info,
 * link summary stats, quick profile/account actions, and sign-out.
 */
export function ProfileDropdown({ onShowToast, onShare }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, profile, profileDoc } = useCurrentUserProfileData();
  const { isSigningIn, isSigningOut, handleSignIn, handleSignOut } = useGoogleAuth({
    onShowToast,
  });

  if (!user) return null;

  const displayName = (
    profileDoc?.displayName ||
    profile.displayName ||
    user.displayName
  ).trim();
  const avatarUrl = profile.avatarUrl || user.photoURL;
  const email = profile.username || user.email;
  const bio = profile.bio;
  const personalPageHref = displayName
    ? `/${encodeURIComponent(displayName)}`
    : null;
  const isOnPersonalPage = Boolean(
    displayName &&
      safeDecodeDisplayName(pathname).toLowerCase() ===
        `/${displayName.toLowerCase()}`
  );

  const linkBlocks = profile.blocks.filter((b) => b.type === "link");
  const totalLinksCount = linkBlocks.length;
  const activeLinksCount = linkBlocks.filter((b) => b.enabled).length;

  const handleOpenEdit = () => {
    setOpen(false);
    setEditOpen(true);
  };

  const handleSwitchAccount = async () => {
    setOpen(false);
    await handleSignIn();
  };

  const handleCopyShare = async () => {
    setOpen(false);
    await onShare();
  };

  const handleLogoutClick = async () => {
    setOpen(false);
    await handleSignOut();
  };

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          aria-label="프로필 메뉴 열기"
          className="group flex h-8 items-center gap-1.5 rounded-xl border border-[#E5E8EB] bg-white pl-1.5 pr-2 text-[#333D4B] shadow-2xs transition-all hover:bg-[#F2F4F6] active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40"
        >
          <Avatar className="h-5 w-5 rounded-full">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt={displayName}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-[#E8F3FF] text-[10px] font-bold text-[#3182F6]">
              {displayName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[76px] truncate text-[12px] font-semibold text-[#191F28]">
            {displayName}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#8B95A1] transition-transform duration-150 group-data-[popup-open]:rotate-180" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner align="end" sideOffset={8} className="z-50">
            <Popover.Popup className="w-[292px] sm:w-[312px] origin-(--transform-origin) rounded-2xl border border-[#E5E8EB] bg-white p-3 text-[#191F28] shadow-lg ring-1 ring-black/5 outline-none transition-all duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
              {/* 1. Account Card */}
              <div className="flex items-start gap-3 rounded-xl bg-[#F9FAFB] p-3 border border-[#F2F4F6]">
                <Avatar className="h-10 w-10 shrink-0 rounded-full ring-1 ring-[#E5E8EB]">
                  {avatarUrl ? (
                    <AvatarImage
                      src={avatarUrl}
                      alt={displayName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-[#E8F3FF] text-[14px] font-bold text-[#3182F6]">
                    {displayName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] font-bold text-[#191F28]">
                      {displayName}
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[10px] font-semibold text-[#3182F6]">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Google 연동
                    </span>
                  </div>
                  {email && (
                    <p className="mt-0.5 truncate text-[12px] text-[#8B95A1]">
                      {email}
                    </p>
                  )}
                  {bio && (
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[#4E5968] break-keep">
                      {bio}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Mini Stats Bar */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between rounded-xl border border-[#F2F4F6] bg-white px-3 py-2">
                  <span className="text-[12px] font-medium text-[#6B7684]">
                    등록된 링크
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-bold text-[#191F28]">
                    <Link2 className="h-3.5 w-3.5 text-[#3182F6]" />
                    {totalLinksCount}개
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#F2F4F6] bg-white px-3 py-2">
                  <span className="text-[12px] font-medium text-[#6B7684]">
                    활성 링크
                  </span>
                  <span className="text-[13px] font-bold text-[#059669]">
                    {activeLinksCount}개
                  </span>
                </div>
              </div>

              {/* 3. Action Menu Buttons */}
              <div className="mt-2 space-y-0.5">
                {personalPageHref && (
                  <Link
                    href={personalPageHref}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#333D4B] transition-colors hover:bg-[#F2F4F6] hover:text-[#191F28] no-underline"
                  >
                    <ExternalLink className="h-4 w-4 text-[#3182F6]" />
                    <span>내 페이지로 이동</span>
                    <span className="ml-auto max-w-[96px] truncate text-[11px] text-[#8B95A1]">
                      /{displayName}
                    </span>
                  </Link>
                )}

                {pathname !== "/" && (
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#333D4B] transition-colors hover:bg-[#F2F4F6] hover:text-[#191F28] no-underline"
                  >
                    <Home className="h-4 w-4 text-[#6B7684]" />
                    <span>내 링크 관리</span>
                  </Link>
                )}

                {pathname !== "/stats" && (
                  <Link
                    href="/stats"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#333D4B] transition-colors hover:bg-[#F2F4F6] hover:text-[#191F28] no-underline"
                  >
                    <BarChart3 className="h-4 w-4 text-[#6B7684]" />
                    <span>클릭 통계</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#333D4B] transition-colors hover:bg-[#F2F4F6] hover:text-[#191F28] cursor-pointer"
                >
                  <Pencil className="h-4 w-4 text-[#6B7684]" />
                  <span>프로필 수정</span>
                </button>

                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={handleSwitchAccount}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#333D4B] transition-colors hover:bg-[#F2F4F6] hover:text-[#191F28] disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 text-[#6B7684]" />
                  <span>{isSigningIn ? "계정 전환 중..." : "다른 Google 계정으로 전환"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#333D4B] transition-colors hover:bg-[#F2F4F6] hover:text-[#191F28] cursor-pointer"
                >
                  <Share2 className="h-4 w-4 text-[#6B7684]" />
                  <span>페이지 공유(복사)</span>
                </button>
              </div>

              {/* 4. Divider + Logout */}
              <div className="mt-1.5 border-t border-[#F2F4F6] pt-1.5">
                <button
                  type="button"
                  disabled={isSigningOut}
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold text-[#F04452] transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isSigningOut ? "로그아웃 중..." : "로그아웃"}</span>
                </button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <ProfileEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={(updated) => {
          onShowToast("프로필을 수정했어요");
          if (
            updated?.displayName &&
            isOnPersonalPage &&
            updated.displayName.trim().toLowerCase() !== displayName.toLowerCase()
          ) {
            router.replace(`/${encodeURIComponent(updated.displayName.trim())}`);
            return;
          }
          if (pathname !== "/") {
            router.refresh();
          }
        }}
      />
    </>
  );
}
