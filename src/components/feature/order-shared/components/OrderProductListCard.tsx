"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { SharedOrderProduct, SharedOrderSubItem } from "../types";
import { OrderProductItem } from "./OrderProductItem";

interface OrderProductListCardProps {
	items: SharedOrderProduct[];
	subItems?: SharedOrderSubItem[];
	title?: string;
	/** Number of items visible before collapsing — default 3. */
	visibleCount?: number;
}

/**
 * Shared product list card with expand/collapse when items.length > visibleCount.
 * Renders optional sub-items (warranty, gifts) below the main items.
 */
export function OrderProductListCard({
	items,
	subItems,
	title = "Danh sách sản phẩm",
	visibleCount = 3,
}: OrderProductListCardProps) {
	const [showAll, setShowAll] = useState(false);
	const hasMore = items.length > visibleCount;
	const hiddenCount = Math.max(0, items.length - visibleCount);

	return (
		<div className="rounded-2xl bg-white p-4 md:p-5 shadow-sm">
			<h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">
				{title}
			</h3>
			<div className="flex flex-col gap-4">
				{items.slice(0, visibleCount).map((item) => (
					<OrderProductItem key={item.key} item={item} />
				))}

				{hasMore && (
					<div
						className={cn(
							"grid transition-[grid-template-rows,opacity,margin,visibility] duration-500 ease-in-out",
							showAll
								? "grid-rows-[1fr] opacity-100 visible"
								: "grid-rows-[0fr] opacity-0 -mt-4 pointer-events-none invisible",
						)}
					>
						<div className="overflow-hidden flex flex-col gap-4">
							<div className="pt-4 flex flex-col gap-4">
								{items.slice(visibleCount).map((item) => (
									<OrderProductItem
										key={item.key}
										item={item}
									/>
								))}
							</div>
						</div>
					</div>
				)}

				{hasMore && (
					<button
						type="button"
						onClick={() => setShowAll(!showAll)}
						className="text-primary-500 text-sm font-medium mt-2 flex items-center justify-center border-t border-gray-100 pt-4 hover:text-blue-500 transition-colors duration-150 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
					>
						{showAll ? (
							<>
								Thu gọn
								<ChevronUp
									className="ml-1 w-4 h-4"
									aria-hidden="true"
								/>
							</>
						) : (
							<>
								Xem thêm {hiddenCount} sản phẩm
								<ChevronDown
									className="ml-1 w-4 h-4"
									aria-hidden="true"
								/>
							</>
						)}
					</button>
				)}

				{subItems && subItems.length > 0 && (
					<div className="mt-2 pt-3 border-t border-dashed border-gray-200 flex flex-col gap-2">
						{subItems.map((sub) => (
							<div
								key={sub.name}
								className="flex items-center justify-between gap-3"
							>
								<div className="min-w-0 flex-1">
									<p className="text-sm text-gray-900">
										{sub.name}
									</p>
									{sub.price > 0 ? (
										<p className="mt-0.5 text-xs text-text-price">
											{formatPrice(sub.price)}
										</p>
									) : (
										<p className="mt-0.5 text-xs text-green-700">
											Miễn phí
										</p>
									)}
								</div>
								<span className="shrink-0 text-sm text-gray-500">
									x{sub.quantity}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
