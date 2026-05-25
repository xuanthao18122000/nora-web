export type DeliveryDestination =
	| { kind: "pickup"; storeName: string | null; storeAddress: string | null }
	| { kind: "shipping"; address: string }
	| { kind: "none" };

/**
 * Quyết định cách hiển thị địa chỉ nhận hàng cho đơn hàng.
 * - `pickup` khi có storeName hoặc storeAddress → UI render "Nhận tại cửa hàng".
 * - `shipping` khi có shippingAddress → UI render "Giao tới".
 * - `none` khi không có gì để hiển thị.
 */
export function resolveDeliveryDestination(input: {
	storeName?: string | null;
	storeAddress?: string | null;
	shippingAddress?: string | null;
}): DeliveryDestination {
	if (input.storeName || input.storeAddress) {
		return {
			kind: "pickup",
			storeName: input.storeName ?? null,
			storeAddress: input.storeAddress ?? null,
		};
	}
	if (input.shippingAddress) {
		return { kind: "shipping", address: input.shippingAddress };
	}
	return { kind: "none" };
}
