/**
 * Payment Gateway Provider codes — mirrors backend PaymentGatewayProvider enum.
 * Source of truth: ddv-web-api-new/src/common/enums/payment-gateway-provider.enum.ts
 *
 * Keep in sync with backend when adding new providers.
 */
export const PaymentGatewayProvider = {
	/** Cash on delivery */
	COD: "COD",
	/** Manual bank transfer */
	BANK_TRANSFER: "BANK_TRANSFER",
	/** SePay — dynamic QR bank transfer */
	SEPAY: "SEPAY",
	/** VNPay */
	VNPAY: "VNPAY",
	/** MoMo */
	MOMO: "MOMO",
	/** ZaloPay */
	ZALOPAY: "ZALOPAY",
	/** Payoo */
	PAYOO: "PAYOO",
	/** OnePay */
	ONEPAY: "ONEPAY",
	/** Apple Pay (via OnePay) */
	APPLE_PAY: "APPLE_PAY",
	/** Viettel Money */
	VIETTEL: "VIETTEL",
	/** Kim Ngan — offline installment */
	KIM_NGAN: "KIM_NGAN",
	/** AlePay — credit card installment */
	ALEPAY: "ALEPAY",
	/** Kredivo — installment */
	KREDIVO: "KREDIVO",
	/** Home PayLater (Home Credit BNPL) */
	HOME_PAYLATER: "HOME_PAYLATER",
	/** Credit card */
	CREDIT_CARD: "CREDIT_CARD",
} as const;

export type PaymentGatewayProvider =
	(typeof PaymentGatewayProvider)[keyof typeof PaymentGatewayProvider];

// ---------------------------------------------------------------------------

/**
 * Payment Gateway Type — gateway classification.
 * Mirrors backend PaymentGatewayType enum.
 */
export const PaymentGatewayType = {
	/** Standard one-time payment */
	PAYMENT: "PAYMENT",
	/** Installment */
	INSTALLMENT: "INSTALLMENT",
	/** Credit / BNPL */
	CREDIT: "CREDIT",
} as const;

export type PaymentGatewayType =
	(typeof PaymentGatewayType)[keyof typeof PaymentGatewayType];

// ---------------------------------------------------------------------------

/**
 * Gateway providers that do NOT require an online payment transaction.
 * Used to short-circuit the payment step after order creation.
 *
 * Note: this is a FE fallback list.
 * The canonical value comes from `gateway.requiresOnlinePayment` (DB-driven).
 */
export const OFFLINE_PAYMENT_PROVIDERS = new Set<PaymentGatewayProvider>([
	PaymentGatewayProvider.COD,
	PaymentGatewayProvider.KIM_NGAN,
]);
