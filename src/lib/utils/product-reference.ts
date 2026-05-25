import { ProductReferenceTypeEnum } from "@/types/product-reference-type";

interface GetDisplayProductNameParams {
	productReferenceType: ProductReferenceTypeEnum;
	productName: string;
	variantName?: string | null;
}

interface GetDisplayProductImageParams {
	productReferenceType: ProductReferenceTypeEnum;
	productThumbnailUrl?: string | null;
	variantThumbnailUrl?: string | null;
}

/**
 * Lấy tên hiển thị theo loại tham chiếu sản phẩm.
 * - Variant: ưu tiên variantName
 * - Combo (hoặc khác): dùng productName
 */
export function getDisplayProductName({
	productReferenceType,
	productName,
	variantName,
}: GetDisplayProductNameParams): string {
	if (
		productReferenceType === ProductReferenceTypeEnum.PRODUCT_VARIANT &&
		variantName
	) {
		return variantName;
	}
	return productName;
}

/**
 * Lấy thumbnail hiển thị theo loại tham chiếu sản phẩm.
 * - Variant: ưu tiên ảnh variant
 * - Combo (hoặc khác): ưu tiên ảnh product
 */
export function getDisplayProductThumbnailUrl({
	productReferenceType,
	productThumbnailUrl,
	variantThumbnailUrl,
}: GetDisplayProductImageParams): string {
	if (productReferenceType === ProductReferenceTypeEnum.PRODUCT_VARIANT) {
		return variantThumbnailUrl || productThumbnailUrl || "";
	}
	return productThumbnailUrl || variantThumbnailUrl || "";
}
