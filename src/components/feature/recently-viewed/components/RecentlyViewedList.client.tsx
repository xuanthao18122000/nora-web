"use client";

import useSWR from "swr";
import Carousel from "@/components/common/Carousel";
import type { ProductCardType } from "@/components/common/ProductCard";
import { ProductCard } from "@/components/common/ProductCard";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { Skeleton } from "@/components/common/Skeleton";
import { api } from "@/lib/api";
import { API } from "@/lib/api/endpoints";
import { toHref } from "@/lib/utils/href";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import type { RecentlyViewedProductInfo } from "@/types/product";
import { ClearHistoryButton } from "./ClearHistoryButton.client";

// ── Data mapping ────────────────────────────────────────────────────────

interface RecentlyViewedCard {
	productId: string;
	product: ProductCardType;
}

function toCard(p: RecentlyViewedProductInfo): RecentlyViewedCard {
	return {
		productId: String(p.id),
		product: {
			id: p.id,
			name: p.name,
			price: Number(p.minPrice),
			image: p.thumbnailUrl ?? undefined,
			href: toHref(p.urlPath),
			listedPrice: p.listedPrice ? Number(p.listedPrice) : undefined,
			isInstallmentZero: p.isInstallmentZero,
			createdAt: p.createdAt,
		},
	};
}

// ── Skeleton ────────────────────────────────────────────────────────────

// Mirror ProductCard.HorizontalPreset exactly to avoid CLS when the real data
// swaps in: same wrapper width (266px), padding (p-2), image box (70×70), and
// content column dimensions (name min-h-10 line-clamp-2 + price rows).
function RecentlyViewedCardSkeleton() {
	return (
		<div className="w-[266px] shrink-0" aria-hidden="true">
			<div className="bg-white border border-gray-200 rounded-lg p-2 size-full flex flex-row gap-1 items-center">
				<Skeleton className="size-[70px] shrink-0 rounded" />
				<div className="flex flex-1 flex-col gap-0.5 min-w-0 pr-6 w-full">
					<div className="min-h-10 flex flex-col gap-1 justify-center">
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-4 w-3/5" />
					</div>
					<div className="flex flex-col w-full">
						<Skeleton className="h-5 w-2/5" />
						<div className="min-h-5 flex items-center gap-2">
							<Skeleton className="h-3 w-1/3" />
							<Skeleton className="h-3 w-8" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function RecentlyViewedSkeleton({ onClear }: { onClear: () => void }) {
	return (
		<div
			role="status"
			aria-busy="true"
			aria-label="Đang tải sản phẩm đã xem"
		>
			<SectionWrapper
				title="Sản phẩm đã xem"
				headerTrailing={<ClearHistoryButton onClear={onClear} />}
			>
				<div className="flex gap-2 overflow-hidden">
					{Array.from({ length: 4 }, (_, i) => (
						<RecentlyViewedCardSkeleton key={i} />
					))}
				</div>
			</SectionWrapper>
		</div>
	);
}

// ── Client component ────────────────────────────────────────────────────

/**
 * Recently Viewed carousel — fully client-side.
 *
 *  • IDs live in Zustand (`useRecentlyViewedStore`, persisted to localStorage).
 *  • Product data is fetched via SWR (`POST /fe/products/by-ids`) so that
 *    navigating back to this page always shows the freshest list.
 *  • Server already reserves layout space based on the `ddv-rv-has` flag
 *    cookie, so the skeleton shown during the initial fetch does not cause
 *    cumulative layout shift.
 */
export function RecentlyViewedList() {
	const ids = useRecentlyViewedStore((s) => s.ids);
	const hasHydrated = useRecentlyViewedStore((s) => s._hasHydrated);
	const remove = useRecentlyViewedStore((s) => s.remove);
	const clear = useRecentlyViewedStore((s) => s.clear);

	// Wait for persist rehydration before firing SWR — otherwise we'd miss
	// the IDs stored in localStorage and render an empty list on first paint.
	const swrKey =
		hasHydrated && ids.length > 0
			? ([API.PRODUCTS.BY_IDS, ...ids] as const)
			: null;

	const { data } = useSWR(
		swrKey,
		() =>
			api.post<RecentlyViewedProductInfo[]>(API.PRODUCTS.BY_IDS, { ids }),
		{
			revalidateOnFocus: false,
			revalidateIfStale: false,
			keepPreviousData: true,
		},
	);

	// Show skeleton only before the first successful fetch. After that,
	// `keepPreviousData` keeps `data` defined across key changes (e.g. when
	// the user removes an item), so the list updates in place without any
	// loading flash.
	if (!hasHydrated || data === undefined)
		return <RecentlyViewedSkeleton onClear={clear} />;
	if (data.length === 0) return null;

	// Sort by store order (MRU first). Drop products the store no longer knows.
	const order = new Map(ids.map((id, i) => [id, i]));
	const cards = data
		.filter((p) => order.has(String(p.id)))
		.sort(
			(a, b) =>
				(order.get(String(a.id)) ?? Number.POSITIVE_INFINITY) -
				(order.get(String(b.id)) ?? Number.POSITIVE_INFINITY),
		)
		.map(toCard);

	if (cards.length === 0) return null;

	return (
		<SectionWrapper
			title="Sản phẩm đã xem"
			headerTrailing={<ClearHistoryButton onClear={clear} />}
		>
			<Carousel gap={8} navSize="md">
				{cards.map(({ product, productId }) => (
					<ProductCard.HorizontalPreset
						key={productId}
						product={product}
						onRemove={() => remove(productId)}
					/>
				))}
			</Carousel>
		</SectionWrapper>
	);
}
