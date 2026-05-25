/** Aligns with BE `CommentTargetTypeEnum` — dùng constant thay vì string literal. */
export enum CommentTargetType {
	CATEGORY = "CATEGORY",
	PRODUCT = "PRODUCT",
}

export type CommentCustomerTypeApi = "CUSTOMER" | "ADMIN";

/** Row shape from GET /fe/comments and GET /fe/comments/:id/replies */
export type CommentRowApi = {
	id: string;
	createdAt: string;
	updatedAt: string;
	targetType: CommentTargetType;
	targetId: number;
	parentId: string | null;
	/** BE may return `parent` as id string or null when joining */
	parent?: string | null;
	content: string;
	customerName: string | null;
	/** BE currently returns phone in entity; FE should not display it */
	customerPhone?: string | null;
	customerCommentType: CommentCustomerTypeApi;
	likeCount: number;
	replyCount: number;
	status: string;
	/** Optional when roots API joins `children` */
	children?: CommentRowApi[];
};

export type PaginatedCommentsPayload = {
	data: CommentRowApi[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
