"use client";

import useSWR from "swr";
import {
	type ListPageParams,
	getAdminPage,
	listAdminPages,
} from "@/lib/api/admin";

export function useAdminPages(params: ListPageParams) {
	return useSWR(["admin/pages", params], () => listAdminPages(params), {
		keepPreviousData: true,
	});
}

export function useAdminPage(id: string | null) {
	return useSWR(id ? ["admin/page", id] : null, () => getAdminPage(id as string));
}
