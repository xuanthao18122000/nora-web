import { ApiError } from "@/lib/api/client";

const DEFAULT_MESSAGE = "Đã xảy ra lỗi. Vui lòng thử lại sau.";

/** Extract a human-readable message from any error */
export function extractErrorMessage(
	err: unknown,
	fallback: string = DEFAULT_MESSAGE,
): string {
	if (err instanceof ApiError) {
		const data = err.data as Record<string, unknown> | null | undefined;
		if (data && typeof data === "object") {
			const msg =
				(data.message as string) ??
				(Array.isArray(data.errors)
					? (data.errors as string[]).join(", ")
					: undefined);
			if (msg) return msg;
		}
		return err.statusText || fallback;
	}
	if (err instanceof Error) return err.message;
	return fallback;
}

/** Extract `retryAfter` (seconds) from API error response `meta.retryAfter`. */
export function extractRetryAfter(err: unknown): number | null {
	if (err instanceof ApiError) {
		const data = err.data as Record<string, unknown> | null | undefined;
		if (data && typeof data.meta === "object" && data.meta != null) {
			const meta = data.meta as Record<string, unknown>;
			if (typeof meta.retryAfter === "number" && meta.retryAfter > 0) {
				return meta.retryAfter;
			}
		}
	}
	return null;
}
