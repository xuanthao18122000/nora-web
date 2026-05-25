import type { SearchInitialData } from "@/types/search";

/**
 * Acquyhn không có endpoint `/fe/search/initial` — search panel hiển thị
 * placeholder, không có trends/suggestions/recommended. Trả empty thẳng,
 * tránh log 404 noise ở BE.
 */
export async function getSearchInitialData(): Promise<SearchInitialData> {
	return { trends: [], suggestions: [], recommendedProducts: [] };
}
