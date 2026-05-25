import type { ProductCardProduct } from "@/components/common/product-list";
import { toHref } from "@/lib/utils/href";
import type { SearchProductItem } from "@/types/search";
import { getCardPricing } from "./get-card-pricing";

function parseRating(v: number | null | undefined): number | undefined {
	if (v == null) return undefined;
	if (!Number.isFinite(v) || v <= 0) return undefined;
	return Math.round(v * 10) / 10;
}

export function mapSearchProductToCard(
	item: SearchProductItem,
): ProductCardProduct {
	const { price, originalPrice, discount } = getCardPricing(item);
	const dp = item.discountProgram;
	const promotionQuotaRemaining =
		dp != null && dp.maxQuota > 0
			? Math.max(0, dp.maxQuota - dp.totalUsed)
			: undefined;

	return {
		id: item.id,
		name: item.name,
		href: toHref(item.urlPath),
		price,
		originalPrice,
		discount,
		image: item.thumbnailUrl ?? undefined,
		imageAlt: item.name,
		rating: parseRating(item.avgRating ?? null),
		promotionName: dp?.name ?? undefined,
		promotionEndAt: dp?.endAt ?? undefined,
		promotionQuotaRemaining,
		listedPrice: originalPrice,
		isInstallmentZero: item.isInstallmentZero ?? false,
		createdAt: item.createdAt ?? undefined,
	};
}
