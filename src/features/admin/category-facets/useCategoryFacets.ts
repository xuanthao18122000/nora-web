"use client";

import useSWR from "swr";
import { listAdminFacets, listCategoryFacets } from "@/lib/api/admin";

/** Facets đã gắn vào category (cho section "Cấu hình bộ lọc"). */
export function useCategoryFacets(categoryId: number | null | undefined) {
	return useSWR(
		categoryId != null && Number.isFinite(categoryId)
			? ["admin/category-facets", categoryId]
			: null,
		() => listCategoryFacets(categoryId as number),
	);
}

/** Facets CHƯA gắn vào category (cho dialog "Thêm bộ lọc"). */
export function useAvailableFacetsForCategory(
	categoryId: number | null | undefined,
	enabled = true,
) {
	return useSWR(
		enabled && categoryId != null && Number.isFinite(categoryId)
			? ["admin/facets-available-for-category", categoryId]
			: null,
		() =>
			listAdminFacets({
				getFull: true,
				excludeCategoryId: categoryId as number,
			}),
	);
}
