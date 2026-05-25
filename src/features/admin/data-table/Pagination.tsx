"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button, Select } from "@/features/admin/ui";

interface PaginationProps {
	currentPage: number;
	pageSize: number;
	total: number;
	pageSizeOptions?: number[];
	itemLabel?: string;
	isLoading?: boolean;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
}

export function Pagination({
	currentPage,
	pageSize,
	total,
	pageSizeOptions = [10, 20, 50, 100],
	itemLabel = "bản ghi",
	isLoading,
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const canPrev = currentPage > 1;
	const canNext = currentPage < totalPages;

	const visiblePages = computeVisiblePages(currentPage, totalPages);

	return (
		<div className="flex flex-col items-stretch gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="text-xs text-gray-500 sm:text-sm">
				Trang <strong>{currentPage}</strong> / {totalPages} ({total.toLocaleString("vi-VN")}{" "}
				{itemLabel})
			</div>

			<div className="flex items-center justify-center gap-1">
				<IconBtn
					title="Trang đầu"
					onClick={() => onPageChange(1)}
					disabled={!canPrev || isLoading}
				>
					<ChevronsLeft className="h-3.5 w-3.5" />
				</IconBtn>
				<IconBtn
					title="Trang trước"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={!canPrev || isLoading}
				>
					<ChevronLeft className="h-3.5 w-3.5" />
				</IconBtn>

				{visiblePages.map((page) => (
					<Button
						key={page}
						type="button"
						size="sm"
						variant={page === currentPage ? "primary" : "secondary"}
						onClick={() => onPageChange(page)}
						disabled={isLoading}
						className="!h-7 !w-7 !p-0"
					>
						{page}
					</Button>
				))}

				<IconBtn
					title="Trang sau"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={!canNext || isLoading}
				>
					<ChevronRight className="h-3.5 w-3.5" />
				</IconBtn>
				<IconBtn
					title="Trang cuối"
					onClick={() => onPageChange(totalPages)}
					disabled={!canNext || isLoading}
				>
					<ChevronsRight className="h-3.5 w-3.5" />
				</IconBtn>
			</div>

			{onPageSizeChange && (
				<div className="flex items-center justify-center gap-2">
					<span className="text-xs text-gray-500">Hiển thị</span>
					<Select
						value={String(pageSize)}
						onChange={(e) => onPageSizeChange(Number(e.target.value))}
						className="!h-8 !w-20 !py-0 text-xs"
					>
						{pageSizeOptions.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</Select>
				</div>
			)}
		</div>
	);
}

function IconBtn({
	children,
	title,
	disabled,
	onClick,
}: {
	children: React.ReactNode;
	title: string;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			variant="secondary"
			size="sm"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className="!h-7 !w-7 !p-0"
		>
			{children}
		</Button>
	);
}

function computeVisiblePages(current: number, total: number): number[] {
	const max = 5;
	if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
	if (current <= 3) return [1, 2, 3, 4, 5];
	if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
	return [current - 2, current - 1, current, current + 1, current + 2];
}
