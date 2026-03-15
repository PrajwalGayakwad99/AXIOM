// PATH: src/store/useUserStore.ts
// Zustand store for user state — role, XP, streak, profile

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role, Profile, Notification, UserAchievement } from "@/types";

interface UserState {
  // ── User identity ──
  id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  role: Role;

  // ── Gamification ──
  totalXp: number;
  streakDays: number;
  level: number;
  rank: number;

  // ── Profile ──
  profile: Profile | null;

  // ── Notifications ──
  notifications: Notification[];
  unreadCount: number;

  // ── Achievements ──
  recentAchievements: UserAchievement[];

  // ── Session ──
  isHydrated: boolean;
}

interface UserActions {
  // ── Setters ──
  setUser: (user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
  }) => void;
  setProfile: (profile: Profile) => void;
  setRole: (role: Role) => void;

  // ── Gamification ──
  addXp: (amount: number, reason?: string) => void;
  setStreak: (days: number) => void;
  setRank: (rank: number) => void;

  // ── Notifications ──
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // ── Achievements ──
  addAchievement: (achievement: UserAchievement) => void;

  // ── Reset ──
  reset: () => void;
  setHydrated: (hydrated: boolean) => void;
}

/** Compute level from XP (every 500 XP = 1 level) */
function computeLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  image: null,
  role: "STUDENT",
  totalXp: 0,
  streakDays: 0,
  level: 1,
  rank: 0,
  profile: null,
  notifications: [],
  unreadCount: 0,
  recentAchievements: [],
  isHydrated: false,
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Setters ──────────────────────────────

      setUser: (user) =>
        set({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }),

      setProfile: (profile) =>
        set({
          profile,
          totalXp: profile.totalXp,
          streakDays: profile.streakDays,
          level: computeLevel(profile.totalXp),
        }),

      setRole: (role) => set({ role }),

      // ── Gamification ─────────────────────────

      addXp: (amount) => {
        const newXp = get().totalXp + amount;
        set({
          totalXp: newXp,
          level: computeLevel(newXp),
        });
      },

      setStreak: (days) => set({ streakDays: days }),

      setRank: (rank) => set({ rank }),

      // ── Notifications ────────────────────────

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),

      markNotificationRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.isRead).length,
          };
        }),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),

      // ── Achievements ─────────────────────────

      addAchievement: (achievement) =>
        set((state) => ({
          recentAchievements: [achievement, ...state.recentAchievements].slice(0, 10),
        })),

      // ── Reset ────────────────────────────────

      reset: () => set(initialState),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "codevision-user-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        email: state.email,
        image: state.image,
        role: state.role,
        totalXp: state.totalXp,
        streakDays: state.streakDays,
        level: state.level,
        rank: state.rank,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
