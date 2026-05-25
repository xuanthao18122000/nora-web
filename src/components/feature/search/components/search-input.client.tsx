"use client";

import { useRouter } from "next/navigation";
import { type ComponentPropsWithoutRef, use } from "react";

import SearchInputCommon from "@/components/common/SearchInput";

import { SearchContext } from "../context/search-provider.client";

interface SearchInputProps
	extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
	placeholder?: string;
	onSearch?: (value: string) => void;
	className?: string;
}

export function SearchInput({
	placeholder = "Bạn muốn mua gì hôm nay",
	onSearch,
	className = "",
	...props
}: SearchInputProps) {
	const router = useRouter();
	const ctx = use(SearchContext);
	if (!ctx) return null;

	const { state, actions } = ctx;

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			actions.close();
		}
	};

	const handleSearch = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;

		actions.setQuery(trimmed);
		actions.addHistory(trimmed);
		actions.close();
		onSearch?.(trimmed);

		router.push(`/search?q=${encodeURIComponent(trimmed)}`);
	};

	return (
		<SearchInputCommon
			{...props}
			aria-label="Tìm kiếm sản phẩm"
			value={state.query}
			onChange={(e) => {
				actions.setQuery(e.target.value);
				if (!state.isOpen) actions.open();
			}}
			onFocus={actions.open}
			onSearch={handleSearch}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			className={className}
		/>
	);
}
