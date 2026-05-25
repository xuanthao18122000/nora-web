import { useMemo } from "react";
import type { ProductDetail, ProductVariant } from "@/types/product";

export function normalizeAttrValue(value: unknown): string | null {
	if (typeof value === "string") return value.trim().toLowerCase();
	if (typeof value === "number") return String(value).trim().toLowerCase();
	return null;
}

export function useVariantAttributes(
	product: ProductDetail | undefined | null,
) {
	const attributeGroups = useMemo(() => {
		if (!product?.variants) return [];
		const groupsById = new Map<
			string,
			{
				attributeId: string;
				label: string;
				valuesMap: Map<
					string,
					{
						value: string;
						minSellingPrice: number;
						hasStock: boolean;
					}
				>;
			}
		>();

		for (const v of product.variants) {
			const sellingPrice = v.sellingPrice;
			const inStock = v.stockQuantity > 0;

			for (const a of v.attributes) {
				if (!a.attributeId) continue;

				if (!groupsById.has(a.attributeId)) {
					groupsById.set(a.attributeId, {
						attributeId: a.attributeId,
						label: a.attributeLabel ?? a.attributeId,
						valuesMap: new Map(),
					});
				}
				const group = groupsById.get(a.attributeId)!;

				const normValue = normalizeAttrValue(a.value);
				if (!normValue) continue;

				if (!group.valuesMap.has(normValue)) {
					group.valuesMap.set(normValue, {
						value: a.value ?? "",
						minSellingPrice: sellingPrice,
						hasStock: inStock,
					});
				} else {
					const existing = group.valuesMap.get(normValue)!;
					if (sellingPrice < existing.minSellingPrice) {
						existing.minSellingPrice = sellingPrice;
					}
					if (inStock) existing.hasStock = true;
				}
			}
		}

		return [...groupsById.values()].map((g) => {
			const sortedValues = [...g.valuesMap.values()]
				.sort((a, b) => {
					const aStock = a.hasStock ? 1 : 0;
					const bStock = b.hasStock ? 1 : 0;
					if (aStock !== bStock) return bStock - aStock;
					return a.minSellingPrice - b.minSellingPrice;
				})
				.map((v) => v.value);
			return {
				attributeId: g.attributeId,
				label: g.label,
				values: sortedValues,
			};
		});
	}, [product]);

	const extractSelectedAttrsById = (variant: ProductVariant) => {
		const m = new Map<string, string>();
		for (const a of variant.attributes ?? []) {
			if (!a.attributeId) continue;
			const value = normalizeAttrValue(a.value);
			if (!value) continue;
			m.set(a.attributeId, value);
		}
		return m;
	};

	const findVariantForAttributeValue = (
		attributeId: string,
		value: string,
		selectedVariant: ProductVariant,
	): ProductVariant | null => {
		const variants = product?.variants ?? [];
		const selectedAttrsById = extractSelectedAttrsById(selectedVariant);
		const otherAttributeIds = [...selectedAttrsById.keys()].filter(
			(id) => id !== attributeId,
		);

		const primary = variants.find((v) => {
			const a = v.attributes.find((x) => x.attributeId === attributeId);
			if (!a) return false;
			if (normalizeAttrValue(a.value) !== value) return false;

			for (const otherId of otherAttributeIds) {
				const expected = selectedAttrsById.get(otherId);
				if (!expected) continue;
				const otherAttr = v.attributes.find(
					(x) => x.attributeId === otherId,
				);
				if (!otherAttr) return false;
				if (normalizeAttrValue(otherAttr.value) !== expected)
					return false;
			}

			return true;
		});

		if (primary) return primary;

		return (
			variants.find((v) => {
				const a = v.attributes.find(
					(x) => x.attributeId === attributeId,
				);
				return a && normalizeAttrValue(a.value) === value;
			}) ?? null
		);
	};

	const getThumbForAttributeValue = (
		attributeId: string,
		value: string,
	): string | null => {
		const variant = product?.variants?.find((v) =>
			v.attributes.some(
				(a) =>
					a.attributeId === attributeId &&
					normalizeAttrValue(a.value) === value,
			),
		);
		if (!variant) return null;

		const attr = variant.attributes.find(
			(a) =>
				a.attributeId === attributeId &&
				normalizeAttrValue(a.value) === value,
		);
		const meta = attr?.meta;
		if (meta && typeof meta === "object") {
			const m = meta as Record<string, unknown>;
			const metaThumb =
				(typeof m.thumbnailUrl === "string" && m.thumbnailUrl) ||
				(typeof m.imageUrl === "string" && m.imageUrl) ||
				null;
			if (metaThumb) return metaThumb; // Note: you might need getImageUrl here, but caller can do it
		}

		if (variant.thumbnailUrl) return variant.thumbnailUrl;
		const firstImg = variant.images?.[0]?.imageUrl;
		if (firstImg) return firstImg;

		return null;
	};

	return {
		attributeGroups,
		findVariantForAttributeValue,
		getThumbForAttributeValue,
	};
}
