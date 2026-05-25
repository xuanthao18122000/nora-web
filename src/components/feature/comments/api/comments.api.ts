import { api } from "@/lib/api/client";
import { API } from "@/lib/api/endpoints";
import type { CommentTargetType, PaginatedCommentsPayload } from "../types";

export async function getCommentsRoots(params: {
	targetType: CommentTargetType;
	targetId: number;
	page?: number;
	limit?: number;
}): Promise<PaginatedCommentsPayload> {
	const { targetType, targetId, page = 1, limit = 10 } = params;
	return api.get<PaginatedCommentsPayload>(API.COMMENTS_FE.LIST, {
		params: {
			targetType,
			targetId: String(targetId),
			page: String(page),
			limit: String(limit),
		},
	});
}

export async function getCommentReplies(
	parentId: string,
	params?: { page?: number; limit?: number },
): Promise<PaginatedCommentsPayload> {
	const { page = 1, limit = 50 } = params ?? {};
	return api.get<PaginatedCommentsPayload>(
		API.COMMENTS_FE.REPLIES(parentId),
		{ params: { page: String(page), limit: String(limit) } },
	);
}

export async function createCommentRoot(body: {
	targetType: CommentTargetType;
	targetId: number;
	content: string;
	customerName?: string;
}): Promise<{ id: string }> {
	return api.post<{ id: string }>(API.COMMENTS_FE.LIST, body);
}

export async function createCommentReply(
	parentId: string,
	body: {
		targetType: CommentTargetType;
		content: string;
		customerName?: string;
	},
): Promise<{ id: string }> {
	return api.post<{ id: string }>(API.COMMENTS_FE.REPLIES(parentId), body);
}
