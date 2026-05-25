import { SearchInput } from "./components/search-input.client";
import { SearchPanel } from "./components/search-panel.client";
import {
	HistorySection,
	RecommendedProductsSection,
	ResultsCategoriesSection,
	ResultsProductsSection,
	SuggestedKeywordsSection,
	TrendingSection,
} from "./components/sections";
import { SearchProvider } from "./context/search-provider.client";
import { HeaderSearchDesktop } from "./views/header-search-desktop.client";
import { HeaderSearchMobile } from "./views/header-search-mobile.client";
import { SearchInitialContent } from "./views/search-initial-content";
import { SearchInitialSlot } from "./views/search-initial-slot.client";
import { SearchResults } from "./views/search-results.client";

export const Search = {
	Root: SearchProvider,
	Input: SearchInput,
	Panel: SearchPanel,
	InitialSlot: SearchInitialSlot,
	InitialContent: SearchInitialContent,
	Results: SearchResults,
	HeaderDesktop: HeaderSearchDesktop,
	HeaderMobile: HeaderSearchMobile,
	History: HistorySection,
	SuggestedKeywords: SuggestedKeywordsSection,
	Trending: TrendingSection,
	RecommendedProducts: RecommendedProductsSection,
	ResultsCategories: ResultsCategoriesSection,
	ResultsProducts: ResultsProductsSection,
};

export { SearchInput } from "./components/search-input.client";
export { SearchPanel } from "./components/search-panel.client";
export {
	HistorySection,
	RecommendedProductsSection,
	ResultsCategoriesSection,
	ResultsProductsSection,
	SuggestedKeywordsSection,
	TrendingSection,
} from "./components/sections";
export type { SearchContextValue } from "./context/search-provider.client";
export {
	SearchContext,
	SearchProvider,
} from "./context/search-provider.client";
export { HeaderSearchDesktop } from "./views/header-search-desktop.client";
export { HeaderSearchMobile } from "./views/header-search-mobile.client";
export { SearchInitialContent } from "./views/search-initial-content";
export { SearchInitialSlot } from "./views/search-initial-slot.client";
export { SearchResults } from "./views/search-results.client";
