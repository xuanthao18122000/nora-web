import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import { getImageUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils/cn";

export interface PostCardItem {
	id: number;
	title: string;
	slug: string;
	shortDescription?: string | null;
	featuredImage?: string | null;
	createdAt?: string;
	views?: number;
}

interface PostCardProps {
	post: PostCardItem;
	className?: string;
	/** Layout `vertical` = ảnh trên, text dưới (default). `horizontal` = ảnh trái, text phải. */
	variant?: "vertical" | "horizontal";
}

const formatDate = (s?: string) => {
	if (!s) return "";
	try {
		return new Date(s).toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	} catch {
		return "";
	}
};

const buildHref = (slug: string): Route => {
	const clean = slug.replace(/^\/+/, "").replace(/\.html$/, "");
	return `/${clean}` as Route;
};

export function PostCard({ post, className, variant = "vertical" }: PostCardProps) {
	const href = buildHref(post.slug);
	const date = formatDate(post.createdAt);

	if (variant === "horizontal") {
		return (
			<Link
				href={href}
				className={cn(
					"group flex gap-3 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors p-2",
					className,
				)}
			>
				<div className="relative shrink-0 w-32 sm:w-40 aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
					<Image
						src={
							post.featuredImage
								? getImageUrl(post.featuredImage)
								: "/no-image-available.png"
						}
						alt={post.title}
						fill
						sizes="(max-width: 640px) 128px, 160px"
						className={cn(
							"transition-transform duration-300 group-hover:scale-105",
							post.featuredImage
								? "object-cover"
								: "object-contain p-3 opacity-70",
						)}
					/>
				</div>
				<div className="min-w-0 flex-1 flex flex-col py-1">
					<h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-500 transition-colors">
						{post.title}
					</h3>
					{post.shortDescription && (
						<p className="mt-1 text-xs md:text-sm text-gray-500">
							{post.shortDescription}
						</p>
					)}
					<div className="mt-auto pt-2 flex items-center gap-3 text-xs text-gray-400">
						{date && (
							<span className="inline-flex items-center gap-1">
								<Calendar className="size-3" />
								{date}
							</span>
						)}
						{typeof post.views === "number" && (
							<span className="inline-flex items-center gap-1">
								<Eye className="size-3" />
								{Math.floor(post.views / 3)}
							</span>
						)}
					</div>
				</div>
			</Link>
		);
	}

	return (
		<Link
			href={href}
			className={cn(
				"group flex flex-col rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow",
				className,
			)}
		>
			<div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
				<Image
					src={
						post.featuredImage
							? getImageUrl(post.featuredImage)
							: "/no-image-available.png"
					}
					alt={post.title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className={cn(
						"transition-transform duration-300 group-hover:scale-105",
						post.featuredImage ? "object-cover" : "object-contain p-6 opacity-70",
					)}
				/>
			</div>
			<div className="p-4 flex flex-col flex-1">
				<h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-500 transition-colors">
					{post.title}
				</h3>
				{post.shortDescription && (
					<p className="mt-2 text-sm text-gray-500">
						{post.shortDescription}
					</p>
				)}
				<div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
					{date && (
						<span className="inline-flex items-center gap-1">
							<Calendar className="size-3" />
							{date}
						</span>
					)}
					{typeof post.views === "number" && (
						<span className="inline-flex items-center gap-1">
							<Eye className="size-3" />
							{Math.floor(post.views / 3)}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
