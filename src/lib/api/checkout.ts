import type { PaymentGateway, VoucherValidateResult } from "@/types/checkout";
import type { CreateOrderDto, Order } from "@/types/order";
import { api } from "./client";
import { API } from "./endpoints";

// ── Shipping Fee ──

export interface ShippingFeeResult {
	fee: number;
	maxAmount: number;
	isFreeShipping: boolean;
}

export async function calculateShippingFee(
	cityId: number,
	totalPrice: number,
): Promise<ShippingFeeResult> {
	return api.get<ShippingFeeResult>(API.SHIPPING.CALCULATE, {
		params: { cityId: String(cityId), totalPrice: String(totalPrice) },
	});
}

// ── Paginated response shape from backend ──
interface PaginatedData<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// ── Checkout Summary ──

export interface CheckoutSummaryItem {
	productId: number;
	name: string;
	slug: string;
	sku: string;
	thumbnailUrl: string | null;
	unitPrice: number;
	originalPrice: number | null;
	quantity: number;
	lineTotal: number;
}

export interface CheckoutSummaryResult {
	items: CheckoutSummaryItem[];
	subtotal: number;
	shippingFee: number;
	total: number;
}

export async function getCheckoutSummary(
	items: { productId: number; quantity: number }[],
): Promise<CheckoutSummaryResult> {
	return api.post<CheckoutSummaryResult>(API.ORDERS.CHECKOUT_SUMMARY, {
		items,
	});
}

// ── Order API ──

export async function createOrder(dto: CreateOrderDto): Promise<{
	order: Order;
	paymentToken?: string;
	paymentId?: number;
	redirectUrl?: string;
	gatewayError?: string;
	paymentResult?: { redirectUrl?: string } | null;
	feResultUrl?: string;
	/** SePay QR: nội dung mã QR — Dcore trả base64 image */
	qrCode?: string;
	/** SePay QR: metadata */
	qrData?: {
		qrCodeContent: string; // base64 ảnh QR
		amount: number;
		expireOn: number;
		createdAt: string;
		orderId: number;
		customerPhone: string;
		bankName?: string;
		accountNumber?: string;
		accountName?: string;
		transferContent?: string;
	};
}> {
	return api.post(API.ORDERS.CREATE, dto);
}

export interface ProcessPaymentParams {
	orderId: number;
	gatewayId: number;
	amount: number;
	customerName?: string;
	customerPhone?: string;
	orderInfo?: string;
	paymentToken?: string;
}

export interface ProcessPaymentResult {
	paymentId: number;
	paymentToken?: string;
	redirectUrl?: string;
	expiredAt?: string;
}

/** Gọi cổng thanh toán sau khi tạo order → nhận redirectUrl để redirect sang gateway */
export async function processPayment(
	params: ProcessPaymentParams,
): Promise<ProcessPaymentResult> {
	return api.post<ProcessPaymentResult>(API.PAYMENTS.PROCESS, params);
}

// ── Cart Addons API (mock) ──

export interface CartAddonProduct {
	productId: string;
	variantId: string;
	name: string;
	image: string;
	price: number;
	originalPrice?: number;
	type: "gift" | "cross_sell";
}

/**
 * Fetch cross-sell / gift products for given variant IDs.
 * Returns a map: variantId → CartAddonProduct[]
 */
export async function getCartAddons(
	variantIds: string[],
): Promise<Record<string, CartAddonProduct[]>> {
	if (variantIds.length === 0) return {};
	return api.get(API.PRODUCTS.CART_ADDONS, {
		params: { variantIds: variantIds.join(",") },
	});
}

// ── Payment Gateway API ──

/** Raw shape returned by backend — before normalization */
interface RawGateway {
	id: number;
	name: string;
	code: string;
	description?: string;
	type: string; // "PAYMENT" | "INSTALLMENT" | "CREDIT" | ...
	provider: string;
	status: number;
	position: number;
	/** false = offline / no payment creation needed. Default true. */
	requiresOnlinePayment?: boolean;
	minAmount?: string;
	maxAmount?: string;
	logo?: { id: number; path: string; mimeType: string } | null;
}

function mapGateway(raw: RawGateway): PaymentGateway {
	return {
		id: raw.id,
		name: raw.name,
		code: raw.code,
		description: raw.description,
		type: raw.type,
		provider: raw.provider,
		status: raw.status,
		position: raw.position,
		// Default true (safe) — after migration, BE sends the actual value
		requiresOnlinePayment: raw.requiresOnlinePayment ?? true,
		minAmount: raw.minAmount ? Number(raw.minAmount) : undefined,
		maxAmount: raw.maxAmount ? Number(raw.maxAmount) : undefined,
		logo: raw.logo ?? null,
	};
}

export async function getPaymentGateways(
	/** Nếu truyền vào, chỉ lấy gateway theo loại. undefined = tất cả */
	type?: "PAYMENT" | "INSTALLMENT",
	productIds?: string[],
	options?: { isAllowPreOrder?: boolean },
): Promise<PaymentGateway[]> {
	const params: Record<string, string> = { limit: "100", page: "1" };
	if (type) {
		params.type = type;
	}
	if (productIds && productIds.length > 0) {
		params.productIds = productIds.join(",");
	}
	if (options?.isAllowPreOrder !== undefined) {
		params.isAllowPreOrder = options.isAllowPreOrder ? "1" : "-1";
	}

	const result = await api.get<PaginatedData<RawGateway>>(
		API.PAYMENTS.GATEWAYS,
		{ params },
	);
	const items = result?.data ?? [];
	return items
		.filter((g) => g.status === 1)
		.filter((g) => !type || g.type === type)
		.sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
		.map(mapGateway);
}

// ── Voucher API ──

export interface ValidateVoucherParams {
	code: string;
	orderAmount: number;
	productIds?: string[];
	phone?: string;
	storeId?: number;
}

export async function validateVoucher(
	params: ValidateVoucherParams,
): Promise<VoucherValidateResult> {
	return api.post<VoucherValidateResult>(
		API.PROMOTIONS.VALIDATE_VOUCHER,
		params,
	);
}

export interface ValidateCouponParams {
	code: string;
	orderAmount: number;
	productIds?: string[];
	phone?: string;
	storeId?: number;
}

export async function validateCoupon(
	params: ValidateCouponParams,
): Promise<VoucherValidateResult> {
	return api.post<VoucherValidateResult>(
		API.PROMOTIONS.VALIDATE_COUPON,
		params,
	);
}

export interface CumulativeValueItem {
	quantityFrom: number | null;
	quantityTo: number | null;
	cumulativeValue: number | null;
}

export interface ValidatePromotionResult {
	type: "voucher" | "coupon" | "invalid";
	valid: boolean;
	discountAmount: number;
	message?: string;
	// Voucher-branch metadata (only populated when type==="voucher" && valid)
	voucherId?: number;
	voucherDetailId?: number;
	voucherCode?: string;
	voucherName?: string;
	voucherTypeDiscount?: number; // 1=Cash, 2=Percent
	voucherAmount?: number;
	matchedProductIds?: string[];
	cumulativeValues?: CumulativeValueItem[];
}

export async function validatePromotion(
	params: ValidateVoucherParams, // basically the same params
): Promise<ValidatePromotionResult> {
	return api.post<ValidatePromotionResult>(
		API.PROMOTIONS.VALIDATE_PROMOTION,
		params,
	);
}

export interface AvailableVoucherItem {
	id: number;
	code?: string;
	name: string;
	description?: string;
	type: number;
	value: number;
	maxValue?: number;
	applyFromAmount: number;
	discountAmount: number;
	startDate?: string;
	endDate?: string;
}

/** Lấy danh sách voucher khả dụng cho checkout */
export async function listAvailableVouchers(params: {
	productIds: string[];
	orderAmount: number;
	limit?: number;
	page?: number;
}): Promise<AvailableVoucherItem[]> {
	const result = await api.get<PaginatedData<AvailableVoucherItem>>(
		API.PROMOTIONS.AVAILABLE_VOUCHERS,
		{
			params: {
				productIds: params.productIds.join(","),
				orderAmount: String(params.orderAmount),
				limit: String(params.limit ?? 20),
				page: String(params.page ?? 1),
			},
		},
	);
	return result?.data ?? [];
}

/** Unified: fetch both vouchers + coupons in a single call */
export interface AvailablePromotionsResult {
	vouchers: AvailableVoucherItem[];
	coupons: AvailableVoucherItem[];
}

export async function listAvailablePromotions(params: {
	productIds: string[];
	orderAmount: number;
	phone?: string;
	limit?: number;
}): Promise<AvailablePromotionsResult> {
	const queryParams: Record<string, string> = {
		productIds: params.productIds.join(","),
		orderAmount: String(params.orderAmount),
		limit: String(params.limit ?? 10),
	};
	if (params.phone) {
		queryParams.phone = params.phone;
	}
	const result = await api.get<AvailablePromotionsResult>(
		API.PROMOTIONS.AVAILABLE_PROMOTIONS,
		{ params: queryParams },
	);
	return {
		vouchers: result?.vouchers ?? [],
		coupons: result?.coupons ?? [],
	};
}

// ── Cities / Wards API ──

export interface City {
	id: number;
	name: string;
	/** Tên các tỉnh/thành cũ đã sáp nhập vào tỉnh này (2025) */
	oldNames?: string[];
}

export interface Ward {
	id: number;
	name: string;
	cityId: number;
	/** Tên các phường/xã cũ đã sáp nhập vào phường này (2025) */
	oldNames?: string[];
}

/** Lấy danh sách tỉnh/thành phố (effectType=2 — địa chỉ mới) */
export async function getCities(): Promise<City[]> {
	const result = await api.get<PaginatedData<City>>(API.SHARED.CITIES, {
		params: { getFull: "true" },
	});
	return result?.data ?? [];
}

/** Lấy danh sách phường/xã theo tỉnh (effectType=2) */
export async function getWards(cityId: number): Promise<Ward[]> {
	const result = await api.get<PaginatedData<Ward>>(
		API.SHARED.WARDS(cityId),
		{
			params: { getFull: "true" },
		},
	);
	return result?.data ?? [];
}

// ── Store Pickup: chỉ lấy tỉnh/phường CÓ cửa hàng hoạt động ──

/** Lấy danh sách tỉnh/thành phố có cửa hàng đang hoạt động */
export async function getStoreCities(): Promise<City[]> {
	const result = await api.get<PaginatedData<City>>(API.SHARED.STORE_CITIES);
	return result?.data ?? [];
}

/** Lấy danh sách phường/xã có cửa hàng đang hoạt động theo tỉnh */
export async function getStoreWards(cityId: number): Promise<Ward[]> {
	const result = await api.get<PaginatedData<Ward>>(
		API.SHARED.STORE_WARDS(cityId),
	);
	return result?.data ?? [];
}
