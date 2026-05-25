"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

export interface AdminCategory {
	id: number;
	parentId?: number | null;
	parent?: { id: number; name: string; slug: string } | null;
	name: string;
	slug: string;
	description?: string;
	idPath: string;
	priority: number;
	position: number;
	level: number;
	iconUrl?: string;
	thumbnailUrl?: string;
	canonicalUrl?: string;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	metaRobots: string;
	seoBaseSchema?: Record<string, unknown>;
	status: StatusCommonEnum;
	deleted: number;
	createdAt: string;
	updatedAt: string;
}

export interface CategoryTreeNode extends AdminCategory {
	children: CategoryTreeNode[];
}

export interface ListCategoryParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	searchName?: string;
	searchSlug?: string;
	status?: StatusCommonEnum;
	parentId?: number;
	tree?: boolean;
}

export interface CreateCategoryPayload {
	parentId?: number | null;
	name: string;
	slug?: string;
	description?: string;
	priority?: number;
	position?: number;
	iconUrl?: string;
	thumbnailUrl?: string;
	canonicalUrl?: string;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	metaRobots?: string;
	seoBaseSchema?: Record<string, unknown>;
	status?: StatusCommonEnum;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminCategories(
	params: ListCategoryParams = {},
): Promise<PaginatedResponse<AdminCategory>> {
	return adminFetch(`/cms/categories${buildQuery(params)}`);
}

export async function listAdminCategoryTree(): Promise<CategoryTreeNode[]> {
	return adminFetch(`/cms/categories${buildQuery({ tree: true })}`);
}

export async function getAdminCategory(id: number): Promise<AdminCategory> {
	return adminFetch(`/cms/categories/${id}`);
}

export async function createAdminCategory(
	payload: CreateCategoryPayload,
): Promise<AdminCategory> {
	return adminFetch("/cms/categories", { method: "POST", body: payload });
}

export async function updateAdminCategory(
	id: number,
	payload: UpdateCategoryPayload,
): Promise<AdminCategory> {
	return adminFetch(`/cms/categories/${id}`, {
		method: "PATCH",
		body: payload,
	});
}

export async function deleteAdminCategory(id: number): Promise<void> {
	return adminFetch(`/cms/categories/${id}`, { method: "DELETE" });
}
