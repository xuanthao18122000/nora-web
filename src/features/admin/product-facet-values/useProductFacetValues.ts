"use client";

import useSWR from "swr";
import { listAdminFacets, listProductFacetValues } from "@/lib/api/admin";

/** Facet values đã gắn cho product. */
export function useProductFacetValues(productId: number | null | undefined) {
	return useSWR(
		productId != null && Number.isFinite(productId)
			? ["admin/product-facet-values", productId]
			: null,
		() => listProductFacetValues(productId as number),
	);
}

/**
 * Facets áp dụng cho 1 hoặc nhiều category (kèm `facetValues[]`).
 * Skip khi `categoryIds` rỗng (vì BE không filter sẽ trả tất cả → không đúng UX).
 */
export function useFacetsByCategoryIds(categoryIds: number[]) {
	const sorted = [...categoryIds].sort((a, b) => a - b);
	const key = sorted.join(",");
	return useSWR(
		key ? ["admin/facets-by-category", key] : null,
		() =>
			listAdminFacets({
				getFull: true,
				categoryIds: sorted,
			}),
	);
}
