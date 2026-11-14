"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import {
  subscribeToAuthState,
  toAuthUserSummary,
} from "@/lib/firebase-auth";
import {
  subscribeToUserProfile,
  syncUserProfileToFirestore,
} from "@/lib/firestore-users";
import {
  fetchUserLinks,
  subscribeToUserLinks,
} from "@/lib/firestore-links";
import {
  TopBar,
  ProfileHero,
  LinkList,
  BottomCTA,
  Toast,
  LinkAddDialog,
  LoginRequiredCard,
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

export default function HomePage() {
  const user = useMyLinkStore((state) => state.user);
  const authLoading = useMyLinkStore((state) => state.authLoading);
  const linksLoading = useMyLinkStore((state) => state.linksLoading);
  const profile = useMyLinkStore((state) => state.profile);
  const setAuthUser = useMyLinkStore((state) => state.setAuthUser);
  const setLinksLoading = useMyLinkStore((state) => state.setLinksLoading);
  const setUserProfileDoc = useMyLinkStore((state) => state.setUserProfileDoc);
  const setFirestoreLinks = useMyLinkStore((state) => state.setFirestoreLinks);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasMounted = useHasMounted();
  const uid = user?.uid ?? null;

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const refreshLinks = useCallback(async () => {
    if (!uid) return;
    try {
      const links = await fetchUserLinks(uid);
      setFirestoreLinks(links);
    } catch (error) {
      console.error("Failed to fetch user Firestore links:", error);
      showToast("링크 목록을 불러오지 못했어요");
    }
  }, [uid, setFirestoreLinks, showToast]);

  // 1. Firebase Auth 상태 구독 및 로그인 시 users/{uid} 프로필 동기화
  useEffect(() => {
    let isCancelled = false;

    const unsubscribeAuth = subscribeToAuthState((firebaseUser) => {
      if (isCancelled) return;

      if (!firebaseUser) {
        setAuthUser(null);
        return;
      }

      setAuthUser(toAuthUserSummary(firebaseUser));

      syncUserProfileToFirestore(firebaseUser)
        .then((profileDoc) => {
          if (!isCancelled) {
            setUserProfileDoc(profileDoc);
          }
        })
        .catch((error) => {
          console.error("Failed to sync user profile to Firestore:", error);
          if (!isCancelled) {
            showToast("사용자 프로필을 저장하지 못했어요");
          }
        });
    });

    return () => {
      isCancelled = true;
      unsubscribeAuth();
    };
  }, [setAuthUser, setUserProfileDoc, showToast]);

  // 2. 로그인된 사용자에 한해 users/{uid} 및 users/{uid}/links 실시간 구독
  useEffect(() => {
    if (!uid) {
      return;
    }

    let isCancelled = false;
    setLinksLoading(true);

    const unsubscribeProfile = subscribeToUserProfile(
      uid,
      (profileDoc) => {
        if (!isCancelled && profileDoc) {
          setUserProfileDoc(profileDoc);
        }
      },
      (error) => {
        console.error("Failed to subscribe to user profile:", error);
      }
    );

    const unsubscribeLinks = subscribeToUserLinks(
      uid,
      (links) => {
        if (!isCancelled) {
          setFirestoreLinks(links);
        }
      },
      (error) => {
        console.error("Failed to subscribe to user Firestore links:", error);
        if (!isCancelled) {
          setLinksLoading(false);
          showToast("링크 목록을 불러오지 못했어요");
        }
      }
    );

    return () => {
      isCancelled = true;
      unsubscribeProfile();
      unsubscribeLinks();
    };
  }, [uid, setLinksLoading, setUserProfileDoc, setFirestoreLinks, showToast]);

  const handleLinkClick = (title: string) => {
    showToast(`${title}(으)로 이동해요`);
  };

  const handleSocialClick = (platform: string) => {
    showToast(`${platform} 채널로 이동해요`);
  };

  const isAuthReady = hasMounted && !authLoading;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-sans antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
      {/* 1. Top Navigation Bar (with Google Login / Logout) */}
      <TopBar onShowToast={showToast} />

      {/* 2. Main Mobile-First Container */}
      <main className="mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6 pb-10">
        {!isAuthReady ? (
          <AuthLoadingSkeleton />
        ) : !user ? (
          <LoginRequiredCard onShowToast={showToast} />
        ) : (
          <>
            {/* Authenticated User Profile Hero (from users/{uid}) */}
            <ProfileHero
              profile={profile}
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
                <Button className="w-full h-[52px] rounded-2xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] shadow-sm transition-transform cursor-pointer">
                  + 새 링크 추가하기
                </Button>
              </LinkAddDialog>
            </div>

            {/* Personalized Link List (users/{uid}/links) */}
            <div className="mt-2">
              {linksLoading ? (
                <div className="space-y-3 pt-2">
                  <div className="h-[74px] w-full animate-pulse rounded-2xl bg-white border border-[#E5E8EB]" />
                  <div className="h-[74px] w-full animate-pulse rounded-2xl bg-white border border-[#E5E8EB]" />
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
          </>
        )}

        {/* Bottom CTA & Footer */}
        <BottomCTA
          onAction={() => {
            if (!user) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              showToast("상단 또는 안내 카드에서 Google 로그인을 진행해 주세요");
              return;
            }
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
