import { create } from "zustand";
import { ProfileData, ContentBlock } from "@/types/mylink";
import { defaultProfile } from "@/data/defaultProfile";

export interface MyLinkState {
  profile: ProfileData;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  setProfile: (profile: Partial<ProfileData>) => void;
  addBlock: (block: ContentBlock) => void;
  updateBlock: (id: string, block: Partial<ContentBlock>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blocks: ContentBlock[]) => void;
  resetToDefault: () => void;
}

export const useMyLinkStore = create<MyLinkState>()((set) => ({
  profile: defaultProfile,
  isHydrated: true,
  setHydrated: (val) => set({ isHydrated: val }),
  setProfile: (updated) =>
    set((state) => ({
      profile: { ...state.profile, ...updated },
    })),
  addBlock: (block) =>
    set((state) => ({
      profile: {
        ...state.profile,
        blocks: [...state.profile.blocks, block],
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
    }),
}));
