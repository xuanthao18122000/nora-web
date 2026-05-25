"use client";

import { LayoutGrid } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/common/Button";
import Carousel from "@/components/common/Carousel";
import { cn } from "@/lib/utils";
import { toHref } from "@/lib/utils/href";
import { ResultsCategoriesContext } from "./results-categories-chips.client";

export function SearchCategoriesCarousel() {
	const ctx = use(ResultsCategoriesContext);
	if (!ctx) return null;

	const { items, query, currentSlug } = ctx;
	const allSelected = !currentSlug;

	const searchHref = (
		query.trim().length > 0
			? `/search?q=${encodeURIComponent(query.trim())}`
			: "/search"
	) as Route;

	const children = [
		<Link key="__all" href={searchHref}>
			<Button
				type="button"
				variant="filter"
				size="sm"
				pressed={allSelected}
				className="gap-2 whitespace-nowrap"
			>
				<LayoutGrid className="size-5 shrink-0" aria-hidden />
				Tất cả
			</Button>
		</Link>,
		...items.map((item) => {
			const isSelected = currentSlug === item.slug;
			return (
				<Link key={item.id} href={toHref(item.slug)}>
					<Button
						type="button"
						variant="filter"
						size="sm"
						pressed={isSelected}
						className={cn(
							"whitespace-nowrap",
							isSelected && "text-blue-500 border-blue-500",
						)}
					>
						{item.name}
					</Button>
				</Link>
			);
		}),
	];

	return (
		<Carousel gap={8} showNav={false}>
			{children}
		</Carousel>
	);
}
