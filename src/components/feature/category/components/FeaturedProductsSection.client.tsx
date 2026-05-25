"use client";

import { Carousel } from "@/components/common";
import { ProductCard } from "@/components/common/ProductCard";
import type { CategoryPageProductItem } from "@/types/category-page";

import { mapCategoryProductToCard } from "../utils/map-category-product";

export interface FeaturedProductsSectionProps {
	products: CategoryPageProductItem[];
	limit?: number;
}

export default function FeaturedProductsSection({
	products,
	limit = 10,
}: FeaturedProductsSectionProps) {
	if (products.length === 0) return null;

	return (
		<section className="rounded-2xl border border-gray-200 bg-white p-2 md:p-4 space-y-2 md:space-y-4">
			<h2 className="text-base md:text-lg font-semibold text-gray-900">
				Sản phẩm nổi bật
			</h2>
			<div>
				<Carousel gap={8} navSize="sm" navPosition="inside">
					{products.slice(0, limit).map((p, index) => {
						const product = mapCategoryProductToCard(p);
						return (
							<div
								key={p.id}
								className="shrink-0 w-[180px] sm:w-[200px] lg:w-[227px]"
							>
								<ProductCard.Preset
									product={product}
									priority={index < 2}
								/>
							</div>
						);
					})}
				</Carousel>
			</div>
		</section>
	);
}
