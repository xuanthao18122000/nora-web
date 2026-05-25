import type { GroupedSection } from "@/types/page";

interface FlashSaleProps {
	group?: GroupedSection;
	categoryId?: number;
}

/**
 * Acquyhn không có module discount-programs / flash sale.
 * Stub component trả `null` để PageRenderer + CategoryPageWrapper
 * không cần sửa. Khi nào cần Flash Sale thực thì viết lại tại đây.
 */
export default function FlashSale(_props: FlashSaleProps) {
	return null;
}
