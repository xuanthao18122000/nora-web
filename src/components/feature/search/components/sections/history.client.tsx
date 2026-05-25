"use client";

import { History } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

import { SearchContext } from "../../context/search-provider.client";

export function HistorySection() {
	const router = useRouter();
	const ctx = use(SearchContext);
	if (!ctx) return null;

	const {
		state: { history },
		actions: { setQuery, addHistory, clearHistory, close },
	} = ctx;

	const handlePickTerm = (term: string) => {
		setQuery(term);
		addHistory(term);
		close();
		router.push(`/search?q=${encodeURIComponent(term)}`);
	};

	return (
		<section className="flex w-full flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-sm font-normal leading-5 text-gray-900">
					Lịch sử tìm kiếm
				</h3>
				{history.length > 0 ? (
					<button
						type="button"
						onClick={clearHistory}
						className="rounded-lg px-1.5 py-1 text-sm font-medium leading-5 text-gray-400 outline-none transition-colors hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
					>
						Xoá tất cả
					</button>
				) : null}
			</div>
			{history.length === 0 ? (
				<p className="text-sm leading-5 text-gray-400">
					Chưa có lịch sử tìm kiếm.
				</p>
			) : (
				<ul className="flex w-full flex-col">
					{history.map((term) => (
						<li key={term}>
							<button
								type="button"
								onClick={() => handlePickTerm(term)}
								className="flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left text-sm font-normal leading-5 text-gray-900 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:py-1.5"
							>
								<History className="size-5 shrink-0 text-gray-500" />
								<span className="truncate">{term}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
