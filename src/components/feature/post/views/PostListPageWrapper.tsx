import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/common";
import ParseHtmlContent from "@/components/common/ParseHtmlContent";
import type { ResolvedPostList } from "@/types/slug";
import {
	getPostListPosts,
	POST_LIST_PAGE_SIZE,
} from "../api/get-post-list-posts";
import { PostCard } from "../components/PostCard";
import PostListSearch from "../components/PostListSearch.client";

interface PostListPageWrapperProps {
	postList: ResolvedPostList;
	searchParams?: Record<string, string | string[] | undefined>;
}

function parsePage(value: string | string[] | undefined): number {
	const raw = Array.isArray(value) ? value[0] : value;
	const n = Number(raw);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function parseString(value: string | string[] | undefined): string {
	const raw = Array.isArray(value) ? value[0] : value;
	return (raw ?? "").trim();
}

export default async function PostListPageWrapper({
	postList,
	searchParams,
}: PostListPageWrapperProps) {
	const currentPage = parsePage(searchParams?.page);
	const searchTerm = parseString(searchParams?.q);
	const { items: posts, total, totalPages } = await getPostListPosts(
		postList.id,
		currentPage,
		POST_LIST_PAGE_SIZE,
		searchTerm || undefined,
	);

	const basePath = `/${postList.slug}`;
	const buildHref = (page: number): Route => {
		const params = new URLSearchParams();
		if (searchTerm) params.set("q", searchTerm);
		if (page > 1) params.set("page", String(page));
		const qs = params.toString();
		return (qs ? `${basePath}?${qs}` : basePath) as Route;
	};

	return (
		<section className="container-inner mt-4 space-y-4 pb-8">
			<Breadcrumb
				items={[
					{ label: "Trang chủ", href: "/" },
					{ label: postList.name },
				]}
			/>

			<header className="rounded-2xl bg-white p-5 md:p-6 space-y-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
					<div className="min-w-0 flex-1">
						<div className="flex items-baseline gap-3 flex-wrap">
							<h1 className="text-2xl font-semibold text-gray-900">
								{postList.name}
							</h1>
							<span className="text-sm text-gray-400">
								{searchTerm
									? `${total} kết quả cho "${searchTerm}"`
									: `${total} bài viết`}
							</span>
						</div>
						{postList.description && (
							<div className="mt-2 text-sm text-gray-600 leading-relaxed">
								<ParseHtmlContent html={postList.description} />
							</div>
						)}
					</div>
					<div className="w-full sm:w-80 sm:shrink-0">
						<PostListSearch defaultValue={searchTerm} />
					</div>
				</div>
			</header>

			{posts.length === 0 ? (
				<div className="rounded-2xl bg-white p-10 text-center">
					<div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gray-100">
						<Newspaper className="size-7 text-gray-400" />
					</div>
					<div className="text-base font-medium text-gray-900">
						{searchTerm
							? `Không tìm thấy bài viết nào cho "${searchTerm}"`
							: "Chưa có bài viết nào"}
					</div>
					<div className="mt-1 text-sm text-gray-500">
						{searchTerm
							? "Thử dùng từ khóa khác hoặc xóa tìm kiếm."
							: "Nội dung sẽ được cập nhật sớm."}
					</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{posts.map((p) => (
							<PostCard key={p.id} post={p} />
						))}
					</div>

					{totalPages > 1 && (
						<PaginationLinks
							currentPage={currentPage}
							totalPages={totalPages}
							buildHref={buildHref}
						/>
					)}
				</>
			)}
		</section>
	);
}

function getPageWindow(
	current: number,
	total: number,
	maxVisible = 5,
): (number | "...")[] {
	if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

	const pages: (number | "...")[] = [];
	const half = Math.floor(maxVisible / 2);
	let start = Math.max(1, current - half);
	let end = Math.min(total, start + maxVisible - 1);
	if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

	if (start > 1) {
		pages.push(1);
		if (start > 2) pages.push("...");
	}
	for (let i = start; i <= end; i++) pages.push(i);
	if (end < total) {
		if (end < total - 1) pages.push("...");
		pages.push(total);
	}
	return pages;
}

function PaginationLinks({
	currentPage,
	totalPages,
	buildHref,
}: {
	currentPage: number;
	totalPages: number;
	buildHref: (page: number) => Route;
}) {
	const pages = getPageWindow(currentPage, totalPages);
	const isFirst = currentPage <= 1;
	const isLast = currentPage >= totalPages;

	const baseBtn =
		"flex items-center justify-center min-w-9 h-9 px-3 rounded-md border text-sm transition-colors";
	const activeBtn =
		"border-primary-500 bg-primary-500 text-white hover:bg-primary-600";
	const idleBtn = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
	const disabledBtn =
		"border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed";

	return (
		<nav
			aria-label="Pagination"
			className="flex items-center justify-center gap-1 pt-2"
		>
			{isFirst ? (
				<span className={`${baseBtn} ${disabledBtn}`} aria-disabled="true">
					<ChevronLeft className="size-4" />
				</span>
			) : (
				<Link
					href={buildHref(currentPage - 1)}
					className={`${baseBtn} ${idleBtn}`}
					aria-label="Trang trước"
				>
					<ChevronLeft className="size-4" />
				</Link>
			)}

			{pages.map((p, idx) =>
				p === "..." ? (
					<span
						key={`gap-${idx}`}
						className="px-2 text-sm text-gray-400 select-none"
					>
						…
					</span>
				) : p === currentPage ? (
					<span key={p} className={`${baseBtn} ${activeBtn}`} aria-current="page">
						{p}
					</span>
				) : (
					<Link
						key={p}
						href={buildHref(p)}
						className={`${baseBtn} ${idleBtn}`}
					>
						{p}
					</Link>
				),
			)}

			{isLast ? (
				<span className={`${baseBtn} ${disabledBtn}`} aria-disabled="true">
					<ChevronRight className="size-4" />
				</span>
			) : (
				<Link
					href={buildHref(currentPage + 1)}
					className={`${baseBtn} ${idleBtn}`}
					aria-label="Trang sau"
				>
					<ChevronRight className="size-4" />
				</Link>
			)}
		</nav>
	);
}
