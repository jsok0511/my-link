import { create } from "zustand";
import { ProfileData, ContentBlock, LinkItem } from "@/types/mylink";
import { defaultProfile } from "@/data/defaultProfile";

export interface MyLinkState {
  profile: ProfileData;
  isHydrated: boolean;
  firestoreLinkIds: string[];
  setHydrated: (state: boolean) => void;
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
  profile: defaultProfile,
  isHydrated: true,
  firestoreLinkIds: [],
  setHydrated: (val) => set({ isHydrated: val }),
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
    set((state) => {
      const previousRemoteIds = new Set(state.firestoreLinkIds);
      const nextRemoteIds = links.map((link) => link.id);
      const nextRemoteIdSet = new Set(nextRemoteIds);

      const baseBlocks = state.profile.blocks.filter(
        (block) => !previousRemoteIds.has(block.id) && !nextRemoteIdSet.has(block.id)
      );

      return {
        firestoreLinkIds: nextRemoteIds,
        profile: {
          ...state.profile,
          blocks: [...links, ...baseBlocks],
        },
      };
    }),
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
      profile: defaultProfile,
      firestoreLinkIds: [],
    }),
}));
