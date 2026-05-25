"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/common/Button";
import type { TrendingKeyword } from "@/types/search";
import { SearchContext } from "../../context/search-provider.client";

interface TrendingSectionProps {
	items: TrendingKeyword[];
}

export function TrendingSection({ items }: TrendingSectionProps) {
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
				Xu hướng tìm kiếm
			</h3>
			<div className="flex w-full flex-wrap gap-1.5 md:gap-2">
				{items.map((item) => (
					<Button
						type="button"
						size="sm"
						variant="pill"
						key={item.keyword}
						onClick={() => handlePickTerm(item.keyword)}
						leadingIcon={
							<Search className="size-5 shrink-0 text-gray-900" />
						}
					>
						{item.keyword}
					</Button>
				))}
			</div>
		</section>
	);
}
