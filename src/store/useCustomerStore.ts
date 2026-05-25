/**
 * useCustomerStore — lưu thông tin khách hàng đặt hàng (tên, SĐT, địa chỉ)
 *
 * Store này KHÔNG bị reset sau khi đặt hàng — dữ liệu được tái sử dụng
 * cho lần đặt hàng tiếp theo (auto-fill).
 *
 * Bảo mật:
 * - Chỉ lưu thông tin liên lạc / địa chỉ — KHÔNG lưu payment credentials.
 * - Dùng localStorage (Zustand persist) — phù hợp cho dữ liệu không nhạy cảm.
 * - Có thể dùng sessionStorage thay thế nếu muốn xóa khi đóng tab: thay
 *   `storage: createJSONStorage(() => localStorage)` bằng `sessionStorage`.
 */
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import type { CustomerAddress } from "@/types/checkout";
import { persistMiddleware } from "./_persist";

export interface SavedCustomerInfo {
	fullName: string;
	phone: string;
	email?: string;
	gender?: number;
	address?: Pick<
		CustomerAddress,
		"cityId" | "cityName" | "wardId" | "wardName" | "street"
	>;
}

interface CustomerStoreActions {
	saveCustomer: (info: SavedCustomerInfo) => void;
	clearCustomer: () => void;
}

const EMPTY: SavedCustomerInfo = { fullName: "", phone: "" };

export const useCustomerStore = create<
	SavedCustomerInfo & CustomerStoreActions
>()(
	persistMiddleware<SavedCustomerInfo & CustomerStoreActions>(
		(set) => ({
			...EMPTY,
			saveCustomer: (info) => set(info),
			clearCustomer: () => set(EMPTY),
		}),
		{
			name: "ddv-customer", // localStorage key
			storage: createJSONStorage(() => localStorage),
			// Chỉ persist thông tin cá nhân, không persist actions
			partialize: (state) => ({
				fullName: state.fullName,
				phone: state.phone,
				email: state.email,
				gender: state.gender,
				address: state.address,
			}),
		},
	),
);
