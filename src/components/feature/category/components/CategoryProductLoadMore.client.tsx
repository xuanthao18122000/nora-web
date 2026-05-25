"use client";

import { useCallback, useMemo } from "react";

import {
	DEFAULT_PAGE_SIZE,
	LoadMore,
} from "@/components/common/product-list/load-more.client";
import { getCategoryProducts } from "@/components/feature/category/api/get-category-products";
import { mapCategoryProductToCard } from "@/components/feature/category/utils/map-category-product";

export interface CategoryProductLoadMoreProps {
	categoryId: number;
	sort?: string;
	initialPage: number;
	limit: number;
	totalProducts: number;
	searchParams?: Record<string, string | string[] | undefined>;
}

export function CategoryProductLoadMore({
	categoryId,
	sort,
	initialPage,
	limit,
	totalProducts,
	searchParams,
}: CategoryProductLoadMoreProps) {
	const searchParamsJson = JSON.stringify(searchParams ?? {});

	const resetKey = useMemo(
		() =>
			`${categoryId}|${sort ?? ""}|${limit}|${initialPage}|${searchParamsJson}`,
		[categoryId, sort, limit, initialPage, searchParamsJson],
	);

	const fetchMore = useCallback(
		async (page: number) => {
			const merged: Record<string, string | string[] | undefined> = {
				...(JSON.parse(searchParamsJson) as Record<
					string,
					string | string[] | undefined
				>),
				page: String(page),
				limit: String(limit),
			};
			if (sort) merged.sort = sort;

			const data = await getCategoryProducts(categoryId, merged);
			return data.items.map(mapCategoryProductToCard);
		},
		[categoryId, sort, limit, searchParamsJson],
	);

	return (
		<LoadMore
			fetchMore={fetchMore}
			initialPage={initialPage}
			pageSize={limit > 0 ? limit : DEFAULT_PAGE_SIZE}
			totalItems={totalProducts}
			resetKey={resetKey}
		/>
	);
}
