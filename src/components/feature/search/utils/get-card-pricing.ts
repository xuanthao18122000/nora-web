import type { SearchProductItem } from "@/types/search";

/**
 * Khi sản phẩm không có sale thật, fake giá gốc = price × 1.1 để hiển thị
 * "đang giảm ~10%" — đồng nhất với CategoryPage (marketing convention).
 */
const FAKE_DISCOUNT_RATIO = 1.1;

function clampMinInt(value: number, min: number) {
	return Number.isFinite(value) ? Math.max(min, Math.floor(value)) : min;
}

function calcDiscountPercent(minPrice: number, maxPrice: number) {
	if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return undefined;
	if (maxPrice <= 0 || maxPrice <= minPrice) return undefined;
	const discount = ((maxPrice - minPrice) / maxPrice) * 100;
	return Math.max(1, Math.round(discount));
}

export interface CardPricing {
	price: number;
	originalPrice?: number;
	discount?: number;
}

/**
 * Tính giá hiển thị cho ProductCard từ SearchProductItem.
 * - Có sale thật (listedPrice > minPrice): originalPrice = listedPrice
 * - Không có sale: originalPrice = price × 1.1 (fake để luôn có badge ~10%)
 */
export function getCardPricing(item: SearchProductItem): CardPricing {
	const price = clampMinInt(item.minPrice, 0);
	const listed =
		item.listedPrice != null ? clampMinInt(item.listedPrice, 0) : 0;

	const hasSale = listed > 0 && listed > price;
	const originalPrice = hasSale
		? listed
		: price > 0
			? Math.round(price * FAKE_DISCOUNT_RATIO)
			: undefined;
	const discount =
		originalPrice != null ? calcDiscountPercent(price, originalPrice) : undefined;

	return { price, originalPrice, discount };
}
