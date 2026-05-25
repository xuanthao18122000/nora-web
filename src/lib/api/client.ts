import type { SearchParams } from "../../types";
import { envConfig } from "../configs";

// =========================
// Types
// =========================
export interface ApiOptions extends Omit<RequestInit, "body"> {
	params?: SearchParams;
	body?: unknown; // Mở rộng kiểu body để nhận cả Object thuần
	/**
	 * Nếu true: gửi cookie (httpOnly) theo request — chỉ dùng cho
	 * các endpoint cần cookie xác thực (cancel order, paymeny retry).
	 * Mặc định false để giảm attack surface.
	 */
	withCredentials?: boolean;
	/** Internal flag to prevent infinite retry loops on 401. */
	_isRetry?: boolean;
}

export class ApiError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		public data?: unknown,
	) {
		super(`API Error ${status}: ${statusText}`);
		this.name = "ApiError";
	}
}

// =========================
// Helpers
// =========================
function buildUrl(
	base: string,
	endpoint: string,
	params?: SearchParams,
): string {
	// Safe string concatenation instead of complex regex
	const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = `${cleanBase}${cleanEndpoint}`;

	if (!params || Object.keys(params).length === 0) return url;
	return `${url}?${new URLSearchParams(params as Record<string, string>).toString()}`;
}

async function parseErrorData(response: Response): Promise<unknown> {
	try {
		return await response.json();
	} catch {
		try {
			return await response.text();
		} catch {
			return undefined;
		}
	}
}

// =========================
// Silent Refresh (client-side only)
// =========================

/**
 * Singleton promise to deduplicate concurrent refresh attempts.
 * Multiple 401s hitting at the same time will share a single refresh call.
 */
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
	// Shop acquyhn không có đăng nhập khách hàng → không có refresh flow.
	return false;
}

// =========================
// Core Fetcher
// =========================
interface ApiEnvelope<T> {
	success: boolean;
	statusCode: string;
	data: T;
	message: string;
}

async function universalFetch<TData>(
	endpoint: string,
	options: ApiOptions = {},
): Promise<TData> {
	const isServer = typeof window === "undefined";
	const headers = new Headers(options.headers);
	let url: string;

	// 1. Resolve URL và Token dựa trên môi trường
	if (isServer) {
		// Server gọi thẳng BACKEND_URL (BE mount routes ở root, không có prefix).
		url = buildUrl(envConfig.BACKEND_URL, endpoint, options.params);

		// Forward access_token for authenticated SSR requests
		try {
			const [{ cookies }, { COOKIE_ACCESS_TOKEN }] = await Promise.all([
				import("next/headers"),
				import("@/lib/constants/cookies"),
			]);
			const cookieStore = await cookies();
			const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
			if (accessToken) {
				headers.set("Authorization", `Bearer ${accessToken}`);
			}
		} catch {
			// cookies() not available outside request context (build time, etc.)
		}
	} else {
		// Ở Client, gọi qua Next.js Proxy
		url = buildUrl(envConfig.NEXT_PUBLIC_API_URL, endpoint, options.params);
	}

	// 2. Xử lý Body thông minh (Tự động nhận diện FormData vs JSON)
	let fetchBody: BodyInit | undefined;

	if (options.body !== undefined && options.body !== null) {
		if (
			options.body instanceof FormData ||
			options.body instanceof URLSearchParams ||
			options.body instanceof Blob ||
			options.body instanceof ArrayBuffer ||
			typeof options.body === "string"
		) {
			// Native browser types (FormData, Blob, etc.) — pass through as-is
			fetchBody = options.body as BodyInit;
		} else {
			// Plain object/array — serialize to JSON
			fetchBody = JSON.stringify(options.body);
			if (!headers.has("Content-Type")) {
				headers.set("Content-Type", "application/json");
			}
		}
	}

	const response = await fetch(url, {
		...options,
		headers,
		body: fetchBody,
	});

	// 4. Bắt lỗi — with silent refresh on 401
	if (!response.ok) {
		// Try silent refresh on 401 (client-side only, max 1 retry)
		if (
			response.status === 401 &&
			!options._isRetry &&
			typeof window !== "undefined"
		) {
			// Deduplicate: all concurrent 401s share one refresh call
			if (!refreshPromise) {
				refreshPromise = tryRefreshToken().finally(() => {
					refreshPromise = null;
				});
			}

			const refreshed = await refreshPromise;
			if (refreshed) {
				// Cookie updated by server action — retry original request.
				// The proxy will read the new access_token cookie automatically.
				return universalFetch<TData>(endpoint, {
					...options,
					_isRetry: true,
				});
			}

			// Refresh failed — clear auth state
			try {
				const { clearAuthCookie } = await import(
					"@/lib/actions/auth-cookies"
				);
				await clearAuthCookie();
			} catch {
				// Best effort cleanup
			}
		}

		const data = await parseErrorData(response);
		throw new ApiError(response.status, response.statusText, data);
	}

	if (response.status === 204) return {} as TData;

	const raw = (await response.json()) as unknown;

	// Standard API envelope (DDV legacy): `{ success: boolean, statusCode, data, message }`.
	// CHỈ unwrap khi response có field `success` — nếu không, raw JSON trả thẳng.
	// Lý do: BE acquyhn không dùng envelope, paginatedResponse trả `{ data, total, page, limit }`
	// — `data` ở đây là payload, không phải envelope wrapper.
	if (
		raw &&
		typeof raw === "object" &&
		"success" in (raw as Record<string, unknown>) &&
		"data" in (raw as Record<string, unknown>)
	) {
		const envelope = raw as Partial<ApiEnvelope<TData>> & {
			data: TData;
		};

		if (envelope.success === false) {
			throw new ApiError(
				response.status,
				envelope.message ?? response.statusText,
				envelope,
			);
		}

		return envelope.data;
	}

	return raw as TData;
}

// =========================
// Bảng điều khiển (API Methods)
// =========================
// Giờ đây các hàm này cực kỳ gọn gàng vì universalFetch đã làm hết việc nặng
export const api = {
	get: <TData>(endpoint: string, options?: ApiOptions) =>
		universalFetch<TData>(endpoint, { ...options, method: "GET" }),

	post: <TData>(endpoint: string, body?: unknown, options?: ApiOptions) =>
		universalFetch<TData>(endpoint, { ...options, method: "POST", body }),

	put: <TData>(endpoint: string, body?: unknown, options?: ApiOptions) =>
		universalFetch<TData>(endpoint, { ...options, method: "PUT", body }),

	patch: <TData>(endpoint: string, body?: unknown, options?: ApiOptions) =>
		universalFetch<TData>(endpoint, { ...options, method: "PATCH", body }),

	delete: <TData>(endpoint: string, options?: ApiOptions) =>
		universalFetch<TData>(endpoint, { ...options, method: "DELETE" }),
};
