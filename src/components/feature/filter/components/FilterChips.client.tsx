"use client";

import FilterResultChip from "@/components/common/FilterResultChip";
import { cn } from "@/lib/utils";
import { useFilterContext } from "../context/filter-provider.client";

export interface FilterChipsProps {
	className?: string;
}

export function useHasActiveFilters(): boolean {
	const { state } = useFilterContext();
	const { urlFilters } = state;

	return Object.values(urlFilters).some((values) => values.length > 0);
}

export function FilterChips({ className }: FilterChipsProps) {
	const { state, actions } = useFilterContext();
	const { facets, urlFilters } = state;

	const chips: Array<{ key: string; label: string }> = [];

	for (const facet of facets) {
		const selected = urlFilters[facet.key] ?? [];
		if (!selected.length) continue;

		for (const valueKey of selected) {
			const value = facet.facetValues.find((v) => v.key === valueKey);
			const valueLabel = value?.label ?? valueKey;
			const label = `${facet.label}: ${valueLabel}`;
			chips.push({ key: `${facet.key}:${valueKey}`, label });
		}
	}

	if (chips.length === 0) return null;

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{chips.map((chip) => {
				const [facetKey, valueKey] = chip.key.split(":");
				return (
					<FilterResultChip
						key={chip.key}
						label={chip.label}
						clearAriaLabel={`Xóa lọc: ${chip.label}`}
						onClear={() =>
							actions.removeFilterValue(facetKey, valueKey)
						}
					/>
				);
			})}
		</div>
	);
}
