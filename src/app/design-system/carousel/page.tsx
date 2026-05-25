"use client";

import {
	Carousel,
	CarouselNav,
	FlashSaleCard,
	RecentlyViewedCard,
} from "@/components/common";

import CodeSnippet from "../CodeSnippet";

const IMG =
	"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg";

export default function CarouselPage() {
	return (
		<div className="space-y-8">
			<div className="rounded-lg border border-gray-200 bg-white p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Carousel
				</h1>
				<p className="text-gray-600 mb-8">
					Carousel container, nav buttons, and recently viewed card.
				</p>
				<section aria-labelledby="nav-heading" className="mb-8">
					<h2
						id="nav-heading"
						className="text-lg font-semibold text-gray-900 mb-4"
					>
						CarouselNav
					</h2>
					<div className="flex items-center gap-3">
						<CarouselNav direction="prev" size="sm" />
						<CarouselNav direction="next" size="sm" />
						<CarouselNav direction="prev" size="md" />
						<CarouselNav direction="next" size="md" />
						<CarouselNav direction="prev" disabled />
						<CarouselNav direction="next" disabled />
					</div>
				</section>
				<section aria-labelledby="carousel-heading" className="mb-8">
					<h2
						id="carousel-heading"
						className="text-lg font-semibold text-gray-900 mb-4"
					>
						Carousel (Flash Sale Cards)
					</h2>
					<div className="px-6">
						<Carousel gap={12} navSize="sm">
							{[
								{
									name: "Samsung Galaxy A56 5G 8GB/128GB",
									price: "9.200.000 đ",
									originalPrice: "12.200.000 đ",
									discount: "-30%",
									image: IMG,
								},
								{
									name: "iPhone 16 Pro Max 256GB",
									price: "28.990.000 đ",
									originalPrice: "34.990.000 đ",
									discount: "-17%",
									image: IMG,
								},
							].map((card) => (
								<div key={card.name} className="w-[180px]">
									<FlashSaleCard {...card} />
								</div>
							))}
						</Carousel>
					</div>
				</section>
				<section aria-labelledby="recently-heading">
					<h2
						id="recently-heading"
						className="text-lg font-semibold text-gray-900 mb-4"
					>
						Recently Viewed Card
					</h2>
					<div className="px-6">
						<Carousel gap={8} navSize="sm">
							{[
								{
									name: "MacBook Pro 2024 16-inch M4 Pro 14-Core CPU | 20-C...",
									price: "63.990.000 đ",
									imageUrl: IMG,
								},
								{
									name: "iPhone 17 256GB | Chính hãng",
									price: "63.990.000 đ",
									imageUrl: IMG,
								},
							].map((card) => (
								<RecentlyViewedCard
									key={card.name}
									{...card}
									onRemove={() => {}}
								/>
							))}
						</Carousel>
					</div>
				</section>
				<CodeSnippet
					code={`import { Carousel, CarouselNav, RecentlyViewedCard } from "@/components/common";

<Carousel gap={16} navSize="sm">...</Carousel>
<CarouselNav direction="prev" size="md" />
<RecentlyViewedCard name="..." price="..." imageUrl="..." onRemove={() => {}} />`}
				/>
			</div>
		</div>
	);
}
