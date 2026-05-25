import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/common/Carousel";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { cn } from "@/lib/utils/cn";
import { getImageUrl } from "@/lib/utils/image";
import {
	getPageSectionItemsForViewport,
	parseSectionItemData,
} from "@/lib/utils/page-sections";
import type { LinkItemData, PageSectionItem } from "@/types/page";

interface PromotionGridProps {
	items: PageSectionItem[];
	title?: string;
	/** Number of items visible at once (from CMS extra.slidesPerView) */
	slidesPerView?: number;
	/** Enable auto-scroll (from CMS extra.autoScroll) */
	autoScroll?: boolean;
	isMobile?: boolean;
}

const DEFAULT_MOBILE_SLIDES_PER_VIEW = 2;

export default function PromotionGrid({
	items,
	title,
	slidesPerView = 0,
	autoScroll = false,
	isMobile = false,
}: PromotionGridProps) {
	if (!items || items.length === 0) return null;
	const itemsToShow = getPageSectionItemsForViewport(items, isMobile);

	const effectiveSlidesPerView = isMobile
		? DEFAULT_MOBILE_SLIDES_PER_VIEW
		: slidesPerView;

	return (
		<SectionWrapper title={title} className="max-w-full">
			<Carousel
				gap={8}
				slidesPerView={effectiveSlidesPerView}
				autoPlay={autoScroll ? 5000 : 0}
				showNav={true}
				navSize="sm"
				navPosition="inside"
				className="w-full"
			>
				{itemsToShow.map((item) => {
					const data = parseSectionItemData<LinkItemData>(item);
					const iconOrImage =
						data?.icon ||
						(data as any)?.image ||
						(data as any)?.imageUrl;
					if (!iconOrImage) return null;

					const src = getImageUrl(iconOrImage);
					if (!src) return null;

					return (
						<Link
							key={item.id}
							href={data?.url ?? item.targetUrl ?? "/"}
							className={cn(
								"shrink-0 bg-white flex flex-col gap-2 rounded-lg group/item",
								effectiveSlidesPerView > 0
									? "w-full"
									: "w-[140px] md:w-[180px]",
							)}
							prefetch={false}
						>
							<div className="aspect-square flex items-center overflow-hidden relative rounded w-full bg-gray-50">
								<Image
									src={src}
									alt={item.name || "Promotion"}
									fill
									className="object-cover group-hover/item:scale-105 transition-transform duration-300"
									sizes="(max-width: 768px) 140px, 20vw"
								/>
							</div>
							<div className="flex flex-col gap-2 items-center w-full mt-1">
								<p className="font-medium md:font-bold text-sm text-left text-gray-900 truncate w-full px-1">
									{item.name}
								</p>
							</div>
						</Link>
					);
				})}
			</Carousel>
		</SectionWrapper>
	);
}
