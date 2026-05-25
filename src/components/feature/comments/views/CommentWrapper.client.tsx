"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils/error";
import {
	createCommentReply,
	createCommentRoot,
	getCommentReplies,
	getCommentsRoots,
} from "../api/comments.api";
import CommentSectionView from "../components/CommentSection.client";
import type { Comment } from "../interfaces/comment.types";
import type { CommentTargetType } from "../types";
import { mapReplyRowToUi, mapRootsToUi } from "../utils/map-comments-api-to-ui";

const PAGE_SIZE = 5;

export type CommentWrapperProps = {
	targetType: CommentTargetType;
	targetId: number;
};

export default function CommentWrapper({
	targetType,
	targetId,
}: CommentWrapperProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [initialLoading, setInitialLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [question, setQuestion] = useState("");
	const [questionSubmitting, setQuestionSubmitting] = useState(false);
	const [loadingRepliesForId, setLoadingRepliesForId] = useState<
		string | null
	>(null);
	const [replySubmittingForId, setReplySubmittingForId] = useState<
		string | null
	>(null);

	useEffect(() => {
		let cancelled = false;
		setInitialLoading(true);
		setComments([]);
		setPage(1);
		setTotalPages(1);

		void (async () => {
			try {
				const res = await getCommentsRoots({
					targetType,
					targetId,
					page: 1,
					limit: PAGE_SIZE,
				});
				if (cancelled) return;
				setComments(mapRootsToUi(res.data));
				setPage(res.page);
				setTotalPages(res.totalPages);
			} catch (e) {
				if (!cancelled)
					toast.error(extractErrorMessage(e, "Đã có lỗi xảy ra"));
			} finally {
				if (!cancelled) setInitialLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [targetType, targetId]);

	const hasMore = page < totalPages;

	const onLoadMore = useCallback(async () => {
		if (page >= totalPages || loadingMore || initialLoading) return;
		setLoadingMore(true);
		try {
			const nextPage = page + 1;
			const res = await getCommentsRoots({
				targetType,
				targetId,
				page: nextPage,
				limit: PAGE_SIZE,
			});
			setComments((prev) => [...prev, ...mapRootsToUi(res.data)]);
			setPage(res.page);
			setTotalPages(res.totalPages);
		} catch (e) {
			toast.error(extractErrorMessage(e, "Đã có lỗi xảy ra"));
		} finally {
			setLoadingMore(false);
		}
	}, [page, totalPages, loadingMore, initialLoading, targetType, targetId]);

	const onLoadReplies = useCallback(async (commentId: string) => {
		setLoadingRepliesForId(commentId);
		try {
			const res = await getCommentReplies(commentId, {
				page: 1,
				limit: 50,
			});
			const mapped = res.data.map(mapReplyRowToUi);
			setComments((prev) =>
				prev.map((c) =>
					c.id === commentId ? { ...c, replies: mapped } : c,
				),
			);
		} catch (e) {
			toast.error(extractErrorMessage(e, "Đã có lỗi xảy ra"));
		} finally {
			setLoadingRepliesForId(null);
		}
	}, []);

	const onSubmitQuestion = useCallback(async () => {
		const content = question.trim();
		if (!content) return;
		setQuestionSubmitting(true);
		try {
			await createCommentRoot({ targetType, targetId, content });
			setQuestion("");
			toast.success("Gửi bình luận thành công");
		} catch (e) {
			toast.error(extractErrorMessage(e, "Đã có lỗi xảy ra"));
		} finally {
			setQuestionSubmitting(false);
		}
	}, [question, targetType, targetId]);

	const onSubmitReply = useCallback(
		async (commentId: string, content: string) => {
			setReplySubmittingForId(commentId);
			try {
				await createCommentReply(commentId, { targetType, content });
				toast.success(
					"Đã gửi phản hồi. Nội dung sẽ hiển thị sau khi được duyệt.",
				);
			} catch (e) {
				toast.error(extractErrorMessage(e, "Đã có lỗi xảy ra"));
			} finally {
				setReplySubmittingForId(null);
			}
		},
		[targetType],
	);

	return (
		<CommentSectionView
			comments={comments}
			commentsInitialLoading={initialLoading}
			question={question}
			onQuestionChange={setQuestion}
			onSubmitQuestion={onSubmitQuestion}
			questionSubmitting={questionSubmitting}
			onSubmitReply={onSubmitReply}
			onLoadReplies={onLoadReplies}
			loadingRepliesForId={loadingRepliesForId}
			replySubmittingForId={replySubmittingForId}
			onLoadMoreComments={hasMore ? onLoadMore : undefined}
			commentsHasMore={hasMore}
			commentsLoadingMore={loadingMore}
			commentsPerPage={PAGE_SIZE}
		/>
	);
}
