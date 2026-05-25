import Image from "next/image";
import Carousel from "@/components/common/Carousel";
import CategoryGrid from "@/components/feature/home/CategoryGrid";
import DealHotSection from "@/components/feature/home/DealHotSection";
import FlashSale from "@/components/feature/home/FlashSale";
import BoxDanhMucSection from "@/components/feature/home/BoxDanhMucSection";
import HeroBannerSection from "@/components/feature/home/HeroBannerSection";
import NewsSection from "@/components/feature/home/NewsSection";
import ProductTabbedSection from "@/components/feature/home/ProductTabbedSection";
import PromoBannerSection from "@/components/feature/home/PromoBannerSection";
import PromotionGrid from "@/components/feature/home/PromotionGrid";
import RecentlyViewedSection from "@/components/feature/recently-viewed/views/RecentlyViewedSection";
import { isMobileUA } from "@/lib/utils/device";
import { getImageUrl } from "@/lib/utils/image";
import { parseSectionItemData } from "@/lib/utils/page-sections";
import type {
	BannerItemData,
	GroupedSection,
	PageSectionItem,
} from "@/types/page";
import { PageSectionKey } from "@/types/page";
import SlideImage from "../../common/SlideImage";
import { toBannerSlides } from "./banner-utils";

/* ─────────── Banner grid (multi-column) ─────────── */

interface BannerPosition {
	position: number;
	name: string;
	desktopUrl: string;
	mobileUrl: string;
	href?: string;
}

function groupBannersByPosition(items: PageSectionItem[]): BannerPosition[] {
	const map = new Map<number, BannerPosition>();

	for (const item of items) {
		const d = parseSectionItemData<BannerItemData>(item);
		const rawUrl = d?.imageUrl ?? d?.image;
		if (!rawUrl) continue;
		const url = getImageUrl(rawUrl);
		if (!url) continue;

		let entry = map.get(item.position);
		if (!entry) {
			entry = {
				position: item.position,
				name: item.name || "Banner",
				desktopUrl: "",
				mobileUrl: "",
				href: d?.link ?? item.targetUrl,
			};
			map.set(item.position, entry);
		}

		if (item.deviceType === "mobile") {
			entry.mobileUrl = url;
		} else {
			entry.desktopUrl = url;
		}
	}

	return Array.from(map.values())
		.sort((a, b) => a.position - b.position)
		.filter((p) => p.desktopUrl || p.mobileUrl);
}

function chunkSlides<T>(items: T[], size: number): T[][] {
	if (size <= 0) return [items];
	const out: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		out.push(items.slice(i, i + size));
	}
	return out;
}

function BannerGrid({ group }: { group: GroupedSection }) {
	const { section, items } = group;
	const cols = Number(section.extra?.slidesPerView) || 3;
	const positions = groupBannersByPosition(items);
	if (positions.length === 0) return null;

	const slides = toBannerSlides(items);
	const groupSize = Math.min(cols, slides.length);
	const pages = chunkSlides(slides, groupSize);
	const autoSlide = Boolean(section.extra?.autoSlide);
	const canScroll = pages.length > 1;

	return (
		<Carousel
			autoPlay={autoSlide && canScroll ? 5000 : 0}
			showDots={canScroll}
			showNav={canScroll}
			navVisibility="hover"
			loop={canScroll}
			gap={16}
			slidesPerView={1}
			className="relative w-full"
		>
			{pages.map((pageSlides, pageIdx) => (
				<div
					key={`banner-grid-page-${pageIdx}`}
					className="flex min-h-0 w-full min-w-0 flex-col gap-4 md:flex-row md:gap-4"
				>
					{pageSlides.map((slide, i) => (
						<div
							key={slide.id}
							className="relative w-full min-w-0 shrink-0 overflow-hidden rounded-lg bg-gray-100 aspect-[3/1] md:flex-1 md:basis-0"
						>
							<SlideImage
								slide={slide}
								priority={pageIdx === 0 && i < groupSize}
							/>
						</div>
					))}
				</div>
			))}
		</Carousel>
	);
}

/* ─────────────── Section renderers ─────────────── */

function renderSection(group: GroupedSection, isMobile: boolean) {
	const { section, items } = group;
	const key = section.key;

	/** CMS sections without `key` — e.g. “Deal hot” link tiles (Figma: recommeded) */
	if (!key && section.type === "link_item" && items.length > 0) {
		return <DealHotSection group={group} dismissible={false} />;
	}

	switch (key) {
		case PageSectionKey.HERO_BANNER:
			return <HeroBannerSection group={group} />;

		case PageSectionKey.PROMO_BANNER:
			return <PromoBannerSection group={group} />;

		case PageSectionKey.CATEGORY_GRID:
			return <CategoryGrid group={group} />;

		case PageSectionKey.RECENTLY_VIEWED:
			return <RecentlyViewedSection />;

		case PageSectionKey.PROMOTION_GRID:
			return (
				<PromotionGrid
					items={items}
					title={section.name}
					slidesPerView={Number(section.extra?.slidesPerView) || 0}
					autoScroll={Boolean(section.extra?.autoScroll)}
					isMobile={isMobile}
				/>
			);
		case PageSectionKey.FLASH_SALE:
			return <FlashSale group={group} />;

		case PageSectionKey.NEWS:
			return <NewsSection group={group} />;

		case PageSectionKey.BOX_DANH_MUC:
			return <BoxDanhMucSection group={group} />;

		default:
			if (section.type === "product") {
				return <ProductTabbedSection group={group} />;
			}
			if (section.type === "banner") {
				const slidesPerView = Number(section.extra?.slidesPerView) || 1;

				if (slidesPerView > 1) {
					return <BannerGrid group={group} />;
				}

				const desktopItems = items.filter(
					(it) =>
						it.deviceType === "desktop" || it.deviceType === "all",
				);
				const slides = toBannerSlides(
					desktopItems.length > 0 ? desktopItems : items,
				);
				if (slides.length === 0) return null;

				const autoSlide = Boolean(section.extra?.autoSlide);
				return (
					<Carousel
						autoPlay={autoSlide ? 5000 : 0}
						showDots={slides.length > 1}
						showNav={slides.length > 1}
						navVisibility="hover"
						loop
						gap={0}
						slidesPerView={slidesPerView}
						className="relative w-full rounded-lg overflow-hidden bg-gray-100"
					>
						{slides.map((slide, idx) => {
							const isFirst = idx === 0;
							const imageEl = (
								<Image
									src={getImageUrl(slide.imageUrl)}
									alt={slide.alt}
									width={2172}
									height={724}
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
									priority={isFirst}
									fetchPriority={isFirst ? "high" : "auto"}
									loading={isFirst ? "eager" : "lazy"}
									className="w-full h-auto object-contain"
								/>
							);
							return slide.href ? (
								<a
									key={slide.id}
									href={slide.href}
									target={slide.target}
									rel={
										slide.target === "_blank"
											? "noopener noreferrer"
											: undefined
									}
									className="block w-full"
								>
									{imageEl}
								</a>
							) : (
								<div key={slide.id} className="w-full">
									{imageEl}
								</div>
							);
						})}
					</Carousel>
				);
			}
			return <SectionPlaceholder group={group} />;
	}
}

/* ─────────────── Placeholder (dev) ─────────────── */

function SectionPlaceholder({ group }: { group: GroupedSection }) {
	const { section, items } = group;
	return (
		<div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-4">
			<div className="mb-2 flex items-center gap-2">
				<span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
					{section.type}
				</span>
				{section.key && (
					<span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
						{section.key}
					</span>
				)}
				<span className="text-sm font-medium text-gray-700">
					{section.name ?? `Section #${section.id}`}
				</span>
				<span className="ml-auto text-xs text-gray-400">
					pos {section.position} · {items.length} item(s)
				</span>
			</div>
			<pre className="max-h-60 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-600">
				{JSON.stringify({ section, items }, null, 2)}
			</pre>
		</div>
	);
}

/* ─────────────── PageRenderer ─────────────── */

interface PageRendererProps {
	sections: GroupedSection[];
	heroFromLayout?: GroupedSection | null;
}

export default async function PageRenderer({
	sections,
	heroFromLayout = null,
}: PageRendererProps) {
	if (sections.length === 0) return null;
	const isMobile = await isMobileUA();

	// We render RecentlyViewed right under Hero on Homepage.
	// Filter it out from CMS sections to avoid duplicates / wrong placement.
	const nonHeroSections = sections.filter(
		(g) =>
			g.section.key !== PageSectionKey.HERO_BANNER &&
			g.section.key !== PageSectionKey.RECENTLY_VIEWED,
	);

	return (
		<div className="container-inner flex flex-col gap-2 md:gap-4 py-2 md:py-4">
			{heroFromLayout && (
				<div key={`layout-hero-${heroFromLayout.section.id}`}>
					{renderSection(heroFromLayout, isMobile)}
				</div>
			)}
			<RecentlyViewedSection />
			{nonHeroSections.map((group) => (
				<div key={group.section.id}>
					{renderSection(group, isMobile)}
				</div>
			))}
		</div>
	);
}
