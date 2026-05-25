import type { SearchInitialData } from "@/types/search";

import {
	HistorySection,
	RecommendedProductsSection,
	SuggestedKeywordsSection,
	TrendingSection,
} from "../components/sections";

interface SearchInitialContentProps {
	initialData?: SearchInitialData;
}

export function SearchInitialContent({
	initialData,
}: SearchInitialContentProps) {
	return (
		<div className="flex w-full flex-col gap-3 p-3 md:gap-4">
			<HistorySection />
			<SuggestedKeywordsSection items={initialData?.suggestions ?? []} />
			<TrendingSection items={initialData?.trends ?? []} />
			<RecommendedProductsSection
				items={initialData?.recommendedProducts ?? []}
			/>
		</div>
	);
}
