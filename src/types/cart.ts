// ── Cart Types ──

export interface CartAddonItem {
	productId: string; // string ID như backend yêu cầu (e.g. "50033813")
	variantId: string;
	name: string;
	image?: string;
	price: number;
	originalPrice?: number;
	discountAmount?: number;
	quantity: number;
}

export interface CartWarrantyItem {
	productId: string;
	quantity: number;
	name: string;
	price: number;
	image?: string;
	accessoryId?: string;
}

export interface CartItem {
	productId: string; // string ID như backend yêu cầu (e.g. "50033813")
	variantId: string; // same format
	name: string;
	variantName?: string;
	image?: string;
	price: number;
	originalPrice?: number;
	quantity: number;
	thumbnailUrl?: string;
	slug?: string;
	sku: string;
	urlPath?: string;
	selected: boolean;
	/** Tên chương trình flash sale (nếu có) */
	promotionName?: string;
	/** Thời điểm kết thúc flash sale */
	promotionEndAt?: string | null;
	/** Attributes của variant đang chọn (để hiển thị nhãn như "Đen - 256GB") */
	variantAttributes?: { value?: string | null }[];
	/** Sản phẩm mua kèm */
	addons?: CartAddonItem[];
	/** Gói bảo hành mở rộng */
	warranty?: CartWarrantyItem;
}

export interface Cart {
	items: CartItem[];
	totalItems: number;
	totalPrice: number;
}
