"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { defaultProfile } from "@/data/defaultProfile";
import {
  TopBar,
  ProfileHero,
  LinkList,
  BottomCTA,
  Toast,
} from "@/components/mylink";

// React 19 권장: SSR Hydration 안전 구독 훅
const emptySubscribe = () => () => {};
const useHasMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
};

export default function HomePage() {
  const profile = useMyLinkStore((state) => state.profile);
  const isHydrated = useMyLinkStore((state) => state.isHydrated);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasMounted = useHasMounted();

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleLinkClick = (title: string) => {
    showToast(`${title}(으)로 이동해요`);
  };

  const handleSocialClick = (platform: string) => {
    showToast(`${platform} 채널로 이동해요`);
  };

  // SSR 단계 및 Hydration 전에는 시드 데이터(defaultProfile)로 일관되게 렌더링
  const currentProfile = hasMounted && isHydrated ? profile : defaultProfile;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-sans antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
      {/* 1. Top Navigation Bar */}
      <TopBar onShowToast={showToast} />

      {/* 2. Main Mobile-First Container */}
      <main className="mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6">
        {/* Profile Hero Section */}
        <ProfileHero
          profile={currentProfile}
          onSocialClick={handleSocialClick}
        />

        {/* Link List Blocks Section (Header + Cards + Category Filter) */}
        <div className="mt-2">
          <LinkList
            blocks={currentProfile.blocks}
            onLinkClick={handleLinkClick}
            showCategoryFilter={true}
          />
        </div>

        {/* Bottom CTA & Footer */}
        <BottomCTA
          onAction={() => {
            showToast("마이링크 서비스를 준비하고 있어요");
          }}
        />
      </main>

      {/* 3. TDS Floating Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
