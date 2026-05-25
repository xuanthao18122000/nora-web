"use client";

import { ChevronRight, Package } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Carousel from "@/components/common/Carousel";
import { ProductCard } from "@/components/common/ProductCard";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { mapCategoryProductToCard } from "@/components/feature/category/utils/map-category-product";
import { toHref } from "@/lib/utils/href";
import type { CategoryPageProductItem } from "@/types/category-page";
import type { GroupedSection } from "@/types/page";

interface TabItem {
	id: number | string;
	name: string;
	slug?: string;
}

interface ProductTabbedSectionProps {
	group: GroupedSection;
}

const CAROUSEL_GAP = 8;

export default function ProductTabbedSection({
	group,
}: ProductTabbedSectionProps) {
	const { section } = group;
	const pathname = usePathname();

	// Tabs still come from `section.config`, but layout settings
	// (slidesPerView, rows) are persisted by CMS into `section.extra`.
	const config = (section.config || {}) as { tabs?: TabItem[] };
	const extra = (section.extra || {}) as {
		slidesPerView?: number | string;
		rows?: 1 | 2 | "1" | "2";
	};

	const slidesPerView = Number(extra.slidesPerView) || 4;
	const rows = Number(extra.rows) === 2 ? 2 : 1;

	let tabs = config.tabs || [];
	let products: CategoryPageProductItem[] = [];

	if (group.items && group.items.length > 0) {
		const parsedTabs = group.items
			.filter((i) => i.type === "list_tabs")
			.map((tab) => {
				let data: { slug?: string } = {};
				try {
					data =
						typeof tab.data === "string"
							? JSON.parse(tab.data)
							: tab.data;
				} catch {}
				return { id: tab.id, name: tab.name, slug: data.slug || "" };
			});
		if (parsedTabs.length > 0) tabs = parsedTabs;

		products = group.items
			.filter((i) => i.type === "list_products")
			.map((item) => {
				let data: {
					productId?: number | string;
					thumbnailUrl?: string | null;
					price?: number | string;
					salePrice?: number | string | null;
					slug?: string;
					averageRating?: number | string | null;
					reviewCount?: number;
				} = {};
				try {
					data =
						typeof item.data === "string"
							? JSON.parse(item.data)
							: (item.data as typeof data);
				} catch {}
				const id = String(data.productId ?? item.id ?? "");
				if (!id) return null;
				return {
					id,
					name: item.name ?? "",
					slug: String(data.slug ?? ""),
					thumbnailUrl: data.thumbnailUrl ?? null,
					price: data.price ?? 0,
					salePrice: data.salePrice ?? null,
					averageRating: data.averageRating ?? null,
					reviewCount: data.reviewCount ?? 0,
				} satisfies CategoryPageProductItem;
			})
			.filter(Boolean) as CategoryPageProductItem[];
	}

	if (products.length === 0) {
		return null;
	}

	// Group products into "columns" of `rows` items each so that one carousel
	// slide stacks `rows` products vertically.
	const columns: CategoryPageProductItem[][] = [];
	for (let i = 0; i < products.length; i += rows) {
		columns.push(products.slice(i, i + rows));
	}

	return (
		<SectionWrapper
			title={section.name}
			titleIcon={<Package className="size-3.5" aria-hidden="true" />}
			tabs={
				tabs.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{tabs.map((tab) => {
							const href = tab.slug
								? toHref(tab.slug)
								: section.url
									? (section.url as Route)
									: "#";
							const isActive =
								typeof href === "string" && pathname
									? pathname === href.split("?")[0]
									: false;

							return (
								<Link
									key={String(tab.id)}
									href={href}
									aria-current={isActive ? "page" : undefined}
									className={[
										"min-w-fit rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
										isActive
											? "border-primary-500 bg-primary-50 text-primary-700"
											: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
									].join(" ")}
								>
									{tab.name}
								</Link>
							);
						})}
					</div>
				) : null
			}
			footer={
				section.url ? (
					<Link
						href={section.url as Route}
						className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 bg-white"
					>
						Xem thêm sản phẩm
						<ChevronRight className="size-4" />
					</Link>
				) : null
			}
			contentClassName="flex-1"
		>
			<Carousel
				gap={CAROUSEL_GAP}
				showNav={columns.length > slidesPerView}
				navPosition="inside"
				navWrapperClasses={{ left: "-left-3", right: "-right-3" }}
			>
				{columns.map((col, colIdx) => (
					<div
						key={col[0]?.id ?? colIdx}
						className="shrink-0 flex flex-col gap-2 w-[180px] md:w-[227px]"
					>
						{col.map((p, rowIdx) => {
							const card = mapCategoryProductToCard(p);
							return (
								<ProductCard.Preset
									key={p.id}
									product={card}
									priority={colIdx === 0 && rowIdx === 0}
								/>
							);
						})}
					</div>
				))}
			</Carousel>
		</SectionWrapper>
	);
}
