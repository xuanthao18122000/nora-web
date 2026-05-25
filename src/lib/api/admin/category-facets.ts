"use client";

import { adminFetch } from "./client";
import type { AdminFacet } from "./facets";
import type { StatusCommonEnum } from "./types";

// ============= Types =============
export interface AdminCategoryFacet {
	categoryId: number;
	facetId: number;
	displayOrder: number;
	isVisible: boolean;
	status: StatusCommonEnum;
	deleted: number;
	userCreated?: number | null;
	userUpdated?: number | null;
	createdAt: string;
	updatedAt: string;
	/** Populated khi GET list */
	facet?: AdminFacet;
}

export interface AddCategoryFacetItem {
	facetId: number;
	displayOrder?: number;
	isVisible?: boolean;
	status?: StatusCommonEnum;
}

export interface AddCategoryFacetsPayload {
	items: AddCategoryFacetItem[];
}

export interface AddCategoryFacetsResponse {
	success: number;
	created: number;
	restored: number;
	skipped: number;
	items: AdminCategoryFacet[];
}

export interface UpdateCategoryFacetPayload {
	displayOrder?: number;
	isVisible?: boolean;
	status?: StatusCommonEnum;
}

// ============= API =============

/** Liệt kê facets đã gắn vào category. BE trả mảng trực tiếp (không paginate). */
export async function listCategoryFacets(
	categoryId: number,
): Promise<AdminCategoryFacet[]> {
	return adminFetch(`/cms/categories/${categoryId}/facets`);
}

/** Bulk add nhiều facet vào category. */
export async function addCategoryFacets(
	categoryId: number,
	payload: AddCategoryFacetsPayload,
): Promise<AddCategoryFacetsResponse> {
	return adminFetch(`/cms/categories/${categoryId}/facets`, {
		method: "POST",
		body: payload,
	});
}

/** Cập nhật mapping (displayOrder / isVisible / status). */
export async function updateCategoryFacet(
	categoryId: number,
	facetId: number,
	payload: UpdateCategoryFacetPayload,
): Promise<AdminCategoryFacet> {
	return adminFetch(`/cms/categories/${categoryId}/facets/${facetId}`, {
		method: "PATCH",
		body: payload,
	});
}

/** Soft-delete mapping. */
export async function removeCategoryFacet(
	categoryId: number,
	facetId: number,
): Promise<void> {
	return adminFetch(`/cms/categories/${categoryId}/facets/${facetId}`, {
		method: "DELETE",
	});
}
