"use client";

import { adminFetch } from "./client";
import type { AdminUser, LoginPayload, LoginResponse } from "./types";

export async function adminLogin(payload: LoginPayload): Promise<LoginResponse> {
	return adminFetch<LoginResponse>("/cms/auth/login", {
		method: "POST",
		body: payload,
		withAuth: false,
	});
}

export async function adminMe(): Promise<AdminUser> {
	return adminFetch<AdminUser>("/cms/auth/me", { method: "GET" });
}
