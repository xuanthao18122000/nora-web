// ── Trade-In Types ──
// Mapped from: docs/api/trade-in-fe.md, docs/api/trade-in-stepper.md

import type { PaginatedResponse } from "./common";

/**
 * Trade-in parent product — displayed in product grid.
 * Backend deduplicates by parentProductId, keeping the program with the best finalTradeInPrice.
 */
export interface TradeinParentProductFE {
	id: string;
	name: string | null;
	thumbnailUrl: string | null;
	slug: string;
	price: number;
	tradeInSubsidy: number;
	tradeInSubsidyDmember: number;
	finalTradeInPrice: number;
}

/**
 * Response for paginated trade-in products.
 */
export type TradeinProductsResponse = PaginatedResponse<
	TradeinParentProductFE[]
>;

/**
 * Tab-level group info with selection state.
 * From: GET /fe/tradein-program-groups/with-products → groups[]
 */
export interface TradeinGroupTab {
	id: number;
	groupName: string | null;
	groupDescription: string | null;
	isSelected: boolean;
}

/**
 * Response for the unified groups+products endpoint.
 * groups[].isSelected indicates the active group whose products are loaded.
 * From: GET /fe/tradein-program-groups/with-products?groupId=&search=&page=&limit=
 */
export interface TradeinGroupsWithProductsResponse {
	groups: TradeinGroupTab[];
	products: PaginatedResponse<TradeinParentProductFE[]> | null;
}

// ── Variant Types ──
// Mapped from: ddv-web-api tradein-criteria-fe.dto.ts

export interface TradeinVariantAttributeInfo {
	id: number | null;
	value: string | null;
	meta: string | null;
	attributeId: string;
	attributeLabel: string | null;
}

export interface TradeinVariantInfo {
	id: string;
	coreOriginalName: string | null;
	thumbnailUrl: string | null;
	sku: string;
	/** Trade-in buying price for this variant (VND), sorted DESC by BE */
	buyingPrice: number;
	attributes: TradeinVariantAttributeInfo[];
}

// ── Criteria & Price Calculation Types ──
// Mapped from: docs/api/trade-in-stepper.md

/**
 * A single criteria option within a group.
 * From: GET /fe/tradein-products/:parentProductId/criteria → criteriaGroups[].options[]
 */
export interface TradeinCriteriaOption {
	id: number;
	name: string;
	priority: number | null;
	/** VND payout for this option (server: basePrice + adjustment) */
	price: number;
	/** Signed delta from basePrice (e.g. -50000 means deduct 50k) */
	adjustment: number;
	isDefault?: boolean;
}

/**
 * A criteria group containing options for condition assessment.
 * type: 1=SINGLE_SELECT (radio), 2=MULTI_SELECT (checkbox)
 */
export interface TradeinCriteriaGroup {
	id: number;
	groupName: string;
	/** 1=SINGLE_SELECT, 2=MULTI_SELECT */
	type: number;
	priority: number | null;
	options: TradeinCriteriaOption[];
}

/**
 * Response for GET /fe/tradein-products/:parentProductId/criteria (optional ?programId=)
 */
export interface TradeinProductCriteriaResponse {
	programId: number;
	programName: string;
	basePrice: number;
	tradeInSubsidy: number;
	tradeInSubsidyDmember: number;
	product: {
		id: string;
		name: string | null;
		thumbnailUrl: string | null;
		slug: string;
	};
	criteriaGroups: TradeinCriteriaGroup[];
	variants: TradeinVariantInfo[];
}

// ── Upgrade Product Types (Step 2: "Chọn máy lên đời") ──

/** Parent product displayed in upgrade device grid (from upgrade API). */
export interface UpgradeProductItem {
	id: string;
	name: string;
	slug: string;
	urlPath: string;
	thumbnailUrl: string | null;
	/** Selling price (VND) */
	minPrice: number;
	maxPrice: number;
	listedPrice: number | null;
}

/**
 * Response for GET /fe/tradein-upgrade/products.
 * groups[].isSelected indicates the active group whose products are loaded.
 */
export interface UpgradeGroupsWithProductsResponse {
	groups: TradeinGroupTab[];
	products: PaginatedResponse<UpgradeProductItem[]> | null;
}

/** Variant attribute for upgrade product. */
export interface UpgradeVariantAttribute {
	attributeId: string;
	attributeLabel: string | null;
	value: string | null;
}

/** Variant of the upgrade product (from GET /fe/products/variants). */
export interface UpgradeVariantInfo {
	id: string;
	coreOriginalName: string | null;
	thumbnailUrl: string | null;
	sku: string;
	/** Selling price (VND) */
	sellingPrice: number;
	listedPrice: number;
	stockQuantity: number;
	attributes: UpgradeVariantAttribute[];
}
