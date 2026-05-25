"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

/* ─── Design: Figma DDV Form Input (node 73:6625) ─────────────────────────
 * States: default, focus (border blue-400), filled, disable, caption, error, success.
 * Tokens: border gray-200, focus blue-400, error red-300, success green-300,
 *         disabled bg/border gray-300; text gray-900, placeholder gray-500;
 *         spacing gap-1 (4px), slot px-3 py-2.5 gap-2, radius-sm (8px).
 * Composition: no boolean props; use Root, Label, Slot, LeadingIcon, Field, Message.
 */

const inputSlotVariants = cva(
	"flex gap-2 items-center w-full rounded-[var(--radius-sm)] border bg-white px-3 py-2.5 text-sm transition-[border-color,box-shadow] outline-none min-h-10 border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 has-[[aria-invalid=true]]:border-red-300 has-[[aria-invalid=true]]:focus-within:border-red-300 has-[[aria-invalid=true]]:focus-within:ring-red-300/20 has-[[data-success]]:border-green-300 has-[[data-success]]:focus-within:border-green-300 has-[[data-success]]:focus-within:ring-green-300/20 has-[[disabled]]:border-gray-300 has-[[disabled]]:bg-gray-200/50 has-[[disabled]]:cursor-not-allowed",
	{
		variants: {
			size: {
				xs: "min-h-7 py-2 px-2 text-xs",
				sm: "min-h-8 py-2 px-2.5 text-xs",
				md: "min-h-10 py-2.5 px-3 text-sm",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const inputFieldVariants = cva(
	"min-w-0 flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 disabled:text-gray-600 disabled:placeholder:text-gray-600 outline-none",
	{
		variants: {
			size: {
				xs: "text-xs",
				sm: "text-xs",
				md: "text-sm",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const inputMessageVariants = cva("text-xs leading-4 min-w-0", {
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
type InputRootProps = React.ComponentProps<"div">;

function InputRoot({ className, ...props }: InputRootProps) {
	return (
		<div
			className={cn("flex flex-col gap-1 items-start w-full", className)}
			data-slot="input-root"
			{...props}
		/>
	);
}

// ─── Compound: Label (compose with Input.Required / optional text) ───────
// Associate with field via htmlFor on Label and id on Input.Field (consumer responsibility).
type InputLabelProps = React.ComponentProps<"label">;

function InputLabel({ className, ...props }: InputLabelProps) {
	return (
		// biome-ignore lint: label association is via htmlFor/id set by consumer
		<label
			className={cn(
				"flex gap-1 items-center text-sm font-medium text-gray-900 leading-5 shrink-0",
				className,
			)}
			data-slot="input-label"
			{...props}
		/>
	);
}

function InputRequired() {
	return (
		<span className="text-red-500 font-medium" aria-hidden>
			*
		</span>
	);
}

type InputLabelOptionalProps = { children?: React.ReactNode };

function InputLabelOptional({ children }: InputLabelOptionalProps) {
	return (
		<span className="text-xs font-normal text-gray-500 leading-4">
			{children ?? "(Tùy chọn)"}
		</span>
	);
}

// ─── Compound: Slot (wrapper for LeadingIcon + Field; border/state) ───────
type InputSlotProps = React.ComponentProps<"div"> &
	VariantProps<typeof inputSlotVariants>;

function InputSlot({ className, size, ...props }: InputSlotProps) {
	return (
		<div
			className={cn(inputSlotVariants({ size }), className)}
			data-slot="input-slot"
			suppressHydrationWarning
			{...props}
		/>
	);
}

// ─── Compound: Leading icon (decorative, left of field) ──────────────────
function InputLeadingIcon({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"flex shrink-0 size-4 items-center justify-center text-gray-500",
				className,
			)}
			aria-hidden
			data-slot="input-leading-icon"
			{...props}
		>
			{children}
		</span>
	);
}

// ─── Compound: Field (native input; use id + htmlFor for a11y) ───────────
type InputFieldProps = Omit<
	React.ComponentProps<"input">,
	"className" | "size"
> &
	VariantProps<typeof inputFieldVariants> & {
		className?: string;
		/** Set when validation succeeded (green border). */
		"data-success"?: boolean;
	};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	({ className, size, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type="text"
				data-slot="input"
				className={cn(inputFieldVariants({ size }), className)}
				suppressHydrationWarning
				{...props}
			/>
		);
	},
);
InputField.displayName = "InputField";

// ─── Compound: Message (caption / error / success) ───────────────────────
type InputMessageVariant = VariantProps<typeof inputMessageVariants>["variant"];

type InputMessageProps = React.ComponentProps<"p"> &
	VariantProps<typeof inputMessageVariants>;

function InputMessage({ variant, className, ...props }: InputMessageProps) {
	return (
		<p
			role={variant === "error" ? "alert" : undefined}
			className={cn(inputMessageVariants({ variant }), className)}
			data-slot="input-message"
			data-variant={variant}
			{...props}
		/>
	);
}

// ─── Convenience: TextField (label + optional/required + leadingIcon + field) ─
type InputTextFieldProps = Omit<InputFieldProps, "id"> & {
	id: string;
	label: string;
	optional?: boolean;
	required?: boolean;
	leadingIcon?: React.ReactNode;
};

const InputTextField = forwardRef<HTMLInputElement, InputTextFieldProps>(
	function InputTextField(
		{ label, optional, required, leadingIcon, id, size, ...fieldProps },
		ref,
	) {
		return (
			<InputRoot>
				<InputLabel htmlFor={id}>
					{label}
					{required && <InputRequired />}
				</InputLabel>
				<InputSlot size={size}>
					{leadingIcon && (
						<InputLeadingIcon>{leadingIcon}</InputLeadingIcon>
					)}
					<InputField ref={ref} id={id} size={size} {...fieldProps} />
				</InputSlot>
			</InputRoot>
		);
	},
);
InputTextField.displayName = "InputTextField";

// ─── Export compound + convenience ──────────────────────────────────────
const Input = {
	Root: InputRoot,
	Label: InputLabel,
	Required: InputRequired,
	LabelOptional: InputLabelOptional,
	Slot: InputSlot,
	LeadingIcon: InputLeadingIcon,
	Field: InputField,
	Message: InputMessage,
	TextField: InputTextField,
};

export type {
	InputFieldProps,
	InputMessageProps,
	InputMessageVariant,
	InputTextFieldProps,
};
export { Input, inputFieldVariants, inputMessageVariants, inputSlotVariants };
