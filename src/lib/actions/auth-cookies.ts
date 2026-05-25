"use server";

import { cookies } from "next/headers";
import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_REFRESH_TOKEN,
} from "@/lib/constants/cookies";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function setAuthCookie(accessToken: string) {
	const cookieStore = await cookies();
	cookieStore.set(COOKIE_ACCESS_TOKEN, accessToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: IS_PRODUCTION,
		maxAge: TOKEN_MAX_AGE,
		path: "/",
	});
}

export async function setRefreshCookie(refreshToken: string) {
	const cookieStore = await cookies();
	cookieStore.set(COOKIE_REFRESH_TOKEN, refreshToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: IS_PRODUCTION,
		maxAge: TOKEN_MAX_AGE,
		path: "/",
	});
}

export async function getRefreshTokenValue(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_REFRESH_TOKEN)?.value ?? null;
}

export async function clearAuthCookie() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_ACCESS_TOKEN);
	cookieStore.delete(COOKIE_REFRESH_TOKEN);
}
