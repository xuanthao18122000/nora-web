"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Radio, type RadioProps } from "./Radio";

/* ────────────────────────────────────────────────────────────────────────────
 * RadioGroup — renders a group of Radio buttons with shared name + state
 *
 * Usage:
 *   <RadioGroup
 *     name="gender"
 *     value={selected}
 *     onChange={setSelected}
 *     options={[
 *       { value: 1, label: "Anh" },
 *       { value: 2, label: "Chị" },
 *     ]}
 *   />
 *
 *   // Or with children for custom layout:
 *   <RadioGroup name="gender" value={selected} onChange={setSelected}>
 *     <RadioGroup.Item value={1} label="Anh" />
 *     <RadioGroup.Item value={2} label="Chị" />
 *   </RadioGroup>
 * ──────────────────────────────────────────────────────────────────────────── */

export interface RadioGroupOption {
	value: string | number;
	label: React.ReactNode;
	disabled?: boolean;
}

export interface RadioGroupProps {
	/** Shared input name for the group */
	name: string;
	/** Currently selected value */
	value: string | number | undefined;
	/** Callback when selection changes */
	onChange: (value: string | number) => void;
	/** Quick declarative options (alternative to children) */
	options?: RadioGroupOption[];
	/** Layout direction */
	direction?: "horizontal" | "vertical";
	/** Gap between items */
	gap?: "sm" | "md" | "lg";
	/** Radio size passed to each Radio */
	size?: RadioProps["size"];
	/** Disable entire group */
	disabled?: boolean;
	/** Optional label for the group */
	label?: React.ReactNode;
	/** Error message */
	error?: string;
	/** Additional className for the container */
	className?: string;
	/** Children (use RadioGroup.Item) */
	children?: React.ReactNode;
}

const gapMap = {
	sm: "gap-3",
	md: "gap-4",
	lg: "gap-6",
} as const;

/* ── Context for compound component pattern ──────────────────────────────── */
interface RadioGroupContextValue {
	name: string;
	value: string | number | undefined;
	onChange: (value: string | number) => void;
	size?: RadioProps["size"];
	disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
	null,
);

/* ── RadioGroup.Item — individual radio within a group ───────────────────── */
export interface RadioGroupItemProps
	extends Omit<RadioProps, "name" | "checked" | "onChange" | "value"> {
	value: string | number;
}

function RadioGroupItem({
	value,
	disabled: itemDisabled,
	size: itemSize,
	...props
}: RadioGroupItemProps) {
	const ctx = React.useContext(RadioGroupContext);
	if (!ctx) {
		throw new Error("RadioGroup.Item must be used within a RadioGroup");
	}

	const isDisabled = itemDisabled || ctx.disabled;

	return (
		<Radio
			name={ctx.name}
			value={value}
			checked={ctx.value === value}
			onChange={() => ctx.onChange(value)}
			disabled={isDisabled}
			size={itemSize ?? ctx.size}
			{...props}
		/>
	);
}

RadioGroupItem.displayName = "RadioGroup.Item";

/* ── RadioGroup (root) ───────────────────────────────────────────────────── */
function RadioGroup({
	name,
	value,
	onChange,
	options,
	direction = "horizontal",
	gap = "lg",
	size,
	disabled,
	label,
	error,
	className,
	children,
}: RadioGroupProps) {
	const ctxValue = React.useMemo<RadioGroupContextValue>(
		() => ({ name, value, onChange, size, disabled }),
		[name, value, onChange, size, disabled],
	);

	return (
		<RadioGroupContext.Provider value={ctxValue}>
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
					role="radiogroup"
				>
					{options
						? options.map((opt) => (
								<Radio
									key={opt.value}
									name={name}
									value={opt.value}
									checked={value === opt.value}
									onChange={() => onChange(opt.value)}
									label={opt.label}
									disabled={opt.disabled || disabled}
									size={size}
								/>
							))
						: children}
				</div>

				{error && <p className="text-xs text-red-500">{error}</p>}
			</fieldset>
		</RadioGroupContext.Provider>
	);
}

RadioGroup.displayName = "RadioGroup";
RadioGroup.Item = RadioGroupItem;

export { RadioGroup };
export default RadioGroup;
