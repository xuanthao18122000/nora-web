"use client";

import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";
import type { Facet } from "@/types/facets";

import { useFilterContext } from "../context/filter-provider.client";

export interface FacetGroupProps {
	facet: Facet;
	className?: string;
}

export function FacetGroup({ facet, className }: FacetGroupProps) {
	const { state, actions } = useFilterContext();
	const selected = new Set(state.draftFilters[facet.key] ?? []);
	const values = facet.facetValues ?? [];
	if (values.length === 0) return null;

	const handleToggle = (valueKey: string) => {
		const next = new Set(selected);
		if (next.has(valueKey)) {
			next.delete(valueKey);
		} else {
			next.add(valueKey);
		}
		actions.setDraftFilter(facet.key, Array.from(next));
	};

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="text-sm font-normal text-black">{facet.label}</div>

			<div className="flex flex-wrap gap-2">
				{values.map((v) => {
					const isChecked = selected.has(v.key);

					return (
						<Button
							key={v.key}
							type="button"
							variant="pill"
							color="blue"
							size="sm"
							pressed={isChecked}
							leadingIcon={
								v.icon ? (
									<span aria-hidden>{v.icon}</span>
								) : undefined
							}
							onClick={() => handleToggle(v.key)}
						>
							{v.label}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
