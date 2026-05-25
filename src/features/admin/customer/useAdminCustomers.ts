"use client";

import useSWR from "swr";
import {
	type ListCustomerParams,
	type ListOrderParams,
	listAdminCustomers,
	listAdminOrders,
} from "@/lib/api/admin";

export function useAdminCustomers(params: ListCustomerParams) {
	return useSWR(["admin/customers", params], () => listAdminCustomers(params), {
		keepPreviousData: true,
	});
}

/** Lịch sử order của customer — dùng list endpoint với filter customerId. */
export function useAdminCustomerOrders(customerId: number | null, params: ListOrderParams = {}) {
	return useSWR(
		Number.isFinite(customerId) && customerId
			? ["admin/customer/orders", customerId, params]
			: null,
		() => listAdminOrders({ ...params, customerId: customerId as number, limit: 20 }),
		{ keepPreviousData: true },
	);
}
