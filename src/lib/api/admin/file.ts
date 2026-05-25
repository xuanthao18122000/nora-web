"use client";

import { envConfig } from "@/lib/configs/env";
import {
	ADMIN_TOKEN_STORAGE_KEY,
	AdminApiError,
} from "./client";

export interface AdminFileUploadResponse {
	id: number;
	originalName: string;
	fileName: string;
	/** Public path tương đối, vd `/uploads/abc-xyz.png` */
	path: string;
	mimeType: string;
	size: number;
	fileType: string;
	isUsed: boolean;
	createdAt?: string;
	updatedAt?: string;
}

/** Upload 1 file lên `/cms/files/upload` (multipart). */
export async function uploadAdminFile(
	file: File,
): Promise<AdminFileUploadResponse> {
	const fd = new FormData();
	fd.append("file", file);

	const token =
		typeof window !== "undefined"
			? localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
			: null;

	const base = envConfig.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
	const url = `${base}/cms/files/upload`;

	const headers: Record<string, string> = {};
	if (token) headers.Authorization = `Bearer ${token}`;
	// KHÔNG set Content-Type — fetch tự gen multipart boundary

	const res = await fetch(url, { method: "POST", headers, body: fd });

	if (res.status === 204) {
		throw new AdminApiError(204, "Empty response", null);
	}

	const contentType = res.headers.get("content-type") || "";
	const isJson = contentType.includes("application/json");
	const data = isJson ? await res.json() : await res.text();

	if (!res.ok) {
		const payload = isJson ? (data as { message?: string | string[] }) : null;
		const rawMsg = payload?.message;
		const msg = Array.isArray(rawMsg)
			? rawMsg.join(", ")
			: rawMsg || `Upload failed (${res.status})`;
		throw new AdminApiError(res.status, msg, payload);
	}

	return data as AdminFileUploadResponse;
}
