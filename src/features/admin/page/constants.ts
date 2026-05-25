/**
 * Constants tham chiếu CMS gốc — chỉ phần Page System.
 * BE acquyhn lưu type/key dạng string tự do, FE define option đẹp ở đây.
 */

export const PageSectionTypeEnum = {
	BANNER: "banner",
	PRODUCT: "product",
	TEXT: "text",
	FAQ: "faq",
	LINK_ITEM: "link_item",
} as const;
export type PageSectionTypeEnum = (typeof PageSectionTypeEnum)[keyof typeof PageSectionTypeEnum];

export const PageSectionKeyEnum = {
	// Layout
	LAYOUT_MENU: "layout_menu",
	LAYOUT_KEY_WORD: "layout_key_word",
	LAYOUT_KEY_WORD_FOOTER: "layout_key_word_footer",
	LAYOUT_SEARCH_SUGGESTION: "layout_search_suggestion",
	LAYOUT_FOOTER: "layout_footer",

	// Storefront / Home
	HERO_BANNER: "hero_banner",
	PROMOTION_GRID: "promotion_grid",
	BESTSELLER: "bestseller",
	NEWS: "news",
	BRAND_SHOWCASE: "brand_showcase",
	BOX_DANH_MUC: "box_danh_muc",
} as const;
export type PageSectionKeyEnum = (typeof PageSectionKeyEnum)[keyof typeof PageSectionKeyEnum];

export const PageCodeEnum = {
	HOME_PAGE: "home_page",
	LAYOUT_PAGE: "layout_page",
} as const;
export type PageCodeEnum = (typeof PageCodeEnum)[keyof typeof PageCodeEnum];

// ─── Options dropdown ───────────────────────────────────────────────

export const PAGE_CODE_OPTIONS: { value: string; label: string }[] = [
	{ value: PageCodeEnum.HOME_PAGE, label: "Trang chủ" },
	{ value: PageCodeEnum.LAYOUT_PAGE, label: "Trang layout" },
];

/** System section options — type-based, có thể add nhiều lần. */
export const SYSTEM_SECTION_OPTIONS: { value: string; label: string }[] = [
	{ value: PageSectionTypeEnum.BANNER, label: "Banner" },
	{ value: PageSectionTypeEnum.PRODUCT, label: "Box sản phẩm" },
	{ value: PageSectionTypeEnum.TEXT, label: "Văn bản" },
	{ value: PageSectionTypeEnum.FAQ, label: "FAQ" },
];

/** Layout section options — key-based, mỗi key chỉ add 1 lần. */
export const LAYOUT_SECTION_OPTIONS: {
	value: string;
	label: string;
	sectionType: string;
}[] = [
	{ value: PageSectionKeyEnum.LAYOUT_MENU, label: "Menu", sectionType: PageSectionTypeEnum.LINK_ITEM },
	{ value: PageSectionKeyEnum.LAYOUT_KEY_WORD, label: "Hot Keywords", sectionType: PageSectionTypeEnum.LINK_ITEM },
	{
		value: PageSectionKeyEnum.LAYOUT_KEY_WORD_FOOTER,
		label: "Hot Keywords Footer",
		sectionType: PageSectionTypeEnum.LINK_ITEM,
	},
	{
		value: PageSectionKeyEnum.LAYOUT_SEARCH_SUGGESTION,
		label: "Gợi ý tìm kiếm",
		sectionType: PageSectionTypeEnum.LINK_ITEM,
	},
	{ value: PageSectionKeyEnum.LAYOUT_FOOTER, label: "Footer Menu", sectionType: PageSectionTypeEnum.LINK_ITEM },
];

/** Storefront / Home section options — key-based, mỗi key chỉ add 1 lần. */
export const STOREFRONT_SECTION_OPTIONS: {
	value: string;
	label: string;
	sectionType: string;
}[] = [
	{ value: PageSectionKeyEnum.HERO_BANNER, label: "Hero Banner", sectionType: PageSectionTypeEnum.BANNER },
	{ value: PageSectionKeyEnum.PROMOTION_GRID, label: "Promotion Grid", sectionType: PageSectionTypeEnum.BANNER },
	{ value: PageSectionKeyEnum.BESTSELLER, label: "Bestseller", sectionType: PageSectionTypeEnum.PRODUCT },
	{ value: PageSectionKeyEnum.BRAND_SHOWCASE, label: "Brand Showcase", sectionType: PageSectionTypeEnum.LINK_ITEM },
	{ value: PageSectionKeyEnum.NEWS, label: "News", sectionType: PageSectionTypeEnum.LINK_ITEM },
	{
		value: PageSectionKeyEnum.BOX_DANH_MUC,
		label: "Box danh mục",
		sectionType: PageSectionTypeEnum.LINK_ITEM,
	},
];

/** Map key → DB type — dùng khi submit để resolve type chính xác. */
export const SECTION_KEY_TO_DB_TYPE = new Map<string, string>(
	[...LAYOUT_SECTION_OPTIONS, ...STOREFRONT_SECTION_OPTIONS].map((o) => [o.value, o.sectionType]),
);

/** Các key được phép thêm nhiều lần (không bị disable trong dropdown). */
export const REPEATABLE_SECTION_KEYS = new Set<string>([
	PageSectionKeyEnum.NEWS,
	PageSectionKeyEnum.BOX_DANH_MUC,
]);

/** Type/key được phép xoá khỏi page. */
export const DELETABLE_SECTION_TYPES = new Set<string>([
	...SYSTEM_SECTION_OPTIONS.map((o) => o.value),
	...LAYOUT_SECTION_OPTIONS.map((o) => o.value),
	...STOREFRONT_SECTION_OPTIONS.map((o) => o.value),
	...LAYOUT_SECTION_OPTIONS.map((o) => o.sectionType),
	...STOREFRONT_SECTION_OPTIONS.map((o) => o.sectionType),
]);

/** Section type mà extra rỗng (data nằm trong items[].data). */
export const EMPTY_EXTRA_TYPES = new Set<string>([
	PageSectionTypeEnum.TEXT,
	PageSectionTypeEnum.FAQ,
]);

// ─── Helpers ────────────────────────────────────────────────────────

const ALL_OPTIONS_LABEL_MAP = new Map<string, string>([
	...SYSTEM_SECTION_OPTIONS.map((o) => [o.value, o.label] as const),
	...LAYOUT_SECTION_OPTIONS.map((o) => [o.value, o.label] as const),
	...STOREFRONT_SECTION_OPTIONS.map((o) => [o.value, o.label] as const),
]);

export function getSectionLabel(typeOrKey: string): string {
	return ALL_OPTIONS_LABEL_MAP.get(typeOrKey) || typeOrKey;
}

export function normalizeSlugValue(value: string) {
	return value.replace(/^\/+/, "");
}

export function toSlugDisplayValue(value: string) {
	return value ? `/${normalizeSlugValue(value)}` : "";
}

/** Generate slug từ title (giống generateSlugFromLabel bên CMS). */
export function generateSlugFromLabel(input: string): string {
	if (!input) return "";
	return input
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/đ/gi, "d")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}
