"use client";

import { ChevronDown, ChevronUp, Undo2, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "@/components/common/Button";
import type { Comment, Reply } from "../interfaces/comment.types";

const MAX_REPLY_CHARS = 1000;

function Avatar({ initial }: { initial: string }) {
	return (
		<div
			className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200"
			aria-hidden="true"
		>
			<span className="text-sm font-medium text-gray-600">{initial}</span>
		</div>
	);
}

function AdminBadge() {
	return (
		<span className="rounded bg-primary-500 px-1 text-[10px] leading-[14px] font-medium text-white">
			Quản trị viên
		</span>
	);
}

function DotSeparator() {
	return (
		<span
			className="inline-block size-1 rounded-full bg-gray-400"
			aria-hidden="true"
		/>
	);
}

function CommentContent({ content }: { content: string }) {
	return (
		<p className="whitespace-pre-line text-sm leading-5 text-gray-900">
			{content}
		</p>
	);
}

function ReplyButton({ onClick }: { onClick?: () => void }) {
	return (
		<Button
			variant="bordered"
			color="gray"
			size="xs"
			leadingIcon={<Undo2 aria-hidden="true" />}
			onClick={onClick}
		>
			Trả lời
		</Button>
	);
}

function InlineReplyForm({
	replyingTo,
	onCancel,
	onSubmit,
	disabled,
}: {
	replyingTo: string;
	onCancel: () => void;
	onSubmit: (content: string) => void | Promise<void>;
	disabled?: boolean;
}) {
	const [text, setText] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = () => {
		if (text.trim().length === 0 || disabled) return;
		void onSubmit(text.trim());
		setText("");
	};

	return (
		<div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2.5">
			<div className="flex items-center justify-between">
				<span className="text-xs text-gray-500">
					Trả lời{" "}
					<span className="font-medium text-gray-700">
						{replyingTo}
					</span>
				</span>
				<button
					type="button"
					onClick={onCancel}
					className="flex size-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					aria-label="Hủy trả lời"
				>
					<X className="size-3.5" aria-hidden="true" />
				</button>
			</div>
			<textarea
				ref={textareaRef}
				value={text}
				onChange={(e) => {
					if (e.target.value.length <= MAX_REPLY_CHARS) {
						setText(e.target.value);
					}
				}}
				placeholder="Viết phản hồi..."
				rows={2}
				disabled={disabled}
				className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm leading-5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60"
			/>
			<div className="flex items-center justify-between">
				<span className="text-xs text-gray-400">
					{text.length}/{MAX_REPLY_CHARS}
				</span>
				<Button
					variant="filled"
					color="primary"
					size="sm"
					onClick={handleSubmit}
					disabled={disabled || text.trim().length === 0}
				>
					Gửi phản hồi
				</Button>
			</div>
		</div>
	);
}

function ReplyItem({
	reply,
	onReply,
}: {
	reply: Reply;
	onReply: (name: string) => void;
}) {
	return (
		<div className="flex gap-2">
			<Avatar initial={reply.initial} />
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex items-center gap-1.5">
					<span className="text-sm font-medium text-gray-900">
						{reply.name}
					</span>
					{reply.isAdmin && <AdminBadge />}
					<DotSeparator />
					<span className="text-xs text-gray-600">{reply.time}</span>
				</div>
				<CommentContent content={reply.content} />
				<div className="mt-1">
					<ReplyButton onClick={() => onReply(reply.name)} />
				</div>
			</div>
		</div>
	);
}

export type CommentItemProps = {
	comment: Comment;
	onSubmitReply: (content: string) => void | Promise<void>;
	onLoadReplies?: () => void | Promise<void>;
	repliesLoading?: boolean;
	replySubmitting?: boolean;
};

export default function CommentItem({
	comment,
	onSubmitReply,
	onLoadReplies,
	repliesLoading = false,
	replySubmitting = false,
}: CommentItemProps) {
	const [expanded, setExpanded] = useState(false);
	const [replyingTo, setReplyingTo] = useState<string | null>(null);

	const hasReplies = comment.replies.length > 0;
	const firstReply = comment.replies[0];
	const remainingReplies = comment.replies.slice(1);
	const hasMoreReplies = comment.totalReplies > 1;

	const pendingRepliesFetch =
		comment.totalReplies > 0 &&
		comment.replies.length === 0 &&
		onLoadReplies;

	const handleReply = (name: string) => {
		setReplyingTo(name);
	};

	const handleCancelReply = () => {
		setReplyingTo(null);
	};

	return (
		<div className="flex gap-2">
			<Avatar initial={comment.initial} />
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex items-center gap-1.5">
					<span className="text-sm font-medium text-gray-900">
						{comment.name}
					</span>
					<DotSeparator />
					<span className="text-xs text-gray-600">
						{comment.time}
					</span>
				</div>
				<CommentContent content={comment.content} />
				<div className="mt-1">
					<ReplyButton onClick={() => handleReply(comment.name)} />
				</div>

				{pendingRepliesFetch && (
					<div className="mt-2">
						<button
							type="button"
							disabled={repliesLoading}
							onClick={() => void onLoadReplies()}
							className="text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							{repliesLoading
								? "Đang tải phản hồi…"
								: `Xem ${comment.totalReplies} phản hồi`}
						</button>
					</div>
				)}

				{replyingTo && !hasReplies && (
					<div className="mt-2">
						<InlineReplyForm
							replyingTo={replyingTo}
							onCancel={handleCancelReply}
							onSubmit={async (content) => {
								await onSubmitReply(content);
								setReplyingTo(null);
							}}
							disabled={replySubmitting}
						/>
					</div>
				)}

				{hasReplies && firstReply && (
					<div className="mt-2 flex flex-col gap-3 rounded-2xl bg-gray-100 p-3">
						<ReplyItem reply={firstReply} onReply={handleReply} />

						{expanded &&
							remainingReplies.map((reply) => (
								<ReplyItem
									key={reply.id}
									reply={reply}
									onReply={handleReply}
								/>
							))}

						{hasMoreReplies && (
							<button
								type="button"
								className="flex items-center gap-1 self-start text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded
									? "Rút gọn phản hồi"
									: `Xem tất cả ${comment.totalReplies} phản hồi`}
								{expanded ? (
									<ChevronUp
										className="size-4"
										aria-hidden="true"
									/>
								) : (
									<ChevronDown
										className="size-4"
										aria-hidden="true"
									/>
								)}
							</button>
						)}

						{replyingTo && (
							<InlineReplyForm
								replyingTo={replyingTo}
								onCancel={handleCancelReply}
								onSubmit={async (content) => {
									await onSubmitReply(content);
									setReplyingTo(null);
								}}
								disabled={replySubmitting}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
