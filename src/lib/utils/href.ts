import type { HrefType } from "@/types/common";

/**
 * Build storefront href dạng flat slug (KHÔNG `.html`).
 * Handles query strings, leading slashes, null/undefined.
 * Tự strip `.html` còn sót lại từ data legacy (CMS cũ, import từ DDV).
 *
 * @example
 *   toHref("dien-thoai/iphone-16")              → "/dien-thoai/iphone-16"
 *   toHref("dien-thoai/iphone-16?color=red")    → "/dien-thoai/iphone-16?color=red"
 *   toHref("/dien-thoai/iphone-16.html")        → "/dien-thoai/iphone-16"
 *   toHref("dien-thoai/iphone-16", "ABC123")    → "/dien-thoai/iphone-16?sku=ABC123"
 *   toHref(undefined)                            → "#"
 */
export function toHref(
	path: string | undefined | null,
	sku?: string | null,
): HrefType {
	if (!path) return "#" as HrefType;

	const [pathname, ...rest] = path.split("?");
	const query = rest.length > 0 ? `?${rest.join("?")}` : "";

	const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
	// Strip `.html` suffix nếu có — convention mới: flat slug.
	const stripped = normalized.endsWith(".html")
		? normalized.slice(0, -5)
		: normalized;

	const skuParam = sku ? `${query ? "&" : "?"}sku=${sku}` : "";

	return `${stripped}${query}${skuParam}` as HrefType;
}
