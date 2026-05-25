"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { adminMe, AdminApiError } from "@/lib/api/admin";
import { useAdminAuthStore } from "@/store/admin";

const LOGIN_PATH = "/admin/login";

/**
 * Bảo vệ các route /admin/(dashboard).
 * - Chưa có token → redirect /admin/login
 * - Có token → gọi /me 1 lần lúc mount (verify + sync user info)
 * - Token hết hạn (401) → clear store + redirect /admin/login
 *
 * Note: chỉ verify 1 lần / session client. Switch page không re-fetch.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const token = useAdminAuthStore((s) => s.token);
	const hasHydrated = useAdminAuthStore((s) => s.hasHydrated);
	const setUser = useAdminAuthStore((s) => s.setUser);
	const clearAuth = useAdminAuthStore((s) => s.clearAuth);
	const verifiedTokenRef = useRef<string | null>(null);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!token) {
			router.replace(LOGIN_PATH);
			return;
		}

		// Skip verify nếu token này đã verify trong session.
		if (verifiedTokenRef.current === token) return;
		verifiedTokenRef.current = token;

		adminMe()
			.then((user) => setUser(user))
			.catch((err: unknown) => {
				if (err instanceof AdminApiError && err.status === 401) {
					verifiedTokenRef.current = null;
					clearAuth();
					router.replace(LOGIN_PATH);
				}
			});
	}, [hasHydrated, token, router, setUser, clearAuth]);

	if (!hasHydrated || !token) {
		return (
			<div className="flex h-screen items-center justify-center text-sm text-gray-500">
				Đang kiểm tra phiên đăng nhập...
			</div>
		);
	}

	return <>{children}</>;
}
