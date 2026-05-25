import Carousel from "@/components/common/Carousel";
import type { GroupedSection, PageSectionItem } from "@/types/page";
import SlideImage from "../../common/SlideImage";
import { toBannerSlides } from "./banner-utils";

function splitHeroBannerItems(items: PageSectionItem[]) {
	const main: PageSectionItem[] = [];
	const side: PageSectionItem[] = [];

	for (const item of items) {
		if (item.type === "banner") {
			side.push(item);
		} else {
			main.push(item);
		}
	}

	return { main, side };
}

export default function HeroBannerSection({
	group,
}: {
	group: GroupedSection;
}) {
	const { section, items } = group;
	const { main, side } = splitHeroBannerItems(items);
	const slides = toBannerSlides(main);
	const sideBanners = toBannerSlides(side);
	if (slides.length === 0) return null;

	const autoPlay =
		section.extra?.autoSlide === false ||
		section.extra?.autoScroll === false
			? 0
			: 5000;

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-stretch">
			<Carousel
				autoPlay={autoPlay}
				showDots={slides.length > 1}
				showNav={slides.length > 1}
				navVisibility="hover"
				loop
				gap={0}
				slidesPerView={1}
				className="relative aspect-[2.32/1] w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm md:w-[880px] md:max-w-[880px]"
			>
				{slides.map((slide, i) => (
					<div key={slide.id} className="relative size-full">
						<SlideImage
							slide={slide}
							priority={i <= 1}
							className="size-full object-cover"
						/>
					</div>
				))}
			</Carousel>

			{sideBanners.length > 0 && (
				<div className="hidden md:flex h-[200px] w-full shrink-0 flex-col md:h-auto md:min-h-0 md:w-[304px] md:self-stretch">
					<Carousel
						autoPlay={autoPlay}
						showDots={sideBanners.length > 1}
						showNav={sideBanners.length > 1}
						navVisibility="hover"
						loop={sideBanners.length > 1}
						gap={0}
						slidesPerView={1}
						className="relative size-full min-h-[120px] rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm"
					>
						{sideBanners.map((sb, i) => (
							<div
								key={sb.id}
								className="relative h-full min-h-[120px]"
							>
								<SlideImage
									slide={sb}
									priority={i <= 1}
									className="size-full object-cover"
								/>
							</div>
						))}
					</Carousel>
				</div>
			)}
		</div>
	);
}
