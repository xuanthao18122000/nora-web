"use client";

import { useState } from "react";

import { Popover } from "@/components/common/Popover";
import { cn } from "@/lib/utils";
import type { Facet } from "@/types/facets";

import { FacetGroup } from "../components/FacetGroup.client";
import { FacetPopover } from "../components/FacetPopover.client";
import {
	ApplyButton,
	ClearAllButton,
	FilterTriggerButton,
	ResetButton,
} from "../components/FilterButtons.client";
import {
	FilterChips,
	useHasActiveFilters,
} from "../components/FilterChips.client";
import { FilterProvider } from "../context/filter-provider.client";

export interface FilterInlineClientProps {
	facets: Facet[];
	pathname: string;
	preservedEntries: Array<[string, string]>;
	className?: string;
	title?: string;
}

function FilterInlineContent({
	facets,
	preservedEntries,
	className,
	title = "Bộ lọc tìm kiếm",
}: Omit<FilterInlineClientProps, "pathname">) {
	const [open, setOpen] = useState(false);
	const hasActiveFilters = useHasActiveFilters();

	const handleApply = () => {
		setOpen(false);
	};

	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-2xl bg-white p-2 md:p-4",
				className,
			)}
		>
			{/* Title + Filter Buttons */}
			<div className="flex flex-col gap-2 md:gap-4">
				{title && (
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						{title}
					</h2>
				)}

				{/* Filter buttons row */}
				<div className="flex flex-wrap items-start gap-2">
					{/* Main Filter Button - opens all facets */}
					<Popover.Root open={open} onOpenChange={setOpen}>
						<Popover.Trigger asChild>
							<FilterTriggerButton />
						</Popover.Trigger>

						<Popover.Content className="w-[700px] max-w-[calc(100vw-32px)]">
							<section className="w-full rounded-2xl bg-white">
								<div className="flex items-center gap-2 border-b border-gray-200 p-4">
									<div className="flex flex-1 flex-wrap gap-2">
										<FilterChips />
									</div>

									<ClearAllButton
										variant="link"
										color="blue"
										size="xs"
									>
										Bỏ chọn tất cả
									</ClearAllButton>
								</div>

								{preservedEntries.map(([k, v]) => (
									<input
										key={`${k}:${v}`}
										type="hidden"
										name={k}
										value={v}
									/>
								))}

								<div className="flex max-h-[400px] flex-col gap-5 overflow-y-auto p-4">
									{facets.map((facet) => (
										<FacetGroup
											key={facet.key}
											facet={facet}
										/>
									))}
								</div>

								<div className="flex items-center justify-center gap-2 border-t border-gray-200 p-4">
									<ResetButton
										variant="bordered"
										color="gray"
										size="sm"
										onClick={() => setOpen(false)}
									>
										Đóng
									</ResetButton>
									<ApplyButton
										variant="filled"
										color="primary"
										size="sm"
										onClick={handleApply}
									>
										Xem kết quả
									</ApplyButton>
								</div>
							</section>
						</Popover.Content>
					</Popover.Root>

					{/* Individual Facet Buttons - each opens its own values */}
					{facets.map((facet) => (
						<FacetPopover key={facet.key} facet={facet} />
					))}
				</div>
			</div>

			{/* Active Filter Chips */}
			{hasActiveFilters && (
				<div className="flex flex-wrap items-center gap-2">
					<FilterChips />
					<ClearAllButton variant="link" color="blue" size="xs">
						Bỏ chọn tất cả
					</ClearAllButton>
				</div>
			)}
		</div>
	);
}

export function FilterInlineClient({
	facets,
	pathname,
	preservedEntries,
	className,
	title,
}: FilterInlineClientProps) {
	return (
		<FilterProvider facets={facets} pathname={pathname}>
			<FilterInlineContent
				facets={facets}
				preservedEntries={preservedEntries}
				className={className}
				title={title}
			/>
		</FilterProvider>
	);
}
