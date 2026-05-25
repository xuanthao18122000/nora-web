"use client";

import useSWR from "swr";
import {
	type ListFacetValuesParams,
	type ListFacetsParams,
	getAdminFacet,
	listAdminFacetValues,
	listAdminFacets,
} from "@/lib/api/admin";

export function useAdminFacets(params: ListFacetsParams) {
	return useSWR(
		["admin/facets", params],
		() => listAdminFacets(params),
		{ keepPreviousData: true },
	);
}

export function useAdminFacet(id: number | null | undefined) {
	return useSWR(
		id != null && Number.isFinite(id) ? ["admin/facet", id] : null,
		() => getAdminFacet(id as number),
	);
}

export function useAdminFacetValues(
	facetId: number | null | undefined,
	params: ListFacetValuesParams,
) {
	return useSWR(
		facetId != null && Number.isFinite(facetId)
			? ["admin/facet-values", facetId, params]
			: null,
		() => listAdminFacetValues(facetId as number, params),
		{ keepPreviousData: true },
	);
}
