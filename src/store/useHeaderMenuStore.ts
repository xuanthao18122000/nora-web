"use client";

import { create } from "zustand";

/**
 * Coordinate giữa drawer "Danh mục" (CategoriesMenu) và các dropdown
 * cate kế bên (HeaderNavItem) — để mỗi lúc chỉ có 1 cái mở.
 */
interface HeaderMenuState {
	categoriesOpen: boolean;
	setCategoriesOpen: (open: boolean) => void;
	closeCategories: () => void;
}

export const useHeaderMenuStore = create<HeaderMenuState>((set) => ({
	categoriesOpen: false,
	setCategoriesOpen: (open) => set({ categoriesOpen: open }),
	closeCategories: () => set({ categoriesOpen: false }),
}));
