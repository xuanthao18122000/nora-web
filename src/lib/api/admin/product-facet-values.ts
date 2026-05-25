"use client";

import { adminFetch } from "./client";
import type { AdminFacet, AdminFacetValue } from "./facets";

// ============= Types =============

/** FacetValue kèm `facet` populated (khi list từ /cms/products/:id/facet-values). */
export interface AdminFacetValueWithFacet extends AdminFacetValue {
	facet?: AdminFacet;
}

export interface AdminProductFacetValue {
	id: number;
	productId: number;
	facetValueId: number;
	deleted: number;
	userCreated?: number | null;
	userUpdated?: number | null;
	createdAt: string;
	updatedAt: string;
	/** Populated khi GET list */
	facetValue?: AdminFacetValueWithFacet;
}

export interface BulkSetProductFacetValuesPayload {
	/** Mảng rỗng = xoá hết. Trùng lặp sẽ được dedup ở BE. */
	facetValueIds: number[];
}

export interface BulkSetProductFacetValuesResponse {
	success: number;
	created: number;
	restored: number;
	deleted: number;
	total: number;
	results: {
		created: AdminProductFacetValue[];
		restored: AdminProductFacetValue[];
		deleted: AdminProductFacetValue[];
	};
}

// ============= API =============

/** Liệt kê facet values đã gắn cho product (kèm facetValue.facet). */
export async function listProductFacetValues(
	productId: number,
): Promise<AdminProductFacetValue[]> {
	return adminFetch(`/cms/products/${productId}/facet-values`);
}

/** Bulk replace toàn bộ facet values cho product. */
export async function bulkSetProductFacetValues(
	productId: number,
	facetValueIds: number[],
): Promise<BulkSetProductFacetValuesResponse> {
	const payload: BulkSetProductFacetValuesPayload = { facetValueIds };
	return adminFetch(`/cms/products/${productId}/facet-values`, {
		method: "PUT",
		body: payload,
	});
}

/** Soft-delete 1 mapping. */
export async function removeProductFacetValue(
	productId: number,
	facetValueId: number,
): Promise<void> {
	return adminFetch(
		`/cms/products/${productId}/facet-values/${facetValueId}`,
		{ method: "DELETE" },
	);
}
