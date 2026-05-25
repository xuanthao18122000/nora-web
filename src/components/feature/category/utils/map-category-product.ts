import type { ProductCardProduct } from "@/components/common/product-list";
import { toHref } from "@/lib/utils/href";
import type { CategoryPageProductItem } from "@/types/category-page";

function clampMinInt(value: number, min: number) {
	return Number.isFinite(value) ? Math.max(min, Math.floor(value)) : min;
}

function parseRating(v: string | number | null | undefined): number | undefined {
	if (v === null || v === undefined || v === "") return undefined;
	const n = typeof v === "number" ? v : Number(v);
	if (!Number.isFinite(n) || n <= 0) return undefined;
	return Math.round(n * 10) / 10;
}

function calcDiscountPercent(minPrice: number, maxPrice: number) {
	if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return;
	if (maxPrice <= 0 || maxPrice <= minPrice) return;

	const discount = ((maxPrice - minPrice) / maxPrice) * 100;
	return Math.max(1, Math.round(discount));
}

/**
 * Khi sản phẩm không có salePrice, fake giá gốc = giá bán × 1.1 để hiển thị
 * "đang giảm ~10%" (yêu cầu marketing — luôn show có khuyến mãi).
 */
const FAKE_DISCOUNT_RATIO = 1.1;

export function mapCategoryProductToCard(
	item: CategoryPageProductItem,
): ProductCardProduct {
	// Acquyhn convention: salePrice = giá đang bán (chính), price = giá gốc (gạch)
	const rawPrice = clampMinInt(Number(item.price ?? item.minPrice ?? 0), 0);
	const rawSale = clampMinInt(Number(item.salePrice ?? 0), 0);

	const hasSale = rawSale > 0 && rawSale < rawPrice;
	const display = hasSale ? rawSale : rawPrice;

	// Khi không có sale thật, dựng giá gốc ảo = display × 1.1 để vẫn show
	// "giảm 10%" trên card.
	const originalPrice = hasSale
		? rawPrice
		: display > 0
			? Math.round(display * FAKE_DISCOUNT_RATIO)
			: undefined;
	const discount =
		originalPrice != null
			? calcDiscountPercent(display, originalPrice)
			: undefined;

	return {
		id: item.id,
		name: item.name,
		href: toHref(item.urlPath ?? item.slug),
		price: display,
		originalPrice,
		discount,
		image: item.thumbnailUrl ?? undefined,
		imageAlt: item.name,
		rating: parseRating(item.averageRating),
		reviewCount: item.reviewCount ?? 0,
	};
}
