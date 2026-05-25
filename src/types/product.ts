import type { ProductPreOrderFormModeEnum } from "@/constants/pre-order.constant";

// ── Product Enums ──
// Synced with: ddv-web-api/src/common/enums/product.enum.ts

export enum ProductStatus {
	PUBLISHED = "PUBLISHED",
	DRAFT = "DRAFT",
	ARCHIVED = "ARCHIVED",
	OUT_OF_STOCK = "OUT_OF_STOCK",
}

// ── Product Combo Types ──

export interface ProductComboItemVariant {
	id: string;
	sku: string;
	thumbnailUrl: string | null;
	attributes: { value: string | null; attributeLabel: string | null }[];
}

export interface ProductComboItemProduct {
	id: string;
	name: string;
	thumbnailUrl: string | null;
	urlPath: string | null;
}

export interface ProductComboItem {
	id: string;
	quantity: number;
	priceSnapshot: string;
	product: ProductComboItemProduct | null;
	variant: ProductComboItemVariant | null;
}

export interface ProductCombo {
	id: string;
	originalPrice: string;
	listedPrice: string;
	price: string;
	effectivePrice: string | null;
	sellingPrice: string;
	saveAmount: string;
	savePercent: string;
	productComboItems: ProductComboItem[];
}

// ── Discount Program (Flash Sale) Types ──

/** Per-variant pricing and slot data within a discount program */
export interface DiscountProgramVariantSlot {
	salePrice: number; // Frozen final price
	originalPrice: number; // Original variant price
	discountAmount: number; // Discount value
	discountType: string | null; // "1"=fixed, "2"=percentage
	isLimitedSlots: boolean; // true = limited quota, false = unlimited
	totalSlots: number; // Initial quota
	usedSlots: number; // Sold count (from Redis real-time)
	remainingSlots: number; // totalSlots - usedSlots
	priceVersion: number; // For cart validation
}

/** Program-level discount info with per-variant slot data */
export interface DiscountProgram {
	id: number; // Program web ID
	name: string; // e.g. "Flash Sale 12h"
	programStatus: string; // "RUNNING"
	startAt: string | null; // ISO datetime
	endAt: string | null; // ISO datetime (for countdown)
	startTime: string | null; // "08:00" (daily window)
	endTime: string | null; // "12:00" (daily window)
	variantSlots: Record<string, DiscountProgramVariantSlot>; // keyed by variant ID
}

// ── Product Detail Types ──
// Synced with: ddv-web-api-v2/src/modules/slug/services/slug-resolve.service.ts → findProductForFE()

export interface ProductDetail {
	// Base fields
	id: string;
	name: string;
	slug: string;
	thumbnailUrl: string | null;
	urlPath: string;
	shortDescription: string | null;
	description: string | null;
	conditionNote: string | null;
	warrantyNote: string | null;
	promotionDesc: string | null;
	promotionInfo: string | null;
	banners: unknown[] | null;

	minPrice: number;
	maxPrice: number;
	stock: number;
	productType: string;
	rootCategoryId: string | null;
	status: number;

	avgRating: string | null; // "4.5"
	reviewCount: number;
	rating5Count: number;
	rating4Count: number;
	rating3Count: number;
	rating2Count: number;
	rating1Count: number;
	viewCount: number;
	soldCount: number;
	brandId: string | null;

	// Installment
	isInstallment?: boolean;

	// SEO
	seoTitle: string | null;
	seoDescription: string | null;
	seoImage: string | null;
	seoKeywords: string | null;
	seoBaseSchema: Record<string, unknown> | null;
	canonicalUrl: string | null;

	// Enriched
	images: ProductImage[];
	variants: ProductVariant[];
	specifications: ProductSpecification[];
	brand: ProductBrand | null;
	breadcrumbs?: { id: number; name: string; slug: string }[];
	productGroup: ProductGroup | null;
	primaryCategoryId?: number | null;
	tradeIn: ProductTradeIn | null;
	relatedProducts: RelatedProduct[];
	productCombo?: ProductCombo | null;
	discountProgram?: DiscountProgram | null;
}

export interface RelatedProduct {
	id: string;
	name: string;
	slug: string;
	urlPath: string;
	thumbnailUrl: string | null;
	minPrice: number;
	maxPrice: number;
	avgRating: string | null;
	reviewCount: number;
	status: number;
}

export interface ProductTradeIn {
	price: number;
	subsidy: number;
}

export interface ProductImage {
	id: number;
	imageUrl: string; // absolute CDN URL from backend
	altText: string | null;
	priority: number;
	productVariantId: string | null; // null = product-level image
}

export interface ProductVariant {
	id: string; // UUID
	productId: string;
	thumbnailUrl: string | null;
	sku: string;
	price: number; // base price (VND)
	effectivePrice: number | null; // discount program price (null if none)
	sellingPrice: number; // = effectivePrice || price
	originalPrice: number | null; // original price before any adjustment
	listedPrice: number | null; // MSRP / listed price
	stockQuantity: number;
	isVisible: boolean;
	coreOriginalName: string | null;
	images: VariantImage[];
	attributes: VariantAttribute[];
	warrantyOptions: WarrantyOption[];
	preOrderMode?: ProductPreOrderFormModeEnum;
}

export interface WarrantyOption {
	id: string;
	name: string;
	price: number;
	originalPrice: number;
	thumbnailUrl: string | null;
	sku: string;
	productId: string;
}

export interface VariantImage {
	id: number;
	imageUrl: string;
	altText: string | null;
}

export interface VariantAttribute {
	id: number | null;
	value: string | null;
	meta: Record<string, unknown> | null;
	attributeId: string | null;
	attributeLabel: string | null;
}

export interface ProductBrand {
	id: string;
	name: string;
	thumbnail: string | null;
	slug: string;
}

export interface ProductGroup {
	groupId: string;
	items: ProductGroupItem[];
}

export interface ProductGroupItem {
	productId: string;
	alias: string | null;
	sortOrder: number;
	isCurrent: boolean;
	product: {
		id: string;
		name: string;
		thumbnailUrl: string | null;
		minPrice: number;
		maxPrice: number;
		slug: string;
		urlPath: string;
		status: string;
	} | null;
}

export interface ProductSpecification {
	id: string;
	name: string; // e.g., "Chip xử lý", "Kích thước màn hình"
	value: string; // e.g., "Apple A18 Pro", "6.9 inch"
	groupName: string; // e.g., "Màn hình & Bộ xử lý"
	priority: number; // lower = higher priority
	groupPriority: number;
}

// Backward-compatible alias (some older code may refer to `Product`)
export type Product = ProductDetail;

// Review/comment-related types are out of this PDP hero spec (kept out intentionally)

// ── Category Types ──
// Mapped from: ddv-web-api-v2/src/modules/category/entities/

export interface Category {
	id: number;
	name: string;
	slug: string;
	parentId?: number;
	children?: Category[];
	facets?: CategoryFacet[];
}

export interface CategoryFacet {
	id: number;
	name: string;
	values: CategoryFacetValue[];
}

export interface CategoryFacetValue {
	id: number;
	value: string;
}

// ── Brand Types ──
// Mapped from: ddv-web-api-v2/src/modules/brand/entities/

export interface Brand {
	id: number;
	name: string;
	slug?: string;
	logo?: string;
}

// ── Recently Viewed Types ──
// Synced with: POST /fe/products/by-ids response

export interface RecentlyViewedProductInfo {
	id: string;
	name: string;
	slug: string;
	urlPath: string;
	thumbnailUrl: string | null;
	minPrice: string;
	maxPrice: string;
	status: number; // 1 = active, 0 = inactive/deleted
	listedPrice?: string;
	isInstallmentZero?: boolean;
	createdAt?: string;
}
