import { formatDate } from "@/lib/utils/format";
import type { Comment, Reply } from "../interfaces/comment.types";
import type { CommentRowApi } from "../types";

function displayName(row: CommentRowApi): string {
	const n = row.customerName?.trim();
	if (n) return n;
	return "Khách hàng";
}

function initialFromName(name: string): string {
	const t = name.trim();
	if (!t) return "?";
	const ch = t.charAt(0);
	return ch.toLocaleUpperCase("vi");
}

export function mapCommentRowToUi(
	row: CommentRowApi,
	replies: Reply[] = [],
): Comment {
	const name = displayName(row);
	const childrenCount = (row.children ?? []).length;
	return {
		id: row.id,
		name,
		initial: initialFromName(name),
		time: formatDate(row.createdAt),
		content: row.content,
		replies,
		totalReplies: Math.max(row.replyCount, childrenCount, replies.length),
	};
}

export function mapReplyRowToUi(row: CommentRowApi): Reply {
	const name = displayName(row);
	return {
		id: row.id,
		name,
		initial: initialFromName(name),
		isAdmin: row.customerCommentType === "ADMIN",
		time: formatDate(row.createdAt),
		content: row.content,
	};
}

export function mapRootsToUi(rows: CommentRowApi[]): Comment[] {
	return rows.map((r) => {
		const children = r.children ?? [];
		const replies = children
			.slice()
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime(),
			)
			.map(mapReplyRowToUi);
		return mapCommentRowToUi(r, replies);
	});
}
