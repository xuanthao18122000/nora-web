import { Calendar, Eye } from "lucide-react";
import Image from "next/image";
import { Breadcrumb } from "@/components/common";
import ParseHtmlContent from "@/components/common/ParseHtmlContent";
import { getImageUrl } from "@/lib/utils/image";
import type { ResolvedPost } from "@/types/slug";

interface PostDetailPageWrapperProps {
	post: ResolvedPost;
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

export default function PostDetailPageWrapper({
	post,
}: PostDetailPageWrapperProps) {
	const date = formatDate(post.createdAt);
	const image = post.featuredImage ?? post.thumbnailUrl ?? null;

	return (
		<section className="container-inner mt-4 pb-8">
			<Breadcrumb
				items={[
					{ label: "Trang chủ", href: "/" },
					{ label: post.title },
				]}
			/>

			<article className="mt-4 rounded-2xl bg-white p-5 md:p-8 space-y-4">
				<div
					className={
						image
							? "grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 md:gap-8 items-start"
							: ""
					}
				>
					<div className="space-y-3 min-w-0">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
							{post.title}
						</h1>

						<div className="flex items-center gap-4 text-xs md:text-sm text-gray-400">
							{date && (
								<span className="inline-flex items-center gap-1.5">
									<Calendar className="size-4" />
									{date}
								</span>
							)}
							{typeof post.views === "number" && (
								<span className="inline-flex items-center gap-1.5">
									<Eye className="size-4" />
									{Math.floor(post.views / 3)} lượt xem
								</span>
							)}
						</div>

						{post.shortDescription && (
							<p className="text-base text-gray-600 italic leading-relaxed">
								{post.shortDescription}
							</p>
						)}
					</div>

					{image && (
						<div className="relative w-full aspect-video md:aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
							<Image
								src={getImageUrl(image)}
								alt={post.title}
								fill
								sizes="(max-width: 768px) 100vw, 360px"
								className="object-cover"
								priority
							/>
						</div>
					)}
				</div>

				{post.content && (
					<div className="prose prose-sm md:prose-base max-w-none text-gray-800 border-t border-gray-100 pt-5">
						<ParseHtmlContent
							html={post.content}
							alwaysExpanded
							containerClassName=""
							contentClassName="flex flex-col gap-3"
						/>
					</div>
				)}
			</article>
		</section>
	);
}
