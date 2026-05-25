import { envConfig } from "../configs";

/**
 * Resolves an image path → URL hợp lệ cho `<img>` / `next/image`.
 *
 * Quy ước phân loại theo input:
 *   1. Absolute (http://, https://, //, data:, blob:) → giữ nguyên.
 *   2. Bắt đầu `/uploads/` (BE local files) → prefix `NEXT_PUBLIC_API_URL`
 *      (proxy qua `/api/uploads/*` trong dev, Nginx ở prod).
 *   3. Bắt đầu `/` khác → **local asset trong `/public`** (vd `/khach-hang/x.jpg`,
 *      `/no-image.png`). Giữ nguyên — browser resolve theo origin.
 *   4. Không có `/` đầu (vd `files/posts/x.jpg`) → **path từ data CDN** —
 *      prefix `NEXT_PUBLIC_CDN_URL`.
 *
 * Nếu input rỗng/null → trả `fallback` (mặc định `/no-image-available.png`).
 */
export const FALLBACK_IMAGE = "/no-image-available.png";

export const getImageUrl = (
	path: string | null | undefined,
	fallback: string = FALLBACK_IMAGE,
): string => {
	const raw = (path ?? "").trim();
	if (!raw) return fallback;

	// 1. Absolute / data / blob — không xử lý nội dung, chỉ upgrade
	//    `http://` → `https://` để tránh mixed content khi storefront chạy HTTPS.
	if (
		/^(https?:)?\/\//i.test(raw) ||
		/^data:/i.test(raw) ||
		/^blob:/i.test(raw)
	) {
		return raw.replace(/^http:\/\//i, "https://");
	}

	// 2. /uploads/* — file BE local, đi qua API proxy.
	if (raw.startsWith("/uploads/") || raw.startsWith("uploads/")) {
		const apiBase = String(envConfig.NEXT_PUBLIC_API_URL ?? "").replace(
			/\/$/,
			"",
		);
		const cleanPath = raw.startsWith("/") ? raw : `/${raw}`;
		return `${apiBase}${cleanPath}`;
	}

	// 3. Path bắt đầu `/` — local asset trong /public, giữ nguyên.
	if (raw.startsWith("/")) {
		return raw;
	}

	// 4. Path không có `/` đầu — data CDN.
	const base = String(envConfig.NEXT_PUBLIC_CDN_URL ?? "").trim();
	if (!base) return `/${raw}`;
	const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
	return `${cleanBase}/${raw}`;
};
