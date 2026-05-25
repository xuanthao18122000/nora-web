"use client";

import { type ReactNode, use } from "react";

import { SearchContext } from "../context/search-provider.client";

interface SearchInitialSlotProps {
	children: ReactNode;
}

/**
 * Gates SearchInitialContent render by context state.
 * Keeps the content as server-rendered children while the gate runs client-side.
 */
export function SearchInitialSlot({ children }: SearchInitialSlotProps) {
	const ctx = use(SearchContext);
	if (!ctx) return null;

	const { state } = ctx;
	if (!state.isOpen) return null;

	if (state.query.trim().length > 0) return null;

	return <>{children}</>;
}
