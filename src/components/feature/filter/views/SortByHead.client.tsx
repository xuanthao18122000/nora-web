"use client";

import type { ReactNode } from "react";
import Carousel from "@/components/common/Carousel";
import { cn } from "@/lib/utils";
import type { SortOption } from "../components/SortBy.client";
import { SortBy } from "../components/SortBy.client";
import { useSortContext } from "../context/sort-provider.client";

export interface SortByHeadProps {
	options?: SortOption[];
	defaultValue?: string;
	paramKey?: string;
	label?: string;
	className?: string;
	showSearch?: boolean;
	searchPlaceholder?: string;
	searchParamKey?: string;
	children?: ReactNode;
}

function SortByCarousel({ label }: { label: string }) {
	const { state } = useSortContext();

	return (
		<div
			className="flex w-full min-w-0 flex-1 items-center gap-2"
			role="group"
			aria-label={label}
		>
			<SortBy.Label label={label} />
			<div className="min-w-0 flex-1 overflow-hidden">
				<Carousel gap={8} showNav={false}>
					{state.options.map((option) => (
						<SortBy.Button key={option.value} option={option} />
					))}
				</Carousel>
			</div>
		</div>
	);
}

/**
 * Head bar layout from Figma: 4-col grid, sort (cols 1–3) + search (col 4).
 * gap 16px. Sort section: gap 8px. Parent controls padding (e.g. px-6 py-3).
 */
export function SortByHead({
	options,
	defaultValue = "relevance",
	paramKey = "sort",
	label = "Sắp xếp theo:",
	className,
	showSearch = false,
	searchPlaceholder = "Nhập tên sản phẩm bạn cần tìm",
	searchParamKey = "q",
	children,
}: SortByHeadProps) {
	return (
		<SortBy.Root
			options={options}
			defaultValue={defaultValue}
			paramKey={paramKey}
		>
			<div
				className={cn(
					"flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-between",
					className,
				)}
			>
				{children}

				<SortByCarousel label={label} />

				{showSearch && (
					<SortBy.Search
						paramKey={searchParamKey}
						placeholder={searchPlaceholder}
						className="w-full md:w-[360px]"
					/>
				)}
			</div>
		</SortBy.Root>
	);
}
