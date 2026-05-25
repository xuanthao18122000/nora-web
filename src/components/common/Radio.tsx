import React from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * Radio — reusable radio button component
 *
 * Uses a hidden native <input type="radio"> for accessibility + form
 * semantics, paired with a custom visual indicator that matches the DDV
 * design system.
 *
 * Usage:
 *   <Radio name="gender" value="male" checked={…} onChange={…} />
 *   <Radio name="gender" value="female" checked={…} onChange={…} label="Chị" />
 * ──────────────────────────────────────────────────────────────────────────── */

export interface RadioProps
	extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
	/** Optional visible label rendered next to the dot */
	label?: React.ReactNode;
	/** Visual size of the radio dot */
	size?: "sm" | "md";
}

const sizeMap = {
	sm: {
		outer: "h-4 w-4", // 16px
		inner: "h-2 w-2", // 8px
	},
	md: {
		outer: "h-[18px] w-[18px]", // 18px
		inner: "h-2.5 w-2.5", // 10px
	},
} as const;

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
					type="radio"
					checked={checked}
					disabled={disabled}
					className="peer sr-only"
					{...props}
				/>

				<span
					className={cn(
						"relative inline-flex shrink-0 items-center justify-center rounded-full border transition-all duration-150",
						s.outer,
						checked
							? "border-primary-500 bg-white"
							: "border-gray-300 bg-white",
						!disabled && !checked && "group-hover:border-gray-400",
					)}
					aria-hidden="true"
				>
					{/* Inner dot */}
					<span
						className={cn(
							"rounded-full transition-all duration-150",
							s.inner,
							checked
								? "scale-100 bg-primary-500"
								: "scale-0 bg-transparent",
						)}
					/>
				</span>

				{/* Label text */}
				{label != null && (
					<span className="text-sm text-gray-900">{label}</span>
				)}
			</label>
		);
	},
);

Radio.displayName = "Radio";

export { Radio };
export default Radio;
