"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import type { ProfileData } from "@/types/mylink";
import { TopBar } from "./TopBar";
import { ProfileHero } from "./ProfileHero";
import { LinkList } from "./LinkList";
import { BottomCTA } from "./BottomCTA";
import { Toast } from "./Toast";

interface PublicProfileViewProps {
  ownerUid: string;
  profile: ProfileData;
}

/**
 * Read-only public link hub rendered on `/[displayName]`.
 */
export function PublicProfileView({ ownerUid, profile }: PublicProfileViewProps) {
  const router = useRouter();
  const user = useMyLinkStore((state) => state.user);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const isOwner = Boolean(user?.uid && user.uid === ownerUid);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-sans antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
      <TopBar onShowToast={showToast} />

      <main className="mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6 pb-10">
        <ProfileHero
          profile={profile}
          editable={false}
          onSocialClick={(platform) => showToast(`${platform} 채널로 이동해요`)}
        />

        <div className="mt-2">
          <LinkList
            blocks={profile.blocks}
            editable={false}
            emptyMessage="아직 등록된 링크가 없어요."
            onLinkClick={(title) => showToast(`${title}(으)로 이동해요`)}
            showCategoryFilter={true}
          />
        </div>

        <BottomCTA
          label={isOwner ? "내 마이링크 관리하기" : "나만의 마이링크 무료로 만들기"}
          onAction={() => router.push("/")}
        />
      </main>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
