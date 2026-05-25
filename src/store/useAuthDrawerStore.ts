"use client";

import { create } from "zustand";

/**
 * Stub: shop acquyhn không có đăng nhập khách hàng. Giữ shape store để
 * checkout PersonalInfoSection.tsx không cần sửa — `openLogin` là no-op.
 */

interface AuthDrawerState {
	activeDrawer: null;
	openLogin: () => void;
	openSignUp: () => void;
	close: () => void;
}

export const useAuthDrawerStore = create<AuthDrawerState>(() => ({
	activeDrawer: null,
	openLogin: () => undefined,
	openSignUp: () => undefined,
	close: () => undefined,
}));
