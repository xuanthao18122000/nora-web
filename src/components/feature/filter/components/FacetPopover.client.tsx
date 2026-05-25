"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, useState } from "react";

import Button from "@/components/common/Button";
import { Popover } from "@/components/common/Popover";
import type { Facet } from "@/types/facets";

import { useFilterContext } from "../context/filter-provider.client";

interface FacetTriggerButtonProps
	extends React.ComponentPropsWithoutRef<typeof Button> {
	facet: Facet;
}

export const FacetTriggerButton = forwardRef<
	HTMLButtonElement,
	FacetTriggerButtonProps
>(({ facet, ...props }, ref) => {
	const { state } = useFilterContext();
	const isActive = (state.urlFilters[facet.key] ?? []).length > 0;

	return (
		<Button
			ref={ref}
			variant="filter"
			size="sm"
			pressed={isActive}
			trailingIcon={<ChevronDown className="size-4" />}
			{...props}
		>
			{facet.label}
		</Button>
	);
});
FacetTriggerButton.displayName = "FacetTriggerButton";

interface FacetPopoverProps {
	facet: Facet;
}

export function FacetPopover({ facet }: FacetPopoverProps) {
	const [open, setOpen] = useState(false);
	const { state, actions } = useFilterContext();
	const selected = new Set(state.draftFilters[facet.key] ?? []);
	const urlSelected = state.urlFilters[facet.key] ?? [];
	const values = facet.facetValues ?? [];

	if (values.length === 0) return null;

	const hasChanges = selected.size > 0 || urlSelected.length > 0;

	const handleToggle = (valueKey: string) => {
		const next = new Set(selected);
		if (next.has(valueKey)) {
			next.delete(valueKey);
		} else {
			next.add(valueKey);
		}
		actions.setDraftFilter(facet.key, Array.from(next));
	};

	const handleApply = () => {
		actions.applyDraft();
		setOpen(false);
	};

	const handleClose = () => {
		actions.resetDraftFromUrl();
		setOpen(false);
	};

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<FacetTriggerButton facet={facet} />
			</Popover.Trigger>

			<Popover.Content className="w-auto min-w-[280px] max-w-[540px]">
				<div className="flex flex-col gap-3 rounded-2xl bg-white p-4">
					<div className="flex flex-wrap gap-2">
						{values.map((v) => {
							const isChecked = selected.has(v.key);
							return (
								<Button
									key={v.key}
									type="button"
									variant="pill"
									color="blue"
									size="sm"
									pressed={isChecked}
									onClick={() => handleToggle(v.key)}
								>
									{v.label}
								</Button>
							);
						})}
					</div>

					<div className="flex items-center gap-2">
						<Button
							className="flex-1"
							variant="bordered"
							color="gray"
							size="sm"
							onClick={handleClose}
						>
							Đóng
						</Button>
						<Button
							className="flex-1"
							variant="filled"
							color="primary"
							size="sm"
							disabled={!hasChanges}
							onClick={handleApply}
						>
							Xem kết quả
						</Button>
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
	);
}
