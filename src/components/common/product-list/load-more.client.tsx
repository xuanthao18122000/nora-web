"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/common/Button";
import { type ProductCardProduct, ProductListItem } from "./item";

export interface ProductListLoadMoreProps {
	/** Called to fetch the next page. Should return already-mapped items. */
	fetchMore: (page: number) => Promise<ProductCardProduct[]>;
	/** The page number of the SSR-rendered (initial) items. */
	initialPage: number;
	/** Items per page from API (must match category/search page size). @default 20 */
	pageSize?: number;
	/** Total number of items available (used to compute "remaining" count). */
	totalItems: number;
	/**
	 * When this value changes the component resets its internal state.
	 * Use it to react to filter / query changes from the parent.
	 * @example `${query}|${sort}`
	 */
	resetKey?: string;
	/** Noun shown in the button label, e.g. "sản phẩm". @default "sản phẩm" */
	itemLabel?: string;
}

/** Default when API/page props omit page size */
export const DEFAULT_PAGE_SIZE = 20;

export function LoadMore({
	fetchMore,
	initialPage,
	pageSize = DEFAULT_PAGE_SIZE,
	totalItems,
	resetKey = "",
	itemLabel = "sản phẩm",
}: ProductListLoadMoreProps) {
	const [items, setItems] = useState<ProductCardProduct[]>([]);
	const [page, setPage] = useState(initialPage);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		void resetKey;
		setItems([]);
		setPage(initialPage);
		setHasMore(true);
	}, [initialPage, resetKey]);

	const initialRenderedCount = Math.max(0, initialPage) * pageSize;
	const displayedCount = initialRenderedCount + items.length;
	const remaining = useMemo(
		() => Math.max(0, totalItems - displayedCount),
		[displayedCount, totalItems],
	);

	const handleLoadMore = () => {
		if (!hasMore || isPending) return;

		startTransition(async () => {
			try {
				setError(null);
				const nextPage = page + 1;
				const newItems = await fetchMore(nextPage);

				if (newItems.length === 0) {
					setHasMore(false);
					return;
				}

				setItems((prev) => [...prev, ...newItems]);
				setPage(nextPage);
			} catch {
				setError("Không thể tải thêm. Vui lòng thử lại.");
			}
		});
	};

	return (
		<>
			{items.map((p) => (
				<ProductListItem key={p.id} product={p} />
			))}

			{hasMore && remaining > 0 && (
				<li className="col-span-full mt-2 flex justify-center">
					<Button
						type="button"
						variant="bordered"
						color="gray"
						size="xs"
						onClick={handleLoadMore}
						loading={isPending}
						disabled={isPending}
						className="w-full sm:w-[220px]"
						trailingIcon={
							<ChevronDown className="size-5" aria-hidden />
						}
					>
						{isPending
							? "Đang tải..."
							: `Còn lại ${remaining} ${itemLabel}`}
					</Button>
				</li>
			)}

			{error && (
				<li className="col-span-full mt-2 text-center text-sm text-red-600">
					{error}
				</li>
			)}
		</>
	);
}
