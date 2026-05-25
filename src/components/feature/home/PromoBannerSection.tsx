import Carousel from "@/components/common/Carousel";
import type { GroupedSection } from "@/types/page";
import SlideImage from "../../common/SlideImage";
import { toBannerSlides } from "./banner-utils";

export default function PromoBannerSection({
	group,
}: {
	group: GroupedSection;
}) {
	const { section, items } = group;
	const slides = toBannerSlides(items);
	if (slides.length === 0) return null;

	const autoPlay = Boolean(
		section.extra?.autoSlide ?? section.extra?.autoScroll,
	);

	return (
		<Carousel
			autoPlay={autoPlay ? 5000 : 0}
			showDots={slides.length > 1}
			showNav={false}
			loop
			gap={0}
			slidesPerView={1}
			className="relative h-[200px] md:h-[380px] rounded-lg overflow-hidden bg-gray-100"
		>
			{slides.map((slide, i) => (
				<div key={slide.id} className="relative h-full">
					<SlideImage slide={slide} priority={i === 0} />
				</div>
			))}
		</Carousel>
	);
}
