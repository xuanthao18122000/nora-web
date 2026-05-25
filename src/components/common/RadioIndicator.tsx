import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * RadioIndicator — visual-only radio circle (no input, no label).
 *
 * Use inside cards/buttons where wrapping a real <input type="radio"> would
 * nest interactive elements. The parent <button> owns click semantics; this
 * component just renders the circle + inner dot.
 *
 * Variants:
 *   - "outline" (default): hollow circle with colored border + colored dot
 *   - "filled": solid colored circle with white dot inside
 * ──────────────────────────────────────────────────────────────────────────── */

export interface RadioIndicatorProps {
	/** Whether the radio is selected */
	checked: boolean;
	/** Visual style — outline (default) or filled */
	variant?: "outline" | "filled";
	/** Size of the outer circle */
	size?: "sm" | "md";
	/**
	 * If true, render at sm size on mobile and md size on ≥md breakpoint.
	 * Overrides `size` when set.
	 */
	responsive?: boolean;
	/** Extra classes for the outer circle */
	className?: string;
}

const sizeMap = {
	sm: { outer: "size-4", dot: "size-2" }, // 16 / 8
	md: { outer: "size-5", dot: "size-2.5" }, // 20 / 10
} as const;

const responsiveOuter = "size-4";
const responsiveDot = "size-2";

export function RadioIndicator({
	checked,
	variant = "outline",
	size = "sm",
	responsive = false,
	className,
}: RadioIndicatorProps) {
	const s = sizeMap[size];
	const isFilled = variant === "filled";

	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full border-1 transition-colors duration-150",
				responsive ? responsiveOuter : s.outer,
				checked
					? isFilled
						? "border-primary-500 bg-primary-500"
						: "border-primary-500 bg-white"
					: "border-gray-300 bg-white",
				className,
			)}
		>
			{checked && (
				<span
					className={cn(
						"rounded-full",
						responsive ? responsiveDot : s.dot,
						isFilled ? "bg-white" : "bg-primary-500",
					)}
				/>
			)}
		</span>
	);
}

export default RadioIndicator;
