"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — responsive breakpoint hook
 *
 * 📌 Custom hooks go in `lib/hooks/`.
 *    Naming: always start with `use` (e.g., useSearch, useCategories).
 *    Must be client-side only ("use client").
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		setMatches(media.matches);

		const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, [query]);

	return matches;
}

/** Breakpoint values match Tailwind defaults (see :root in globals.css). */
const QUERY_BELOW_MD = "(max-width: 767px)";
const QUERY_MD_UP = "(min-width: 768px)";
const QUERY_LG_UP = "(min-width: 1024px)";

/** True when viewport is below md (768px). */
export function useIsMobile(): boolean {
	return useMediaQuery(QUERY_BELOW_MD);
}

/** True when viewport is md (768px) up to below lg (1024px). */
export function useIsTablet(): boolean {
	const belowLg = !useMediaQuery(QUERY_LG_UP);
	const mdUp = useMediaQuery(QUERY_MD_UP);
	return mdUp && belowLg;
}

/** True when viewport is lg (1024px) and up. */
export function useIsDesktop(): boolean {
	return useMediaQuery(QUERY_LG_UP);
}

/**
 * useDebounce — delay value updates (for search input, etc.)
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearch) fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
}
