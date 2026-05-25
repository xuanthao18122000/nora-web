"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface OrderDiscountDetailsProps {
	totalDiscount: number;
	discountDetails?: Array<{ label: string; amount: number }>;
	className?: string;
	isListItem?: boolean;
}

export function OrderDiscountDetails({
	totalDiscount,
	discountDetails,
	className,
	isListItem = false,
}: OrderDiscountDetailsProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (!totalDiscount || totalDiscount <= 0) {
		return null;
	}

	const hasDetails = Boolean(discountDetails && discountDetails.length > 0);

	const content = (
		<div className={cn("flex flex-col", className)}>
			<button
				type="button"
				className={cn(
					"flex items-center w-full justify-between text-left",
					hasDetails ? "cursor-pointer group" : "",
				)}
				onClick={() => hasDetails && setIsOpen(!isOpen)}
			>
				<span
					className={cn(
						"flex items-center",
						isListItem ? "gap-1" : "",
					)}
				>
					{isListItem ? (
						<strong>Khuyến mãi:</strong>
					) : (
						<span>Khuyến mãi:</span>
					)}
					{isListItem && (
						<span className="flex items-center gap-1 text-green-600 font-medium ml-1">
							-{formatPrice(totalDiscount)}
							{hasDetails && <ToggleIcon isOpen={isOpen} />}
						</span>
					)}
				</span>
				{!isListItem && (
					<span className="flex items-center gap-1 text-green-600 font-medium">
						-{formatPrice(totalDiscount)}
						{hasDetails && <ToggleIcon isOpen={isOpen} />}
					</span>
				)}
			</button>
			{isOpen && hasDetails && (
				<ul
					className={cn(
						"flex flex-col list-none font-normal",
						isListItem
							? "mt-2 gap-1.5 text-sm mb-2 ml-6 border-l-2 border-dashed border-gray-200 pl-3"
							: "pl-2 pt-2 gap-1.5 text-xs text-gray-500",
					)}
				>
					{discountDetails?.map((d, i) => (
						<li
							key={i}
							className={cn(
								"flex items-center",
								isListItem ? "gap-1.5" : "justify-between",
							)}
						>
							<span className={isListItem ? "text-gray-500" : ""}>
								{d.label}
								{isListItem ? ":" : ""}
							</span>
							<span
								className={
									isListItem
										? "text-gray-900 font-medium"
										: "text-green-600"
								}
							>
								-{formatPrice(d.amount)}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);

	if (isListItem) {
		return <li className={className}>{content}</li>;
	}

	return content;
}

function ToggleIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<ChevronDown
			aria-hidden="true"
			className={cn(
				"size-4 text-gray-400 group-hover:text-gray-600 transition-transform",
				isOpen ? "rotate-180" : "",
			)}
		/>
	);
}
