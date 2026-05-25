// endpoints.ts
export const API = {
	CMS: {
		RESOLVE: (slug: string) => `/fe/resolve${slug ? `?slug=${slug}` : ""}`,
		RESOLVE_SLUG: (slug: string) => `/slug/${slug}`,
		PAGE_LAYOUT: "/pages/layout",
		PAGE_BY_SLUG: (slug: string) => `/pages/${slug}`,
	},
	PRODUCTS: {
		DETAIL: (slug: string) =>
			`/fe/products/${encodeURIComponent(slug)}`,
		BY_IDS: "/fe/products/by-ids", // POST { ids: string[] }
		COMPARE: "/fe/products/compare", // POST { ids: string[] } — full data + specs
		QUICK_SEARCH: "/fe/products/quick-search", // GET ?q=...&limit=8 — DB-based for compare bar
		CATEGORIES: "/fe/categories",
		CATEGORY_PAGE: (slug: string) => `/fe/categories/${slug}`,
		CATEGORY_FLASH_SALE: (slug: string) =>
			`/fe/categories/${slug}/flash-sale`,
		CATEGORY_FEATURED: (slug: string) => `/fe/categories/${slug}/featured`,
		SEARCH: "/fe/search",
		SEARCH_INITIAL: "/fe/search/initial",
		SEARCH_TRENDS: "/fe/search/trends",
		SEARCH_SUGGESTIONS: "/fe/search/suggestions",
		FACETS: "/fe/facets",
		REVIEWS: "/fe/product-reviews",
		COMMENTS: "/fe/product-comments",
		CART_ADDONS: "/fe/products/cart-addons",
		VARIANTS: (productId: string) =>
			`/fe/products/variants?productId=${encodeURIComponent(productId)}`,
	},
	DISCOUNT_PROGRAMS: {
		/** Lấy tất cả Flash Sale đang RUNNING, kèm sản phẩm & quota/sold real-time từ Redis.
		 *  Optional: ?limit=20&categoryId=123 */
		RUNNING: "/fe/discount-programs/running",
	},
	RECOMMENDATIONS: {
		GUEST: "/fe/recommendations/guest",
	},
	CART: {
		GET: "/fe/carts",
		MERGE: "/fe/carts/merge",
		ADD: "/fe/carts/add",
		UPDATE_ITEM_QUANTITY: "/fe/carts/items/quantity",
		UPDATE_ITEM_VARIANT: "/fe/carts/items/variant",
		REMOVE_ITEM: "/fe/carts/items",
		ADD_ACCESSORY_DELTA: "/fe/cart-accessories",
		SET_ACCESSORY_QUANTITY: "/fe/cart-accessories/quantity",
		REMOVE_ACCESSORY: "/fe/cart-accessories",
		GIFTS: "/fe/carts/gifts",
	},
	ACCESSORY_BUNDLES: {
		BY_VARIANT: (variantId: string) =>
			`/fe/accessory-bundles/by-variant/${variantId}`,
		WARRANTY_BY_VARIANT: (variantId: string) =>
			`/fe/accessory-bundles/by-variant/${variantId}/warranty`,
	},
	SHIPPING: {
		CALCULATE: "/fe/shipping-fees/calculate",
	},
	CONTACT: {
		CREATE: "/fe/contact-informations",
	},
	ORDERS: {
		CREATE: "/fe/orders",
		CHECKOUT_SUMMARY: "/fe/orders/checkout-summary",
		BY_PHONE: "/fe/orders/by-phone",
		CREATE_PRE_TRADE_IN: "/fe/pre-orders/trade-in",
		DETAIL: (id: string | number) => `/fe/orders/${id}`,
		PAYMENT_STATUS: (id: string | number) =>
			`/fe/orders/${id}/payment-status`,
		VERIFY: (id: string | number) => `/fe/orders/${id}/verify`,
		TRACKING: (id: string | number) => `/fe/orders/${id}/tracking`,
		CANCEL: (id: string | number) => `/fe/orders/${id}/cancel`,
	},
	PRE_ORDERS: {
		CREATE: "/fe/pre-orders",
		CREATE_TRADE_IN: "/fe/pre-orders/trade-in",
		VERIFY: (id: string | number) => `/fe/pre-orders/${id}/verify`,
		TRACKING: (id: string | number) => `/fe/pre-orders/${id}/tracking`,
	},
	PROMOTIONS: {
		VALIDATE_PROMOTION: "/fe/promotions/validate",
		VALIDATE_VOUCHER: "/fe/vouchers/validate",
		AVAILABLE_VOUCHERS: "/fe/vouchers/available",
		VALIDATE_COUPON: "/fe/coupons/validate",
		AVAILABLE_PROMOTIONS: "/fe/promotions/available",
		VOUCHER_FOR_PRODUCT: (productId: string) =>
			`/fe/vouchers/for-product/${productId}`,
	},
	PAYMENTS: {
		GATEWAYS: "/fe/payment-gateways",
		GATEWAY_BY_ID: (id: number) => `/fe/payment-gateways/${id}`,
		PROCESS: "/fe/payment/process",
		PRE_ORDER_RETRY: "/fe/payment/pre-order/retry",
	},
	TRADE_IN: {
		GROUPS: "/fe/tradein-program-groups",
		GROUPS_WITH_PRODUCTS: "/fe/tradein-program-groups/with-products",
		GROUP_PRODUCTS: (id: number) =>
			`/fe/tradein-program-groups/${id}/products`,
		CRITERIA: (parentProductId: string) =>
			`/fe/tradein-products/${parentProductId}/criteria`,
		UPGRADE_PRODUCTS: "/fe/tradein-upgrade/products",
		UPGRADE_GROUP_PRODUCTS: (groupId: number) =>
			`/fe/tradein-upgrade/groups/${groupId}/products`,
		CREATE_CUSTOM: "/fe/pre-orders/trade-in-custom",
	},
	SHARED: {
		STORES: "/fe/stores",
		STORE_CITIES: "/fe/stores/cities",
		STORE_WARDS: (cityId: number) => `/fe/stores/cities/${cityId}/wards`,
		STORE_STOCKS: (variantId: string) =>
			`/fe/products/variants/${variantId}/store-stocks`,
		CITIES: "/fe/cities",
		WARDS: (cityId: number) => `/fe/cities/${cityId}/wards`,
	},
	/** FE: generic comments (CATEGORY | PRODUCT) */
	COMMENTS_FE: {
		LIST: "/fe/comments",
		REPLIES: (parentId: string) =>
			`/fe/comments/${encodeURIComponent(parentId)}/replies`,
	},
	FAQS: {
		LIST: "/fe/faqs",
	},
	POLICIES: {
		TREE: "/fe/policies",
		BY_SLUG: (slug: string) => `/fe/policies/${slug}`,
	},
	INSTALLMENT: {
		PROMO_PLANS: "/fe/installment/promo-plans",
		CALCULATE_ALL: "/fe/installment/calculate-all",
		PAYOO_BANKS: (gatewayId: number) =>
			`/fe/installment/${gatewayId}/payoo-banks`,
		BANKS: (gatewayId: number) => `/fe/installment/${gatewayId}/banks`,
		LOAN_CALCULATOR: (gatewayId: number) =>
			`/fe/installment/${gatewayId}/loan-calculator`,
		PAYOO_QUOTE: (gatewayId: number) =>
			`/fe/installment/${gatewayId}/payoo-quote`,
		KREDIVO_CALCULATOR: (gatewayId: number) =>
			`/fe/installment/${gatewayId}/kredivo-calculator`,
	},
	CUSTOMER_TYPES: "/fe/customer-types",
	AUTH: {
		OTP_SEND: "/fe/auth/otp/send",
		OTP_VERIFY: "/fe/auth/otp/verify",
		REGISTER_COMPLETE: "/fe/auth/register/complete",
		LOGIN_PASSWORD: "/fe/auth/login",
		FORGOT_PASSWORD_RESET: "/fe/auth/forgot-password/reset",
		ME: "/fe/auth/me",
		UPDATE_ME: "/fe/auth/me",
		REFRESH: "/fe/auth/refresh",
		SIGN_OUT: "/fe/auth/sign-out",
		ADDRESSES: "/fe/auth/me/addresses",
		ADDRESS_BY_ID: (id: number) => `/fe/auth/me/addresses/${id}`,
		ADDRESS_SET_DEFAULT: (id: number) =>
			`/fe/auth/me/addresses/${id}/default`,
	},
} as const;
