"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  subscribeToAuthState,
  toAuthUserSummary,
} from "@/lib/firebase-auth";
import {
  myLinkKeys,
  useSyncUserProfileMutation,
} from "@/lib/use-mylink-queries";
import { useMyLinkStore } from "@/store/useMyLinkStore";

/**
 * Subscribes to Firebase Authentication state once at the root layout level
 * so auth status and user profile sync work across both `/` and `/[displayName]`.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const setAuthUser = useMyLinkStore((state) => state.setAuthUser);
  const { mutate: syncUserProfile } = useSyncUserProfileMutation();

  useEffect(() => {
    let isCancelled = false;

    const unsubscribeAuth = subscribeToAuthState((firebaseUser) => {
      if (isCancelled) return;

      if (!firebaseUser) {
        setAuthUser(null);
        queryClient.removeQueries({ queryKey: myLinkKeys.all });
        return;
      }

      setAuthUser(toAuthUserSummary(firebaseUser));

      syncUserProfile(firebaseUser, {
        onError: (error) => {
          console.error("Failed to sync user profile to Firestore:", error);
        },
      });
    });

    return () => {
      isCancelled = true;
      unsubscribeAuth();
    };
  }, [queryClient, setAuthUser, syncUserProfile]);

  return <>{children}</>;
}
