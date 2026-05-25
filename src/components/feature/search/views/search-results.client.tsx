"use client";

import { use } from "react";

import {
	ResultsCategoriesSection,
	ResultsProductsSection,
} from "../components/sections";
import { SearchContext } from "../context/search-provider.client";

const MIN_QUERY_LENGTH = 2;

/**
 * Results state content: min-chars hint, loading, error, categories + products or empty.
 * Renders only when panel is open and query is non-empty (explicit variant).
 */
export function SearchResults() {
	const ctx = use(SearchContext);
	if (!ctx) return null;

	const { state, search } = ctx;
	if (!state.isOpen) return null;

	const trimmedQuery = state.query.trim();
	if (trimmedQuery.length === 0) return null;

	const { data, isLoading, error, shouldFetch } = search;
	const categories = data?.categories?.items ?? [];
	const products = data?.products?.items ?? [];
	const hasCategories = categories.length > 0;
	const hasProducts = products.length > 0;

	if (!shouldFetch) {
		return (
			<div className="p-2 md:p-4 text-center text-sm text-gray-500">
				Nhập ít nhất {MIN_QUERY_LENGTH} ký tự để tìm kiếm
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center gap-2 p-2 md:p-4 text-sm text-gray-500">
				<span
					className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
					aria-hidden
				/>
				Đang tìm kiếm...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-2 md:p-4 text-center text-sm text-red-600">
				Không thể tải gợi ý. Thử lại sau.
			</div>
		);
	}

	return (
		<section className="flex w-full flex-col gap-2 p-2 md:p-4 md:gap-4">
			<ResultsCategoriesSection items={categories} />
			<ResultsProductsSection items={products} />
			{!hasCategories && !hasProducts ? (
				<p className="text-center text-sm text-gray-500">
					Không tìm thấy kết quả.
				</p>
			) : null}
		</section>
	);
}
