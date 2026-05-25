import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CarouselNavProps {
	direction: "prev" | "next";
	onClick?: () => void;
	disabled?: boolean;
	size?: "sm" | "md";
	className?: string;
}

/**
 * Carousel Nav Button — circular prev/next button.
 *
 * Standalone nav button used outside of the embla CarouselRoot context.
 * For embla-managed nav, use CarouselPrevious / CarouselNext instead.
 */
export default function CarouselNav({
	direction,
	onClick,
	disabled = false,
	size = "md",
	className,
}: CarouselNavProps) {
	const sizeClasses = size === "sm" ? "size-8" : "size-10";
	const iconSize = size === "sm" ? 14 : 18;

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={direction === "prev" ? "Previous" : "Next"}
			className={cn(
				sizeClasses,
				"inline-flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-[box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
				className,
			)}
		>
			{direction === "prev" ? (
				<ChevronLeft className="text-gray-700" size={iconSize} />
			) : (
				<ChevronRight className="text-gray-700" size={iconSize} />
			)}
		</button>
	);
}
