// Category page API response types — /fe/categories/:slug

/**
 * Sản phẩm Flash Sale từ API /fe/categories/:slug/flash-sale
 * Trả về giá flash, quota/sold real-time từ Redis.
 */
export interface FlashSaleProductItem {
	id: string;
	name: string;
	slug: string;
	urlPath: string | null;
	thumbnailUrl: string | null;
	variantId: string;
	/** Giá Flash Sale (effectivePrice) */
	flashPrice: number;
	/** Giá gốc niêm yết */
	originalPrice: number;
	/** Phần trăm giảm giá, ví dụ 20 = 20% */
	discountPercent: number;
	/** Số suất còn lại (real-time Redis, fallback DB) */
	quota: number;
	/** Số đã bán trong chương trình */
	sold: number;
	/** Tổng số suất ban đầu */
	initialQuota: number;
	isLimitUse: boolean;
	/** false nếu Redis state != RUNNING hoặc hết quota */
	isActive: boolean;
	programId: number;
}

export interface CategoryPageProductItem {
	id: string;
	name: string;
	slug: string;
	/** Legacy field từ DDV — acquyhn không có, dùng `slug` để build href. */
	urlPath?: string | null;
	thumbnailUrl: string | null;
	/** Giá gốc — gạch ngang nếu có salePrice */
	price?: number | string;
	/** Giá khuyến mãi — giá đang bán */
	salePrice?: number | string | null;
	minPrice?: string;
	maxPrice?: string;
	listedPrice?: string | number;
	averageRating?: string | number | null;
	reviewCount?: number;
	promotionInfo?: string | null;
	soldCount?: number;
	viewCount?: number;
	status?: string;
	brandId?: number | null;
}

export interface CategoryPageChild {
	id: number;
	name: string;
	slug: string;
	iconUrl?: string;
	thumbnailUrl?: string | null;
	priority?: number;
}

export interface CategoryPageBreadcrumb {
	id: number;
	name: string;
	slug: string;
}

export interface CategoryPageResponse {
	id: number;
	name: string;
	slug: string;
	parentId?: number | null;
	idPath?: string;
	level?: number;
	priority?: number;
	iconUrl?: string;
	thumbnailUrl?: string | null;
	description?: string;
	canonicalUrl?: string;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	postTagCode?: string;
	status?: number;
	children: CategoryPageChild[];
	breadcrumbs: CategoryPageBreadcrumb[];
	filters: unknown[];
	products: {
		items: CategoryPageProductItem[];
		total: number;
		page: number;
		limit: number;
	};
}
