export interface FacetValue {
	id: number;
	key: string;
	label: string;
	icon: string | null;
	meta: unknown | null;
	status: number;
	deleted: number;
	facetId: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	userCreated: number | null;
	userUpdated: number | null;
	facet: number;
}

export interface Facet {
	id: number;
	key: string;
	label: string;
	displayOrder: number;
	status: number;
	facetValues: FacetValue[];
	facetValuesCount: number;
}

/**
 * /fe/facets response envelope is already unwrapped by `api.get<T>()`.
 * The backend returns: { data: Facet[] } in `data`.
 */
export interface FacetsResponse {
	data: Facet[];
}
