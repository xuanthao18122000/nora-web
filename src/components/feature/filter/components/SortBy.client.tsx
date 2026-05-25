"use client";

import {
	ArrowDownWideNarrow,
	ArrowUpNarrowWide,
	Star,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { forwardRef, type ReactNode, useEffect, useState } from "react";

import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import { cn } from "@/lib/utils";

import {
	type SortOption,
	SortProvider,
	useSortContext,
} from "../context/sort-provider.client";

const DEFAULT_SORT_OPTIONS: SortOption[] = [
	{
		value: "relevance",
		label: "Liên quan",
		icon: <Star className="size-5" aria-hidden />,
	},
	{
		value: "price_asc",
		label: "Giá tăng dần",
		icon: <ArrowUpNarrowWide className="size-5" aria-hidden />,
	},
	{
		value: "price_desc",
		label: "Giá giảm dần",
		icon: <ArrowDownWideNarrow className="size-5" aria-hidden />,
	},
];

// --- Root (provider) ---

export interface SortByRootProps {
	options?: SortOption[];
	defaultValue?: string;
	paramKey?: string;
	children: ReactNode;
}

export function SortByRoot({
	options = DEFAULT_SORT_OPTIONS,
	defaultValue = "relevance",
	paramKey = "sort",
	children,
}: SortByRootProps) {
	return (
		<SortProvider
			options={options}
			defaultValue={defaultValue}
			paramKey={paramKey}
		>
			{children}
		</SortProvider>
	);
}

// --- Group (layout) ---

export interface SortByGroupProps {
	className?: string;
	"aria-label"?: string;
	children: ReactNode;
}

export function SortByGroup({
	className,
	"aria-label": ariaLabel = "Sắp xếp theo",
	children,
}: SortByGroupProps) {
	return (
		<div
			className={cn("flex min-w-0 flex-1 items-center gap-2", className)}
			role="group"
			aria-label={ariaLabel}
		>
			{children}
		</div>
	);
}

// --- Label ---

export interface SortByLabelProps {
	children?: ReactNode;
	label?: string;
	className?: string;
}

export function SortByLabel({
	children,
	label = "Sắp xếp theo:",
	className,
}: SortByLabelProps) {
	return (
		<span
			className={cn(
				"hidden shrink-0 text-xs leading-4 text-gray-900 md:inline",
				className,
			)}
		>
			{children ?? label}
		</span>
	);
}

// --- Button (single option, uses context) ---

interface SortByButtonProps
	extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "onClick"> {
	option: SortOption;
}

export const SortByButton = forwardRef<HTMLButtonElement, SortByButtonProps>(
	({ option, ...props }, ref) => {
		const { state, actions } = useSortContext();
		const isActive = state.currentSort === option.value;
		return (
			<Button
				ref={ref}
				role="button"
				type="button"
				variant="pill"
				color="blue"
				size="sm"
				pressed={isActive}
				aria-label={`Sắp xếp: ${option.label}`}
				leadingIcon={option.icon}
				onClick={() => actions.setSort(option.value)}
				className="shrink-0 whitespace-nowrap"
				{...props}
			>
				{option.label}
			</Button>
		);
	},
);
SortByButton.displayName = "SortByButton";

// --- Options (all buttons from context) ---

export function SortByOptions() {
	const { state } = useSortContext();
	return (
		<>
			{state.options.map((option) => (
				<SortByButton key={option.value} option={option} />
			))}
		</>
	);
}

// --- Search (URL-synced) ---

export interface SortBySearchProps {
	paramKey?: string;
	placeholder?: string;
	className?: string;
}

export function SortBySearch({
	paramKey = "q",
	placeholder = "Nhập tên sản phẩm bạn cần tìm",
	className,
}: SortBySearchProps) {
	const [q, setQ] = useQueryState(paramKey, parseAsString.withDefault(""));
	const [draft, setDraft] = useState(q);

	useEffect(() => {
		setDraft(q);
	}, [q]);

	const commit = (value: string) => {
		const trimmed = value.trim();
		const next = trimmed || null;
		if (next === (q || null)) return;
		setQ(next, { shallow: false });
	};

	return (
		<SearchInput
			placeholder={placeholder}
			value={draft}
			onChange={(e) => setDraft(e.target.value)}
			onSearch={commit}
			onBlur={() => commit(draft)}
			className={cn("h-10 rounded-lg border-gray-200", className)}
		/>
	);
}

// --- Compound export (no default component) ---

export const SortBy = {
	Root: SortByRoot,
	Group: SortByGroup,
	Label: SortByLabel,
	Button: SortByButton,
	Options: SortByOptions,
	Search: SortBySearch,
};

export { DEFAULT_SORT_OPTIONS, type SortOption };
