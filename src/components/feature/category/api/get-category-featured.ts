import { API, api } from "@/lib/api";
import type { CategoryPageProductItem } from "@/types/category-page";

interface CategoryFeaturedResponse {
	items: CategoryPageProductItem[];
	total: number;
	page: number;
	limit: number;
}

export async function getCategoryFeatured(
	slug: string,
	options?: { page?: number; limit?: number },
): Promise<CategoryFeaturedResponse> {
	const params = new URLSearchParams();
	if (options?.page) params.set("page", String(options.page));
	if (options?.limit) params.set("limit", String(options.limit));

	const qs = params.toString() ? `?${params.toString()}` : "";

	return api.get<CategoryFeaturedResponse>(
		API.PRODUCTS.CATEGORY_FEATURED(slug) + qs,
	);
}
