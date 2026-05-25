"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

// ============= Enums =============
export enum FacetTypeEnum {
	SINGLE_SELECT = 1,
	MULTI_SELECT = 2,
	RANGE = 3,
	BOOLEAN = 4,
}

export const FACET_TYPE_LABEL: Record<FacetTypeEnum, string> = {
	[FacetTypeEnum.SINGLE_SELECT]: "Chọn một (Radio)",
	[FacetTypeEnum.MULTI_SELECT]: "Chọn nhiều (Checkbox)",
	[FacetTypeEnum.RANGE]: "Khoảng (Slider)",
	[FacetTypeEnum.BOOLEAN]: "Bật/Tắt (Toggle)",
};

// ============= Types =============
export interface AdminFacetValue {
	id: number;
	facetId: number;
	key: string;
	label: string;
	icon?: string | null;
	meta?: Record<string, unknown> | null;
	status: StatusCommonEnum;
	deleted: number;
	userCreated?: number | null;
	userUpdated?: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface AdminFacet {
	id: number;
	key: string;
	label: string;
	displayOrder: number;
	status: StatusCommonEnum;
	type: FacetTypeEnum;
	deleted: number;
	userCreated?: number | null;
	userUpdated?: number | null;
	createdAt: string;
	updatedAt: string;
	/** Có khi list (BE auto-populate). KHÔNG có khi GET /:id */
	facetValues?: AdminFacetValue[];
	facetValuesCount?: number;
}

export interface ListFacetsParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	createdAtFrom?: string;
	createdAtTo?: string;
	updatedAtFrom?: string;
	updatedAtTo?: string;
	search?: string;
	status?: StatusCommonEnum;
	/** Loại bỏ facets đã gắn vào category này — dùng cho dialog "Thêm facet vào category". */
	excludeCategoryId?: number;
	/** Chỉ lấy facets đã gắn vào ít nhất 1 trong các category — dùng trong product form. */
	categoryIds?: number[];
}

export interface CreateFacetPayload {
	key: string;
	label: string;
	displayOrder?: number;
	status?: StatusCommonEnum;
	type?: FacetTypeEnum;
}

export interface UpdateFacetPayload {
	label?: string;
	displayOrder?: number;
	status?: StatusCommonEnum;
	type?: FacetTypeEnum;
}

export interface ListFacetValuesParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	createdAtFrom?: string;
	createdAtTo?: string;
	updatedAtFrom?: string;
	updatedAtTo?: string;
	search?: string;
	status?: StatusCommonEnum;
}

export interface CreateFacetValuePayload {
	facetId: number;
	key: string;
	label: string;
	icon?: string;
	meta?: Record<string, unknown>;
	status?: StatusCommonEnum;
}

export interface UpdateFacetValuePayload {
	key?: string;
	label?: string;
	icon?: string;
	meta?: Record<string, unknown>;
	status?: StatusCommonEnum;
}

// ============= Helpers =============
function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			// BE accepts comma-separated format: ?categoryIds=1,2,3
			search.set(key, value.join(","));
			continue;
		}
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

// ============= Facets API =============
export async function listAdminFacets(
	params: ListFacetsParams = {},
): Promise<PaginatedResponse<AdminFacet>> {
	return adminFetch(`/cms/facets${buildQuery(params)}`);
}

export async function getAdminFacet(id: number): Promise<AdminFacet> {
	return adminFetch(`/cms/facets/${id}`);
}

export async function createAdminFacet(
	payload: CreateFacetPayload,
): Promise<AdminFacet> {
	return adminFetch(`/cms/facets`, { method: "POST", body: payload });
}

export async function updateAdminFacet(
	id: number,
	payload: UpdateFacetPayload,
): Promise<AdminFacet> {
	return adminFetch(`/cms/facets/${id}`, { method: "PATCH", body: payload });
}

export async function deleteAdminFacet(id: number): Promise<void> {
	return adminFetch(`/cms/facets/${id}`, { method: "DELETE" });
}

// ============= Facet Values API =============
export async function listAdminFacetValues(
	facetId: number,
	params: ListFacetValuesParams = {},
): Promise<PaginatedResponse<AdminFacetValue>> {
	return adminFetch(
		`/cms/facets/${facetId}/values${buildQuery(params)}`,
	);
}

export async function getAdminFacetValue(
	facetId: number,
	valueId: number,
): Promise<AdminFacetValue> {
	return adminFetch(`/cms/facets/${facetId}/values/${valueId}`);
}

export async function createAdminFacetValue(
	facetId: number,
	payload: CreateFacetValuePayload,
): Promise<AdminFacetValue> {
	return adminFetch(`/cms/facets/${facetId}/values`, {
		method: "POST",
		body: payload,
	});
}

export async function updateAdminFacetValue(
	facetId: number,
	valueId: number,
	payload: UpdateFacetValuePayload,
): Promise<AdminFacetValue> {
	return adminFetch(`/cms/facets/${facetId}/values/${valueId}`, {
		method: "PATCH",
		body: payload,
	});
}

export async function deleteAdminFacetValue(
	facetId: number,
	valueId: number,
): Promise<void> {
	return adminFetch(`/cms/facets/${facetId}/values/${valueId}`, {
		method: "DELETE",
	});
}
