import { API, api } from "@/lib/api";
import type { FlashSaleProductItem } from "@/types/category-page";

interface CategoryFlashSaleResponse {
	items: FlashSaleProductItem[];
	total: number;
	page: number;
	limit: number;
}

export async function getCategoryFlashSale(
	slug: string,
	options?: { page?: number; limit?: number },
): Promise<CategoryFlashSaleResponse> {
	const params = new URLSearchParams();
	if (options?.page) params.set("page", String(options.page));
	if (options?.limit) params.set("limit", String(options.limit));

	const qs = params.toString() ? `?${params.toString()}` : "";

	return api.get<CategoryFlashSaleResponse>(
		API.PRODUCTS.CATEGORY_FLASH_SALE(slug) + qs,
		{ cache: "no-store" }, // quota/sold thay đổi real-time → không cache
	);
}
