import { cn, formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
	price: number;
	originalPrice?: number;
	discount?: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const SIZE_CLASSES = {
	sm: { price: "text-sm", original: "text-xs", discount: "text-xs" },
	md: { price: "text-md", original: "text-xs", discount: "text-xs" },
	lg: { price: "text-xl", original: "text-sm", discount: "text-sm" },
};

/**
 * Price Display — matches Figma product-item price section.
 * Uses formatPrice for Vietnamese price formatting.
 *
 * @example
 * <PriceDisplay price={9200000} originalPrice={12200000} discount="-30%" />
 */
export default function PriceDisplay({
	price,
	originalPrice,
	discount,
	size = "md",
	className = "",
}: PriceDisplayProps) {
	const s = SIZE_CLASSES[size];

	return (
		<div className={cn("flex flex-col gap-0.5", className)}>
			{/* Sale price */}
			<span className={`${s.price} font-semibold text-primary-600`}>
				{formatPrice(price)}
			</span>

			{/* Original price + discount */}
			{(originalPrice !== undefined || discount) && (
				<div className="flex items-center gap-1">
					{originalPrice !== undefined && (
						<span
							className={cn(
								s.original,
								"font-normal text-gray-400 line-through",
							)}
						>
							{formatPrice(originalPrice)}
						</span>
					)}
					{discount && (
						<span
							className={cn(
								s.discount,
								"font-medium text-primary-600",
							)}
						>
							{discount}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
