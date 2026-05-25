"use client";

import { Search } from "lucide-react";
import type { KeyboardEvent } from "react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { Input } from "@/components/common/Input";
import { cn } from "@/lib/utils";

/**
 * Search Input — Figma DDV (node 11-858): Input.Slot + search icon left, placeholder "Search".
 * States: default, focus (blue border), filled, disabled. Composes Input compound.
 * Enter calls onSearch?.(value). Controlled when value + onChange passed.
 */
type SearchInputProps = Omit<
	ComponentPropsWithoutRef<"input">,
	"type" | "className" | "size"
> & {
	className?: string;
	/**
	 * Override class for the inner `Input.Slot` wrapper — used to apply Tailwind
	 * responsive overrides on top of the CVA `size` (e.g. `md:min-h-10 md:px-3`
	 * to grow a mobile `sm` slot into `md` on desktop without a hydration flash).
	 */
	slotClassName?: string;
	/**
	 * Override class for the native input element. Useful alongside
	 * `slotClassName` for responsive text-size overrides (`md:text-sm`).
	 */
	fieldClassName?: string;
	size?: "xs" | "sm" | "md";
	onSearch?: (value: string) => void;
	/** Accessible name for the search field (required for form/label accessibility). */
	ariaLabel?: string;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	(
		{
			placeholder = "Bạn muốn mua gì hôm nay",
			ariaLabel = "Tìm kiếm sản phẩm",
			size,
			onSearch,
			onKeyDown,
			className,
			slotClassName,
			fieldClassName,
			...props
		},
		ref,
	) => {
		const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(e);
			if (e.key === "Enter" && !e.defaultPrevented) {
				e.preventDefault();
				onSearch?.(e.currentTarget.value);
			}
		};

		return (
			<Input.Root className={cn("w-full", className)}>
				<Input.Slot size={size} className={slotClassName}>
					<Input.LeadingIcon>
						<Search
							className="size-4 md:size-5 text-gray-500"
							aria-hidden
						/>
					</Input.LeadingIcon>
					<Input.Field
						ref={ref}
						type="search"
						size={size}
						aria-label={ariaLabel}
						placeholder={placeholder}
						onKeyDown={handleKeyDown}
						autoComplete="off"
						className={fieldClassName}
						{...props}
					/>
				</Input.Slot>
			</Input.Root>
		);
	},
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
