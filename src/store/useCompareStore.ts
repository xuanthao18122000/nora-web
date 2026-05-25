"use client";

import { create } from "zustand";
import { persistMiddleware } from "./_persist";

/**
 * CompareItem — fully decoupled from URL/category tree structure.
 *
 * `categoryKey` is the ONLY grouping key.
 * It should be a stable, opaque string (e.g. D-Core productCateId).
 * Do NOT use rootCategoryId or URL-based hierarchy — those may change.
 */
export interface CompareItem {
	productId: string;
	slug: string;
	/** Stable grouping key — use D-Core productCateId or any opaque string.
	 *  Items with different categoryKeys cannot be compared together. */
	categoryKey: string;
	name: string;
	image: string;
	price: number;
	listedPrice?: number | null;
}

type AddItemResult =
	| { success: true }
	| { success: false; error?: "MAX_REACHED" | "WRONG_CATEGORY" };

interface CompareState {
	items: (CompareItem | null)[];
	collapsed: boolean;
	/** Adds an item to a specific slot, or the first available slot if slotIndex is undefined */
	addItem: (item: CompareItem, slotIndex?: number) => AddItemResult;
	removeItem: (productId: string) => void;
	clearAll: () => void;
	hasProduct: (productId: string) => boolean;
	canAdd: (categoryKey: string) => boolean;
	setCollapsed: (collapsed: boolean) => void;
}

const MAX_ITEMS = 3;

export const useCompareStore = create<CompareState>()(
	persistMiddleware<CompareState>(
		(set, get) => ({
			items: Array(MAX_ITEMS).fill(null),
			collapsed: true,
			setCollapsed: (collapsed) => set({ collapsed }),

			addItem: (item, slotIndex) => {
				const { items, hasProduct } = get();
				const validItems = items.filter((i): i is CompareItem => !!i);

				if (validItems.length >= MAX_ITEMS)
					return { success: false, error: "MAX_REACHED" };
				if (
					item.categoryKey &&
					validItems[0]?.categoryKey &&
					validItems[0].categoryKey !== item.categoryKey
				) {
					return { success: false, error: "WRONG_CATEGORY" };
				}
				if (hasProduct(item.productId)) return { success: false };

				set((s) => {
					// Pad items to MAX_ITEMS (localStorage may persist fewer slots)
					const nextItems = [...s.items];
					while (nextItems.length < MAX_ITEMS) nextItems.push(null);

					const idx =
						slotIndex !== undefined && nextItems[slotIndex] === null
							? slotIndex
							: nextItems.indexOf(null);

					if (idx !== -1) {
						nextItems[idx] = item;
						return { items: nextItems };
					}
					return s;
				});
				return { success: true };
			},

			removeItem: (productId) =>
				set((s) => ({
					items: s.items.map((i) =>
						i?.productId === productId ? null : i,
					),
				})),

			clearAll: () => set({ items: Array(MAX_ITEMS).fill(null) }),

			hasProduct: (id) => get().items.some((i) => i?.productId === id),

			canAdd: (categoryKey) => {
				const { items } = get();
				const first = items.find((i): i is CompareItem => !!i);
				const count = items.filter(Boolean).length;

				if (count >= MAX_ITEMS) return false;
				return (
					!categoryKey ||
					!first?.categoryKey ||
					first.categoryKey === categoryKey
				);
			},
		}),
		{
			name: "ddv-compare",
		},
	),
);
