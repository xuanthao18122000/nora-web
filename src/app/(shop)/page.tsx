import type { Metadata } from "next";
import dynamicImport from "next/dynamic";

import PageRenderer from "@/components/feature/home/PageRenderer";
import { api } from "@/lib/api";

// Below-fold sections — lazy load để giảm JS bundle initial
const CustomerTestimonials = dynamicImport(
	() => import("@/components/feature/home/CustomerTestimonials"),
);
import { getPageLayout } from "@/lib/api/layout";
import { extractPageSections } from "@/lib/utils/page-sections";
import type { GroupedSection } from "@/types/page";
import { PageSectionKey } from "@/types/page";

// NORA không dùng Flash Sale real-time → cho cache 60s ở dev/prod.
// Mỗi 60s page tự revalidate; admin update content xuất hiện sau ≤ 60s.
export const revalidate = 60;

export const metadata: Metadata = {
	title:
		"Công ty TNHH Kỹ thuật - Dịch vụ NORA | Thiết bị cơ điện, hồ bơi, cửa xây dựng",
};

export default async function HomePage() {
	let homePageData: unknown = null;
	let heroFromLayout: GroupedSection | null = null;

	const [homePageResult, layoutResult] = await Promise.allSettled([
		api.get(`/pages/by-code/home_page`, {
			next: { revalidate: 60 },
		} as RequestInit),
		getPageLayout(),
	]);

	if (homePageResult.status === "fulfilled") {
		homePageData = homePageResult.value;
	} else {
		console.error(
			"[HomePage] Failed to fetch home_page:",
			homePageResult.reason,
		);
	}

	if (layoutResult.status === "fulfilled") {
		const layout = layoutResult.value;
		const layoutSections: GroupedSection[] = (layout.sections ?? []).map(
			(section) => ({
				section: section as unknown as GroupedSection["section"],
				items: (section.items ?? []) as GroupedSection["items"],
			}),
		);
		heroFromLayout =
			layoutSections.find(
				(g) => g.section.key === PageSectionKey.HERO_BANNER,
			) ?? null;
	} else {
		console.error(
			"[HomePage] Failed to fetch layout (hero banner):",
			layoutResult.reason,
		);
	}

	const sections = homePageData
		? extractPageSections(
				homePageData as Parameters<typeof extractPageSections>[0],
			)
		: [];

	return (
		<div className="bg-gray-100 min-h-screen">
			<PageRenderer sections={sections} heroFromLayout={heroFromLayout} />
			<div className="container-inner flex flex-col gap-2 md:gap-4 pb-4 md:pb-8">
				<CustomerTestimonials />
			</div>
		</div>
	);
}
