/** JWT access token (set after login) */
export const COOKIE_ACCESS_TOKEN = "access_token";
/** JWT refresh token (set after login, used for silent token renewal) */
export const COOKIE_REFRESH_TOKEN = "refresh_token";
/** Signed payment token (httpOnly, set by backend) */
export const COOKIE_PAYMENT_TOKEN = "ddv_pt";
/** Encrypted checkout phone number (httpOnly, set by backend) */
export const COOKIE_USER_PHONE = "ddv_up";
/**
 * Boolean flag cookie for recently-viewed products.
 * Value: "1" when the user has at least one recently-viewed product, otherwise absent.
 * Used by Server Components to decide whether to render the section wrapper
 * (reserving layout space to avoid CLS). The actual list of IDs lives in
 * the client-side Zustand store (localStorage).
 */
export const COOKIE_RECENTLY_VIEWED = "ddv-rv";

/** Cookie names that proxy.ts forwards to backend via Cookie header */
export const BACKEND_FORWARDED_COOKIES = [
	COOKIE_PAYMENT_TOKEN,
	COOKIE_USER_PHONE,
] as const;
