import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { getImageUrl } from "@/lib/utils/image";
import type { GroupedSection } from "@/types/page";

interface NewsPostLite {
	id: number;
	title: string;
	slug: string;
	shortDescription?: string | null;
	featuredImage?: string | null;
}

interface NewsSectionExtra {
	cols?: 3 | 4 | 5;
	rows?: 1 | 2;
	showTitle?: boolean;
	mode?: "auto" | "manual";
	postListId?: number;
	limit?: number;
	posts?: NewsPostLite[];
}

interface NewsSectionProps {
	group: GroupedSection;
}

const COLS_CLASS: Record<3 | 4 | 5, string> = {
	3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
	4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
	5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

function toHref(slug: string): string {
	if (!slug) return "#";
	if (slug.startsWith("/") || slug.startsWith("http")) return slug;
	return `/${slug}`;
}

export default function NewsSection({ group }: NewsSectionProps) {
	const { section } = group;
	const extra = (section.extra ?? {}) as NewsSectionExtra;
	const cols: 3 | 4 | 5 =
		extra.cols === 3 || extra.cols === 5 ? extra.cols : 4;
	const rows: 1 | 2 = extra.rows === 2 ? 2 : 1;
	const totalSlots = cols * rows;
	const posts = (extra.posts ?? []).slice(0, totalSlots);

	if (posts.length === 0) return null;

	const showTitle = extra.showTitle !== false;
	const sectionTitle = section.name || "Tin tức";
	const viewAllHref = section.url?.trim() || null;

	return (
		<section className="rounded-2xl bg-white p-4 md:p-6">
			{showTitle && (
				<header className="mb-5 flex items-center justify-between gap-3 md:mb-6">
					<h2 className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600 md:text-sm">
						<Newspaper className="size-3.5" aria-hidden="true" />
						{sectionTitle}
					</h2>
					{viewAllHref && (
						<Link
							href={viewAllHref}
							className="group inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
						>
							Xem tất cả
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					)}
				</header>
			)}

			<ul className={cn("grid gap-3 md:gap-4", COLS_CLASS[cols])}>
				{posts.map((post) => (
					<NewsCard key={post.id} post={post} />
				))}
			</ul>
		</section>
	);
}

function NewsCard({ post }: { post: NewsPostLite }) {
	const href = toHref(post.slug);
	const imageSrc = getImageUrl(post.featuredImage ?? "") || null;

	return (
		<li className="group">
			<Link
				href={href}
				className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
				aria-label={post.title}
			>
				{/* Image */}
				<div className="relative aspect-video w-full overflow-hidden bg-gray-100">
					{imageSrc ? (
						<>
							<Image
								src={imageSrc}
								alt={post.title}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							{/* Gradient overlay (bottom) — magazine feel */}
							<div
								aria-hidden="true"
								className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							/>
						</>
					) : (
						<div
							aria-hidden="true"
							className="flex h-full w-full items-center justify-center"
						>
							<Newspaper className="size-10 text-gray-300" />
						</div>
					)}
				</div>

				{/* Body */}
				<div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
					<h3 className="line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary-600 md:text-base md:min-h-[2.8em]">
						{post.title}
					</h3>
					{post.shortDescription && (
						<p className="line-clamp-2 text-xs leading-relaxed text-gray-500 md:text-sm">
							{post.shortDescription}
						</p>
					)}
					<div className="mt-auto flex items-center gap-1 pt-2 text-xs font-medium text-primary-600">
						<span>Đọc tiếp</span>
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</Link>
		</li>
	);
}
