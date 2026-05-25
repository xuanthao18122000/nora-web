"use client";

/**
 * Auth bị tắt cho shop acquyhn — site này không có đăng nhập khách hàng.
 * Stub này giữ shape `useAuth()` để các component cũ (checkout/order-tracking)
 * không phá build. Tất cả method là no-op, user luôn null.
 */

import type { ReactNode } from "react";

export type AuthUser = {
	id: number;
	fullName: string;
	email: string | null;
	phoneNumber: string | null;
	gender: number | null;
	birthday: string | null;
	avatar: string | null;
};

interface AuthProviderProps {
	hasToken?: boolean;
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	return <>{children}</>;
}

export function useAuth() {
	return {
		user: null as AuthUser | null,
		isLoggedIn: false,
		isReady: true,
		loginWithToken: async () => null,
		loginWithCustomer: async () => undefined,
		setAuth: async () => undefined,
		updateUser: () => undefined,
		refreshUser: async () => null,
		clearAuth: async () => undefined,
	};
}
