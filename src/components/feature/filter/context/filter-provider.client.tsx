"use client";

import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import type { Facet } from "@/types/facets";

export type DraftFilters = Record<string, string[]>;

export interface FilterContextValue {
	state: {
		draftFilters: DraftFilters;
		urlFilters: DraftFilters;
		facets: Facet[];
		pathname: string;
	};
	actions: {
		setDraftFilter: (key: string, values: string[]) => void;
		applyDraft: () => void;
		resetDraftFromUrl: () => void;
		clearAll: () => void;
		clearFacet: (key: string) => void;
		removeFilterValue: (key: string, value: string) => void;
	};
}

const FilterContext = createContext<FilterContextValue | null>(null);

interface FilterProviderProps {
	facets: Facet[];
	pathname: string;
	children: ReactNode;
}

function normalizeFilters(
	raw: Record<string, unknown>,
	facetKeys: string[],
): DraftFilters {
	const next: DraftFilters = {};

	for (const key of facetKeys) {
		const value = raw[key];
		if (Array.isArray(value)) {
			next[key] = value.filter(
				(v): v is string => typeof v === "string" && v.length > 0,
			);
		} else if (typeof value === "string" && value.length > 0) {
			next[key] = [value];
		} else {
			next[key] = [];
		}
	}

	return next;
}

export function FilterProvider({
	facets,
	pathname,
	children,
}: FilterProviderProps) {
	const facetKeys = useMemo(() => facets.map((f) => f.key), [facets]);

	const parsers = useMemo(
		() =>
			Object.fromEntries(
				facetKeys.map((key) => [
					key,
					parseAsArrayOf(parseAsString).withDefault([]),
				]),
			),
		[facetKeys],
	);

	const [rawUrlFilters, setRawUrlFilters] = useQueryStates(parsers, {
		shallow: false,
	});

	const urlFilters = useMemo(
		() => normalizeFilters(rawUrlFilters, facetKeys),
		[rawUrlFilters, facetKeys],
	);

	const [draftFilters, setDraftFilters] = useState<DraftFilters>({});
	const draftFiltersRef = useRef(draftFilters);
	draftFiltersRef.current = draftFilters;

	const initialUrlFiltersRef = useRef<DraftFilters | null>(null);
	if (!initialUrlFiltersRef.current) {
		initialUrlFiltersRef.current = urlFilters;
	}

	const [hasInitializedDraft, setHasInitializedDraft] = useState(false);

	useEffect(() => {
		if (hasInitializedDraft) return;
		setDraftFilters(initialUrlFiltersRef.current ?? {});
		setHasInitializedDraft(true);
	}, [hasInitializedDraft]);

	const setDraftFilter = useCallback((key: string, values: string[]) => {
		setDraftFilters((prev) => ({
			...prev,
			[key]: values,
		}));
	}, []);

	const applyDraft = useCallback(() => {
		const current = draftFiltersRef.current;
		setRawUrlFilters((prev) => {
			const next: Record<string, string[] | null> = {};
			for (const key of facetKeys) {
				const values = current[key] ?? [];
				next[key] = values.length ? values : null;
			}
			return { ...prev, ...next };
		});
	}, [facetKeys, setRawUrlFilters]);

	const resetDraftFromUrl = useCallback(() => {
		setDraftFilters(urlFilters);
	}, [urlFilters]);

	const clearAll = useCallback(() => {
		setRawUrlFilters((prev) => {
			const cleared: Record<string, null> = {};
			for (const key of facetKeys) {
				cleared[key] = null;
			}
			return { ...prev, ...cleared };
		});
		setDraftFilters({});
	}, [facetKeys, setRawUrlFilters]);

	const clearFacet = useCallback(
		(key: string) => {
			setRawUrlFilters((prev) => ({
				...prev,
				[key]: null,
			}));
			setDraftFilters((prev) => ({
				...prev,
				[key]: [],
			}));
		},
		[setRawUrlFilters],
	);

	const removeFilterValue = useCallback(
		(key: string, value: string) => {
			setRawUrlFilters((prev) => {
				const current = prev[key];
				const arr =
					Array.isArray(current) &&
					current.every((v) => typeof v === "string")
						? (current as string[])
						: typeof current === "string"
							? [current]
							: [];
				const nextValues = arr.filter((v) => v !== value);
				return {
					...prev,
					[key]: nextValues.length ? nextValues : null,
				};
			});

			setDraftFilters((prev) => {
				const current = prev[key] ?? [];
				const nextValues = current.filter((v) => v !== value);
				return {
					...prev,
					[key]: nextValues,
				};
			});
		},
		[setRawUrlFilters],
	);

	const state = useMemo(
		() => ({
			draftFilters,
			urlFilters,
			facets,
			pathname,
		}),
		[draftFilters, urlFilters, facets, pathname],
	);

	const actions = useMemo(
		() => ({
			setDraftFilter,
			applyDraft,
			resetDraftFromUrl,
			clearAll,
			clearFacet,
			removeFilterValue,
		}),
		[
			setDraftFilter,
			applyDraft,
			resetDraftFromUrl,
			clearAll,
			clearFacet,
			removeFilterValue,
		],
	);

	const value: FilterContextValue = useMemo(
		() => ({ state, actions }),
		[state, actions],
	);

	return (
		<FilterContext.Provider value={value}>
			{children}
		</FilterContext.Provider>
	);
}

export function useFilterContext() {
	const ctx = useContext(FilterContext);
	if (!ctx) {
		throw new Error("useFilterContext must be used within FilterProvider");
	}
	return ctx;
}
