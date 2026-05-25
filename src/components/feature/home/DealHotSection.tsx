"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Carousel from "@/components/common/Carousel";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { getImageUrl } from "@/lib/utils/image";
import { parseSectionItemData } from "@/lib/utils/page-sections";
import type { GroupedSection, LinkItemData } from "@/types/page";

const DEFAULT_TITLE = "Deal hot - Giá tốt";

function dismissedStorageKey(sectionId: number) {
	return `ddv-deal-hot-dismissed-${sectionId}`;
}

export interface DealHotSectionProps {
	group: GroupedSection;
	/**
	 * Figma: header close control. When dismissed, hidden until the browser session ends.
	 */
	dismissible?: boolean;
}

export default function DealHotSection({
	group,
	dismissible = true,
}: DealHotSectionProps) {
	const { section, items } = group;
	const sectionId = section.id;
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		try {
			if (
				typeof window !== "undefined" &&
				sessionStorage.getItem(dismissedStorageKey(sectionId)) === "1"
			) {
				setDismissed(true);
			}
		} catch {
			/* ignore */
		}
	}, [sectionId]);

	const onDismiss = useCallback(() => {
		setDismissed(true);
		try {
			sessionStorage.setItem(dismissedStorageKey(sectionId), "1");
		} catch {
			/* ignore */
		}
	}, [sectionId]);

	if (dismissed) return null;

	const tiles = items
		.map((item) => {
			const data = parseSectionItemData<LinkItemData>(item);
			if (!data?.icon) return null;
			const src = getImageUrl(data.icon);
			if (!src) return null;
			const href = data.url ?? item.targetUrl ?? "/";
			return { item, src, href };
		})
		.filter((x): x is NonNullable<typeof x> => x !== null);

	if (tiles.length === 0) return null;

	const title = section.name?.trim() || DEFAULT_TITLE;
	const titleId = `deal-hot-title-${sectionId}`;

	return (
		<SectionWrapper
			title={title}
			className="max-w-full"
			headerTrailing={
				dismissible ? (
					<button
						type="button"
						onClick={onDismiss}
						className="flex size-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-700 transition-colors hover:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:size-8 md:min-h-0 md:min-w-0"
						aria-label="Đóng"
					>
						<X className="size-3" aria-hidden />
					</button>
				) : null
			}
			aria-labelledby={titleId}
		>
			<Carousel
				gap={8}
				showNav
				navSize="sm"
				navPosition="inside"
				className="w-full"
			>
				{tiles.map(({ item, src, href }) => (
					<a
						key={item.id}
						href={href}
						className="group/item flex w-[140px] shrink-0 flex-col gap-2 rounded-lg bg-white p-2 md:w-[180px]"
					>
						<div className="relative aspect-square w-full overflow-hidden rounded">
							<Image
								src={src}
								alt={item.name || "Ưu đãi"}
								fill
								className="object-cover transition-transform duration-300 group-hover/item:scale-105"
								sizes="(max-width: 768px) 140px, 20vw"
							/>
						</div>
						<p className="w-full truncate px-0.5 text-left text-sm font-semibold leading-5 text-gray-900">
							{item.name}
						</p>
					</a>
				))}
			</Carousel>
		</SectionWrapper>
	);
}
