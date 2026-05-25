"use client";

import { create } from "zustand";

/**
 * PDP selection store — merges warranty pick (from "Chọn gói dịch vụ bảo hành")
 * and accessory ticks (from "Thường mua kèm") into a single source of truth
 * scoped per product variant. Both the main product-info CTA and the
 * frequently-bought-together CTA read & write this store so either button
 * results in the full merged basket being added to cart.
 *
 * Not persisted — PDP selection is ephemeral and must reset when the user
 * leaves the page or switches variant.
 */

export interface PdpSelectedWarranty {
	id: string;
	name: string;
	price: number;
}

interface PdpSelectionState {
	/** The variantId currently scoped. State resets when this changes. */
	variantId: string | null;
	warranty: PdpSelectedWarranty | null;
	accessoryIds: string[];
	/** Switches the active variant and clears stale selection. */
	setVariant: (variantId: string | null) => void;
	setWarranty: (warranty: PdpSelectedWarranty | null) => void;
	setAccessoryIds: (ids: string[]) => void;
	reset: () => void;
}

export const usePdpSelectionStore = create<PdpSelectionState>()((set, get) => ({
	variantId: null,
	warranty: null,
	accessoryIds: [],

	setVariant: (variantId) => {
		if (get().variantId === variantId) return;
		set({ variantId, warranty: null, accessoryIds: [] });
	},

	setWarranty: (warranty) => set({ warranty }),

	setAccessoryIds: (ids) => set({ accessoryIds: ids }),

	reset: () => set({ variantId: null, warranty: null, accessoryIds: [] }),
}));
