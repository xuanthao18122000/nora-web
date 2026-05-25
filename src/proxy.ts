import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { envConfig } from "./lib/configs";
import {
	BACKEND_FORWARDED_COOKIES,
	COOKIE_ACCESS_TOKEN,
} from "./lib/constants/cookies";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// ── 1. Non-API requests + storefront-local API routes: pass through ──
	// `/api/revalidate` is a Next.js route handler on this storefront — do NOT proxy it to BE.
	const isLocalApi = pathname === "/api/revalidate";
	if (!pathname.startsWith("/api/") || isLocalApi) {
		return NextResponse.next();
	}

	// ── 2. API proxy: /api/* → backend ──
	const requestHeaders = new Headers(request.headers);

	// Ưu tiên header `Authorization` từ request (admin lưu token ở localStorage,
	// adminFetch tự gắn header). Chỉ fallback sang cookie nếu request không gửi
	// header — dùng cho storefront client (httpOnly cookie do BE set).
	const hasIncomingAuth = request.headers.has("authorization");
	if (!hasIncomingAuth) {
		const token = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
		if (token) {
			requestHeaders.set("Authorization", `Bearer ${token}`);
		}
	}

	// Rebuild Cookie header with only backend-needed cookies (payment session).
	// Don't leak all frontend cookies — only forward what the backend reads.
	const forwardedParts: string[] = [];
	for (const name of BACKEND_FORWARDED_COOKIES) {
		const value = request.cookies.get(name)?.value;
		if (value) {
			forwardedParts.push(`${name}=${value}`);
		}
	}
	requestHeaders.set("cookie", forwardedParts.join("; "));

	const backendBase = envConfig.BACKEND_URL;
	if (!backendBase) {
		return NextResponse.json(
			{ message: "Missing BACKEND_URL" },
			{ status: 500 },
		);
	}

	// Strip `/api` prefix → forward to BE at root (BE mounts routes without prefix).
	const pathWithoutApi = pathname.replace(/^\/api/, "") || "/";
	const base = new URL(backendBase);
	const backendPathname = base.pathname.replace(/\/?$/, "") + pathWithoutApi;
	const backendUrl = new URL(backendPathname, base.origin);
	backendUrl.search = request.nextUrl.search;

	return NextResponse.rewrite(backendUrl, {
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: [
		// Match all requests except static assets
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
