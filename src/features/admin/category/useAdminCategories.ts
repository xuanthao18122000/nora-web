"use client";

import useSWR from "swr";
import {
	type ListCategoryParams,
	listAdminCategories,
	listAdminCategoryTree,
} from "@/lib/api/admin";

export function useAdminCategories(params: ListCategoryParams) {
	return useSWR(["admin/categories", params], () => listAdminCategories(params), {
		keepPreviousData: true,
	});
}

export function useAdminCategoryTree() {
	return useSWR("admin/categories/tree", () => listAdminCategoryTree(), {
		keepPreviousData: true,
	});
}
