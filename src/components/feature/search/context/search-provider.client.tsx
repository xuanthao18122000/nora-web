"use client";

import { usePathname } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import useSWR from "swr";
import { useDebounceValue, useLocalStorage } from "usehooks-ts";

import { API, api } from "@/lib/api";
import type { SearchResponse } from "@/types/search";

const SEARCH_LIMIT = 4;
const MIN_QUERY_LENGTH = 2;
const HISTORY_KEY = "ddv-search-history";
const HISTORY_LIMIT = 4;
const DEBOUNCE_MS = 300;

export interface SearchContextValue {
	state: { query: string; isOpen: boolean; history: string[] };
	actions: {
		setQuery: (q: string) => void;
		open: () => void;
		close: () => void;
		toggle: () => void;
		setOpen: (open: boolean) => void;
		addHistory: (term: string) => void;
		clearHistory: () => void;
	};
	search: {
		data: SearchResponse | null;
		isLoading: boolean;
		error: Error | null;
		shouldFetch: boolean;
	};
}

export const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
	children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const [history, setHistory, removeHistory] = useLocalStorage<string[]>(
		HISTORY_KEY,
		[],
		{ initializeWithValue: false },
	);

	const [debouncedQuery, setDebouncedQuery] = useDebounceValue(
		"",
		DEBOUNCE_MS,
	);

	const handleSetQuery = useCallback(
		(q: string) => {
			setQuery(q);
			setDebouncedQuery(q);
		},
		[setDebouncedQuery],
	);

	const trimmed = debouncedQuery.trim();
	const shouldFetch = trimmed.length >= MIN_QUERY_LENGTH;
	const key = shouldFetch ? (["fe/search", trimmed] as const) : null;

	const { data, isLoading, error } = useSWR(
		key,
		([_, q]) =>
			api.get<SearchResponse>(API.PRODUCTS.SEARCH, {
				params: {
					q: q.trim(),
					productPage: "1",
					categoryPage: "1",
					productLimit: String(SEARCH_LIMIT),
					categoryLimit: String(SEARCH_LIMIT),
				},
			}),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
			dedupingInterval: 2000,
			keepPreviousData: true,
		},
	);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	// Auto-close panel on route change — handles <Link> clicks inside panel
	// without needing div-level onClick delegation.
	const pathname = usePathname();
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	const addHistory = useCallback(
		(term: string) => {
			const trimmedTerm = term.trim();
			if (!trimmedTerm) return;
			setHistory((prev: string[]) => {
				const next = [
					trimmedTerm,
					...prev.filter((t: string) => t !== trimmedTerm),
				].slice(0, HISTORY_LIMIT);
				return next;
			});
		},
		[setHistory],
	);

	const clearHistory = useCallback(() => {
		setHistory([]);
		removeHistory();
	}, [removeHistory, setHistory]);

	const value: SearchContextValue = {
		state: { query, isOpen, history },
		actions: {
			setQuery: handleSetQuery,
			open,
			close,
			toggle,
			setOpen: setIsOpen,
			addHistory,
			clearHistory,
		},
		search: {
			data: data ?? null,
			isLoading: shouldFetch && isLoading,
			error: error ?? null,
			shouldFetch,
		},
	};

	return (
		<SearchContext.Provider value={value}>
			{children}
		</SearchContext.Provider>
	);
}
