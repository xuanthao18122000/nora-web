"use client";

import { ChevronDown } from "lucide-react";
import Button from "@/components/common/Button";
import type { Comment } from "../interfaces/comment.types";
import CommentItem from "./CommentItem.client";

const MAX_CHARS = 2000;

function CommentsListSkeleton() {
	return (
		<div
			className="flex flex-col gap-4"
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex gap-2 animate-pulse">
					<div className="size-8 shrink-0 rounded-full bg-gray-200" />
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<div className="h-4 w-32 rounded bg-gray-200" />
						<div className="h-4 w-full rounded bg-gray-100" />
						<div className="h-4 w-[80%] rounded bg-gray-100" />
					</div>
				</div>
			))}
		</div>
	);
}

export type CommentSectionViewProps = {
	comments: Comment[];
	/** True while first page of comments is loading (client fetch). */
	commentsInitialLoading?: boolean;
	question: string;
	onQuestionChange: (value: string) => void;
	onSubmitQuestion: () => void | Promise<void>;
	questionSubmitting?: boolean;
	onSubmitReply: (commentId: string, content: string) => void | Promise<void>;
	onLoadReplies?: (commentId: string) => void | Promise<void>;
	loadingRepliesForId?: string | null;
	replySubmittingForId?: string | null;
	onLoadMoreComments?: () => void | Promise<void>;
	commentsHasMore?: boolean;
	commentsLoadingMore?: boolean;
	commentsPerPage?: number;
};

export default function CommentSectionView({
	comments,
	commentsInitialLoading = false,
	question,
	onQuestionChange,
	onSubmitQuestion,
	questionSubmitting = false,
	onSubmitReply,
	onLoadReplies,
	loadingRepliesForId = null,
	replySubmittingForId = null,
	onLoadMoreComments,
	commentsHasMore = false,
	commentsLoadingMore = false,
	commentsPerPage = 5,
}: CommentSectionViewProps) {
	const handleSubmitQuestion = () => {
		void onSubmitQuestion();
	};

	return (
		<section className="rounded-2xl bg-white p-2 md:p-4">
			<div className="mb-2 md:mb-3">
				<h2 className="text-base font-medium text-gray-900">
					Hỏi và đáp
				</h2>
			</div>

			<div className="border-b border-gray-200 pb-3 md:pb-4">
				<p className="text-sm leading-6 text-gray-600">
					Mọi yêu cầu hỗ trợ sẽ được phản hồi trong vòng 1–2 giờ làm
					việc. Đối với các liên hệ ngoài giờ hành chính, chúng tôi sẽ
					phản hồi trong tối đa 24 giờ làm việc tiếp theo.
				</p>

				<div className="mt-4 flex flex-col items-end gap-4">
					<div className="relative w-full">
						<textarea
							value={question}
							onChange={(e) => {
								if (e.target.value.length <= MAX_CHARS) {
									onQuestionChange(e.target.value);
								}
							}}
							placeholder="Viết câu hỏi của bạn tại đây"
							rows={2}
							disabled={questionSubmitting}
							className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60"
						/>
						<span className="absolute right-3 bottom-2.5 text-xs text-gray-400">
							{question.length}/{MAX_CHARS}
						</span>
					</div>

					<Button
						variant="filled"
						color="primary"
						size="md"
						onClick={handleSubmitQuestion}
						disabled={
							questionSubmitting || question.trim().length === 0
						}
					>
						{questionSubmitting ? "Đang gửi…" : "Gửi câu hỏi"}
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-4 pt-3 md:pt-4">
				{commentsInitialLoading ? (
					<CommentsListSkeleton />
				) : (
					comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							onSubmitReply={(content) =>
								onSubmitReply(comment.id, content)
							}
							onLoadReplies={
								comment.totalReplies > 0 &&
								comment.replies.length === 0 &&
								onLoadReplies
									? () => onLoadReplies(comment.id)
									: undefined
							}
							repliesLoading={loadingRepliesForId === comment.id}
							replySubmitting={
								replySubmittingForId === comment.id
							}
						/>
					))
				)}

				{!commentsInitialLoading &&
					commentsHasMore &&
					onLoadMoreComments && (
						<div className="flex justify-center pt-2">
							<Button
								variant="bordered"
								color="gray"
								size="sm"
								trailingIcon={
									<ChevronDown aria-hidden="true" />
								}
								onClick={() => void onLoadMoreComments()}
								disabled={commentsLoadingMore}
							>
								{commentsLoadingMore
									? "Đang tải…"
									: `Xem thêm (${commentsPerPage} bình luận)`}
							</Button>
						</div>
					)}
			</div>
		</section>
	);
}
