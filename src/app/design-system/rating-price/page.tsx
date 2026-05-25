"use client";

import { PriceDisplay, StarRating } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function RatingPricePage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Rating & Price
			</h1>
			<p className="text-gray-600 mb-8">
				Star rating with review count and formatted price display.
			</p>
			<section aria-labelledby="rating-heading" className="mb-8">
				<h2
					id="rating-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					Star Rating
				</h2>
				<div className="flex items-center gap-6 flex-wrap">
					<StarRating rating={4.9} reviewCount={100} size="sm" />
					<StarRating rating={4.5} reviewCount={2340} size="md" />
					<StarRating rating={5} />
					<StarRating rating={3.2} reviewCount={8} size="sm" />
				</div>
			</section>
			<section aria-labelledby="price-heading" className="mb-8">
				<h2
					id="price-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					Price Display
				</h2>
				<div className="flex items-center gap-8 flex-wrap">
					<PriceDisplay
						price={9_200_000}
						originalPrice={12_200_000}
						discount="-30%"
						size="sm"
					/>
					<PriceDisplay
						price={28_990_000}
						originalPrice={34_990_000}
						discount="-17%"
						size="md"
					/>
					<PriceDisplay price={63_990_000} size="lg" />
				</div>
			</section>
			<CodeSnippet
				code={`import { StarRating, PriceDisplay } from "@/components/common";

<StarRating rating={4.5} reviewCount={120} />
<PriceDisplay price={9200000} originalPrice={12200000} discount="-30%" />`}
			/>
		</div>
	);
}
