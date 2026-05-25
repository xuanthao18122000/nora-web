interface StarRatingProps {
	rating: number | string;
	reviewCount?: number;
	size?: "sm" | "md";
	className?: string;
}

/**
 * Star Rating — matches Figma product-item review section
 *
 * @example <StarRating rating={4.9} reviewCount={100} />
 * → ⭐ 4.9 (100)
 */
export default function StarRating({
	rating,
	reviewCount,
	size = "sm",
	className = "",
}: StarRatingProps) {
	const numRating = Number(rating);
	const displayRating = numRating.toFixed(1).replace(/\.0$/, "");

	const sizeClasses = {
		sm: "text-xs",
		md: "text-sm",
	};

	const starSize = size === "sm" ? 12 : 16;

	return (
		<div
			className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${className}`}
		>
			{/* Filled star */}
			<svg
				aria-hidden="true"
				width={starSize}
				height={starSize}
				viewBox="0 0 12 12"
				fill="none"
				className="shrink-0"
			>
				<path
					d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
					fill="#FBBF24"
					stroke="#FBBF24"
					strokeWidth="0.5"
					strokeLinejoin="round"
				/>
			</svg>

			{/* Rating number */}
			<span className="font-medium text-gray-900">{displayRating}</span>

			{/* Review count */}
			{reviewCount !== undefined && (
				<span className="text-gray-400">({reviewCount})</span>
			)}
		</div>
	);
}
