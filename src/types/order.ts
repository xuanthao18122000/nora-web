// ── Order Types ──
// Mapped from: ddv-web-api-new/src/modules/order/dtos/orders/create-order.dto.ts

// Mirrors backend ProductReferenceTypeEnum
export const ProductReferenceType = {
	PRODUCT: "product",
	PRODUCT_VARIANT: "product_variant",
	PRODUCT_COMBO: "product_combo",
} as const;

// ── Sub-item DTOs (nested inside each order item) ──

export interface FreeOrderItemDto {
	productId: string;
	quantity: number;
	productPrice?: number;
}

export interface PromotionOrderItemDto {
	productId: string;
	quantity: number;
	promotionPrice: number;
}

export interface WarrantyOrderItemDto {
	productId: string;
	quantity: number;
	productPrice: number;
}

export interface CumulativeValueDto {
	quantityFrom: number;
	quantityTo: number;
	cumulativeValue: number;
}

export interface OrderItemVoucherDto {
	voucherId: number;
	voucherDetailId: number;
	voucherCode: string;
	voucherTypeDiscount?: number; // 1=Cash, 2=Percentage
	voucherAmount: number;
	cumulativeValues?: CumulativeValueDto[] | null;
}

export interface AffiliateProgramDto {
	rewardAffiliateId?: number;
	commissionRate?: number;
	cookieId?: string;
}

export interface CreateOrderItemDto {
	productId: string;
	productReferenceType?: string; // ProductReferenceType constant
	productVariantId?: string;
	quantity: number;
	productPrice?: number;
	discountProgramId?: number;
	discountType?: number; // 1=Cash, 2=Percentage
	discountAmount?: number;
	freeOrderItems?: FreeOrderItemDto[];
	promotionOrderItems?: PromotionOrderItemDto[];
	warrantyOrderItems?: WarrantyOrderItemDto[];
	vouchers?: OrderItemVoucherDto[];
	affiliateProgram?: AffiliateProgramDto;
}

export interface CreateOrderDto {
	// ── Customer info (required) ──
	customerName: string;
	customerPhone: string;

	// ── Customer info (optional) ──
	customerEmail?: string;
	customerGender?: number;
	customerNote?: string;
	customerMobile?: string;
	customerIdCard?: string;
	customerCityName?: string;
	customerDistrictName?: string;
	customerWardName?: string;

	// ── Core order ──
	refOrderId?: string;
	orderWebId?: number;
	customerId?: number;
	orderType?: number; // 1=in-store, 5=website
	orderSource?: string;

	// ── Shipping address ──
	shippingAddress?: string;
	shippingCityId?: number;
	shippingWardId?: number;

	// ── Customer address ──
	customerAddress?: string;
	customerCityId?: number;
	customerWardId?: number;

	// ── Receiver (if different from customer) ──
	hasReceiver?: boolean;
	receiverName?: string;
	receiverPhone?: string;
	receiverGender?: number;
	receivingFullName?: string;
	receivingPhone?: string;
	receivingAddress?: string;
	receivingNote?: string;

	// ── Payment ──
	paymentGatewayId?: number;
	transferAmount?: number;
	depositAmount?: number;
	installmentAmount?: number;
	// Installment detail fields
	installmentTenor?: number;
	installmentPrepaidAmount?: number;
	installmentMonthlyPayment?: number;
	installmentBankCode?: string;
	installmentCardType?: string;

	creditAmount?: number;
	paymentDate?: string; // YYYY-MM-DD

	// ── Shipping fees ──
	customerShipFee?: number;
	shipFee?: number;

	// ── Voucher / Coupon ──
	/** @deprecated Use `items[].vouchers[]` instead — backend still accepts this as a legacy fallback. */
	voucherCode?: string;
	couponCode?: string;

	// ── Invoice ──
	hasCompanyInvoice?: boolean;
	companyName?: string;
	companyAddress?: string;
	companyTaxCode?: string;

	// ── Discounts ──
	discountType?: number; // 1=Cash, 2=Percentage
	discountAmount?: number;

	// ── Notes ──
	saleNote?: string;

	// ── Installment ──
	installMoneyAccountId?: number;
	installmentUserFullName?: string;
	installmentUserMobile?: string;
	installedMoneyAmount?: number;
	installmentInterestRateValue?: string;
	installmentInterestRateCode?: string;
	installmentTenorCode?: string;

	// ── Store ──
	storeId?: number;

	// ── Items ──
	items: CreateOrderItemDto[];

	// ── Validation ──
	expectedTotalAmount?: number;
}

export interface Order {
	id: string | number;
	orderCode: string;
	status: string;
	totalAmount: number;
	items: OrderItem[];
	createdAt: string;
	paymentResult?: { redirectUrl?: string } | null;
}

export interface OrderItemChild {
	id?: number;
	productId: string;
	productVariantId?: string;
	productName?: string;
	quantity: number;
	productPrice?: number;
}

export interface OrderItemVoucher {
	id?: number;
	voucherId: number;
	voucherDetailId: number;
	voucherCode: string;
	voucherTypeDiscount?: number;
	voucherAmount: number;
}

export interface OrderItem {
	id: number;
	productId: string;
	productName: string;
	variantName?: string;
	quantity: number;
	price: number;
	productSnapshot?: Record<string, unknown> | null;
	gifts?: OrderItemChild[];
	warranties?: OrderItemChild[];
	promotions?: OrderItemChild[];
	vouchers?: OrderItemVoucher[];
}
