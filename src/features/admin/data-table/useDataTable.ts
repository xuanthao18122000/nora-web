"use client";

import { useState } from "react";
import type { FilterValue } from "./types";

interface UseDataTableOptions<TFilters> {
	defaultPageSize?: number;
	defaultFilters?: TFilters;
}

/**
 * Quản lý state cho list page admin: page, pageSize, filters.
 * Trả về `queryParams` đã merge sẵn để feed vào API call (SWR / fetch).
 *
 * @example
 *   const { queryParams, handleFilter, handleResetFilter, handlePaginationChange } =
 *     useDataTable<{ searchName?: string; status?: number }>();
 *   const { data } = useSWR(["admin/products", queryParams], () => listProducts(queryParams));
 */
export function useDataTable<TFilters extends Record<string, unknown> = Record<string, unknown>>(
	options: UseDataTableOptions<TFilters> = {},
) {
	const { defaultPageSize = 10, defaultFilters = {} as TFilters } = options;

	const [pageSize, setPageSize] = useState(defaultPageSize);
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState<TFilters>(defaultFilters);

	function handleFilter(values: FilterValue) {
		// Loại bỏ field rỗng để query gọn (BE skip undefined)
		const cleaned: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(values)) {
			if (val === "" || val === null || val === undefined) continue;
			if (typeof val === "object" && "from" in val && !val.from && !val.to) continue;
			cleaned[key] = val;
		}
		setFilters(cleaned as TFilters);
		setCurrentPage(1);
	}

	function handleResetFilter() {
		setFilters(defaultFilters);
		setCurrentPage(1);
	}

	function handlePaginationChange(page?: number, newPageSize?: number) {
		if (newPageSize !== undefined) {
			setPageSize(newPageSize);
			setCurrentPage(1);
		}
		if (page !== undefined) {
			setCurrentPage(page);
		}
	}

	const queryParams = {
		...filters,
		page: currentPage,
		limit: pageSize,
	} as TFilters & { page: number; limit: number };

	return {
		pageSize,
		currentPage,
		setPageSize,
		setCurrentPage,
		filters,
		setFilters,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
		queryParams,
	};
}
