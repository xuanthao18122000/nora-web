import type { SimpleProductDetail } from "./simple-product";

/** Đồng bộ với BE `SlugTypeEnum` ở `acquyhn-api/src/modules/slug/enums/slug.enum.ts`. */
export enum SlugTypeEnum {
	PRODUCT = 1,
	CATEGORY = 2,
	POST = 3,
	PAGE = 4,
	POST_LIST = 5,
}

/** Shape category trong resolve response — match Category entity acquyhn. */
export interface ResolvedCategory {
	id: number;
	name: string;
	slug: string;
	description?: string | null;
	idPath?: string;
	priority?: number;
	position?: number;
	iconUrl?: string | null;
	thumbnailUrl?: string | null;
	canonicalUrl?: string | null;
	level?: number;
	metaTitle?: string | null;
	metaDescription?: string | null;
	metaKeywords?: string | null;
	metaRobots?: string;
	seoBaseSchema?: unknown;
	status?: number;
	parent?: ResolvedCategory | null;
}

/** Shape page trong resolve response — match Page entity. */
export interface ResolvedPage {
	id: string;
	slug: string;
	code?: string;
	type?: string;
	title?: string;
	description?: string | null;
	metaTitle?: string | null;
	metaDescription?: string | null;
	canonicalUrl?: string | null;
	sections?: unknown[];
	[key: string]: unknown;
}

/** Shape post trong resolve response. */
export interface ResolvedPost {
	id: number;
	title: string;
	slug: string;
	featuredImage?: string | null;
	thumbnailUrl?: string | null;
	content?: string | null;
	shortDescription?: string | null;
	views?: number;
	createdAt?: string;
	metaTitle?: string | null;
	metaDescription?: string | null;
	[key: string]: unknown;
}

/** Shape post-list trong resolve response — chỉ meta. Posts fetch riêng qua /fe/posts. */
export interface ResolvedPostList {
	id: number;
	name: string;
	slug: string;
	description?: string | null;
	[key: string]: unknown;
}

/** Item post trong list (BE `/fe/posts` trả về). */
export interface PostListItem {
	id: number;
	title: string;
	slug: string;
	shortDescription?: string | null;
	featuredImage?: string | null;
	createdAt?: string;
	views?: number;
}

/**
 * Response của `GET /fe/resolve?slug=xxx`.
 * BE trả luôn detail entity tương ứng để FE chỉ cần 1 round-trip.
 * Chỉ field khớp `type` có data; còn lại = null.
 */
export interface SlugResolveResponse {
	type: SlugTypeEnum;
	entityId: number | string;
	slug: string;
	product: SimpleProductDetail | null;
	category: ResolvedCategory | null;
	post: ResolvedPost | null;
	postList: ResolvedPostList | null;
	page: ResolvedPage | null;
}
