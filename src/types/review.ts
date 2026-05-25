/** Single review item from GET /fe/product-reviews */
export interface ReviewItem {
	id: string;
	rating: number;
	content: string;
	customerName: string;
	createdAt: string; // ISO datetime
}

/** Paginated response from GET /fe/product-reviews */
export interface ReviewListResponse {
	data: ReviewItem[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

/** Payload for POST /fe/product-reviews */
export interface CreateReviewPayload {
	productId: string;
	rating: number;
	content?: string;
	customerName?: string;
}

/** Summary data passed from product detail (already on ProductDetail type) */
export interface ReviewSummary {
	avgRating: string | null;
	reviewCount: number;
	rating5Count: number;
	rating4Count: number;
	rating3Count: number;
	rating2Count: number;
	rating1Count: number;
}
