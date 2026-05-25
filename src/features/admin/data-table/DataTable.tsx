"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "./Pagination";
import type { DataTableColumn } from "./types";

interface DataTableProps<T extends { id: string | number }> {
	columns: DataTableColumn<T>[];
	data: T[];
	isLoading?: boolean;
	emptyText?: string;

	// Pagination
	showPagination?: boolean;
	currentPage?: number;
	pageSize?: number;
	total?: number;
	pageSizeOptions?: number[];
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;

	// Tree / row expansion
	enableRowExpansion?: boolean;
	childrenColumnName?: string;
	defaultExpandAllRows?: boolean;

	itemLabel?: string;
	className?: string;
}

/**
 * DataTable dùng chung cho admin.
 *
 * @example
 *   <DataTable
 *     columns={[{ id: 'name', header: 'Tên', cell: r => r.name }]}
 *     data={items} total={total} currentPage={page} pageSize={limit}
 *     onPageChange={(p) => handlePaginationChange(p)}
 *   />
 *
 * Tree:
 *   <DataTable enableRowExpansion childrenColumnName="children" ... />
 */
export function DataTable<T extends { id: string | number }>({
	columns,
	data,
	isLoading,
	emptyText = "Không có dữ liệu",
	showPagination = true,
	currentPage = 1,
	pageSize = 10,
	total = 0,
	pageSizeOptions,
	onPageChange,
	onPageSizeChange,
	enableRowExpansion = false,
	childrenColumnName = "children",
	defaultExpandAllRows = false,
	itemLabel,
	className = "",
}: DataTableProps<T>) {
	const [expanded, setExpanded] = useState<Record<string | number, boolean>>({});

	useEffect(() => {
		if (!enableRowExpansion) return;
		if (!defaultExpandAllRows) {
			setExpanded({});
			return;
		}
		const all: Record<string | number, boolean> = {};
		const walk = (rows: T[]) => {
			for (const r of rows) {
				all[r.id] = true;
				const children = (r as any)[childrenColumnName] as T[] | undefined;
				if (children?.length) walk(children);
			}
		};
		walk(data);
		setExpanded(all);
	}, [data, enableRowExpansion, defaultExpandAllRows, childrenColumnName]);

	function toggleRow(id: string | number) {
		setExpanded((s) => ({ ...s, [id]: !s[id] }));
	}

	const totalCols = columns.length + (enableRowExpansion ? 1 : 0);

	return (
		<div className={className}>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-gray-200 bg-gray-50">
							{enableRowExpansion && <th className="w-8" />}
							{columns.map((col) => (
								<th
									key={col.id}
									className={`px-4 py-4 text-sm font-semibold text-gray-900 ${alignClass(col.align) || "text-left"} ${col.headerClassName ?? ""}`}
									style={col.width ? { width: col.width } : undefined}
								>
									{col.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{isLoading && (
							<tr>
								<td colSpan={totalCols} className="px-4 py-12 text-center text-sm text-gray-500">
									Đang tải...
								</td>
							</tr>
						)}
						{!isLoading && data.length === 0 && (
							<tr>
								<td colSpan={totalCols} className="px-4 py-12 text-center text-sm text-gray-500">
									{emptyText}
								</td>
							</tr>
						)}
						{!isLoading &&
							data.map((row) => (
								<RowRecursive
									key={row.id}
									row={row}
									depth={0}
									columns={columns}
									enableRowExpansion={enableRowExpansion}
									childrenColumnName={childrenColumnName}
									expanded={expanded}
									onToggle={toggleRow}
								/>
							))}
					</tbody>
				</table>
			</div>

			{showPagination && onPageChange && (
				<Pagination
					currentPage={currentPage}
					pageSize={pageSize}
					total={total}
					pageSizeOptions={pageSizeOptions}
					itemLabel={itemLabel}
					isLoading={isLoading}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
				/>
			)}
		</div>
	);
}

function RowRecursive<T extends { id: string | number }>({
	row,
	depth,
	columns,
	enableRowExpansion,
	childrenColumnName,
	expanded,
	onToggle,
}: {
	row: T;
	depth: number;
	columns: DataTableColumn<T>[];
	enableRowExpansion: boolean;
	childrenColumnName: string;
	expanded: Record<string | number, boolean>;
	onToggle: (id: string | number) => void;
}) {
	const children = (row as any)[childrenColumnName] as T[] | undefined;
	const hasChildren = !!children?.length;
	const isOpen = expanded[row.id];

	return (
		<>
			<tr className="border-b border-gray-200 hover:bg-gray-50/60">
				{enableRowExpansion && (
					<td className="px-2 py-3" style={{ paddingLeft: `${8 + depth * 20}px` }}>
						{hasChildren ? (
							<button
								type="button"
								onClick={() => onToggle(row.id)}
								className="rounded p-0.5 text-gray-500 hover:bg-gray-200"
								aria-label={isOpen ? "Thu gọn" : "Mở rộng"}
							>
								{isOpen ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</button>
						) : (
							<span className="inline-block h-4 w-4" />
						)}
					</td>
				)}
				{columns.map((col) => {
					const content = col.cell ? col.cell(row) : ((row as any)[col.id] as React.ReactNode);
					return (
						<td
							key={col.id}
							className={`px-4 py-4 text-gray-700 ${alignClass(col.align)} ${col.className ?? ""}`}
						>
							{content}
						</td>
					);
				})}
			</tr>
			{enableRowExpansion &&
				isOpen &&
				children?.map((child) => (
					<RowRecursive
						key={child.id}
						row={child}
						depth={depth + 1}
						columns={columns}
						enableRowExpansion={enableRowExpansion}
						childrenColumnName={childrenColumnName}
						expanded={expanded}
						onToggle={onToggle}
					/>
				))}
		</>
	);
}

function alignClass(align?: "left" | "right" | "center") {
	if (align === "right") return "text-right";
	if (align === "center") return "text-center";
	return "";
}
