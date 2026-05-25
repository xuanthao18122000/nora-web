"use client";

import { X } from "lucide-react";
import type React from "react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

export type FilterResultChipVariant = "default" | "muted";

export interface FilterResultChipProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	variant?: FilterResultChipVariant;
	label: string;
	onClear?: () => void;
	clearAriaLabel?: string;
}

export default function FilterResultChip({
	variant = "default",
	label,
	onClear,
	clearAriaLabel = "Clear filter",
	className,
	...props
}: FilterResultChipProps) {
	const handleClear = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			onClear?.();
		},
		[onClear],
	);

	return (
		<div
			data-variant={variant}
			className={cn(
				"inline-flex items-center justify-center gap-1 rounded-full text-xs leading-4 font-normal",
				"bg-gray-200 px-2 py-1 text-black",
				"data-[variant=muted]:bg-gray-300",
				className,
			)}
			{...props}
		>
			<span className="truncate">{label}</span>
			{onClear ? (
				<button
					type="button"
					aria-label={clearAriaLabel}
					onClick={handleClear}
					className={cn(
						"inline-flex size-5 items-center justify-center rounded-full p-1 transition-colors duration-150",
						"bg-gray-300 hover:bg-gray-400",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
					)}
				>
					<X className="size-3" strokeWidth={2.5} />
				</button>
			) : null}
		</div>
	);
}
