/** Minimal shape for building a Maps search string (street + admin). */
export type StoreDirectionsAddressParts = {
	address?: string | null;
	newAddress?: string | null;
};

/**
 * Geocode by text only. `newAddress` from APIs is often ward + city; `address` is the street line.
 * Combine when both exist so Maps gets a full query.
 */
export function buildStoreMapsSearchQuery(
	store: StoreDirectionsAddressParts,
): string | null {
	const street = store.address?.trim() ?? "";
	const admin = store.newAddress?.trim() ?? "";
	const line = street && admin ? `${street}, ${admin}` : street || admin;
	return line || null;
}

export function getStoreGoogleMapsUrl(
	store: StoreDirectionsAddressParts,
): string | null {
	const q = buildStoreMapsSearchQuery(store);
	if (!q) return null;
	return `https://maps.google.com/?q=${encodeURIComponent(q)}`;
}
