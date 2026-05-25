"use client";

import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
}

const VARIANTS: Record<Variant, string> = {
	primary: "bg-blue-600 text-white hover:bg-blue-700",
	secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
	danger: "bg-red-600 text-white hover:bg-red-700",
	ghost: "text-gray-600 hover:bg-gray-100",
};

const SIZES: Record<Size, string> = {
	sm: "h-9 px-3 text-sm",
	md: "h-10 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ variant = "primary", size = "md", className = "", ...rest },
	ref,
) {
	return (
		<button
			ref={ref}
			{...rest}
			className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
		/>
	);
});
