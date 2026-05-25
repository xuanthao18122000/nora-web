"use client";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	/** Max page buttons to show (default 5) */
	maxVisible?: number;
	className?: string;
}

/**
 * Pagination — for PLP and Search results
 */
export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	maxVisible = 5,
	className = "",
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const getPages = (): (number | "...")[] => {
		if (totalPages <= maxVisible) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const pages: (number | "...")[] = [];
		const half = Math.floor(maxVisible / 2);
		let start = Math.max(2, currentPage - half);
		let end = Math.min(totalPages - 1, currentPage + half);

		if (currentPage - half <= 2) {
			end = Math.min(totalPages - 1, maxVisible - 1);
		}
		if (currentPage + half >= totalPages - 1) {
			start = Math.max(2, totalPages - maxVisible + 2);
		}

		pages.push(1);
		if (start > 2) pages.push("...");
		for (let i = start; i <= end; i++) pages.push(i);
		if (end < totalPages - 1) pages.push("...");
		pages.push(totalPages);

		return pages;
	};

	return (
		<nav className={`flex items-center gap-1 ${className}`}>
			{/* Prev */}
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				<svg
					aria-hidden="true"
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
				>
					<path
						d="M8.75 3.5L5.25 7L8.75 10.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{/* Pages */}
			{getPages().map((page, i) =>
				page === "..." ? (
					<span
						key={i === 1 ? "ellipsis-start" : "ellipsis-end"}
						className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
					>
						…
					</span>
				) : (
					<button
						key={page}
						type="button"
						onClick={() => onPageChange(page)}
						className={`
							w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors
							${
								page === currentPage
									? "bg-primary-600 text-white"
									: "border border-gray-200 text-gray-700 hover:bg-gray-50"
							}
						`}
					>
						{page}
					</button>
				),
			)}

			{/* Next */}
			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				<svg
					aria-hidden="true"
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
				>
					<path
						d="M5.25 3.5L8.75 7L5.25 10.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</nav>
	);
}
