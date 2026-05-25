"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

export interface AdminPost {
	id: number;
	title: string;
	slug: string;
	content?: string;
	shortDescription?: string;
	featuredImage?: string;
	views: number;
	authorId?: number;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	postList?: { id: number; name: string; slug: string } | null;
	status: StatusCommonEnum;
	deleted: number;
	createdAt: string;
	updatedAt: string;
}

export interface ListPostParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	title?: string;
	slug?: string;
	authorId?: number;
	postListId?: number;
	status?: StatusCommonEnum;
	createdAtFrom?: string;
	createdAtTo?: string;
}

export interface CreatePostPayload {
	title: string;
	slug?: string;
	content?: string;
	shortDescription?: string;
	featuredImage?: string;
	authorId?: number;
	postListId?: number | null;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	status?: StatusCommonEnum;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminPosts(
	params: ListPostParams = {},
): Promise<PaginatedResponse<AdminPost>> {
	return adminFetch(`/cms/posts${buildQuery(params)}`);
}

export async function getAdminPost(id: number): Promise<AdminPost> {
	return adminFetch(`/cms/posts/${id}`);
}

export async function createAdminPost(
	payload: CreatePostPayload,
): Promise<AdminPost> {
	return adminFetch("/cms/posts", { method: "POST", body: payload });
}

export async function updateAdminPost(
	id: number,
	payload: UpdatePostPayload,
): Promise<AdminPost> {
	return adminFetch(`/cms/posts/${id}`, { method: "PATCH", body: payload });
}

export async function deleteAdminPost(id: number): Promise<void> {
	return adminFetch(`/cms/posts/${id}`, { method: "DELETE" });
}
