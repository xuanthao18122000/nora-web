"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

export interface AdminProductCategoryRel {
	id: number;
	category: { id: number; name: string; slug: string };
}

export interface AdminProduct {
	id: number;
	name: string;
	slug: string;
	sku: string;
	shortDescription?: string;
	description?: string;
	price: number;
	salePrice?: number;
	costPrice: number;
	stockQuantity: number;
	unit?: string;
	thumbnailUrl?: string;
	images?: string[];
	origin?: string;
	barcode?: string;
	priority: number;
	viewCount: number;
	soldCount: number;
	averageRating: number;
	reviewCount: number;
	isBestSeller: boolean;
	showPrice: boolean;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	metaRobots: string;
	canonicalUrl?: string;
	seoBaseSchema?: Record<string, unknown>;
	status: StatusCommonEnum;
	deleted: number;
	createdAt: string;
	updatedAt: string;
	productCategories?: AdminProductCategoryRel[];
}

export interface ListProductParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	searchName?: string;
	searchSku?: string;
	status?: StatusCommonEnum;
	categoryId?: number;
	isBestSeller?: boolean;
	minPrice?: number;
	maxPrice?: number;
	createdAtFrom?: string;
	createdAtTo?: string;
}

export interface CreateProductPayload {
	name: string;
	slug?: string;
	sku: string;
	shortDescription?: string;
	description?: string;
	price: number;
	salePrice?: number;
	costPrice?: number;
	stockQuantity?: number;
	unit?: string;
	thumbnailUrl?: string;
	images?: string[];
	categoryIds?: number[];
	origin?: string;
	barcode?: string;
	priority?: number;
	isBestSeller?: boolean;
	showPrice?: boolean;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	metaRobots?: string;
	canonicalUrl?: string;
	seoBaseSchema?: Record<string, unknown>;
	status?: StatusCommonEnum;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminProducts(
	params: ListProductParams = {},
): Promise<PaginatedResponse<AdminProduct>> {
	return adminFetch(`/cms/products${buildQuery(params)}`);
}

export async function getAdminProduct(id: number): Promise<AdminProduct> {
	return adminFetch(`/cms/products/${id}`);
}

export async function createAdminProduct(
	payload: CreateProductPayload,
): Promise<AdminProduct> {
	return adminFetch("/cms/products", { method: "POST", body: payload });
}

export async function updateAdminProduct(
	id: number,
	payload: UpdateProductPayload,
): Promise<AdminProduct> {
	return adminFetch(`/cms/products/${id}`, { method: "PATCH", body: payload });
}

export async function deleteAdminProduct(id: number): Promise<void> {
	return adminFetch(`/cms/products/${id}`, { method: "DELETE" });
}
