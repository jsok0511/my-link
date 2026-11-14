"use client";

import { useState, useCallback } from "react";
import {
  getAuthErrorMessage,
  signInWithGoogle,
  signOutUser,
  toAuthUserSummary,
} from "@/lib/firebase-auth";

interface UseGoogleAuthOptions {
  onShowToast?: (msg: string) => void;
}

/**
 * Provides Google popup sign-in and sign-out handlers with loading state and toast feedback.
 */
export function useGoogleAuth({ onShowToast }: UseGoogleAuthOptions = {}) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      const credential = await signInWithGoogle();
      const summary = toAuthUserSummary(credential.user);
      onShowToast?.(`${summary.displayName}님, 환영해요`);
    } catch (error) {
      const { message, isUserCancelled } = getAuthErrorMessage(error);
      if (!isUserCancelled) {
        console.error("Google sign-in failed:", error);
      }
      onShowToast?.(message);
    } finally {
      setIsSigningIn(false);
    }
  }, [isSigningIn, onShowToast]);

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOutUser();
      onShowToast?.("로그아웃되었어요");
    } catch (error) {
      console.error("Sign-out failed:", error);
      onShowToast?.("로그아웃 중 오류가 발생했어요");
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, onShowToast]);

  return {
    isSigningIn,
    isSigningOut,
    handleSignIn,
    handleSignOut,
  };
}
