"use client";

import useSWR from "swr";
import {
	type ListOrderParams,
	getAdminOrder,
	listAdminOrders,
} from "@/lib/api/admin";

export function useAdminOrders(params: ListOrderParams) {
	return useSWR(["admin/orders", params], () => listAdminOrders(params), {
		keepPreviousData: true,
	});
}

export function useAdminOrder(id: number | null) {
	return useSWR(
		Number.isFinite(id) && id ? ["admin/order", id] : null,
		() => getAdminOrder(id as number),
	);
}
