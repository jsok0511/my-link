import { create } from "zustand";
import type { AuthUserSummary } from "@/lib/firebase-auth";
import type { UserProfileDoc } from "@/lib/firestore-users";
import { ProfileData, ContentBlock, LinkItem } from "@/types/mylink";

const EMPTY_PROFILE: ProfileData = {
  username: "",
  displayName: "",
  bio: "",
  avatarUrl: "",
  avatarFallback: "",
  tags: [],
  socials: [],
  blocks: [],
};

export interface MyLinkState {
  user: AuthUserSummary | null;
  authLoading: boolean;
  linksLoading: boolean;
  userProfileDoc: UserProfileDoc | null;
  profile: ProfileData;
  isHydrated: boolean;
  firestoreLinkIds: string[];
  setHydrated: (state: boolean) => void;
  setAuthUser: (user: AuthUserSummary | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setLinksLoading: (loading: boolean) => void;
  setUserProfileDoc: (doc: UserProfileDoc | null) => void;
  setProfile: (profile: Partial<ProfileData>) => void;
  addBlock: (block: ContentBlock) => void;
  addFirestoreLink: (link: LinkItem) => void;
  setFirestoreLinks: (links: LinkItem[]) => void;
  updateBlock: (id: string, block: Partial<ContentBlock>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blocks: ContentBlock[]) => void;
  resetToDefault: () => void;
}

export const useMyLinkStore = create<MyLinkState>()((set) => ({
  user: null,
  authLoading: true,
  linksLoading: false,
  userProfileDoc: null,
  profile: EMPTY_PROFILE,
  isHydrated: true,
  firestoreLinkIds: [],
  setHydrated: (val) => set({ isHydrated: val }),
  setAuthUser: (user) =>
    set((state) => {
      if (!user) {
        return {
          user: null,
          authLoading: false,
          linksLoading: false,
          userProfileDoc: null,
          firestoreLinkIds: [],
          profile: EMPTY_PROFILE,
        };
      }
      const isSameUser = state.user?.uid === user.uid;
      return {
        user,
        authLoading: false,
        linksLoading: isSameUser ? state.linksLoading : true,
        userProfileDoc: isSameUser ? state.userProfileDoc : null,
        firestoreLinkIds: isSameUser ? state.firestoreLinkIds : [],
        profile: isSameUser
          ? state.profile
          : {
              ...EMPTY_PROFILE,
              displayName: user.displayName,
              username: user.email,
              avatarUrl: user.photoURL,
              avatarFallback: user.displayName.slice(0, 2),
            },
      };
    }),
  setAuthLoading: (authLoading) => set({ authLoading }),
  setLinksLoading: (linksLoading) => set({ linksLoading }),
  setUserProfileDoc: (userProfileDoc) =>
    set((state) => ({
      userProfileDoc,
      profile: userProfileDoc
        ? {
            ...state.profile,
            displayName: userProfileDoc.displayName,
            username: userProfileDoc.email,
            avatarUrl: userProfileDoc.photoURL,
            avatarFallback: userProfileDoc.displayName.slice(0, 2),
            bio: userProfileDoc.bio ?? "",
          }
        : state.profile,
    })),
  setProfile: (updated) =>
    set((state) => ({
      profile: { ...state.profile, ...updated },
    })),
  addBlock: (block) =>
    set((state) => {
      const exists = state.profile.blocks.some((b) => b.id === block.id);
      if (exists) {
        return state;
      }
      return {
        profile: {
          ...state.profile,
          blocks: [block, ...state.profile.blocks],
        },
      };
    }),
  addFirestoreLink: (link) =>
    set((state) => {
      const existsInBlocks = state.profile.blocks.some((b) => b.id === link.id);
      const existsInRemote = state.firestoreLinkIds.includes(link.id);
      return {
        firestoreLinkIds: existsInRemote
          ? state.firestoreLinkIds
          : [link.id, ...state.firestoreLinkIds],
        profile: {
          ...state.profile,
          blocks: existsInBlocks
            ? state.profile.blocks
            : [link, ...state.profile.blocks],
        },
      };
    }),
  setFirestoreLinks: (links) =>
    set((state) => ({
      linksLoading: false,
      firestoreLinkIds: links.map((link) => link.id),
      profile: {
        ...state.profile,
        blocks: links,
      },
    })),
  updateBlock: (id, updated) =>
    set((state) => ({
      profile: {
        ...state.profile,
        blocks: state.profile.blocks.map((b) =>
          b.id === id ? ({ ...b, ...updated } as ContentBlock) : b
        ),
      },
    })),
  deleteBlock: (id) =>
    set((state) => ({
      firestoreLinkIds: state.firestoreLinkIds.filter((fid) => fid !== id),
      profile: {
        ...state.profile,
        blocks: state.profile.blocks.filter((b) => b.id !== id),
      },
    })),
  reorderBlocks: (blocks) =>
    set((state) => ({
      profile: { ...state.profile, blocks },
    })),
  resetToDefault: () =>
    set({
      profile: EMPTY_PROFILE,
      firestoreLinkIds: [],
    }),
}));
