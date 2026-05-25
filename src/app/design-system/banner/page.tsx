"use client";

import { Carousel } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function BannerPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Banner Carousel
			</h1>
			<p className="text-gray-600 mb-8">
				Full-width banner slider using Carousel with loop, dots, and
				hover nav.
			</p>
			<section aria-labelledby="banner-full-heading" className="mb-8">
				<h2
					id="banner-full-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					Banner Slider
				</h2>
				<Carousel
					loop
					showDots
					showNav
					navVisibility="hover"
					gap={0}
					slidesPerView={1}
					autoPlay={5000}
					className="relative h-[200px] md:h-[380px] rounded-lg overflow-hidden bg-gray-100"
				>
					{[
						{ id: "1", alt: "Banner 1" },
						{ id: "2", alt: "Banner 2" },
						{ id: "3", alt: "Banner 3" },
					].map((slide) => (
						<div
							key={slide.id}
							className="relative h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm select-none"
						>
							{slide.alt}
						</div>
					))}
				</Carousel>
			</section>
			<section aria-labelledby="banner-only-heading">
				<h2
					id="banner-only-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					No nav (promo style)
				</h2>
				<Carousel
					loop
					showDots
					showNav={false}
					gap={0}
					slidesPerView={1}
					className="relative h-[200px] md:h-[380px] rounded-lg overflow-hidden bg-gray-100"
				>
					{[
						{ id: "a1", alt: "Full width banner" },
						{ id: "a2", alt: "Second slide" },
					].map((slide) => (
						<div
							key={slide.id}
							className="relative h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm select-none"
						>
							{slide.alt}
						</div>
					))}
				</Carousel>
			</section>
			<CodeSnippet
				code={`import { Carousel } from "@/components/common";

<Carousel loop showDots showNav navVisibility="hover" gap={0} slidesPerView={1} autoPlay={5000}
  className="relative h-[380px] rounded-lg overflow-hidden bg-gray-100">
  {slides.map(slide => <div key={slide.id} className="relative h-full">...</div>)}
</Carousel>`}
			/>
		</div>
	);
}
