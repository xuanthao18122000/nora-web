/**
 * usePendingPaymentStore — Zustand store (persisted) for pending payment state.
 *
 * Why Zustand over raw sessionStorage:
 *  - Auto persist + hydrate (sessionStorage middleware)
 *  - Any component can subscribe without prop drilling
 *  - Single source of truth, no stale state
 *  - Easy to reset from anywhere
 */
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persistMiddleware } from "./_persist";

export interface PendingPaymentState {
	orderId: number;
	customerPhone: string;
	/** Payment window expiry (ISO string) — used by UI to check if window is still active */
	expiresAt?: string;
}

interface PendingPaymentStore {
	pending: PendingPaymentState | null;
	/** Save pending payment info */
	setPending: (state: PendingPaymentState) => void;
	/** Clear after successful payment or order cancellation */
	clearPending: () => void;
	/** Check if the payment window is still active */
	isWindowActive: () => boolean;
}

export const usePendingPaymentStore = create<PendingPaymentStore>()(
	persistMiddleware<PendingPaymentStore>(
		(set, get) => ({
			pending: null,

			setPending: (state) => set({ pending: state }),

			clearPending: () => set({ pending: null }),

			isWindowActive: () => {
				const { pending } = get();
				if (!pending) return false;
				if (!pending.expiresAt) return false;
				return new Date(pending.expiresAt) > new Date();
			},
		}),
		{
			name: "ddv_payment_pending",
			// Use sessionStorage so state is cleared when the tab is closed
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
