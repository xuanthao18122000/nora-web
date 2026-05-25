"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

/* States (Tailwind): hover = cursor over, focus = has focus, focus-visible = keyboard focus (a11y), active = being pressed. We use active for press feedback, focus-visible for focus ring + optional bg. */
const buttonVariants = cva(
	"inline-flex items-center justify-center font-medium border border-solid transition-colors duration-150 cursor-pointer select-none touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-500 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-lg",
	{
		variants: {
			variant: {
				filled: "border-transparent",
				bordered: "bg-white disabled:border-transparent",
				soft: "border-transparent",
				pill: "rounded-lg",
				link: "bg-transparent border-transparent disabled:bg-transparent",
				filter: "bg-white font-normal",
				solid: "border-transparent",
			},
			color: {
				primary: "",
				softPrimary: "",
				gray: "",
				white: "",
				opacity: "",
				textBlack: "",
				textBlue: "",
				blue: "",
			},
			size: {
				xs: "gap-[var(--spacing-1)] text-[length:var(--text-sm)] leading-[var(--leading-sm)] px-[var(--spacing-1_5)] py-[var(--spacing-1_5)] [&_svg]:size-5",
				sm: "gap-[var(--spacing-2)] text-[length:var(--text-sm)] leading-[var(--leading-sm)] px-[var(--spacing-3)] py-[var(--spacing-2_5)] [&_svg]:size-5",
				md: "gap-[var(--spacing-2)] text-[length:var(--text-md)] leading-[var(--leading-md)] px-[var(--spacing-4)] py-[var(--spacing-3)] [&_svg]:size-6",
			},
			iconOnly: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			// ─── Filled (Figma) ───
			{
				variant: "filled",
				color: "primary",
				className:
					"bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-400 disabled:bg-gray-300",
			},
			{
				variant: "filled",
				color: "softPrimary",
				className:
					"bg-primary-50 text-primary-500 hover:bg-primary-100 active:bg-primary-100 disabled:bg-gray-300",
			},
			{
				variant: "filled",
				color: "gray",
				className:
					"bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-200 disabled:bg-gray-300",
			},
			{
				variant: "filled",
				color: "white",
				className:
					"bg-white text-gray-900 hover:bg-primary-500 hover:text-white active:bg-primary-600 disabled:bg-gray-300",
			},
			{
				variant: "filled",
				color: "opacity",
				className:
					"bg-black/10 text-gray-900 hover:bg-black/20 active:bg-black/20 disabled:bg-gray-300",
			},
			{
				variant: "filled",
				color: "textBlack",
				className:
					"bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-100 disabled:bg-transparent",
			},
			{
				variant: "filled",
				color: "textBlue",
				className:
					"bg-transparent text-blue-500 hover:bg-gray-50 active:bg-gray-100 disabled:bg-transparent",
			},
			{
				variant: "filled",
				color: "textBlue",
				className:
					"bg-transparent text-blue-500 hover:bg-gray-50 active:bg-gray-100 disabled:bg-transparent",
			},
			{
				variant: "solid",
				color: "textBlue",
				className:
					"bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-400 disabled:bg-gray-300",
			},

			// ─── Bordered (Figma) ───
			{
				variant: "bordered",
				color: "primary",
				className:
					"text-primary-500 border-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:bg-gray-300",
			},
			{
				variant: "bordered",
				color: "gray",
				className:
					"text-gray-900 border-gray-200 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-100 disabled:bg-gray-300",
			},
			{
				variant: "bordered",
				color: "blue",
				className:
					"text-blue-500 border-blue-500 hover:bg-blue-50 active:bg-blue-50 disabled:bg-gray-300",
			},
			// ─── Icon-only padding ───
			{
				variant: ["filled", "bordered"],
				iconOnly: true,
				size: "xs",
				className: "p-[var(--spacing-1_5)]",
			},
			{
				variant: ["filled", "bordered"],
				iconOnly: true,
				size: "sm",
				className: "p-[var(--spacing-2_5)]",
			},
			{
				variant: ["filled", "bordered"],
				iconOnly: true,
				size: "md",
				className: "p-[var(--spacing-3)]",
			},
			// ─── Legacy ───
			{
				variant: "soft",
				color: "primary",
				className:
					"bg-primary-50 text-primary-500 hover:bg-primary-100 active:bg-primary-100 disabled:bg-gray-300",
			},
			{
				variant: "soft",
				color: "gray",
				className:
					"bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-100 disabled:bg-gray-300",
			},
			{
				variant: "link",
				color: "blue",
				className:
					"text-blue-500 hover:text-blue-600 active:text-blue-700",
			},
			{
				variant: "link",
				color: "primary",
				className:
					"text-primary-500 hover:text-blue-500 active:text-primary-700",
			},
			{
				variant: "link",
				color: "gray",
				className:
					"text-gray-600 hover:text-gray-700 active:text-gray-800",
			},
			{
				variant: "pill",
				size: "xs",
				className: "px-2 py-1 text-xs gap-1",
			},
			{
				variant: "pill",
				size: "sm",
				className: "px-2 md:px-3 py-1.5 text-sm gap-1",
			},
			{
				variant: "pill",
				size: "md",
				className: "px-2 md:px-4 py-2 text-sm gap-2",
			},
			{ variant: "link", size: ["xs", "sm"], className: "px-1.5 py-1.5" },
			{ variant: "link", size: "md", className: "px-2 py-2" },
			{
				variant: "filter",
				size: "sm",
				className: "px-2 md:px-3 h-10 text-sm rounded-lg",
			},
		],
		defaultVariants: {
			variant: "filled",
			color: "primary",
			size: "md",
			iconOnly: false,
		},
	},
);

const pillStateVariants = cva("", {
	variants: {
		pressed: {
			true: "",
			false: "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 active:bg-gray-100",
		},
		color: {
			primary: "",
			softPrimary: "",
			gray: "",
			white: "",
			opacity: "",
			textBlack: "",
			textBlue: "",
			blue: "",
		},
	},
	compoundVariants: [
		{
			pressed: true,
			color: "primary",
			className:
				"bg-white text-primary-500 border-primary-500 hover:bg-primary-50 active:bg-primary-100",
		},
		{
			pressed: true,
			color: "softPrimary",
			className:
				"bg-white text-primary-500 border-primary-500 hover:bg-primary-50 active:bg-primary-100",
		},
		{
			pressed: true,
			color: "blue",
			className:
				"bg-white text-blue-500 border-blue-500 hover:bg-blue-50 active:bg-blue-100",
		},
		{
			pressed: true,
			color: "gray",
			className:
				"bg-white text-gray-900 border-gray-900 hover:bg-gray-50 active:bg-gray-100",
		},
		{
			pressed: true,
			color: "white",
			className:
				"bg-white text-primary-500 border-primary-500 hover:bg-primary-50 active:bg-primary-100",
		},
		{
			pressed: true,
			color: "opacity",
			className:
				"bg-white text-gray-900 border-gray-900 hover:bg-gray-50 active:bg-gray-100",
		},
		{
			pressed: true,
			color: "textBlack",
			className:
				"bg-white text-gray-900 border-gray-900 hover:bg-gray-50 active:bg-gray-100",
		},
		{
			pressed: true,
			color: "textBlue",
			className:
				"bg-white text-blue-500 border-blue-500 hover:bg-blue-50 active:bg-blue-100",
		},
	],
	defaultVariants: {
		pressed: false,
		color: "primary",
	},
});

const filterStateVariants = cva("", {
	variants: {
		pressed: {
			true: "text-blue-500 border border-blue-500 hover:bg-blue-50 active:bg-blue-100",
			false: "text-gray-900 border border-gray-200 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200",
		},
	},
	defaultVariants: {
		pressed: false,
	},
});

const loadingSpinner = (
	<svg
		aria-hidden="true"
		className="size-4 animate-spin"
		viewBox="0 0 24 24"
		fill="none"
	>
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		/>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
		/>
	</svg>
);

export interface ButtonProps
	extends Omit<React.ComponentPropsWithoutRef<"button">, "color">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	pressed?: boolean;
	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			color,
			size,
			iconOnly: _iconOnly,
			asChild = false,
			loading = false,
			pressed,
			iconOnly: _iconOnlyProp,
			leadingIcon,
			trailingIcon,
			disabled,
			children,
			role = "button",
			type = "button",
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		const isDisabled = disabled || loading;

		const childrenCount = React.Children.count(children);
		const isEmptyString =
			typeof children === "string" && children.trim() === "";
		const isIconOnly =
			(childrenCount === 0 || isEmptyString) &&
			(!!leadingIcon || !!trailingIcon);

		const variantClasses = buttonVariants({
			variant,
			color,
			size,
			iconOnly: isIconOnly,
		});
		const pillClasses =
			variant === "pill"
				? pillStateVariants({ pressed, color: color ?? "primary" })
				: "";
		const filterClasses =
			variant === "filter" ? filterStateVariants({ pressed }) : "";

		return (
			<Comp
				ref={ref}
				className={cn(
					variantClasses,
					isIconOnly && "min-w-0",
					pillClasses,
					filterClasses,
					className,
				)}
				disabled={isDisabled}
				aria-pressed={
					variant === "pill" || variant === "filter"
						? pressed
						: undefined
				}
				aria-busy={loading ? true : undefined}
				data-filter-pressed={
					variant === "filter" && pressed ? "true" : undefined
				}
				{...props}
			>
				{loading ? loadingSpinner : leadingIcon}
				<Slottable>{children}</Slottable>
				{!loading && trailingIcon}
			</Comp>
		);
	},
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
