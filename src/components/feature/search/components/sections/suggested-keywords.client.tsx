"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import type { SuggestedKeyword } from "@/types/search";
import { SearchContext } from "../../context/search-provider.client";

interface SuggestedKeywordsSectionProps {
	items: SuggestedKeyword[];
}

export function SuggestedKeywordsSection({
	items,
}: SuggestedKeywordsSectionProps) {
	const router = useRouter();
	const ctx = use(SearchContext);
	if (!ctx) return null;

	const {
		actions: { setQuery, addHistory, close },
	} = ctx;

	const handlePickTerm = (term: string) => {
		setQuery(term);
		addHistory(term);
		close();
		router.push(`/search?q=${encodeURIComponent(term)}`);
	};

	if (!items.length) {
		return null;
	}

	return (
		<section className="flex w-full flex-col gap-2">
			<h3 className="text-sm font-normal leading-5 text-gray-900">
				Có phải bạn muốn tìm
			</h3>
			<ul className="flex w-full flex-col">
				{items.map((item) => (
					<li key={item.keyword}>
						<button
							type="button"
							onClick={() => handlePickTerm(item.keyword)}
							className="flex w-full items-center rounded-lg px-2 py-2 text-left text-sm font-normal leading-5 text-gray-600 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:py-1.5"
						>
							<span className="truncate">{item.keyword}</span>
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}
