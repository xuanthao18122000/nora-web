/**
 * Thông tin site / liên hệ / cửa hàng — single source of truth.
 * Override bằng env nếu deploy nhiều môi trường.
 */

// ─── Logo ─────────────────────────────────────────────────────────────
export const SITE_LOGO_PATH = "/logo.jpg";

// ─── Cửa hàng (1 địa chỉ duy nhất) ────────────────────────────────────
export const STORE_INFO = {
	name: "NORA - Kỹ thuật & Dịch vụ",
	address:
		process.env.NEXT_PUBLIC_STORE_ADDRESS ||
		"111/69 Bình Thành, phường Bình Tân, TP. Hồ Chí Minh, Việt Nam",
	googleMapsUrl:
		process.env.NEXT_PUBLIC_STORE_MAPS_URL ||
		"https://www.google.com/maps/search/?api=1&query=111%2F69+B%C3%ACnh+Th%C3%A0nh+ph%C6%B0%E1%BB%9Dng+B%C3%ACnh+T%C3%A2n+TP+H%E1%BB%93+Ch%C3%AD+Minh",
	latitude: envCoord("NEXT_PUBLIC_STORE_LAT", 10.7411),
	longitude: envCoord("NEXT_PUBLIC_STORE_LNG", 106.6086),
	openingHours: "Mo-Sa 08:00-17:30",
} as const;

function envCoord(name: string, fallback: number): number {
	const v = process.env[name];
	if (v == null || String(v).trim() === "") return fallback;
	const n = Number(v);
	return Number.isFinite(n) ? n : fallback;
}

// ─── Liên hệ ──────────────────────────────────────────────────────────
export const CONTACT = {
	/** E.164 — dùng cho schema.org */
	phoneE164: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+84909637966",
	/** Display có khoảng */
	hotlineDisplay:
		process.env.NEXT_PUBLIC_CONTACT_HOTLINE_DISPLAY || "0909 637 966",
	/** tel: link, không khoảng */
	hotlineTel: process.env.NEXT_PUBLIC_CONTACT_HOTLINE_TEL || "0909637966",
	/** Hotline phụ */
	hotline2Display:
		process.env.NEXT_PUBLIC_CONTACT_HOTLINE2_DISPLAY || "0931 984 069",
	hotline2Tel: process.env.NEXT_PUBLIC_CONTACT_HOTLINE2_TEL || "0931984069",
	hotline3Display:
		process.env.NEXT_PUBLIC_CONTACT_HOTLINE3_DISPLAY || "0912 023 469",
	hotline3Tel: process.env.NEXT_PUBLIC_CONTACT_HOTLINE3_TEL || "0912023469",
	email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@noravn.com",
	/** Chat Zalo */
	zaloUrl: process.env.NEXT_PUBLIC_ZALO_URL || "https://zalo.me/0909637966",
} as const;

// ─── Mạng xã hội ──────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
	facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
	youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "",
	instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
} as const;
