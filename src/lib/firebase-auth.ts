import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Unsubscribe,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export interface AuthUserSummary {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

/**
 * Converts a Firebase Auth User object into a serializable summary for UI state.
 */
export function toAuthUserSummary(user: User): AuthUserSummary {
  const email = user.email ?? "";
  const fallbackName = email ? email.split("@")[0] : "사용자";
  return {
    uid: user.uid,
    displayName: user.displayName?.trim() || fallbackName,
    email,
    photoURL: user.photoURL ?? "",
  };
}

/**
 * Opens a Google sign-in popup using Firebase Authentication.
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Signs out the currently authenticated Firebase user.
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribes to Firebase Authentication state changes.
 */
export function subscribeToAuthState(
  onUserChanged: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, onUserChanged);
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/popup-closed-by-user": "로그인 팝업이 닫혔어요. 다시 시도해 주세요.",
  "auth/cancelled-popup-request": "이미 로그인 창이 열려 있어요.",
  "auth/popup-blocked": "브라우저에서 팝업이 차단되었어요. 팝업 허용 후 다시 시도해 주세요.",
  "auth/network-request-failed": "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
  "auth/unauthorized-domain": "현재 도메인에서는 Google 로그인이 허용되지 않았어요.",
};

/**
 * Maps Firebase Authentication error codes to user-friendly Korean messages.
 */
export function getAuthErrorMessage(error: unknown): {
  message: string;
  isUserCancelled: boolean;
} {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  const isUserCancelled =
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request";

  return {
    message:
      AUTH_ERROR_MESSAGES[code] ??
      "로그인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
    isUserCancelled,
  };
}
