/**
 * Shared order-view types — used by both `/order-tracking` and
 * `/account/orders/:id`. The data shapes returned by the two endpoints
 * are unified (both return TrackOrderResponse from backend), so consumers
 * can pass the raw response into `OrderDetailView` via the `SharedOrderDetail`
 * shape.
 */

export interface SharedOrderProduct {
	/** Unique key for React list rendering. */
	key: string | number;
	productName: string;
	productImage?: string;
	/** Giá đã thanh toán. */
	price: number;
	/** Giá niêm yết (optional) — hiển thị gạch ngang khi > price. */
	listedPrice?: number;
	quantity: number;
	variantName?: string | null;
	variantAttributes?: { value?: string | null }[] | null;
	/** Hiển thị custom action (vd: nút "Mua lại" ở trang account). */
	action?: React.ReactNode;
	/** Link tới PDP (optional). */
	href?: string;
}

export interface SharedOrderSubItem {
	name: string;
	price: number;
	quantity: number;
}

export interface SharedOrderHeader {
	orderCode: string;
	/** Ngày đặt hàng (ISO hoặc Date). */
	createdAt: string | Date;
	/** Badge trạng thái (ReactNode để consumer tuỳ biến — vd: OrderStatusBadge). */
	statusBadge: React.ReactNode;
}

export interface SharedOrderSummaryInfo {
	/** Tổng số lượng sản phẩm. */
	totalItems: number;
	/** Tổng cộng cuối cùng. */
	totalAmount: number;
}

export interface SharedDeliveryInfo {
	receiverName: string;
	receiverPhone: string;
	shippingAddress?: string | null;
	storeName?: string | null;
	storeAddress?: string | null;
}

export interface SharedPaymentInfo {
	paymentType?: string;
	paymentMethod: string;
	/** Mã trạng thái thanh toán (PAID, PENDING...). */
	paymentStatus?: string | null;
	/** Tiền hàng (trước giảm giá + trước ship). */
	goodsAmount: number;
	shippingFee: number;
	discountAmount: number;
	discountDetails?: Array<{ label: string; amount: number }>;
	totalAmount: number;
	paidAmount: number;
	remainingAmount: number;
}

export interface SharedInstallmentInfo {
	tenor: number;
	monthlyPayment?: number | null;
	totalAmount?: number | null;
	bankCode?: string | null;
	cardType?: string | null;
	feeDetails?: Array<{ label: string; amount: number }> | null;
	/** Tổng tiền trả góp so với tổng đơn (để suy ra phí). */
	orderTotal: number;
}

/**
 * Unified order-detail payload — mirrors backend `TrackOrderResponseDto`.
 * Both `/order-tracking` and `/account/orders/:id` receive this exact shape.
 */
export interface SharedOrderDetailItem {
	/** OrderItem id (used when available — fallback to array index). */
	id?: number;
	productName: string;
	productImage?: string;
	price: number;
	listedPrice?: number;
	quantity: number;
	variantName?: string | null;
	variantAttributes?: { value?: string | null }[] | null;
	/** Extended fields (available for authenticated account detail). */
	productId?: string;
	productReferenceType?: string;
	productVariantId?: string;
	productComboId?: string | null;
	productSlug?: string;
	productSku?: string;
}

export interface SharedOrderDetail {
	orderId: number;
	orderCode: string | null;
	orderStatus: string;
	/** FE status bucket (1-5). Present for authenticated detail; may be absent for tracking. */
	feStatus?: number;
	createdAt: string | Date;
	totalItems: number;
	totalAmount: number;
	shippingFee: number;
	discountAmount: number;
	discountDetails: Array<{ label: string; amount: number }>;
	paymentMethod: string;
	paymentType?: string;
	paymentStatus: string | null;
	paidAmount: number;
	remainingAmount: number;
	receiverName: string;
	receiverPhone: string;
	shippingAddress: string | null;
	storeName?: string | null;
	storeAddress?: string | null;
	items: SharedOrderDetailItem[];
	installmentTenor?: number | null;
	installmentMonthlyPayment?: number | null;
	installmentAmount?: number | null;
	installmentBankCode?: string | null;
	installmentCardType?: string | null;
	installmentFeeDetails?: Array<{ label: string; amount: number }> | null;
}
