"use client";

import { ChevronDown, Filter } from "lucide-react";

import { Button } from "@/components/common";
import FilterResultChip from "@/components/common/FilterResultChip";

import CodeSnippet from "../CodeSnippet";

export default function FilterPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">Filter</h1>
			<p className="text-gray-600 mb-8">
				Filter buttons and result chips for product listing filters.
			</p>
			<section aria-labelledby="filter-buttons-heading" className="mb-8">
				<h2
					id="filter-buttons-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					Button variant="filter"
				</h2>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="filter"
						size="sm"
						pressed
						leadingIcon={<Filter className="h-5 w-5" aria-hidden />}
					>
						Lọc
					</Button>
					<Button variant="filter" size="sm">
						Hàng mới về
					</Button>
					<Button
						variant="filter"
						size="sm"
						trailingIcon={
							<ChevronDown className="h-4 w-4" aria-hidden />
						}
					>
						Khoảng giá
					</Button>
					<Button
						variant="filter"
						size="sm"
						trailingIcon={
							<ChevronDown className="h-4 w-4" aria-hidden />
						}
					>
						Loại điện thoại
					</Button>
				</div>
			</section>
			<section aria-labelledby="filter-chip-heading" className="mb-8">
				<h2
					id="filter-chip-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					FilterResultChip
				</h2>
				<div className="flex flex-wrap gap-2">
					<FilterResultChip label="Giá: 5-10tr" onClear={() => {}} />
					<FilterResultChip
						variant="muted"
						label="RAM: 8GB"
						onClear={() => {}}
					/>
				</div>
			</section>
			<CodeSnippet
				code={`import { Button } from "@/components/common";
import FilterResultChip from "@/components/common/FilterResultChip";
import { ChevronDown, Filter } from "lucide-react";

<Button variant="filter" size="sm" pressed leadingIcon={<Filter className="h-5 w-5" />}>Lọc</Button>
<Button variant="filter" size="sm" trailingIcon={<ChevronDown className="h-4 w-4" />}>Khoảng giá</Button>
<FilterResultChip label="Giá: 5-10tr" onClear={() => {}} />
<FilterResultChip variant="muted" label="RAM: 8GB" onClear={() => {}} />`}
			/>
		</div>
	);
}
