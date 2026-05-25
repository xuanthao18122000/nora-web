"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

export enum PageTypeEnum {
	CUSTOM = "custom",
	SYSTEM = "system",
}

export enum DeviceTypeEnum {
	MOBILE = "mobile",
	DESKTOP = "desktop",
	ALL = "all",
}

export interface AdminPageSectionItem {
	id: number;
	name?: string;
	targetUrl?: string;
	type?: string;
	position: number;
	data?: string;
	extra?: Record<string, unknown>;
	deviceType: DeviceTypeEnum;
	status: StatusCommonEnum;
	createdAt: string;
	updatedAt: string;
}

export interface AdminPageSection {
	id: number;
	name?: string;
	key?: string;
	type: string;
	extra?: Record<string, unknown>;
	url?: string;
	position: number;
	status: StatusCommonEnum;
	items?: AdminPageSectionItem[];
	createdAt: string;
	updatedAt: string;
}

export interface AdminPage {
	id: string;
	slug: string;
	code?: string;
	type: PageTypeEnum;
	title?: string;
	status: StatusCommonEnum;
	pageData?: Record<string, unknown>;
	metaTitle?: string;
	metaDescription?: string;
	seoImage?: string;
	canonicalUrl?: string;
	seoKeywords?: string;
	seoBaseSchema?: Record<string, unknown>;
	isSitemap: boolean;
	seoRobots: string;
	description?: string;
	sections?: AdminPageSection[];
	createdAt: string;
	updatedAt: string;
}

export interface ListPageParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	title?: string;
	slug?: string;
	code?: string;
	type?: PageTypeEnum;
	status?: StatusCommonEnum;
	createdAtFrom?: string;
	createdAtTo?: string;
}

export interface CreatePagePayload {
	slug: string;
	code?: string;
	type: PageTypeEnum;
	title?: string;
	status?: StatusCommonEnum;
	pageData?: Record<string, unknown>;
	metaTitle?: string;
	metaDescription?: string;
	seoImage?: string;
	canonicalUrl?: string;
	seoKeywords?: string;
	seoBaseSchema?: Record<string, unknown>;
	isSitemap?: boolean;
	seoRobots?: string;
	description?: string;
}

export type UpdatePagePayload = Partial<CreatePagePayload>;

export interface CreatePageSectionItemPayload {
	type?: string;
	name?: string;
	targetUrl?: string;
	position?: number;
	data?: string;
	extra?: Record<string, unknown>;
	deviceType?: DeviceTypeEnum;
	status?: StatusCommonEnum;
}

export interface CreatePageSectionPayload {
	pageId: string;
	type: string;
	key?: string;
	name?: string;
	extra?: Record<string, unknown>;
	url?: string;
	position?: number;
	status?: StatusCommonEnum;
	items?: CreatePageSectionItemPayload[];
}

export interface UpdatePageSectionPayload {
	type?: string;
	key?: string;
	name?: string;
	extra?: Record<string, unknown>;
	url?: string;
	position?: number;
	status?: StatusCommonEnum;
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

// ─── Pages ───────────────────────────────────────────────────────
export async function listAdminPages(
	params: ListPageParams = {},
): Promise<PaginatedResponse<AdminPage>> {
	return adminFetch(`/cms/pages${buildQuery(params)}`);
}

export async function getAdminPage(id: string): Promise<AdminPage> {
	return adminFetch(`/cms/pages/${id}`);
}

export async function createAdminPage(payload: CreatePagePayload): Promise<AdminPage> {
	return adminFetch("/cms/pages", { method: "POST", body: payload });
}

export async function updateAdminPage(
	id: string,
	payload: UpdatePagePayload,
): Promise<AdminPage> {
	return adminFetch(`/cms/pages/${id}`, { method: "PATCH", body: payload });
}

export async function deleteAdminPage(id: string): Promise<void> {
	return adminFetch(`/cms/pages/${id}`, { method: "DELETE" });
}

export async function clearPageCache(
	id: string,
): Promise<{ code: string | null; cleared: boolean }> {
	return adminFetch(`/cms/pages/${id}/clear-cache`, { method: "POST" });
}

// ─── Page Sections ───────────────────────────────────────────────
export async function getAdminPageSection(id: number): Promise<AdminPageSection> {
	return adminFetch(`/cms/page-sections/${id}`);
}

export async function createAdminPageSection(
	payload: CreatePageSectionPayload,
): Promise<AdminPageSection> {
	return adminFetch("/cms/page-sections", { method: "POST", body: payload });
}

export async function updateAdminPageSection(
	id: number,
	payload: UpdatePageSectionPayload,
): Promise<AdminPageSection> {
	return adminFetch(`/cms/page-sections/${id}`, { method: "PATCH", body: payload });
}

export async function replaceAdminPageSectionItems(
	id: number,
	items: CreatePageSectionItemPayload[],
): Promise<AdminPageSection> {
	return adminFetch(`/cms/page-sections/${id}/items`, {
		method: "PUT",
		body: { items },
	});
}

export async function deleteAdminPageSection(id: number): Promise<void> {
	return adminFetch(`/cms/page-sections/${id}`, { method: "DELETE" });
}
