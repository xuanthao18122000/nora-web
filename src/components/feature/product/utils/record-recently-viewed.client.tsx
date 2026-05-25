"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";

interface RecordRecentlyViewedProps {
	productId: string;
	/**
	 * @deprecated kept for API compatibility with existing callers; no longer
	 * persisted (the client fetches fresh product data via SWR on the list page).
	 */
	urlPath?: string;
}

/**
 * Invisible Client Component — records a product visit into the Zustand store
 * (`useRecentlyViewedStore`, persisted to localStorage). The store also writes
 * a boolean `ddv-rv-has` cookie so Server Components can reserve layout space
 * for the section without CLS.
 */
export function RecordRecentlyViewed({ productId }: RecordRecentlyViewedProps) {
	const add = useRecentlyViewedStore((s) => s.add);

	useEffect(() => {
		if (productId) add(productId);
	}, [productId, add]);

	return null;
}
