/**
 * Simple product detail — khớp BE acquyhn `Product` entity.
 * Sản phẩm acquyhn không có variant/warranty/combo/discount-program/etc.
 */

export interface SimpleProductCategory {
	id: number;
	name: string;
	slug: string;
}

export interface SimpleProductBrand {
	id: number;
	name: string;
	slug: string;
	logoUrl?: string | null;
}

export interface SimpleProductDetail {
	id: number;
	name: string;
	slug: string;
	sku: string;
	shortDescription?: string | null;
	description?: string | null;
	price: number | string;
	salePrice?: number | string | null;
	stockQuantity: number;
	unit?: string | null;
	thumbnailUrl?: string | null;
	images?: string[] | null;
	brand?: SimpleProductBrand | null;
	origin?: string | null;
	barcode?: string | null;
	priority?: number;
	viewCount?: number;
	soldCount?: number;
	averageRating?: number;
	reviewCount?: number;
	isBestSeller?: boolean;
	showPrice?: boolean;
	metaTitle?: string | null;
	metaDescription?: string | null;
	metaKeywords?: string | null;
	canonicalUrl?: string | null;
	status?: number;
	createdAt?: string;
	updatedAt?: string;
	productCategories?: { category: SimpleProductCategory }[];
}
