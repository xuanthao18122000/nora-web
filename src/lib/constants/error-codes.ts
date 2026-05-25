/**
 * Error code constants mirroring the backend ErrorCode definitions.
 * Keep in sync with: ddv-web-api-new/src/common/constants/error-code.ts
 *
 * Usage:
 *   if (data?.code === ApiErrorCode.PRICE_CHANGED) { ... }
 */
export const ApiErrorCode = {
	/** Giá sản phẩm hoặc khuyến mãi đã thay đổi kể từ khi FE tính toán */
	PRICE_CHANGED: "PRICE_CHANGED",

	/** Không tìm thấy đơn hàng */
	ORDER_NOT_FOUND: "ORDER_NOT_FOUND",

	/** Đang có đơn hàng chờ thanh toán */
	ORDER_PENDING_PAYMENT: "ORDER_PENDING_PAYMENT",

	/** Sản phẩm hết hàng */
	PRODUCT_OUT_OF_STOCK: "PRODUCT_OUT_OF_STOCK",

	/** Sản phẩm đang đặt trước — không cho mua trực tiếp */
	PRODUCT_IS_PRE_ORDER: "PRODUCT_IS_PRE_ORDER",

	/** Cổng thanh toán không hợp lệ cho số tiền */
	PAYMENT_GATEWAY_INVALID_AMOUNT: "PAYMENT_GATEWAY_INVALID_AMOUNT",

	/** Cổng thanh toán không hỗ trợ sản phẩm trong đơn */
	PAYMENT_GATEWAY_INVALID_PRODUCT: "PAYMENT_GATEWAY_INVALID_PRODUCT",

	/** Phiên thanh toán hết hạn */
	PAYMENT_EXPIRED: "PAYMENT_EXPIRED",

	/** Token thanh toán không hợp lệ */
	PAYMENT_TOKEN_INVALID: "PAYMENT_TOKEN_INVALID",

	/** Mã voucher/coupon không hợp lệ */
	VOUCHER_VALIDATION_NOT_FOUND: "VOUCHER_VALIDATION_NOT_FOUND",
	VOUCHER_VALIDATION_QUOTA_EXCEEDED: "VOUCHER_VALIDATION_QUOTA_EXCEEDED",
	VOUCHER_VALIDATION_OUT_OF_DATE: "VOUCHER_VALIDATION_OUT_OF_DATE",
	VOUCHER_VALIDATION_MIN_ORDER_AMOUNT: "VOUCHER_VALIDATION_MIN_ORDER_AMOUNT",
	VOUCHER_VALIDATION_PRODUCT_NOT_IN_CART:
		"VOUCHER_VALIDATION_PRODUCT_NOT_IN_CART",

	COUPON_VALIDATION_NOT_FOUND: "COUPON_VALIDATION_NOT_FOUND",
	COUPON_VALIDATION_QUOTA_EXCEEDED: "COUPON_VALIDATION_QUOTA_EXCEEDED",
	COUPON_VALIDATION_OUT_OF_DATE: "COUPON_VALIDATION_OUT_OF_DATE",
	COUPON_VALIDATION_MIN_ORDER_AMOUNT: "COUPON_VALIDATION_MIN_ORDER_AMOUNT",
	COUPON_VALIDATION_PRODUCT_NOT_IN_CART:
		"COUPON_VALIDATION_PRODUCT_NOT_IN_CART",
} as const;

export type ApiErrorCodeValue =
	(typeof ApiErrorCode)[keyof typeof ApiErrorCode];
