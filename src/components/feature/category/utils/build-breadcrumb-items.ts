import { toHref } from "@/lib/utils/href";
import type { CategoryPageBreadcrumb } from "@/types/category-page";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export function buildBreadcrumbItems(
	breadcrumbs: CategoryPageBreadcrumb[],
): BreadcrumbItem[] {
	return [
		{ label: "Trang chủ", href: "/" },
		...breadcrumbs.slice(0, -1).map((b) => ({
			label: b.name,
			href: toHref(b.slug) as string,
		})),
		...(breadcrumbs.length > 0
			? [{ label: breadcrumbs[breadcrumbs.length - 1].name }]
			: []),
	];
}
