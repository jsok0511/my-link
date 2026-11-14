"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "firebase/auth";
import type { AuthUserSummary } from "@/lib/firebase-auth";
import {
  addLinkToFirestore,
  deleteLinkFromFirestore,
  fetchUserLinks,
  updateLinkInFirestore,
  type CreateLinkInput,
  type UpdateLinkInput,
} from "@/lib/firestore-links";
import {
  checkDisplayNameAvailability,
  fetchUserProfile,
  syncUserProfileToFirestore,
  updateUserProfileInFirestore,
  type UpdateUserProfileInput,
  type UserProfileDoc,
} from "@/lib/firestore-users";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import type { LinkItem, ProfileData } from "@/types/mylink";

export const EMPTY_PROFILE: ProfileData = {
  username: "",
  displayName: "",
  bio: "",
  avatarUrl: "",
  avatarFallback: "",
  tags: [],
  socials: [],
  blocks: [],
};

export const myLinkKeys = {
  all: ["mylink"] as const,
  profile: (uid: string) => ["mylink", "profile", uid] as const,
  links: (uid: string) => ["mylink", "links", uid] as const,
};

/**
 * Builds UI `ProfileData` from authenticated summary, Firestore user doc, and links.
 */
export function buildProfileData(
  user: AuthUserSummary | null,
  profileDoc?: UserProfileDoc | null,
  links?: LinkItem[]
): ProfileData {
  if (!user) {
    return EMPTY_PROFILE;
  }

  const displayName = profileDoc?.displayName || user.displayName;
  const email = profileDoc?.email ?? user.email;
  const avatarUrl = profileDoc?.photoURL ?? user.photoURL;

  return {
    ...EMPTY_PROFILE,
    displayName,
    username: email,
    avatarUrl,
    avatarFallback: displayName.slice(0, 2),
    bio: profileDoc?.bio ?? "",
    blocks: links ?? [],
  };
}

/**
 * Fetches `users/{uid}` via TanStack Query (non-realtime).
 */
export function useUserProfileQuery(uid?: string) {
  return useQuery({
    queryKey: myLinkKeys.profile(uid ?? ""),
    queryFn: () => fetchUserProfile(uid!),
    enabled: Boolean(uid),
  });
}

/**
 * Fetches `users/{uid}/links` via TanStack Query (non-realtime).
 */
export function useUserLinksQuery(uid?: string) {
  return useQuery({
    queryKey: myLinkKeys.links(uid ?? ""),
    queryFn: () => fetchUserLinks(uid!),
    enabled: Boolean(uid),
  });
}

/**
 * Provides combined profile & links query state for the currently authenticated user.
 */
export function useCurrentUserProfileData() {
  const user = useMyLinkStore((state) => state.user);
  const uid = user?.uid;

  const profileQuery = useUserProfileQuery(uid);
  const linksQuery = useUserLinksQuery(uid);

  const profile = buildProfileData(user, profileQuery.data, linksQuery.data);

  return {
    user,
    profileDoc: profileQuery.data ?? null,
    links: linksQuery.data ?? [],
    profile,
    isProfileLoading: profileQuery.isLoading,
    isLinksLoading: linksQuery.isLoading,
    isLinksError: linksQuery.isError,
    refetchLinks: linksQuery.refetch,
  };
}

/**
 * Syncs Google Auth profile into `users/{uid}` and seeds the profile query cache.
 */
export function useSyncUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (firebaseUser: User) => syncUserProfileToFirestore(firebaseUser),
    onSuccess: (profileDoc) => {
      queryClient.setQueryData(myLinkKeys.profile(profileDoc.uid), profileDoc);
    },
  });
}

/**
 * Checks whether a displayName is available via Firestore lookup.
 */
export function useCheckDisplayNameMutation(uid?: string) {
  return useMutation({
    mutationFn: (displayName: string) =>
      checkDisplayNameAvailability(displayName, uid),
  });
}

/**
 * Updates `displayName` and `bio` in Firestore using optimistic cache updates
 * with automatic rollback on error and revalidation on settle.
 */
export function useUpdateUserProfileMutation(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserProfileInput) => {
      if (!uid) {
        throw new Error("로그인 후 프로필을 수정할 수 있어요.");
      }
      await updateUserProfileInFirestore(uid, input);
      return input;
    },
    onMutate: async (input) => {
      if (!uid) {
        return { previousProfile: undefined as UserProfileDoc | null | undefined };
      }

      const profileKey = myLinkKeys.profile(uid);
      await queryClient.cancelQueries({ queryKey: profileKey });

      const previousProfile =
        queryClient.getQueryData<UserProfileDoc | null>(profileKey);

      const trimmedName = input.displayName.trim();
      const trimmedBio = input.bio?.trim() ?? "";
      const currentUser = useMyLinkStore.getState().user;

      queryClient.setQueryData<UserProfileDoc | null>(profileKey, (prev) => {
        if (prev) {
          return {
            ...prev,
            displayName: trimmedName,
            bio: trimmedBio || undefined,
          };
        }
        if (currentUser && currentUser.uid === uid) {
          return {
            uid,
            displayName: trimmedName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            bio: trimmedBio || undefined,
          };
        }
        return prev;
      });

      return { previousProfile };
    },
    onError: (_error, _input, context) => {
      if (!uid || !context) return;
      queryClient.setQueryData<UserProfileDoc | null | undefined>(
        myLinkKeys.profile(uid),
        context.previousProfile
      );
    },
    onSettled: () => {
      if (!uid) return;
      void queryClient.invalidateQueries({ queryKey: myLinkKeys.profile(uid) });
    },
  });
}

/**
 * Adds a new link to `users/{uid}/links` and refreshes the links query.
 */
export function useAddLinkMutation(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLinkInput) => {
      if (!uid) {
        throw new Error("로그인 후 링크를 추가할 수 있어요.");
      }
      return addLinkToFirestore(uid, input);
    },
    onSuccess: async (createdLink) => {
      if (!uid) return;
      queryClient.setQueryData<LinkItem[]>(myLinkKeys.links(uid), (prev) => [
        createdLink,
        ...(prev ?? []).filter((item) => item.id !== createdLink.id),
      ]);
      await queryClient.invalidateQueries({ queryKey: myLinkKeys.links(uid) });
    },
  });
}

/**
 * Updates an existing link in `users/{uid}/links/{id}` and refreshes the links query.
 */
export function useUpdateLinkMutation(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateLinkInput }) => {
      if (!uid) {
        throw new Error("로그인 후 링크를 수정할 수 있어요.");
      }
      return updateLinkInFirestore(uid, id, input);
    },
    onSuccess: async (updatedLink) => {
      if (!uid) return;
      queryClient.setQueryData<LinkItem[]>(myLinkKeys.links(uid), (prev) =>
        (prev ?? []).map((item) => (item.id === updatedLink.id ? updatedLink : item))
      );
      await queryClient.invalidateQueries({ queryKey: myLinkKeys.links(uid) });
    },
  });
}

/**
 * Deletes a link from `users/{uid}/links/{id}` and refreshes the links query.
 */
export function useDeleteLinkMutation(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!uid) {
        throw new Error("로그인 후 링크를 삭제할 수 있어요.");
      }
      await deleteLinkFromFirestore(uid, id);
      return id;
    },
    onSuccess: async (deletedId) => {
      if (!uid) return;
      queryClient.setQueryData<LinkItem[]>(myLinkKeys.links(uid), (prev) =>
        (prev ?? []).filter((item) => item.id !== deletedId)
      );
      await queryClient.invalidateQueries({ queryKey: myLinkKeys.links(uid) });
    },
  });
}
