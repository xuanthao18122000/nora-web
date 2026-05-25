import React from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * Checkbox — reusable checkbox component
 *
 * Uses a hidden native <input type="checkbox"> for accessibility + form
 * semantics, paired with a custom visual indicator that matches the DDV
 * design system (primary-500 filled box + white checkmark).
 *
 * Usage:
 *   <Checkbox checked={…} onChange={…} label="Nhờ người khác nhận hàng" />
 *   <Checkbox checked={…} onChange={…} />
 * ──────────────────────────────────────────────────────────────────────────── */

export interface CheckboxProps
	extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
	/** Optional visible label rendered next to the box */
	label?: React.ReactNode;
	/** Visual size of the checkbox */
	size?: "sm" | "md";
}

const sizeMap = {
	sm: {
		box: "h-4 w-4", // 16px
		icon: 12,
	},
	md: {
		box: "h-5 w-5", // 20px
		icon: 14,
	},
} as const;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, label, size = "sm", disabled, checked, ...props }, ref) => {
		const s = sizeMap[size];

		return (
			<label
				className={cn(
					"inline-flex items-center gap-2 cursor-pointer select-none",
					disabled && "cursor-not-allowed opacity-50",
					className,
				)}
			>
				{/* Hidden native input for a11y + form */}
				<input
					ref={ref}
					type="checkbox"
					checked={checked}
					disabled={disabled}
					className="peer sr-only"
					{...props}
				/>

				<span
					className={cn(
						"relative inline-flex shrink-0 items-center justify-center rounded border transition-all duration-150",
						s.box,
						checked
							? "bg-primary-500 border-primary-500"
							: "bg-white border-gray-300",
						!disabled && !checked && "group-hover:border-gray-400",
					)}
					aria-hidden="true"
				>
					{/* Checkmark icon */}
					<svg
						width={s.icon}
						height={s.icon}
						viewBox="0 0 12 12"
						fill="none"
						aria-hidden="true"
						className={cn(
							"transition-all duration-150",
							checked
								? "opacity-100 scale-100"
								: "opacity-0 scale-75",
						)}
					>
						<path
							d="M2 6L5 9L10 3"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>

				{/* Label text */}
				{label != null && (
					<span className="text-sm text-gray-900">{label}</span>
				)}
			</label>
		);
	},
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export default Checkbox;
