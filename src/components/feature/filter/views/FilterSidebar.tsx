import { cn, getPreservedEntries } from "@/lib/utils";
import type { SearchParams } from "@/types/common";
import type { Facet } from "@/types/facets";

import { getFacets } from "../api/get-facets";
import { FacetGroup } from "../components/FacetGroup.client";
import {
	ApplyButton,
	ClearAllButton,
	ResetButton,
} from "../components/FilterButtons.client";
import { FilterChips } from "../components/FilterChips.client";
import { FilterProvider } from "../context/filter-provider.client";

export interface FilterSidebarProps {
	searchParams: SearchParams;
	className?: string;
}

export async function FilterSidebar({
	searchParams,
	className,
}: FilterSidebarProps) {
	const facets = await getFacets();
	const facetKeys = facets.map((f: Facet) => f.key);
	const pathname = "/search" as const;
	const preservedEntries = getPreservedEntries(searchParams, facetKeys);

	return (
		<FilterProvider facets={facets} pathname={pathname}>
			<section
				className={cn(
					"w-full rounded-2xl bg-white drop-shadow-sm",
					className,
				)}
			>
				{/* Top: chips + clear all */}
				<div className="flex items-center gap-2 border-b border-gray-200 p-4">
					<div className="flex flex-1 flex-wrap gap-2">
						<FilterChips />
					</div>

					<ClearAllButton variant="link" color="blue" size="xs">
						Bỏ chọn tất cả
					</ClearAllButton>
				</div>

				{/* preserve non-facet params (q/sort/...) */}
				{preservedEntries.map(([k, v]) => (
					<input key={`${k}:${v}`} type="hidden" name={k} value={v} />
				))}

				<div className="flex flex-col gap-5 p-4">
					{facets.map((facet) => (
						<FacetGroup key={facet.key} facet={facet} />
					))}
				</div>

				<div className="flex items-center justify-center gap-2 border-t border-gray-200 p-4">
					<ResetButton variant="bordered" color="gray" size="sm">
						Đóng
					</ResetButton>
					<ApplyButton variant="filled" color="primary" size="sm">
						Xem kết quả
					</ApplyButton>
				</div>
			</section>
		</FilterProvider>
	);
}
