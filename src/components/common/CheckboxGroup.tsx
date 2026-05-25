"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox, type CheckboxProps } from "./Checkbox";

/* ────────────────────────────────────────────────────────────────────────────
 * CheckboxGroup — renders a group of Checkbox items with shared state
 *
 * Usage:
 *   <CheckboxGroup
 *     value={selectedValues}
 *     onChange={setSelectedValues}
 *     options={[
 *       { value: "a", label: "Option A" },
 *       { value: "b", label: "Option B" },
 *     ]}
 *   />
 *
 *   // Or with children for custom layout:
 *   <CheckboxGroup value={selectedValues} onChange={setSelectedValues}>
 *     <CheckboxGroup.Item value="a" label="Option A" />
 *     <CheckboxGroup.Item value="b" label="Option B" />
 *   </CheckboxGroup>
 * ──────────────────────────────────────────────────────────────────────────── */

export interface CheckboxGroupOption {
	value: string | number;
	label: React.ReactNode;
	disabled?: boolean;
}

export interface CheckboxGroupProps {
	/** Currently selected values */
	value: (string | number)[];
	/** Callback when selection changes */
	onChange: (value: (string | number)[]) => void;
	/** Quick declarative options (alternative to children) */
	options?: CheckboxGroupOption[];
	/** Layout direction */
	direction?: "horizontal" | "vertical";
	/** Gap between items */
	gap?: "sm" | "md" | "lg";
	/** Checkbox size passed to each item */
	size?: CheckboxProps["size"];
	/** Disable entire group */
	disabled?: boolean;
	/** Optional label for the group */
	label?: React.ReactNode;
	/** Error message */
	error?: string;
	/** Additional className for the container */
	className?: string;
	/** Children (use CheckboxGroup.Item) */
	children?: React.ReactNode;
}

const gapMap = {
	sm: "gap-3",
	md: "gap-4",
	lg: "gap-6",
} as const;

/* ── Context for compound component pattern ──────────────────────────────── */
interface CheckboxGroupContextValue {
	value: (string | number)[];
	toggle: (itemValue: string | number) => void;
	size?: CheckboxProps["size"];
	disabled?: boolean;
}

const CheckboxGroupContext =
	React.createContext<CheckboxGroupContextValue | null>(null);

/* ── CheckboxGroup.Item — individual checkbox within a group ─────────────── */
export interface CheckboxGroupItemProps
	extends Omit<CheckboxProps, "checked" | "onChange" | "value"> {
	value: string | number;
}

function CheckboxGroupItem({
	value,
	disabled: itemDisabled,
	size: itemSize,
	...props
}: CheckboxGroupItemProps) {
	const ctx = React.useContext(CheckboxGroupContext);
	if (!ctx) {
		throw new Error(
			"CheckboxGroup.Item must be used within a CheckboxGroup",
		);
	}

	const isChecked = ctx.value.includes(value);
	const isDisabled = itemDisabled || ctx.disabled;

	return (
		<Checkbox
			checked={isChecked}
			onChange={() => ctx.toggle(value)}
			disabled={isDisabled}
			size={itemSize ?? ctx.size}
			{...props}
		/>
	);
}

CheckboxGroupItem.displayName = "CheckboxGroup.Item";

/* ── CheckboxGroup (root) ────────────────────────────────────────────────── */
function CheckboxGroup({
	value,
	onChange,
	options,
	direction = "vertical",
	gap = "md",
	size,
	disabled,
	label,
	error,
	className,
	children,
}: CheckboxGroupProps) {
	const toggle = React.useCallback(
		(itemValue: string | number) => {
			const next = value.includes(itemValue)
				? value.filter((v) => v !== itemValue)
				: [...value, itemValue];
			onChange(next);
		},
		[value, onChange],
	);

	const ctxValue = React.useMemo<CheckboxGroupContextValue>(
		() => ({ value, toggle, size, disabled }),
		[value, toggle, size, disabled],
	);

	return (
		<CheckboxGroupContext.Provider value={ctxValue}>
			<fieldset
				className={cn("flex flex-col", className)}
				disabled={disabled}
			>
				{label && (
					<legend className="text-sm font-bold text-gray-900 mb-2">
						{label}
					</legend>
				)}

				<div
					className={cn(
						"flex",
						direction === "vertical"
							? "flex-col"
							: "flex-row flex-wrap",
						gapMap[gap],
					)}
					role="group"
				>
					{options
						? options.map((opt) => (
								<Checkbox
									key={opt.value}
									checked={value.includes(opt.value)}
									onChange={() => toggle(opt.value)}
									label={opt.label}
									disabled={opt.disabled || disabled}
									size={size}
								/>
							))
						: children}
				</div>

				{error && <p className="text-xs text-red-500">{error}</p>}
			</fieldset>
		</CheckboxGroupContext.Provider>
	);
}

CheckboxGroup.displayName = "CheckboxGroup";
CheckboxGroup.Item = CheckboxGroupItem;

export { CheckboxGroup };
export default CheckboxGroup;
