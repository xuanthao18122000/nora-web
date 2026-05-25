import { API, api } from "@/lib/api";
import type { SearchResponse } from "@/types/search";
import type { SearchQuery } from "../utils/search-query.schema";

export async function getSearchResults(
	query: string,
	options?: SearchQuery,
): Promise<SearchResponse> {
	const trimmed = query.trim();
	const productPage = options?.productPage;
	const categoryPage = options?.categoryPage;
	const productLimit = options?.productLimit;
	const categoryLimit = options?.categoryLimit;
	const sort = options?.sort;

	if (!trimmed) {
		return {
			products: { total: 0, items: [], page: 1, limit: 0 },
			categories: { total: 0, items: [], page: 1, limit: 0 },
		};
	}

	const params: Record<string, string> = { q: trimmed };
	if (productPage != null) params.productPage = String(productPage);
	if (categoryPage != null) params.categoryPage = String(categoryPage);
	if (productLimit != null) params.productLimit = String(productLimit);
	if (categoryLimit != null) params.categoryLimit = String(categoryLimit);
	if (sort != null) params.sort = String(sort);

	return api.get<SearchResponse>(API.PRODUCTS.SEARCH, { params });
}
