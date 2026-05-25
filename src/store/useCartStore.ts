"use client";

import { create } from "zustand";
import type { CartItem } from "@/types/cart";
import { persistMiddleware } from "./_persist";

/**
 * Cart store — local-only, lưu vào localStorage qua Zustand persist.
 * Không sync với BE; mọi thao tác chỉ tác động state local.
 */
interface CartState {
	items: CartItem[];
	/** True after Zustand persist middleware has rehydrated from localStorage */
	_hasHydrated: boolean;
	setHasHydrated: (v: boolean) => void;
	addItem: (item: CartItem) => void;
	removeItem: (variantId: string) => void;
	removeItems: (variantIds: string[]) => void;
	updateQuantity: (variantId: string, quantity: number) => void;
	toggleSelect: (variantId: string) => void;
	selectAll: (selected: boolean) => void;
	clearCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
	persistMiddleware<CartState>(
		(set, get) => ({
			items: [],
			_hasHydrated: false,
			setHasHydrated: (v) => set({ _hasHydrated: v }),

			addItem: (item) =>
				set((state) => {
					const existing = state.items.find(
						(i) => i.variantId === item.variantId,
					);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.variantId === item.variantId
									? {
											...i,
											quantity:
												i.quantity + item.quantity,
										}
									: i,
							),
						};
					}
					return {
						items: [...state.items, { ...item, selected: true }],
					};
				}),

			removeItem: (variantId) =>
				set((state) => ({
					items: state.items.filter((i) => i.variantId !== variantId),
				})),

			/** Xoá nhiều items sau khi order thành công */
			removeItems: (variantIds) =>
				set((state) => ({
					items: state.items.filter(
						(i) => !variantIds.includes(i.variantId),
					),
				})),

			updateQuantity: (variantId, quantity) =>
				set((state) => ({
					items:
						quantity <= 0
							? state.items.filter(
									(i) => i.variantId !== variantId,
								)
							: state.items.map((i) =>
									i.variantId === variantId
										? { ...i, quantity }
										: i,
								),
				})),

			toggleSelect: (variantId) =>
				set((state) => ({
					items: state.items.map((i) =>
						i.variantId === variantId
							? { ...i, selected: !i.selected }
							: i,
					),
				})),

			selectAll: (selected) =>
				set((state) => ({
					items: state.items.map((i) => ({ ...i, selected })),
				})),

			clearCart: () => set({ items: [] }),

			getTotalItems: () =>
				get().items.reduce((sum, item) => sum + item.quantity, 0),

			getTotalPrice: () =>
				get().items.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0,
				),
		}),
		{
			name: "ddv-cart",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
