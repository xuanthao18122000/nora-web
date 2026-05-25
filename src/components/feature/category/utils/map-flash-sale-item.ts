import type { ProductCardProduct } from "@/components/common/product-list";
import { formatDiscount, formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import type { CategoryPageProductItem } from "@/types/category-page";

export interface FlashSaleCardItem {
	name: string;
	price: string;
	originalPrice?: string;
	discount?: string;
	image?: string;
	soldCount: number;
	totalCount: number;
}

export interface MapFlashSaleItemOptions {
	totalCount: number;
	defaultSoldCount: number;
}

/**
 * Maps a CategoryPageProductItem + its derived ProductCardProduct
 * into the props needed by `<FlashSaleCard>`.
 */
export function mapFlashSaleItem(
	item: CategoryPageProductItem,
	productCard: ProductCardProduct,
	options: MapFlashSaleItemOptions,
): FlashSaleCardItem {
	const soldCount = item.soldCount ?? options.defaultSoldCount;
	const clampedSoldCount = Math.max(
		0,
		Math.min(options.totalCount, soldCount),
	);

	return {
		name: item.name,
		price:
			productCard.price > 0 ? formatPrice(productCard.price) : "Liên hệ",
		originalPrice:
			productCard.originalPrice != null
				? formatPrice(productCard.originalPrice)
				: undefined,
		discount:
			productCard.discount != null
				? formatDiscount(productCard.discount)
				: undefined,
		image: productCard.image ? getImageUrl(productCard.image) : undefined,
		soldCount: clampedSoldCount,
		totalCount: options.totalCount,
	};
}
