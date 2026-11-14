import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LinkItem } from "@/types/mylink";

export interface CreateLinkInput {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  category?: LinkItem["category"];
}

export type UpdateLinkInput = CreateLinkInput;

function requireUid(uid: string): string {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new Error("로그인이 필요합니다.");
  }
  return trimmed;
}

function getUserLinksCollection(uid: string) {
  return collection(db, "users", requireUid(uid), "links");
}

function getUserLinkDoc(uid: string, id: string) {
  return doc(db, "users", requireUid(uid), "links", id);
}

function getUserLinksQuery(uid: string) {
  return query(getUserLinksCollection(uid), orderBy("createdAt", "desc"));
}

function toTimestampMillis(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (value && typeof value === "object") {
    if ("toMillis" in value && typeof (value as Timestamp).toMillis === "function") {
      return (value as Timestamp).toMillis();
    }
    if ("seconds" in value && typeof (value as { seconds: unknown }).seconds === "number") {
      return (value as { seconds: number }).seconds * 1000;
    }
  }
  return 0;
}

function getCreatedAtMillis(docSnap: QueryDocumentSnapshot<DocumentData>): number {
  const data = docSnap.data({ serverTimestamps: "estimate" });
  const millis = toTimestampMillis(data.createdAt);
  if (millis > 0) {
    return millis;
  }
  return docSnap.metadata.hasPendingWrites ? Date.now() : 0;
}

function mapDocToLinkItem(id: string, data: DocumentData): LinkItem {
  return {
    id,
    type: "link",
    title: typeof data.title === "string" ? data.title : "",
    url: typeof data.url === "string" ? data.url : "",
    description: typeof data.description === "string" && data.description.length > 0 ? data.description : undefined,
    icon: typeof data.icon === "string" && data.icon.length > 0 ? data.icon : "Link",
    badge: typeof data.badge === "string" && data.badge.length > 0 ? data.badge : undefined,
    category: data.category,
    enabled: typeof data.enabled === "boolean" ? data.enabled : true,
  };
}

function mapSnapshotToLinks(snapshot: QuerySnapshot<DocumentData>): LinkItem[] {
  const linksWithOrder = snapshot.docs.map((docSnap) => {
    const data = docSnap.data({ serverTimestamps: "estimate" });
    return {
      link: mapDocToLinkItem(docSnap.id, data),
      createdAtMs: getCreatedAtMillis(docSnap),
    };
  });

  linksWithOrder.sort((a, b) => b.createdAtMs - a.createdAtMs);
  return linksWithOrder.map((entry) => entry.link);
}

function buildLinkPayload(input: CreateLinkInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    type: "link",
    title: input.title.trim(),
    url: input.url.trim(),
    description: input.description?.trim() || "",
    icon: input.icon?.trim() || "Link",
    enabled: true,
  };

  if (input.badge) {
    payload.badge = input.badge;
  }
  if (input.category) {
    payload.category = input.category;
  }

  return payload;
}

function buildLinkItem(id: string, input: CreateLinkInput): LinkItem {
  const description = input.description?.trim() || "";
  return {
    id,
    type: "link",
    title: input.title.trim(),
    url: input.url.trim(),
    description: description || undefined,
    icon: input.icon?.trim() || "Link",
    badge: input.badge,
    category: input.category,
    enabled: true,
  };
}

/**
 * Saves a new link document to Firestore at `users/{uid}/links`.
 */
export async function addLinkToFirestore(
  uid: string,
  input: CreateLinkInput
): Promise<LinkItem> {
  const payload = {
    ...buildLinkPayload(input),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(getUserLinksCollection(uid), payload);
  return buildLinkItem(docRef.id, input);
}

/**
 * Updates an existing link document in Firestore at `users/{uid}/links/{id}`.
 * Falls back to `setDoc` if the document does not exist yet.
 */
export async function updateLinkInFirestore(
  uid: string,
  id: string,
  input: UpdateLinkInput
): Promise<LinkItem> {
  const docRef = getUserLinkDoc(uid, id);
  const updatePayload = {
    title: input.title.trim(),
    url: input.url.trim(),
    description: input.description?.trim() || "",
    icon: input.icon?.trim() || "Link",
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    const firebaseCode =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: unknown }).code
        : undefined;
    if (firebaseCode === "not-found") {
      await setDoc(
        docRef,
        {
          ...buildLinkPayload(input),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      throw error;
    }
  }

  return buildLinkItem(id, input);
}

/**
 * Deletes a link document from Firestore at `users/{uid}/links/{id}`.
 */
export async function deleteLinkFromFirestore(uid: string, id: string): Promise<void> {
  await deleteDoc(getUserLinkDoc(uid, id));
}

/**
 * Fetches links stored under `users/{uid}/links` ordered by `createdAt` descending (newest first).
 */
export async function fetchUserLinks(uid: string): Promise<LinkItem[]> {
  const snapshot = await getDocs(getUserLinksQuery(uid));
  return mapSnapshotToLinks(snapshot);
}

/**
 * Subscribes to links stored under `users/{uid}/links` ordered by `createdAt` descending (newest first).
 */
export function subscribeToUserLinks(
  uid: string,
  onLinks: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getUserLinksQuery(uid),
    (snapshot) => {
      onLinks(mapSnapshotToLinks(snapshot));
    },
    (error) => {
      onError?.(error);
    }
  );
}
