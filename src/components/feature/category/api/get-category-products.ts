import { api } from "@/lib/api";
import type {
	CategoryPageProductItem,
	CategoryPageResponse,
} from "@/types/category-page";

/** Whitelist key BE accept — match `ListProductDto` + `PaginationOptionsDto`. */
const ALLOWED_QUERY_KEYS = new Set([
	"page",
	"limit",
	"sortBy",
	"order",
	"getFull",
	"searchName",
	"searchSku",
	"status",
	"brandId",
	"isBestSeller",
	"minPrice",
	"maxPrice",
	"createdAtFrom",
	"createdAtTo",
	"updatedAtFrom",
	"updatedAtTo",
]);

interface BackendPaginatedProducts {
	data: CategoryPageProductItem[];
	total: number;
	page: number;
	limit: number;
	totalPages?: number;
}

/**
 * Lấy danh sách sản phẩm theo categoryId (mở rộng theo cây ở BE).
 * Storefront resolve slug → id qua `/fe/resolve`, rồi gọi endpoint này.
 */
const DEFAULT_LIMIT = 20;

export async function getCategoryProducts(
	categoryId: number | string,
	searchParams?: Record<string, string | string[] | undefined>,
): Promise<CategoryPageResponse["products"]> {
	const params = new URLSearchParams();
	params.set("categoryId", String(categoryId));

	let hasLimit = false;
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value === undefined) continue;
		// FE alias → backend keys
		// "q" (search input) → searchName
		// "sort" (price_asc/price_desc/relevance) → sortBy + order
		if (key === "sort") {
			const v = Array.isArray(value) ? value[0] : value;
			if (v === "price_asc") {
				params.set("sortBy", "price");
				params.set("order", "ASC");
			} else if (v === "price_desc") {
				params.set("sortBy", "price");
				params.set("order", "DESC");
			}
			continue;
		}
		const paramKey = key === "q" ? "searchName" : key;
		if (!ALLOWED_QUERY_KEYS.has(paramKey)) continue;
		if (paramKey === "limit") hasLimit = true;
		if (Array.isArray(value)) {
			for (const v of value) params.append(paramKey, v);
		} else {
			params.append(paramKey, value);
		}
	}
	if (!hasLimit) params.set("limit", String(DEFAULT_LIMIT));

	const url = `/fe/products?${params.toString()}`;
	const res = await api.get<BackendPaginatedProducts>(url);

	return {
		items: res.data ?? [],
		total: res.total ?? 0,
		page: res.page ?? 1,
		limit: res.limit ?? 0,
	};
}
