"use client";

import { Check, ListFilter } from "lucide-react";
import { forwardRef } from "react";

import Button from "@/components/common/Button";

import { useFilterContext } from "../context/filter-provider.client";

type ButtonProps = Omit<React.ComponentProps<typeof Button>, "type"> & {
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function FilterIconWithBadge({
	hasActiveFilters,
}: {
	hasActiveFilters: boolean;
}) {
	return (
		<span className="relative">
			<ListFilter className="size-5" />
			{hasActiveFilters && (
				<span className="absolute -right-1.5 -top-2.5 flex size-4 items-center justify-center rounded-full bg-orange-400">
					<Check className="size-3 text-white" strokeWidth={3} />
				</span>
			)}
		</span>
	);
}

export const FilterTriggerButton = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
	const { state } = useFilterContext();

	const hasActiveFilters = Object.values(state.urlFilters).some(
		(values) => values.length > 0,
	);

	return (
		<Button
			ref={ref}
			variant="filter"
			size="sm"
			pressed={hasActiveFilters}
			leadingIcon={
				<FilterIconWithBadge hasActiveFilters={hasActiveFilters} />
			}
			{...props}
		>
			Lọc
		</Button>
	);
});
FilterTriggerButton.displayName = "FilterTriggerButton";

export function ApplyButton({ onClick, ...props }: ButtonProps) {
	const { actions, state } = useFilterContext();
	const hasDraftFilters = Object.values(state.draftFilters).some(
		(values) => values.length > 0,
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		actions.applyDraft();
		onClick?.(event);
	};

	return (
		<Button
			{...props}
			type="button"
			onClick={handleClick}
			disabled={!hasDraftFilters}
		/>
	);
}

export function ResetButton({ onClick, ...props }: ButtonProps) {
	const { actions } = useFilterContext();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		actions.resetDraftFromUrl();
		onClick?.(event);
	};

	return <Button {...props} type="button" onClick={handleClick} />;
}

export function ClearAllButton({ onClick, ...props }: ButtonProps) {
	const { actions } = useFilterContext();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		actions.clearAll();
		onClick?.(event);
	};

	return <Button {...props} type="button" onClick={handleClick} />;
}
