import { CACHE_TAGS } from "@/lib/constants";
import type {
	LayoutMenuItem,
	LayoutMenuSection,
	PageLayoutData,
} from "@/types/layout";
import type { GroupedSection } from "@/types/page";
import { api } from "./client";
import { API } from "./endpoints";

export async function getPageLayout(): Promise<PageLayoutData> {
	// Layout cache 60s ở Next.js — BE cache Redis 1 ngày + tự invalidate khi admin
	// sửa. Cache 60s đủ thời gian admin update + tránh `Cache-Control: no-store`
	// làm Lighthouse phạt bfcache.
	return api.get<PageLayoutData>(API.CMS.PAGE_LAYOUT, {
		next: { revalidate: 60, tags: [CACHE_TAGS.LAYOUT] },
	} as RequestInit);
}

/** BE lưu `item.data` dạng JSON string → parse về object trước khi FE dùng. */
function normalizeMenuItem(raw: unknown): LayoutMenuItem {
	const item = raw as LayoutMenuItem & { data?: unknown };
	let data: unknown = item.data;
	if (typeof data === "string") {
		try {
			data = JSON.parse(data);
		} catch {
			data = {};
		}
	}
	return { ...item, data: (data ?? {}) as LayoutMenuItem["data"] };
}

export function extractMenuItems(layout: PageLayoutData): LayoutMenuItem[] {
	const section = layout.sections.find((s) => s.key === "layout_menu") as
		| LayoutMenuSection
		| undefined;
	return (section?.items ?? []).map(normalizeMenuItem);
}

export function extractFooterMenu(
	layoutSections: GroupedSection[],
): LayoutMenuItem[] {
	const group = layoutSections.find((g) => g.section.key === "layout_footer");
	return (group?.items ?? []).map((it) =>
		normalizeMenuItem(it as unknown),
	);
}
