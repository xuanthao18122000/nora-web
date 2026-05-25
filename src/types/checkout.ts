// ── Checkout Types ──
// Used by the checkout feature components and hooks

import type { DELIVERY_MODE } from "@/constants/checkout.constants";

export type DeliveryMode = (typeof DELIVERY_MODE)[keyof typeof DELIVERY_MODE];

export interface CustomerAddress {
	gender?: number; // 1 = Anh, 2 = Chị
	fullName: string;
	phone: string;
	street: string;
	cityId?: number;
	cityName?: string;
	cityOldNames?: string[];
	wardId?: number;
	wardName?: string;
	wardOldNames?: string[];
	/** Email (không bắt buộc) — dùng để gửi HĐ VAT */
	email?: string;
	/** Ghi chú giao hàng (không bắt buộc) */
	note?: string;
	/** Nhờ người khác nhận hàng */
	hasReceiver?: boolean;
	receiverGender?: number;
	receiverName?: string;
	receiverPhone?: string;
}

export interface CompanyInvoiceData {
	companyName: string;
	companyAddress: string;
	taxCode: string;
	email?: string;
}

/** Mirrors backend PaymentGateway entity */
export interface PaymentGatewayLogo {
	id: number;
	path: string;
	mimeType: string;
}

import type {
	PaymentGatewayProvider,
	PaymentGatewayType,
} from "@/constants/payment-gateway.constants";

export interface PaymentGateway {
	id: number;
	name: string;
	code: string;
	description?: string;
	type: PaymentGatewayType | string;
	provider: PaymentGatewayProvider | string;
	status: number; // 1 = active
	position: number;
	/**
	 * false = no online payment transaction needed (COD, offline installment like KIM_NGAN).
	 * true = requires payment creation via third-party (SePay, Payoo, VNPay...).
	 * Default true (safe fallback).
	 */
	requiresOnlinePayment: boolean;
	/** Nested logo object from backend — use logo.path + CDN_URL to build image URL */
	logo?: PaymentGatewayLogo | null;
	minAmount?: number;
	maxAmount?: number;
}

export interface VoucherValidateResult {
	valid: boolean;
	discountAmount: number;
	message?: string;
}

export interface AppliedVoucher {
	code: string;
	discountAmount: number;
}

/** Full voucher metadata needed to attach a voucher per-order-item */
export interface AppliedFullVoucher {
	voucherId: number;
	voucherDetailId: number;
	voucherCode: string;
	voucherTypeDiscount: number; // 1=Cash, 2=Percent
	voucherAmount: number;
	matchedProductIds: string[];
}

export interface CheckoutSummary {
	subtotal: number;
	shippingFee: number;
	discountAmount: number;
	total: number;
	savedAmount: number;
}
