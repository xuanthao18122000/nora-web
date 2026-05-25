import type {
	SharedOrderDetail,
	SharedOrderDetailItem,
} from "@/components/feature/order-shared";

// ─── Raw shape từ acquyhn-api (MikroORM Order entity) ────────────────

interface RawOrderItem {
	id?: number;
	productName?: string;
	productSlug?: string | null;
	productSku?: string | null;
	quantity?: number;
	unitPrice?: number | string;
	totalPrice?: number | string;
	selectedAttributes?: Record<string, unknown> | null;
	product?: {
		id?: number;
		name?: string;
		slug?: string;
		sku?: string;
		thumbnailUrl?: string | null;
	} | null;
}

interface RawOrder {
	id: number;
	customerName?: string;
	phone?: string;
	email?: string;
	shippingAddress?: string;
	note?: string | null;
	totalAmount?: number | string;
	status?: number;
	paymentMethod?: number;
	createdAt?: string;
	items?: RawOrderItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────

const PAYMENT_LABEL: Record<number, string> = {
	1: "Thanh toán khi nhận hàng (COD)",
	2: "Chuyển khoản ngân hàng",
	3: "Khác",
};

function num(v: unknown, fallback = 0): number {
	if (v == null) return fallback;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}

// ─── Adapter ─────────────────────────────────────────────────────────

/**
 * Map raw response từ `GET /fe/orders/:id/tracking` (MikroORM entity)
 * sang `SharedOrderDetail` shape mà FE OrderDetailView expect.
 */
export function mapBackendOrderToShared(raw: RawOrder): SharedOrderDetail {
	const items: SharedOrderDetailItem[] = (raw.items ?? []).map((it) => {
		const price = num(it.unitPrice);
		return {
			id: it.id,
			productName: it.productName ?? it.product?.name ?? "Sản phẩm",
			productImage: it.product?.thumbnailUrl ?? undefined,
			price,
			quantity: num(it.quantity, 1),
			productSlug: it.productSlug ?? it.product?.slug ?? undefined,
			productSku: it.productSku ?? it.product?.sku ?? undefined,
			productId: it.product?.id != null ? String(it.product.id) : undefined,
		};
	});

	const totalItems = items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
	const totalAmount = num(raw.totalAmount);
	const paymentLabel =
		raw.paymentMethod != null
			? PAYMENT_LABEL[raw.paymentMethod] ?? "Khác"
			: "—";

	return {
		orderId: raw.id,
		orderCode: String(raw.id).padStart(7, "0"),
		orderStatus: String(raw.status ?? 1),
		feStatus: raw.status,
		createdAt: raw.createdAt ?? new Date().toISOString(),
		totalItems,
		totalAmount,
		shippingFee: 0,
		discountAmount: 0,
		discountDetails: [],
		paymentMethod: paymentLabel,
		paymentStatus: null,
		paidAmount: 0,
		remainingAmount: totalAmount,
		receiverName: raw.customerName ?? "",
		receiverPhone: raw.phone ?? "",
		shippingAddress: raw.shippingAddress ?? null,
		items,
	};
}
