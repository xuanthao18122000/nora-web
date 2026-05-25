"use client";

import { create } from "zustand";
import { COOKIE_RECENTLY_VIEWED } from "@/lib/constants/cookies";
import { persistMiddleware } from "./_persist";

const MAX_ITEMS = 20;
const FLAG_MAX_AGE_SEC = 60 * 60 * 24 * 30;

function writeFlagCookie(hasItems: boolean): void {
	if (typeof document === "undefined") return;
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported
	document.cookie = hasItems
		? `${COOKIE_RECENTLY_VIEWED}=1; path=/; max-age=${FLAG_MAX_AGE_SEC}; SameSite=Lax`
		: `${COOKIE_RECENTLY_VIEWED}=; path=/; max-age=0; SameSite=Lax`;
}

interface RecentlyViewedState {
	ids: string[];
	_hasHydrated: boolean;
	setHasHydrated: (v: boolean) => void;
	add: (id: string) => void;
	remove: (id: string) => void;
	clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
	persistMiddleware<RecentlyViewedState>(
		(set, get) => ({
			ids: [],
			_hasHydrated: false,
			setHasHydrated: (v) => set({ _hasHydrated: v }),

			add: (id) => {
				if (!id) return;
				const next = [id, ...get().ids.filter((x) => x !== id)].slice(
					0,
					MAX_ITEMS,
				);
				set({ ids: next });
				writeFlagCookie(next.length > 0);
			},

			remove: (id) => {
				const next = get().ids.filter((x) => x !== id);
				set({ ids: next });
				writeFlagCookie(next.length > 0);
			},

			clear: () => {
				set({ ids: [] });
				writeFlagCookie(false);
			},
		}),
		{
			name: "ddv-recently-viewed",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
				// Reconcile flag cookie with persisted state so that the
				// next SSR pass has the correct value even if the cookie
				// was stripped (Safari ITP, incognito, manual clear…).
				writeFlagCookie((state?.ids.length ?? 0) > 0);
			},
		},
	),
);
