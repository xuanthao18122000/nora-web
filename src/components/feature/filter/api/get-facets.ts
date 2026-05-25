import { API, ApiError, api } from "@/lib/api";
import { CACHE_TAGS } from "@/lib/constants";
import type { Facet, FacetsResponse } from "@/types/facets";

/**
 * Lấy danh sách facets cho FilterInline.
 * - Truyền `categoryId` để lọc theo whitelist `category_facets` (cấu hình admin)
 * - Không truyền → trả tất cả facets active
 * BE trả `{ data: Facet[] }`; nếu 404 → fallback `[]` (BE chưa deploy).
 */
export async function getFacets(categoryId?: number): Promise<Facet[]> {
	try {
		const params: Record<string, string> =
			categoryId != null && Number.isFinite(categoryId)
				? { categoryId: String(categoryId) }
				: {};
		console.log(
			`[getFacets] Calling ${API.PRODUCTS.FACETS} with params=`,
			params,
		);
		const res = await api.get<FacetsResponse>(API.PRODUCTS.FACETS, {
			params,
			next: {
				revalidate: 3600,
				tags: [CACHE_TAGS.FACETS],
			},
		});
		const facets = res?.data ?? [];
		console.log(
			`[getFacets] BE returned ${facets.length} facets:`,
			facets.map((f) => ({
				id: f.id,
				key: f.key,
				label: f.label,
				valuesCount: f.facetValuesCount,
			})),
		);
		return facets
			.slice()
			.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) {
			console.warn(
				`[getFacets] 404 — BE chưa expose /fe/facets, fallback []`,
			);
			return [];
		}
		console.error("[getFacets] Failed:", err);
		throw err;
	}
}
