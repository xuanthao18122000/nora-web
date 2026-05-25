// Search API response types — /fe/search
// Fields must match PRODUCT_SEARCH_SOURCE_FIELDS and CATEGORY_SEARCH_SOURCE_FIELDS
// in ddv-web-api/src/modules/elasticsearch-sync/constants/elasticsearch-sync.constants.ts

export interface SearchProductDiscountProgram {
	id: number;
	name: string;
	startAt: string | null;
	endAt: string | null;
	startTime: string | null;
	endTime: string | null;
	maxQuota: number;
	totalUsed: number;
	originalPrice: number | null;
}

export interface SearchProductItem {
	id: string;
	name: string;
	slug: string;
	urlPath: string;
	thumbnailUrl: string | null;
	minPrice: number;
	maxPrice: number;
	listedPrice?: number;
	wholesalePrice?: number;
	stock?: number;
	productType?: string;
	avgRating?: number | null;
	maxDiscountPercent?: number | null;
	discountProgram?: SearchProductDiscountProgram | null;
	isInstallmentZero?: boolean;
	createdAt?: string;
	_score?: number;
}

export interface SearchCategoryItem {
	id: number;
	name: string;
	slug: string;
	thumbnailUrl?: string | null;
	iconUrl?: string | null;
	parentId?: number;
	level?: number;
	idPath?: string;
	_score?: number;
}

export interface SearchResponse {
	products: {
		total: number;
		items: SearchProductItem[];
		page: number;
		limit: number;
	};
	categories: {
		total: number;
		items: SearchCategoryItem[];
		page: number;
		limit: number;
	};
}

// =====================================================================
// Search Trends
// =====================================================================

export interface TrendingKeyword {
	keyword: string;
	searchCount: number;
}

export interface SearchTrendsResponse {
	period: "24h" | "7d";
	keywords: TrendingKeyword[];
	cachedAt: string;
}

// =====================================================================
// Keyword Suggestions
// =====================================================================

export interface SuggestedKeyword {
	keyword: string;
	score: number;
}

export interface SearchSuggestionsResponse {
	keywords: SuggestedKeyword[];
	cachedAt: string;
}

// =====================================================================
// Guest Recommendations
// =====================================================================

export interface GuestRecommendationsResponse {
	strategy: "session" | "popularity";
	products: SearchProductItem[];
}

// =====================================================================
// Combined Initial Data (SSR)
// =====================================================================

export interface SearchInitialData {
	trends: TrendingKeyword[];
	suggestions: SuggestedKeyword[];
	recommendedProducts: SearchProductItem[];
}
