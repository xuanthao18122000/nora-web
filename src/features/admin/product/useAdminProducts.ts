"use client";

import useSWR from "swr";
import {
	type ListProductParams,
	listAdminCategoryTree,
	listAdminProducts,
} from "@/lib/api/admin";

export function useAdminProducts(params: ListProductParams) {
	return useSWR(["admin/products", params], () => listAdminProducts(params), {
		keepPreviousData: true,
	});
}

/** Category tree cho multi-select trong form product. */
export function useAdminCategoryTreeForProduct() {
	return useSWR(["admin/categories/tree"], () => listAdminCategoryTree());
}
