import { create } from "zustand";
import type { AuthUserSummary } from "@/lib/firebase-auth";

export interface MyLinkState {
  user: AuthUserSummary | null;
  authLoading: boolean;
  setAuthUser: (user: AuthUserSummary | null) => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useMyLinkStore = create<MyLinkState>()((set) => ({
  user: null,
  authLoading: true,
  setAuthUser: (user) =>
    set({
      user,
      authLoading: false,
    }),
  setAuthLoading: (authLoading) => set({ authLoading }),
}));
