import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { getImageUrl } from "@/lib/utils/image";
import { parseSectionItemData } from "@/lib/utils/page-sections";
import type { GroupedSection, PageSectionItem } from "@/types/page";

interface BoxDanhMucExtra {
	subtitle?: string;
	cols?: 4 | 5 | 6;
	showTitle?: boolean;
}

interface BoxDanhMucItemData {
	imageUrl?: string | null;
}

interface BoxDanhMucSectionProps {
	group: GroupedSection;
}

// Item width = (100% - (cols-1)*gap) / cols. Gap = 0.75rem (mobile) / 1rem (md).
// Mobile: 2 cols, sm: 3 cols, md: dynamic theo cols extra.
const ITEM_BASIS_CLASS: Record<4 | 5 | 6, string> = {
	4: "basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] md:basis-[calc((100%-3rem)/4)]",
	5: "basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] md:basis-[calc((100%-4rem)/5)]",
	6: "basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] md:basis-[calc((100%-5rem)/6)]",
};

function toHref(targetUrl: string | undefined): string {
	if (!targetUrl) return "#";
	if (targetUrl.startsWith("/") || targetUrl.startsWith("http")) return targetUrl;
	return `/${targetUrl}`;
}

export default function BoxDanhMucSection({ group }: BoxDanhMucSectionProps) {
	const { section, items } = group;
	const extra = (section.extra ?? {}) as BoxDanhMucExtra;
	const cols: 4 | 5 | 6 =
		extra.cols === 4 || extra.cols === 6 ? extra.cols : 5;

	const visibleItems = (items ?? [])
		.filter((it) => it.status !== 0 && it.status !== -1)
		.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

	if (visibleItems.length === 0) return null;

	const showTitle = extra.showTitle !== false;
	const sectionTitle = section.name || "Danh mục";

	return (
		<section className="rounded-2xl bg-white p-4 md:p-6">
			{(showTitle || extra.subtitle) && (
				<header className="mb-5 text-center md:mb-6">
					{showTitle && (
						<h2 className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600 md:text-sm">
							<LayoutGrid className="size-3.5" aria-hidden="true" />
							{sectionTitle}
						</h2>
					)}
					{extra.subtitle && (
						<p className="mx-auto mt-3 max-w-3xl text-sm text-gray-500 md:text-base">
							{extra.subtitle}
						</p>
					)}
				</header>
			)}

			<ul className="flex flex-wrap justify-center gap-3 md:gap-4">
				{visibleItems.map((item) => (
					<BoxItem key={item.id} item={item} basisClass={ITEM_BASIS_CLASS[cols]} />
				))}
			</ul>
		</section>
	);
}

function BoxItem({ item, basisClass }: { item: PageSectionItem; basisClass: string }) {
	const data = parseSectionItemData<BoxDanhMucItemData>(item);
	const rawImage = data?.imageUrl ?? null;
	const imageSrc = getImageUrl(rawImage ?? "") || null;
	const href = toHref(item.targetUrl);

	return (
		<li className={cn("group", basisClass)}>
			<Link
				href={href}
				aria-label={item.name}
				className="flex h-full flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-2 text-center transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:p-3"
			>
				<div className="relative aspect-square w-20 overflow-hidden rounded-lg bg-gray-50 md:w-24">
					{imageSrc ? (
						<Image
							src={imageSrc}
							alt={item.name}
							fill
							sizes="96px"
							className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div
							aria-hidden="true"
							className="flex h-full w-full items-center justify-center"
						>
							<LayoutGrid className="size-6 text-gray-300" />
						</div>
					)}
				</div>
				<div className="line-clamp-2 text-xs font-semibold text-gray-900 transition-colors group-hover:text-primary-600 md:text-sm">
					{item.name}
				</div>
			</Link>
		</li>
	);
}
