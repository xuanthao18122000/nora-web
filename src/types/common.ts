// ── Common Types ──

import type Link from "next/link";
import type { ComponentProps } from "react";

export interface PaginatedResponse<T = unknown> {
	data: T;
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CommonResponse<T = unknown> {
	data: T;
}

export interface ApiErrorResponse {
	statusCode: number;
	message: string | string[];
	error?: string;
}

export type SearchParams = Record<string, string | string[] | undefined>;

export type HrefType = ComponentProps<typeof Link>["href"];
