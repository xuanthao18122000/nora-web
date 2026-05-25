"use client";

import { parseAsString, useQueryState } from "nuqs";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
} from "react";

export interface SortOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
}

export interface SortContextValue {
	state: {
		currentSort: string;
		options: SortOption[];
	};
	actions: {
		setSort: (value: string) => void;
	};
}

const SortContext = createContext<SortContextValue | null>(null);

interface SortProviderProps {
	options: SortOption[];
	defaultValue?: string;
	paramKey?: string;
	children: ReactNode;
}

export function SortProvider({
	options,
	defaultValue = "featured",
	paramKey = "sort",
	children,
}: SortProviderProps) {
	const [sortValue, setSortValue] = useQueryState(
		paramKey,
		parseAsString.withDefault(defaultValue),
	);

	const currentSort = sortValue ?? defaultValue;

	const setSort = useCallback(
		(value: string) => {
			setSortValue(value === defaultValue ? null : value, {
				shallow: false,
			});
		},
		[setSortValue, defaultValue],
	);

	const state = useMemo(
		() => ({
			currentSort,
			options,
		}),
		[currentSort, options],
	);

	const actions = useMemo(
		() => ({
			setSort,
		}),
		[setSort],
	);

	const value: SortContextValue = useMemo(
		() => ({ state, actions }),
		[state, actions],
	);

	return (
		<SortContext.Provider value={value}>{children}</SortContext.Provider>
	);
}

export function useSortContext() {
	const ctx = useContext(SortContext);
	if (!ctx) {
		throw new Error("useSortContext must be used within SortProvider");
	}
	return ctx;
}
