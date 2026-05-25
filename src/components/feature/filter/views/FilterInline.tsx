import { getPreservedEntries } from "@/lib/utils";
import type { SearchParams } from "@/types/common";
import type { Facet } from "@/types/facets";
import { getFacets } from "../api/get-facets";
import { FilterInlineClient } from "./FilterInline.client";

export interface FilterInlineProps {
	searchParams: SearchParams;
	pathname?: string;
	className?: string;
	/** Khi có → load facets theo whitelist `category_facets` của category này. */
	categoryId?: number;
}

export async function FilterInline({
	searchParams,
	pathname: pathnameProp,
	className,
	categoryId,
}: FilterInlineProps) {
	const facets = await getFacets(categoryId);
	const facetKeys = facets.map((f: Facet) => f.key);
	const pathname = pathnameProp ?? "/search";
	const preservedEntries = getPreservedEntries(searchParams, facetKeys);

	return (
		<FilterInlineClient
			facets={facets}
			pathname={pathname}
			preservedEntries={preservedEntries}
			className={className}
		/>
	);
}
