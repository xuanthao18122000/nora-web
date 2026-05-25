import { api } from "@/lib/api";
import type { PostListItem } from "@/types/slug";

export const POST_LIST_PAGE_SIZE = 9;

interface BackendPaginatedPosts {
	data: PostListItem[];
	total: number;
	page: number;
	limit: number;
	totalPages?: number;
}

export interface PostListPaged {
	items: PostListItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/** Fetch posts của 1 PostList với pagination + search optional. */
export async function getPostListPosts(
	postListId: number | string,
	page = 1,
	limit = POST_LIST_PAGE_SIZE,
	search?: string,
): Promise<PostListPaged> {
	const params = new URLSearchParams({
		postListId: String(postListId),
		page: String(page),
		limit: String(limit),
	});
	const term = search?.trim();
	if (term) params.set("search", term);
	const res = await api.get<BackendPaginatedPosts>(
		`/fe/posts?${params.toString()}`,
		// Search query không cache để kết quả luôn realtime; list mặc định cache 60s.
		term ? ({ cache: "no-store" } as RequestInit) : ({ next: { revalidate: 60 } } as RequestInit),
	);
	return {
		items: res.data ?? [],
		total: res.total ?? 0,
		page: res.page ?? page,
		limit: res.limit ?? limit,
		totalPages: res.totalPages ?? Math.ceil((res.total ?? 0) / limit),
	};
}
