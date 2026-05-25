/**
 * useVariantLabel — resolves a display string from variant attributes.
 *
 * Priority:
 *  1. Fetched attributes (from cart/order API — already populated)
 *  2. Fallback raw string (productVariantName / coreOriginalName)
 *
 * Returns null when no meaningful label can be built.
 */
export function useVariantLabel(
	variantAttributes?: { value?: string | null }[] | null,
	fallbackName?: string | null,
): string | null {
	if (variantAttributes && variantAttributes.length > 0) {
		const label = variantAttributes
			.map((a) => a.value)
			.filter(Boolean)
			.join(" - ");
		if (label) return label;
	}
	return fallbackName ?? null;
}
