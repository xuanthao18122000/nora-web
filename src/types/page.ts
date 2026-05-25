// ── Page Types ──
// Mapped from: ddv-web-api-v2/src/modules/page/entities/

// ── Enums ──

/**
 * Synced with: ddv-web-api-v2/src/common/enums/page.enum.ts → PageSectionKeyEnum
 */
export const PageSectionKey = {
	/** Layout (global) */
	LAYOUT_MENU: "layout_menu",
	LAYOUT_KEY_WORD: "layout_key_word",
	LAYOUT_KEY_WORD_FOOTER: "layout_key_word_footer",
	LAYOUT_SEARCH_SUGGESTION: "layout_search_suggestion",
	LAYOUT_FOOTER: "layout_footer",

	/** Homepage sections */
	HERO_BANNER: "hero_banner",
	FLASH_SALE: "flash_sale",
	CATEGORY_GRID: "category_grid",
	KEY_FEATURES: "key_features",
	PROMOTION_GRID: "promotion_grid",
	FEATURED_TABS: "featured_tabs",
	BRAND_SHOWCASE: "brand_showcase",
	PROMO_BANNER: "promo_banner",
	BESTSELLER: "bestseller",
	SUGGESTION: "suggestion",
	RECENTLY_VIEWED: "recently_viewed",
	NEWS: "news",
	BRAND_NAVIGATION: "brand_navigation",
	BOX_DANH_MUC: "box_danh_muc",

	/** Trade in page */
	TRADE_IN_LIST_PRODUCT: "trade_in_list_product",
} as const;

export type PageSectionKeyValue =
	(typeof PageSectionKey)[keyof typeof PageSectionKey];

/**
 * Synced with: PageSectionTypeEnum
 */
export const SectionType = {
	BANNER: "banner",
	PRODUCT: "product",
	LINK_ITEM: "link_item",
	FAQ: "faq",
	TEXT: "text",
} as const;

export type PageSectionType = (typeof SectionType)[keyof typeof SectionType];

/**
 * Synced with: PageSectionItemTypeEnum
 */
export const SectionItemType = {
	LIST_PRODUCTS: "list_products",
	LIST_TABS: "list_tabs",
	BANNER: "banner",
	BANNER_SLIDER: "banner_slider",
	IMAGE_BACKGROUNDS: "image_backgrounds",
	COLOR_BACKGROUND: "color_background",
	BOX_MENU: "box_menu",
	FLASH_SALE_PRODUCT: "flash_sale_product",
	FAQ: "faq",
	TEXT: "text",
	PROMOTION_TILE: "promotion_tile",
	BRAND_LOGO: "brand_logo",
	ARTICLE: "article",
} as const;

export type PageSectionItemType =
	(typeof SectionItemType)[keyof typeof SectionItemType];

/**
 * Synced with: DeviceTypeEnum
 */
export const Device = {
	MOBILE: "mobile",
	DESKTOP: "desktop",
	ALL: "all",
} as const;

export type DeviceType = (typeof Device)[keyof typeof Device];

/**
 * Synced with: PageCodeEnum
 */
export const PageCode = {
	HOME_PAGE: "home_page",
	LAYOUT_PAGE: "layout_page",
	TRADE_IN_PAGE: "trade_in_page",
} as const;

export type PageCodeValue = (typeof PageCode)[keyof typeof PageCode];

// ── Interfaces ──

export interface Page {
	id: string;
	slug: string;
	code?: string;
	type: PageType;
	title?: string;
	status: number;
	pageData?: Record<string, unknown>;
	sections?: PageSection[];
	// SEO
	metaTitle?: string;
	metaDescription?: string;
	seoImage?: string;
	canonicalUrl?: string;
	seoKeywords?: string;
	seoBaseSchema?: Record<string, unknown>;
	description?: string;
	// Flat items from findBySlug API
	items?: PageSectionItem[];
}

/**
 * Synced with: PageTypeEnum
 */
export type PageType = "custom" | "system";

export interface PageSection {
	id: number;
	name?: string;
	key?: string;
	type: PageSectionType;
	extra?: Record<string, unknown>;
	config?: Record<string, unknown>;
	url?: string;
	position: number;
	status?: number;
	items?: PageSectionItem[];
}

export interface PageSectionItem {
	id: number;
	pageSectionId?: number;
	deviceType: DeviceType;
	name: string;
	targetUrl?: string;
	type?: string;
	position: number;
	data?: string | Record<string, unknown>;
	extra?: Record<string, unknown>;
	status?: number;
	section?: PageSection;
}

// ── Grouped Section (reconstructed from flat items) ──

export interface GroupedSection {
	section: PageSection;
	items: PageSectionItem[];
}

// ── Common data shapes parsed from item.data ──

export interface BannerItemData {
	imageUrl?: string;
	/** CMS sometimes stores the URL under `image` instead of `imageUrl` */
	image?: string;
	mobileImageUrl?: string;
	link?: string;
	buttonText?: string;
}

export interface FlashSaleItemData {
	productId?: string;
	slug?: string;
	flashPrice?: number;
	originalPrice?: number;
	maxSlots?: number;
	soldSlots?: number;
}

export interface LinkItemData {
	icon?: string;
	url?: string;
}

export interface FAQItemData {
	question: string;
	answer: string;
}

export interface FlashSaleExtra {
	backgroundColor?: string;
	timeSlots?: Array<{
		startTime: string;
		endTime: string;
		status: "upcoming" | "active" | "ended";
	}>;
}

export interface CategoryGridItem {
	name: string;
	icon: string;
	link: string;
}

export interface CategoryGridGroup {
	title: string;
	viewAllLink?: string;
	viewAllText?: string;
	items?: CategoryGridItem[];
}

export interface CategoryGridConfig {
	columns?: number;
	groups?: CategoryGridGroup[];
}

/** Typed shape for banner section `extra` field */
export interface BannerSectionExtra {
	autoSlide?: boolean;
	showTitle?: boolean;
	slidesPerView?: number;
}
