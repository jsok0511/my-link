import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
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

function toTimestampMillis(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as Timestamp).toMillis === "function") {
    return (value as Timestamp).toMillis();
  }
  return 0;
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
 * Subscribes to links stored under `users/anonymous/links` in chronological order.
 */
export function subscribeToAnonymousLinks(
  onLinks: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getAnonymousLinksCollection(),
    (snapshot) => {
      const linksWithOrder = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          link: mapDocToLinkItem(docSnap.id, data),
          createdAtMs: toTimestampMillis(data.createdAt),
        };
      });

      linksWithOrder.sort((a, b) => a.createdAtMs - b.createdAtMs);
      onLinks(linksWithOrder.map((entry) => entry.link));
    },
    (error) => {
      onError?.(error);
    }
  );
}
