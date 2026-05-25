"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

/* ─── Design: follows Input compound pattern ─────────────────────────────
 * Compound: Select.Root, Select.Label, Select.Field, Select.Message
 * Convenience: Select.TextField (label + field in one)
 */

const selectFieldVariants = cva(
	"w-full appearance-none rounded-[var(--radius-sm)] border bg-white text-gray-900 transition-[border-color,box-shadow] outline-none cursor-pointer disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20",
	{
		variants: {
			size: {
				sm: "min-h-8 py-2 pl-2.5 pr-8 text-xs",
				md: "min-h-10 py-2.5 pl-3 pr-9 text-sm",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const selectMessageVariants = cva("text-xs leading-4 min-w-0", {
	variants: {
		variant: {
			caption: "text-gray-500",
			error: "text-red-500",
			success: "text-green-500",
		},
	},
	defaultVariants: {
		variant: "caption",
	},
});

// ─── Compound: Root ─────────────────────────────────────────────────────
type SelectRootProps = React.ComponentProps<"div">;

function SelectRoot({ className, ...props }: SelectRootProps) {
	return (
		<div
			className={cn("flex flex-col gap-1 items-start w-full", className)}
			data-slot="select-root"
			{...props}
		/>
	);
}

// ─── Compound: Label ────────────────────────────────────────────────────
type SelectLabelProps = React.ComponentProps<"label">;

function SelectLabel({ className, ...props }: SelectLabelProps) {
	return (
		// biome-ignore lint: label association is via htmlFor/id set by consumer
		<label
			className={cn(
				"flex gap-1 items-center text-sm font-medium text-gray-900 leading-5 shrink-0",
				className,
			)}
			data-slot="select-label"
			{...props}
		/>
	);
}

function SelectRequired() {
	return (
		<span className="text-red-500 font-medium" aria-hidden>
			*
		</span>
	);
}

// ─── Compound: Field (native select + chevron icon) ─────────────────────
type SelectFieldProps = Omit<
	React.ComponentProps<"select">,
	"className" | "size"
> &
	VariantProps<typeof selectFieldVariants> & {
		className?: string;
		/** Placeholder text when no value selected */
		placeholder?: string;
	};

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
	({ className, size, placeholder, children, ...props }, ref) => {
		return (
			<div className="relative w-full" data-slot="select-slot">
				<select
					ref={ref}
					data-slot="select"
					className={cn(selectFieldVariants({ size }), className)}
					{...props}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{children}
				</select>
				<ChevronDown
					className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
					aria-hidden
				/>
			</div>
		);
	},
);
SelectField.displayName = "SelectField";

// ─── Compound: Message ──────────────────────────────────────────────────
type SelectMessageProps = React.ComponentProps<"p"> &
	VariantProps<typeof selectMessageVariants>;

function SelectMessage({ variant, className, ...props }: SelectMessageProps) {
	return (
		<p
			role={variant === "error" ? "alert" : undefined}
			className={cn(selectMessageVariants({ variant }), className)}
			data-slot="select-message"
			data-variant={variant}
			{...props}
		/>
	);
}

// ─── Convenience: TextField (label + field) ─────────────────────────────
type SelectTextFieldProps = Omit<SelectFieldProps, "id"> & {
	id: string;
	label: string;
	required?: boolean;
};

const SelectTextField = forwardRef<HTMLSelectElement, SelectTextFieldProps>(
	function SelectTextField(
		{ label, required, id, size, ...fieldProps },
		ref,
	) {
		return (
			<SelectRoot>
				<SelectLabel htmlFor={id}>
					{label}
					{required && <SelectRequired />}
				</SelectLabel>
				<SelectField ref={ref} id={id} size={size} {...fieldProps} />
			</SelectRoot>
		);
	},
);
SelectTextField.displayName = "SelectTextField";

// ─── Export ─────────────────────────────────────────────────────────────
const Select = {
	Root: SelectRoot,
	Label: SelectLabel,
	Required: SelectRequired,
	Field: SelectField,
	Message: SelectMessage,
	TextField: SelectTextField,
};

export type { SelectFieldProps, SelectMessageProps, SelectTextFieldProps };
export { Select, selectFieldVariants, selectMessageVariants };
