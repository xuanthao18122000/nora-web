"use client";

import { LayoutGrid } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { createContext, type ReactNode, use } from "react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { toHref } from "@/lib/utils/href";
import type { SearchCategoryItem } from "@/types/search";

// --- Context ---

export interface ResultsCategoriesContextValue {
	items: SearchCategoryItem[];
	query: string;
	currentSlug: string | undefined;
}

export const ResultsCategoriesContext =
	createContext<ResultsCategoriesContextValue | null>(null);

// --- Root (provider) ---

export interface ResultsCategoriesRootProps {
	items: SearchCategoryItem[];
	query: string;
	currentSlug?: string | undefined;
	children: ReactNode;
}

export function ResultsCategoriesRoot({
	items,
	query,
	currentSlug,
	children,
}: ResultsCategoriesRootProps) {
	return (
		<ResultsCategoriesContext.Provider
			value={{ items, query: query ?? "", currentSlug }}
		>
			{children}
		</ResultsCategoriesContext.Provider>
	);
}

// --- ChipList ---
export function ResultsCategoriesChipList() {
	const ctx = use(ResultsCategoriesContext);
	if (!ctx) return null;

	const { items, query, currentSlug } = ctx;
	const allSelected = !currentSlug;

	const searchHref = (
		query.trim().length > 0
			? `/search?q=${encodeURIComponent(query.trim())}`
			: "/search"
	) as Route;

	return (
		<div className="contents" role="list">
			<Link href={searchHref} role="listitem" className="shrink-0">
				<Button
					type="button"
					variant="filter"
					size="sm"
					pressed={allSelected}
					className={cn("gap-2 whitespace-nowrap")}
				>
					<LayoutGrid className="size-5 shrink-0" aria-hidden />
					Tất cả
				</Button>
			</Link>
			{items.map((item) => (
				<ResultsCategoriesChip key={item.id} item={item} />
			))}
		</div>
	);
}

// --- Chip ---

export interface ResultsCategoriesChipProps {
	item: SearchCategoryItem;
}

export function ResultsCategoriesChip({ item }: ResultsCategoriesChipProps) {
	const ctx = use(ResultsCategoriesContext);
	if (!ctx) return null;

	const { currentSlug } = ctx;
	const isSelected = currentSlug === item.slug;

	return (
		<Link href={toHref(item.slug)} role="listitem" className="shrink-0">
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
}

// --- Compound export ---

export const ResultsCategories = {
	Root: ResultsCategoriesRoot,
	ChipList: ResultsCategoriesChipList,
	Chip: ResultsCategoriesChip,
};
