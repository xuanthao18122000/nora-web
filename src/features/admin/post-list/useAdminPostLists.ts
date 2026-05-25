"use client";

import useSWR from "swr";
import { type ListPostListParams, listAdminPostLists } from "@/lib/api/admin";

export function useAdminPostLists(params: ListPostListParams) {
	return useSWR(
		["admin/post-lists", params],
		() => listAdminPostLists(params),
		{ keepPreviousData: true },
	);
}
