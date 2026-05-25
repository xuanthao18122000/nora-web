"use client";

import { envConfig } from "@/lib/configs/env";

export const ADMIN_TOKEN_STORAGE_KEY = "acquyhn_admin_access_token";

export interface AdminFetchOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
	/** Tự gắn Bearer token. Default true. */
	withAuth?: boolean;
}

interface ApiErrorPayload {
	statusCode?: number;
	message?: string | string[];
	error?: string;
}

export class AdminApiError extends Error {
	status: number;
	payload: ApiErrorPayload | null;

	constructor(status: number, message: string, payload: ApiErrorPayload | null) {
		super(message);
		this.status = status;
		this.payload = payload;
	}
}

function getAdminToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

/**
 * Fetch wrapper cho admin API.
 * URL = `<NEXT_PUBLIC_API_URL><path>`.
 *  - Dev: NEXT_PUBLIC_API_URL = "/api" → /api/cms/... (proxy.ts FE forward sang BE)
 *  - Prod: cấu hình Nginx rewrite /api → BE.
 *  - BE expose route ở root (không có prefix).
 */
export async function adminFetch<T>(
	path: string,
	options: AdminFetchOptions = {},
): Promise<T> {
	const { body, headers, withAuth = true, ...rest } = options;

	const finalHeaders = new Headers(headers);
	if (!finalHeaders.has("Content-Type") && body !== undefined) {
		finalHeaders.set("Content-Type", "application/json");
	}

	if (withAuth) {
		const token = getAdminToken();
		if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
	}

	const base = envConfig.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
	const url = `${base}${path}`;

	const response = await fetch(url, {
		...rest,
		headers: finalHeaders,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (response.status === 204) {
		return undefined as T;
	}

	const contentType = response.headers.get("content-type") || "";
	const isJson = contentType.includes("application/json");
	const data = isJson ? await response.json() : await response.text();

	if (!response.ok) {
		const payload = isJson ? (data as ApiErrorPayload) : null;
		const rawMessage = payload?.message;
		const message = Array.isArray(rawMessage)
			? rawMessage.join(", ")
			: rawMessage || `Request failed with status ${response.status}`;
		throw new AdminApiError(response.status, message, payload);
	}

	return data as T;
}
