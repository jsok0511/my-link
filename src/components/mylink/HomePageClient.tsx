"use client";

import React, { useCallback, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { getClickCountErrorMessage } from "@/lib/firestore-links";
import {
  useCurrentUserProfileData,
  useIncrementLinkClickMutation,
} from "@/lib/use-mylink-queries";
import {
  TopBar,
  ProfileHero,
  LinkList,
  BottomCTA,
  Toast,
  LinkAddDialog,
  LandingPage,
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

function AuthLoadingSkeleton() {
  return (
    <div className="pt-8 pb-4 space-y-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-[88px] w-[88px] animate-pulse rounded-full bg-[#E5E8EB]" />
        <div className="h-5 w-28 animate-pulse rounded-lg bg-[#E5E8EB]" />
        <div className="h-3.5 w-40 animate-pulse rounded-lg bg-[#F2F4F6]" />
      </div>
      <div className="h-24 w-full animate-pulse rounded-2xl bg-white border border-[#E5E8EB]" />
      <div className="h-16 w-full animate-pulse rounded-2xl bg-white border border-[#E5E8EB]" />
    </div>
  );
}

/**
 * Interactive home view rendering either the public landing page or the signed-in user's link hub.
 */
export function HomePageClient() {
  const router = useRouter();
  const authLoading = useMyLinkStore((state) => state.authLoading);

  const {
    user,
    profile,
    profileDoc,
    isLinksLoading,
    isLinksError,
    refetchLinks,
  } = useCurrentUserProfileData();

  const incrementClickMutation = useIncrementLinkClickMutation(user?.uid);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasMounted = useHasMounted();

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleLinkClick = (title: string, _url: string, id: string) => {
    showToast(`${title}(으)로 이동해요`);
    if (user?.uid && id) {
      incrementClickMutation.mutate(id, {
        onError: (error) => {
          showToast(getClickCountErrorMessage(error));
        },
      });
    }
  };

  const handleSocialClick = (platform: string) => {
    showToast(`${platform} 채널로 이동해요`);
  };

  const isAuthReady = hasMounted && !authLoading;
  const isLandingView = isAuthReady && !user;
  const myDisplayName = (
    profileDoc?.displayName ||
    profile.displayName ||
    user?.displayName ||
    ""
  ).trim();

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-sans antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
      {/* 1. Top Navigation Bar (adapts width for landing vs personal hub) */}
      <TopBar
        onShowToast={showToast}
        containerClassName={
          isLandingView
            ? "max-w-5xl sm:px-6 lg:px-8"
            : "max-w-md sm:max-w-lg"
        }
        showLandingNav={isLandingView}
      />

      {/* 2. Main Container */}
      <main
        className={
          isLandingView
            ? "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-10"
            : "mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6 pb-10"
        }
      >
        {!isAuthReady ? (
          <AuthLoadingSkeleton />
        ) : !user ? (
          <LandingPage onShowToast={showToast} />
        ) : (
          <>
            {/* Authenticated User Profile Hero (from users/{uid}) */}
            <ProfileHero
              profile={profile}
              editable
              onProfileUpdated={() => showToast("프로필을 수정했어요")}
              onSocialClick={handleSocialClick}
            />

            {/* Add Link Button */}
            <div className="mt-6 mb-4 flex justify-center">
              <LinkAddDialog
                onSuccess={(link) => {
                  showToast(`${link.title} 링크를 저장했어요`);
                }}
              >
                <Button className="w-full h-[52px] rounded-2xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] shadow-sm transition-transform cursor-pointer">
                  + 새 링크 추가하기
                </Button>
              </LinkAddDialog>
            </div>

            {/* Personalized Link List (users/{uid}/links) */}
            <div className="mt-2">
              {isLinksLoading ? (
                <div className="space-y-3 pt-2">
                  <div className="h-[74px] w-full animate-pulse rounded-2xl bg-white border border-[#E5E8EB]" />
                  <div className="h-[74px] w-full animate-pulse rounded-2xl bg-white border border-[#E5E8EB]" />
                </div>
              ) : isLinksError ? (
                <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5 text-center">
                  <p className="text-[14px] font-medium text-[#4E5968]">
                    링크 목록을 불러오지 못했어요.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void refetchLinks()}
                    className="mt-3 rounded-xl border-[#E5E8EB] text-[13px] font-semibold text-[#333D4B] hover:bg-[#F2F4F6] cursor-pointer"
                  >
                    다시 시도
                  </Button>
                </div>
              ) : (
                <LinkList
                  blocks={profile.blocks}
                  onLinkClick={handleLinkClick}
                  onLinkUpdated={(link) => {
                    showToast(`${link.title} 링크를 수정했어요`);
                  }}
                  onLinkDeleted={(link) => {
                    showToast(`${link.title} 링크를 삭제했어요`);
                  }}
                  showCategoryFilter={true}
                />
              )}
            </div>

            {/* Bottom CTA & Footer for Authenticated View */}
            <BottomCTA
              label={
                myDisplayName
                  ? "내 공개 마이링크 페이지 보기"
                  : "내 링크 클릭 통계 보기"
              }
              onAction={() => {
                if (myDisplayName) {
                  router.push(`/${encodeURIComponent(myDisplayName)}`);
                } else {
                  router.push("/stats");
                }
              }}
            />
          </>
        )}
      </main>

      {/* 3. TDS Floating Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
