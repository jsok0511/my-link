"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { defaultProfile } from "@/data/defaultProfile";
import {
  fetchAnonymousLinks,
  subscribeToAnonymousLinks,
} from "@/lib/firestore-links";
import {
  TopBar,
  ProfileHero,
  LinkList,
  BottomCTA,
  Toast,
  LinkAddDialog,
} from "@/components/mylink";
import { Button } from "@/components/ui/button";

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
  const setFirestoreLinks = useMyLinkStore((state) => state.setFirestoreLinks);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasMounted = useHasMounted();

  const refreshLinks = useCallback(async () => {
    try {
      const links = await fetchAnonymousLinks();
      setFirestoreLinks(links);
    } catch (error) {
      console.error("Failed to fetch Firestore links:", error);
      setToastMessage("링크 목록을 불러오지 못했어요");
    }
  }, [setFirestoreLinks]);

  useEffect(() => {
    let isCancelled = false;

    fetchAnonymousLinks()
      .then((links) => {
        if (!isCancelled) {
          setFirestoreLinks(links);
        }
      })
      .catch((error) => {
        console.error("Failed to load initial Firestore links:", error);
        if (!isCancelled) {
          setToastMessage("링크 목록을 불러오지 못했어요");
        }
      });

    const unsubscribe = subscribeToAnonymousLinks(
      (links) => {
        if (!isCancelled) {
          setFirestoreLinks(links);
        }
      },
      (error) => {
        console.error("Failed to subscribe to Firestore links:", error);
      }
    );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [setFirestoreLinks]);

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
      <main className="mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6 pb-10">
        {/* Profile Hero Section */}
        <ProfileHero
          profile={currentProfile}
          onSocialClick={handleSocialClick}
        />

        {/* Add Link Button */}
        <div className="mt-6 mb-4 flex justify-center">
          <LinkAddDialog
            onSuccess={(link) => {
              showToast(`${link.title} 링크를 저장했어요`);
              void refreshLinks();
            }}
          >
            <Button className="w-full h-[52px] rounded-2xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] shadow-sm transition-transform">
              + 새 링크 추가하기
            </Button>
          </LinkAddDialog>
        </div>

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
