"use client";

import Link from "next/link";

import { ProductCard } from "@/components/common/ProductCard";
import { toHref } from "@/lib/utils/href";
import type { SearchProductItem } from "@/types/search";
import { getCardPricing } from "../../utils/get-card-pricing";

interface ResultsProductsSectionProps {
	items: SearchProductItem[];
}

export function ResultsProductsSection({ items }: ResultsProductsSectionProps) {
	if (items.length === 0) return null;

	return (
		<section className="flex w-full flex-col gap-2">
			<h3 className="text-sm font-semibold text-gray-800">
				Sản phẩm gợi ý
			</h3>
			<ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-3 md:gap-y-2">
				{items.map((item) => {
					const { price, originalPrice, discount } = getCardPricing(item);
					return (
						<li key={item.id}>
							<Link
								href={toHref(item.urlPath)}
								className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 bg-white transition-colors hover:bg-gray-50"
							>
								<ProductCard.Image
									src={item.thumbnailUrl ?? undefined}
									alt={item.name}
									className="size-16 shrink-0 aspect-auto overflow-hidden p-1"
									imageClassName="object-contain"
								/>
								<ProductCard.Content className="min-w-0 gap-1">
									<ProductCard.Name className="min-h-0 w-full truncate font-medium leading-5 text-gray-900">
										{item.name}
									</ProductCard.Name>
									<ProductCard.Price
										price={price}
										originalPrice={originalPrice}
										discount={discount}
										compact
										className="gap-0"
									/>
								</ProductCard.Content>
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
