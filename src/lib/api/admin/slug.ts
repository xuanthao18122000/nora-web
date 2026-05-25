"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse } from "./types";

export enum SlugTypeEnum {
	PRODUCT = 1,
	CATEGORY = 2,
	POST = 3,
	PAGE = 4,
	POST_LIST = 5,
}

export const SLUG_TYPE_LABEL: Record<SlugTypeEnum, string> = {
	[SlugTypeEnum.PRODUCT]: "Sản phẩm",
	[SlugTypeEnum.CATEGORY]: "Danh mục",
	[SlugTypeEnum.POST]: "Bài viết",
	[SlugTypeEnum.PAGE]: "Trang",
	[SlugTypeEnum.POST_LIST]: "Danh sách bài viết",
};

export interface AdminSlug {
	id: number;
	type: SlugTypeEnum;
	slug: string;
	entityId?: number;
	createdAt: string;
	updatedAt: string;
}

export interface ListSlugParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	slug?: string;
	type?: SlugTypeEnum;
	entityId?: number;
	createdAtFrom?: string;
	createdAtTo?: string;
}

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminSlugs(
	params: ListSlugParams = {},
): Promise<PaginatedResponse<AdminSlug>> {
	return adminFetch(`/cms/slugs${buildQuery(params)}`);
}

export interface ResolvedEntity {
	type: SlugTypeEnum;
	entityId: number;
	name: string;
	slug?: string;
}

/**
 * Batch resolve `(type, entityId)` → tên + slug.
 * Trả map key dạng `<type>:<entityId>` → ResolvedEntity.
 */
export async function resolveSlugEntities(
	items: { type: SlugTypeEnum; entityId: number }[],
): Promise<Record<string, ResolvedEntity>> {
	if (!items.length) return {};
	return adminFetch(`/cms/slugs/resolve-entities`, {
		method: "POST",
		body: { items },
	});
}
