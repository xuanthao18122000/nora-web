import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";
import type { BannerSlide } from "../feature/home/banner-utils";

export default function SlideImage({
	slide,
	priority = false,
	className,
}: {
	slide: BannerSlide;
	priority?: boolean;
	className?: string;
}) {
	const mobileUrl = slide.mobileImageUrl;
	const hasMobileVariant = Boolean(mobileUrl && mobileUrl !== slide.imageUrl);

	const content = slide.imageUrl ? (
		<>
			<Image
				src={getImageUrl(slide.imageUrl)}
				alt={slide.alt}
				fill
				sizes="(max-width: 768px) 100vw, 900px"
				className={cn(
					"object-cover",
					hasMobileVariant ? "hidden sm:block" : undefined,
					className,
				)}
				priority={priority}
				quality={70}
				loading={priority ? "eager" : "lazy"}
				fetchPriority={priority ? "high" : "auto"}
			/>
			{hasMobileVariant && mobileUrl && (
				<Image
					src={getImageUrl(mobileUrl)}
					alt={slide.alt}
					fill
					sizes="100vw"
					className={cn("object-cover sm:hidden", className)}
					priority={priority}
					quality={70}
					loading={priority ? "eager" : "lazy"}
					fetchPriority={priority ? "high" : "auto"}
				/>
			)}
		</>
	) : (
		<div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-600 text-sm select-none">
			{slide.alt || "Banner"}
		</div>
	);

	if (slide.href) {
		return (
			<a
				href={slide.href}
				target={slide.target}
				rel={
					slide.target === "_blank"
						? "noopener noreferrer"
						: undefined
				}
				className="block absolute inset-0"
			>
				{content}
			</a>
		);
	}
	return content;
}
