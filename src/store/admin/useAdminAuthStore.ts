"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADMIN_TOKEN_STORAGE_KEY } from "@/lib/api/admin/client";
import type { AdminUser } from "@/lib/api/admin/types";

interface AdminAuthState {
	token: string | null;
	user: AdminUser | null;
	hasHydrated: boolean;
	setAuth: (token: string, user: AdminUser) => void;
	setUser: (user: AdminUser | null) => void;
	clearAuth: () => void;
	setHasHydrated: (value: boolean) => void;
}

const STORE_NAME = "acquyhn_admin_auth";

export const useAdminAuthStore = create<AdminAuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			hasHydrated: false,
			setAuth: (token, user) => {
				if (typeof window !== "undefined") {
					localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
				}
				set({ token, user });
			},
			setUser: (user) => set({ user }),
			clearAuth: () => {
				if (typeof window !== "undefined") {
					localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
				}
				set({ token: null, user: null });
			},
			setHasHydrated: (value) => set({ hasHydrated: value }),
		}),
		{
			name: STORE_NAME,
			partialize: (state) => ({ token: state.token, user: state.user }),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
				// Sync localStorage key (đảm bảo client.ts đọc được token)
				if (typeof window !== "undefined" && state?.token) {
					localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, state.token);
				}
			},
		},
	),
);
