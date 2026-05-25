import {
	Device,
	type GroupedSection,
	type PageSection,
	type PageSectionItem,
} from "@/types/page";

/**
 * Groups flat `PageSectionItem[]` (from the findBySlug API) into
 * `GroupedSection[]`, sorted by `section.position` ascending.
 */
export function groupItemsBySection(
	items: PageSectionItem[],
): GroupedSection[] {
	const map = new Map<number, GroupedSection>();

	for (const item of items) {
		if (!item.section) continue;
		const sectionId = item.section.id ?? item.pageSectionId;
		let group = map.get(sectionId);

		if (!group) {
			group = { section: item.section, items: [] };
			map.set(sectionId, group);
		}

		group.items.push(item);
	}

	for (const group of map.values()) {
		group.items.sort((a, b) => a.position - b.position);
	}

	return Array.from(map.values()).sort(
		(a, b) => a.section.position - b.section.position,
	);
}

/**
 * Safely JSON.parse the `data` string on a `PageSectionItem`.
 * Returns `null` when `data` is absent or invalid JSON.
 */
export function parseSectionItemData<T>(item: PageSectionItem): T | null {
	if (!item.data) return null;
	if (typeof item.data === "object") return item.data as T;
	try {
		return JSON.parse(item.data) as T;
	} catch {
		return null;
	}
}

/**
 * Extract `GroupedSection[]` from an API response that may carry either
 * nested `sections` (with embedded items) or flat `items`.
 * Layout sections (keys starting with "layout_") are filtered out.
 */
export function extractPageSections(data: {
	sections?: PageSection[];
	items?: PageSectionItem[];
}): GroupedSection[] {
	let groups: GroupedSection[];

	if (data.sections && data.sections.length > 0) {
		groups = data.sections
			.filter((s) => s.status == null || s.status === 1)
			.sort((a, b) => a.position - b.position)
			.map((section) => ({
				section,
				items: (section.items ?? [])
					.filter((i) => i.status == null || i.status === 1)
					.sort((a, b) => a.position - b.position),
			}));
	} else if (data.items && data.items.length > 0) {
		groups = groupItemsBySection(
			data.items.filter((i) => i.status == null || i.status === 1),
		);
	} else {
		return [];
	}

	return groups.filter((g) => !g.section.key?.startsWith("layout_"));
}

/**
 * Picks section items for SSR viewport (same rules as home `PromotionGrid`).
 * Desktop: `desktop` + `all`. Mobile: `mobile` + `all` if any item is
 * mobile-specific; otherwise falls back to desktop + all assets.
 */
export function getPageSectionItemsForViewport(
	items: PageSectionItem[],
	isMobile: boolean,
): PageSectionItem[] {
	const desktopItems = items.filter(
		(item) =>
			item.deviceType === Device.DESKTOP ||
			item.deviceType === Device.ALL,
	);
	const mobileItems = items.filter(
		(item) =>
			item.deviceType === Device.MOBILE || item.deviceType === Device.ALL,
	);
	const hasMobileSpecificItems = items.some(
		(item) => item.deviceType === Device.MOBILE,
	);
	return isMobile
		? hasMobileSpecificItems
			? mobileItems
			: desktopItems
		: desktopItems;
}
