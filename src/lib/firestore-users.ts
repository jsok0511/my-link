import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export const MAX_DISPLAY_NAME_LENGTH = 30;
const MAX_SUFFIX_ATTEMPTS = 9;

export interface UserProfileDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
}

export interface DisplayNameCheckResult {
  available: boolean;
  normalizedName: string;
  reason?: "invalid" | "duplicate";
  message: string;
}

export class DuplicateDisplayNameError extends Error {
  constructor(message = "이미 사용 중인 이름이에요.") {
    super(message);
    this.name = "DuplicateDisplayNameError";
  }
}

export function normalizeDisplayName(name: string): string {
  return name.trim();
}

export function toDisplayNameKey(name: string): string {
  const normalized = normalizeDisplayName(name).toLowerCase();
  if (!normalized) {
    throw new Error("유효한 이름이 필요합니다.");
  }
  // Prefix and URL-encode so Firestore doc IDs never contain '/', '.', '..', or '__.*__'
  return `dn_${encodeURIComponent(normalized)}`;
}

function buildSuffixedDisplayName(base: string, suffix: string): string {
  const cleanBase = normalizeDisplayName(base) || "사용자";
  const maxBaseLength = Math.max(1, MAX_DISPLAY_NAME_LENGTH - suffix.length);
  const slicedBase = cleanBase.slice(0, maxBaseLength).trimEnd() || "사용자";
  return `${slicedBase}${suffix}`;
}

function buildDisplayNameCandidates(base: string, uid: string): string[] {
  const initial = normalizeDisplayName(base).slice(0, MAX_DISPLAY_NAME_LENGTH) || "사용자";
  const candidates = [initial];

  for (let i = 1; i <= MAX_SUFFIX_ATTEMPTS; i += 1) {
    candidates.push(buildSuffixedDisplayName(initial, `_${i}`));
  }

  candidates.push(buildSuffixedDisplayName(initial, `_${uid.slice(0, 5)}`));
  candidates.push(buildSuffixedDisplayName(initial, `_${uid.slice(0, 8)}`));
  return Array.from(new Set(candidates));
}

function getUserDocRef(uid: string) {
  if (!uid) {
    throw new Error("유효한 사용자 UID가 필요합니다.");
  }
  return doc(db, "users", uid);
}

function getDisplayNameDocRef(displayName: string) {
  return doc(db, "displayNames", toDisplayNameKey(displayName));
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
 * Checks whether a displayName is available for use (case-insensitive).
 * A name already owned by `currentUid` is considered available for that user.
 */
export async function checkDisplayNameAvailability(
  displayName: string,
  currentUid?: string
): Promise<DisplayNameCheckResult> {
  const trimmed = normalizeDisplayName(displayName);

  if (trimmed.length === 0) {
    return {
      available: false,
      normalizedName: trimmed,
      reason: "invalid",
      message: "이름을 입력해 주세요.",
    };
  }

  if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      available: false,
      normalizedName: trimmed,
      reason: "invalid",
      message: `이름은 ${MAX_DISPLAY_NAME_LENGTH}자 이내로 입력해 주세요.`,
    };
  }

  const dnSnap = await getDoc(getDisplayNameDocRef(trimmed));
  if (!dnSnap.exists()) {
    return {
      available: true,
      normalizedName: trimmed,
      message: "사용 가능한 이름이에요.",
    };
  }

  const ownerUid = dnSnap.data()?.uid;
  if (currentUid && ownerUid === currentUid) {
    return {
      available: true,
      normalizedName: trimmed,
      message: "현재 사용 중인 이름이에요.",
    };
  }

  return {
    available: false,
    normalizedName: trimmed,
    reason: "duplicate",
    message: "이미 사용 중인 이름이에요.",
  };
}

/**
 * Syncs the authenticated Google user's profile fields into `users/{uid}` in Firestore.
 * Assigns a suffixed unique `displayName` on initial login when the default name is already taken.
 */
export async function syncUserProfileToFirestore(user: User): Promise<UserProfileDoc> {
  const userRef = getUserDocRef(user.uid);
  const email = user.email ?? "";
  const fallbackName = email ? email.split("@")[0] : "사용자";
  const authDisplayName =
    (user.displayName?.trim() || fallbackName).slice(0, MAX_DISPLAY_NAME_LENGTH);
  const photoURL = user.photoURL ?? "";

  return runTransaction(db, async (transaction) => {
    const existingSnap = await transaction.get(userRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : {};

    const existingDisplayName =
      typeof existingData.displayName === "string" && existingData.displayName.trim().length > 0
        ? existingData.displayName.trim().slice(0, MAX_DISPLAY_NAME_LENGTH)
        : undefined;

    const baseName = existingDisplayName ?? authDisplayName;
    const candidates = buildDisplayNameCandidates(baseName, user.uid);

    let chosenDisplayName: string | null = null;
    for (const candidate of candidates) {
      const dnRef = getDisplayNameDocRef(candidate);
      const dnSnap = await transaction.get(dnRef);
      if (!dnSnap.exists() || dnSnap.data()?.uid === user.uid) {
        chosenDisplayName = candidate;
        break;
      }
    }

    if (!chosenDisplayName) {
      chosenDisplayName = buildSuffixedDisplayName(
        baseName,
        `_${Date.now().toString(36).slice(-4)}`
      );
    }

    const basePayload: Record<string, unknown> = {
      uid: user.uid,
      displayName: chosenDisplayName,
      email,
      photoURL,
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      basePayload.createdAt = serverTimestamp();
    }

    transaction.set(
      getDisplayNameDocRef(chosenDisplayName),
      {
        uid: user.uid,
        displayName: chosenDisplayName,
        normalizedName: chosenDisplayName.toLowerCase(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    transaction.set(userRef, basePayload, { merge: true });

    return {
      uid: user.uid,
      displayName: chosenDisplayName,
      email,
      photoURL,
      bio:
        typeof existingData.bio === "string" && existingData.bio.trim().length > 0
          ? existingData.bio.trim()
          : undefined,
    };
  });
}

/**
 * Atomically updates editable profile fields (`displayName`, `bio`) in `users/{uid}`
 * while enforcing unique ownership in `displayNames/{key}`.
 */
export async function updateUserProfileInFirestore(
  uid: string,
  input: UpdateUserProfileInput
): Promise<void> {
  const userRef = getUserDocRef(uid);
  const nextDisplayName = normalizeDisplayName(input.displayName);
  const nextBio = input.bio?.trim() ?? "";

  if (!nextDisplayName) {
    throw new Error("이름을 입력해 주세요.");
  }

  if (nextDisplayName.length > MAX_DISPLAY_NAME_LENGTH) {
    throw new Error(`이름은 ${MAX_DISPLAY_NAME_LENGTH}자 이내로 입력해 주세요.`);
  }

  const nextKey = toDisplayNameKey(nextDisplayName);
  const nextDnRef = getDisplayNameDocRef(nextDisplayName);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const existingData = userSnap.exists() ? userSnap.data() : {};
    const previousDisplayName =
      typeof existingData.displayName === "string" && existingData.displayName.trim().length > 0
        ? existingData.displayName.trim()
        : null;
    const oldKey = previousDisplayName ? toDisplayNameKey(previousDisplayName) : null;

    const nextDnSnap = await transaction.get(nextDnRef);
    if (nextDnSnap.exists() && nextDnSnap.data()?.uid !== uid) {
      throw new DuplicateDisplayNameError("이미 사용 중인 이름이에요.");
    }

    let shouldDeleteOld = false;
    const oldDnRef =
      oldKey && oldKey !== nextKey && previousDisplayName
        ? getDisplayNameDocRef(previousDisplayName)
        : null;

    if (oldDnRef) {
      const oldDnSnap = await transaction.get(oldDnRef);
      shouldDeleteOld = oldDnSnap.exists() && oldDnSnap.data()?.uid === uid;
    }

    if (shouldDeleteOld && oldDnRef) {
      transaction.delete(oldDnRef);
    }

    transaction.set(
      nextDnRef,
      {
        uid,
        displayName: nextDisplayName,
        normalizedName: nextDisplayName.toLowerCase(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    transaction.set(
      userRef,
      {
        uid,
        displayName: nextDisplayName,
        bio: nextBio,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
}

/**
 * Fetches user profile metadata stored at `users/{uid}`.
 */
export async function fetchUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const snapshot = await getDoc(getUserDocRef(uid));
  if (!snapshot.exists()) {
    return null;
  }
  return mapDocToUserProfile(uid, snapshot.data());
}

/**
 * Safely decodes a URL-encoded route parameter without throwing on malformed sequences.
 */
export function safeDecodeDisplayName(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Looks up a user profile by `displayName` using `displayNames/{key}` (case-insensitive)
 * and falling back to an exact `displayName` query on `users`. Returns `null` if not found.
 */
export async function fetchUserByDisplayName(
  displayName: string
): Promise<UserProfileDoc | null> {
  const trimmed = normalizeDisplayName(safeDecodeDisplayName(displayName));
  if (!trimmed || trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    return null;
  }

  const dnSnap = await getDoc(getDisplayNameDocRef(trimmed));
  if (dnSnap.exists()) {
    const uid = dnSnap.data()?.uid;
    if (typeof uid === "string" && uid.trim().length > 0) {
      const profile = await fetchUserProfile(uid.trim());
      if (profile) {
        return profile;
      }
    }
  }

  // Fallback for user documents created before the displayNames index existed
  try {
    const usersQuery = query(
      collection(db, "users"),
      where("displayName", "==", trimmed),
      limit(1)
    );
    const usersSnap = await getDocs(usersQuery);
    if (!usersSnap.empty) {
      const userDoc = usersSnap.docs[0];
      return mapDocToUserProfile(userDoc.id, userDoc.data());
    }
  } catch {
    // Ignore permission/index errors on fallback query
  }

  return null;
}

