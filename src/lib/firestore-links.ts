import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LinkItem } from "@/types/mylink";

export const ANONYMOUS_LINKS_PATH = ["users", "anonymous", "links"] as const;

export interface CreateLinkInput {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  category?: LinkItem["category"];
}

function getAnonymousLinksCollection() {
  return collection(db, ...ANONYMOUS_LINKS_PATH);
}

function getAnonymousLinksQuery() {
  return query(getAnonymousLinksCollection(), orderBy("createdAt", "desc"));
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

/**
 * Saves a new link document to Firestore at `users/anonymous/links`.
 */
export async function addLinkToFirestore(input: CreateLinkInput): Promise<LinkItem> {
  const icon = input.icon?.trim() || "Link";
  const description = input.description?.trim() || "";

  const payload: Record<string, unknown> = {
    type: "link",
    title: input.title.trim(),
    url: input.url.trim(),
    description,
    icon,
    enabled: true,
    createdAt: serverTimestamp(),
  };

  if (input.badge) {
    payload.badge = input.badge;
  }
  if (input.category) {
    payload.category = input.category;
  }

  const docRef = await addDoc(getAnonymousLinksCollection(), payload);

  return {
    id: docRef.id,
    type: "link",
    title: input.title.trim(),
    url: input.url.trim(),
    description: description || undefined,
    icon,
    badge: input.badge,
    category: input.category,
    enabled: true,
  };
}

/**
 * Fetches links stored under `users/anonymous/links` ordered by `createdAt` descending (newest first).
 */
export async function fetchAnonymousLinks(): Promise<LinkItem[]> {
  const snapshot = await getDocs(getAnonymousLinksQuery());
  return mapSnapshotToLinks(snapshot);
}

/**
 * Subscribes to links stored under `users/anonymous/links` ordered by `createdAt` descending (newest first).
 */
export function subscribeToAnonymousLinks(
  onLinks: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getAnonymousLinksQuery(),
    (snapshot) => {
      onLinks(mapSnapshotToLinks(snapshot));
    },
    (error) => {
      onError?.(error);
    }
  );
}
