"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

export interface AdminPostList {
	id: number;
	name: string;
	slug: string;
	description?: string;
	status: StatusCommonEnum;
	deleted: number;
	createdAt: string;
	updatedAt: string;
}

export interface ListPostListParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	name?: string;
	status?: StatusCommonEnum;
}

export interface CreatePostListPayload {
	name: string;
	slug?: string;
	description?: string;
	status?: StatusCommonEnum;
}

export type UpdatePostListPayload = Partial<CreatePostListPayload>;

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminPostLists(
	params: ListPostListParams = {},
): Promise<PaginatedResponse<AdminPostList>> {
	return adminFetch(`/cms/post-lists${buildQuery(params)}`);
}

export async function getAdminPostList(id: number): Promise<AdminPostList> {
	return adminFetch(`/cms/post-lists/${id}`);
}

export async function createAdminPostList(
	payload: CreatePostListPayload,
): Promise<AdminPostList> {
	return adminFetch("/cms/post-lists", { method: "POST", body: payload });
}

export async function updateAdminPostList(
	id: number,
	payload: UpdatePostListPayload,
): Promise<AdminPostList> {
	return adminFetch(`/cms/post-lists/${id}`, {
		method: "PATCH",
		body: payload,
	});
}

export async function deleteAdminPostList(id: number): Promise<void> {
	return adminFetch(`/cms/post-lists/${id}`, { method: "DELETE" });
}
