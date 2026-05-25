"use client";

import { LayoutGrid } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "@/components/common/Button";
import Carousel from "@/components/common/Carousel";
import { cn } from "@/lib/utils";
import { toHref } from "@/lib/utils/href";
import { getImageUrl } from "@/lib/utils/image";

export interface CategoryChipItem {
	id: string | number;
	name: string;
	slug: string;
	iconUrl?: string | null;
	thumbnailUrl?: string | null;
}

export interface CategoryChipListProps {
	items: CategoryChipItem[];
	allHref?: string;
	currentSlug?: string;
	showAll?: boolean;
	className?: string;
}

function IconChip({
	item,
	isSelected,
}: {
	item: CategoryChipItem;
	isSelected: boolean;
}) {
	const [failed, setFailed] = useState(false);
	const handleError = useCallback(() => setFailed(true), []);

	if (failed) {
		return (
			<Link href={toHref(item.slug)}>
				<Button
					type="button"
					variant="filter"
					size="sm"
					pressed={isSelected}
					className={cn(
						"min-w-0",
						isSelected && "text-blue-500 border-blue-500",
					)}
				>
					{item.name}
				</Button>
			</Link>
		);
	}

	return (
		<Link
			href={toHref(item.slug)}
			className={cn(
				"flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-white px-3 transition-colors",
				isSelected
					? "border-2 border-primary-500 text-primary-600"
					: "border-gray-200 text-gray-800 hover:border-primary-400 hover:text-primary-600",
			)}
		>
			<span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50">
				<Image
					src={getImageUrl(item.iconUrl!)}
					alt={item.name}
					width={28}
					height={28}
					className="h-full w-full object-contain pointer-events-none"
					draggable={false}
					onError={handleError}
				/>
			</span>
			<span className="text-sm font-medium whitespace-nowrap">
				{item.name}
			</span>
		</Link>
	);
}

export function CategoryChipList({
	items,
	allHref,
	currentSlug,
	showAll = true,
	className,
}: CategoryChipListProps) {
	const allSelected = !currentSlug;
	const chipItems: React.ReactNode[] = [];

	if (showAll && allHref) {
		chipItems.push(
			<Link key="__all" href={allHref as Route}>
				<Button
					type="button"
					variant="filter"
					size="sm"
					pressed={allSelected}
					className="gap-2"
				>
					<LayoutGrid className="size-5 shrink-0" aria-hidden />
					Tất cả
				</Button>
			</Link>,
		);
	}

	for (const item of items) {
		const isSelected = currentSlug === item.slug;
		const imageSrc = item.iconUrl ?? item.thumbnailUrl ?? null;
		// Có ảnh → render chip ảnh + name. Không có ảnh → fallback text button.
		if (imageSrc) {
			chipItems.push(
				<IconChip
					key={item.id}
					item={{ ...item, iconUrl: imageSrc }}
					isSelected={isSelected}
				/>,
			);
		} else {
			chipItems.push(
				<Link key={item.id} href={toHref(item.slug)}>
					<Button
						type="button"
						variant="filter"
						size="sm"
						pressed={isSelected}
						className={cn(
							"min-w-0",
							isSelected && "text-blue-500 border-blue-500",
						)}
					>
						{item.name}
					</Button>
				</Link>,
			);
		}
	}

	return (
		<div className={className}>
			<Carousel gap={8} showNav={false}>
				{chipItems}
			</Carousel>
		</div>
	);
}
