"use client";

/**
 * useAddToCart — local-only cart cho acquyhn.
 * Add item vào Zustand store (persist localStorage). "Buy now" = add + push /checkout.
 */

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem } from "@/types/cart";

export interface AddToCartInput {
	productId: string | number;
	variantId?: string | number;
	sku: string;
	name: string;
	price: number;
	originalPrice?: number;
	quantity?: number;
	thumbnailUrl?: string;
	image?: string;
	slug?: string;
}

function buildItem(input: AddToCartInput): CartItem {
	return {
		productId: String(input.productId),
		variantId: String(input.variantId ?? input.sku),
		sku: input.sku,
		name: input.name,
		price: input.price,
		originalPrice: input.originalPrice,
		quantity: input.quantity ?? 1,
		thumbnailUrl: input.thumbnailUrl,
		image: input.image ?? input.thumbnailUrl,
		slug: input.slug,
		selected: true,
	};
}

export function useAddToCart() {
	const router = useRouter();
	const addItem = useCartStore((s) => s.addItem);

	const addToCart = useCallback(
		(input: AddToCartInput) => {
			addItem(buildItem(input));
			toast.success("Đã thêm vào giỏ hàng");
		},
		[addItem],
	);

	const buyNow = useCallback(
		(input: AddToCartInput) => {
			addItem(buildItem(input));
			router.push("/checkout");
		},
		[addItem, router],
	);

	return { addToCart, buyNow };
}
