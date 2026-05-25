"use client";

import Carousel from "@/components/common/Carousel";
import { SortBy } from "@/components/feature/filter/components/SortBy.client";
import { useSortContext } from "@/components/feature/filter/context/sort-provider.client";

export function SearchSortCarousel() {
	const { state } = useSortContext();

	return (
		<div className="min-w-0 overflow-hidden">
			<Carousel gap={8} showNav={false}>
				{state.options.map((option) => (
					<SortBy.Button key={option.value} option={option} />
				))}
			</Carousel>
		</div>
	);
}
