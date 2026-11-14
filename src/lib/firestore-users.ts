import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export interface UserProfileDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
}

function getUserDocRef(uid: string) {
  if (!uid) {
    throw new Error("유효한 사용자 UID가 필요합니다.");
  }
  return doc(db, "users", uid);
}

function mapDocToUserProfile(uid: string, data: DocumentData): UserProfileDoc {
  const email = typeof data.email === "string" ? data.email : "";
  const fallbackName = email ? email.split("@")[0] : "사용자";

  return {
    uid,
    displayName:
      typeof data.displayName === "string" && data.displayName.trim().length > 0
        ? data.displayName.trim()
        : fallbackName,
    email,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : "",
    bio: typeof data.bio === "string" && data.bio.trim().length > 0 ? data.bio.trim() : undefined,
  };
}

export interface UpdateUserProfileInput {
  displayName: string;
  bio?: string;
}

/**
 * Syncs the authenticated Google user's profile fields into `users/{uid}` in Firestore.
 * Preserves existing fields such as `createdAt`, custom `displayName`, or custom `bio`.
 */
export async function syncUserProfileToFirestore(user: User): Promise<UserProfileDoc> {
  const userRef = getUserDocRef(user.uid);
  const existingSnap = await getDoc(userRef);
  const existingData = existingSnap.exists() ? existingSnap.data() : {};

  const email = user.email ?? "";
  const fallbackName = email ? email.split("@")[0] : "사용자";
  const authDisplayName = user.displayName?.trim() || fallbackName;
  const existingDisplayName =
    typeof existingData.displayName === "string" && existingData.displayName.trim().length > 0
      ? existingData.displayName.trim()
      : undefined;
  const displayName = existingDisplayName ?? authDisplayName;
  const photoURL = user.photoURL ?? "";

  const basePayload: Record<string, unknown> = {
    uid: user.uid,
    displayName,
    email,
    photoURL,
    updatedAt: serverTimestamp(),
  };

  if (!existingSnap.exists()) {
    basePayload.createdAt = serverTimestamp();
  }

  await setDoc(userRef, basePayload, { merge: true });

  return {
    uid: user.uid,
    displayName,
    email,
    photoURL,
    bio:
      typeof existingData.bio === "string" && existingData.bio.trim().length > 0
        ? existingData.bio.trim()
        : undefined,
  };
}

/**
 * Updates editable profile fields (`displayName`, `bio`) in `users/{uid}`.
 */
export async function updateUserProfileInFirestore(
  uid: string,
  input: UpdateUserProfileInput
): Promise<void> {
  const userRef = getUserDocRef(uid);
  await setDoc(
    userRef,
    {
      uid,
      displayName: input.displayName.trim(),
      bio: input.bio?.trim() ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Subscribes to user profile metadata stored at `users/{uid}`.
 */
export function subscribeToUserProfile(
  uid: string,
  onProfile: (profile: UserProfileDoc | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getUserDocRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onProfile(null);
        return;
      }
      onProfile(mapDocToUserProfile(uid, snapshot.data()));
    },
    (error) => {
      onError?.(error);
    }
  );
}
