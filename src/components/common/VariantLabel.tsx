import { useVariantLabel } from "@/hooks/use-variant-label";

interface VariantLabelProps {
	variantAttributes?: { value?: string | null }[] | null;
	fallbackName?: string | null;
	className?: string;
}

/**
 * Read-only variant label — used in Checkout and Order Tracking.
 * Shows the resolved attribute string (e.g. "Đen - 256GB") as a
 * small pill badge. No popover, no chevron icon.
 */
export function VariantLabel({
	variantAttributes,
	fallbackName,
	className,
}: VariantLabelProps) {
	const label = useVariantLabel(variantAttributes, fallbackName);
	if (!label) return null;
	return (
		<span
			className={
				className ??
				"inline-block w-fit px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 leading-snug"
			}
		>
			{label}
		</span>
	);
}
