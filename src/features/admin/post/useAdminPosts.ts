"use client";

import useSWR from "swr";
import { type ListPostParams, listAdminPosts } from "@/lib/api/admin";

export function useAdminPosts(params: ListPostParams) {
	return useSWR(["admin/posts", params], () => listAdminPosts(params), {
		keepPreviousData: true,
	});
}
