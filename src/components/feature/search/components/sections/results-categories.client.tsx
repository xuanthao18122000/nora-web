"use client";

import { Search } from "lucide-react";
import Link from "next/link";

import { toHref } from "@/lib/utils/href";
import type { SearchCategoryItem } from "@/types/search";

interface ResultsCategoriesSectionProps {
	items: SearchCategoryItem[];
}

export function ResultsCategoriesSection({
	items,
}: ResultsCategoriesSectionProps) {
	if (items.length === 0) return null;

	return (
		<section className="border-gray-100">
			<h3 className="mb-2 text-sm font-semibold text-gray-800">
				Có phải bạn muốn tìm
			</h3>
			<ul className="flex flex-col gap-y-2">
				{items.map((cat) => (
					<li key={cat.id}>
						<Link
							href={toHref(cat.slug)}
							className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
						>
							<Search className="size-3.5 shrink-0 text-gray-400" />
							{cat.name}
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
