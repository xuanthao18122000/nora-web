"use client";

import { useCallback, useMemo } from "react";

import { LoadMore } from "@/components/common/product-list/load-more.client";
import { getSearchResults } from "@/components/feature/search/api/get-search-results";
import { mapSearchProductToCard } from "@/components/feature/search/utils/map-search-product";
import type { SearchQuery } from "@/components/feature/search/utils/search-query.schema";

export interface SearchProductLoadMoreProps {
	search: SearchQuery;
	initialPage: number;
	totalProducts: number;
}

export function SearchProductLoadMore({
	search,
	initialPage,
	totalProducts,
}: SearchProductLoadMoreProps) {
	const { q, sort } = search;

	const resetKey = useMemo(() => `${q.trim()}|${sort ?? ""}`, [q, sort]);

	const fetchMore = useCallback(
		async (page: number) => {
			const trimmed = q.trim();
			if (!trimmed) return [];

			const res = await getSearchResults(trimmed, {
				...search,
				productPage: page,
			});

			return res.products.items.map(mapSearchProductToCard);
		},
		[q, search],
	);

	if (!q.trim()) return null;

	return (
		<LoadMore
			fetchMore={fetchMore}
			initialPage={initialPage}
			totalItems={totalProducts}
			resetKey={resetKey}
		/>
	);
}
