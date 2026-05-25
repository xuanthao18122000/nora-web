/**
 * Checkout intent — danh sách sản phẩm user muốn checkout, lưu trong sessionStorage.
 *
 * 2 nguồn:
 *   - "buy-now": từ trang chi tiết sản phẩm, chỉ 1 productId
 *   - "cart": từ giỏ hàng, các items được tick chọn (để clear sau khi đặt thành công)
 */

const STORAGE_KEY = "checkout_intent";

export interface CheckoutIntent {
	source: "buy-now" | "cart";
	items: { productId: number; quantity: number }[];
	/** Chỉ có khi source === "cart": variantId của các items để remove khỏi cart sau khi đặt. */
	variantIdsToClear?: string[];
}

export function setCheckoutIntent(intent: CheckoutIntent) {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
	} catch {
		// quota / private mode — bỏ qua
	}
}

export function getCheckoutIntent(): CheckoutIntent | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as CheckoutIntent;
		if (!parsed?.items?.length) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function clearCheckoutIntent() {
	if (typeof window === "undefined") return;
	sessionStorage.removeItem(STORAGE_KEY);
}
