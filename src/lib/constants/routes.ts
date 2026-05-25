export const ROUTES = {
	HOME: "/",
	SLUG: (slug: string) => `/${slug}`,
	SEARCH: "/search",
	CART: "/cart",
	CHECKOUT: "/checkout",
	TRADE_IN: "/trade-in",
	/** Trả góp — khác trang trade-in (`TRADE_IN`) */
	INSTALLMENT: "/installment",
	STORE_LOCATOR: "/stores",
	ORDER_TRACKING: "/order-tracking",
	WARRANTY_CENTER: "/bao-hanh",
	ABOUT: "/gioi-thieu",
	CONTACT: "/lien-he",
	WHOLESALE: "/bao-gia-dai-ly",
	RESCUE: "/cuu-ho-ac-quy-24-7",
	/** Trang điều khoản / chính sách (slug public) */
	LEGAL: {
		TERMS_OF_USE: "/chinh-sach-su-dung",
		PRIVACY_POLICY: "/chinh-sach-bao-mat",
	} as const,
} as const;
