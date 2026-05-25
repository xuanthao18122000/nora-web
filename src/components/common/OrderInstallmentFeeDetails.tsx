"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface OrderInstallmentFeeDetailsProps {
	totalFee: number;
	feeDetails?: Array<{ label: string; amount: number }> | null;
	className?: string;
}

export function OrderInstallmentFeeDetails({
	totalFee,
	feeDetails,
	className,
}: OrderInstallmentFeeDetailsProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (!totalFee || totalFee <= 0) return null;

	const hasDetails = Boolean(feeDetails && feeDetails.length > 0);

	return (
		<div className={cn("flex flex-col", className)}>
			<button
				type="button"
				className={cn(
					"flex items-center w-full justify-between text-left",
					hasDetails ? "cursor-pointer group" : "",
				)}
				onClick={() => hasDetails && setIsOpen(!isOpen)}
			>
				<span>Phí phát sinh:</span>
				<span className="flex items-center gap-1 text-gray-900 font-medium">
					{formatPrice(totalFee)}
					{hasDetails && (
						<ChevronDown
							aria-hidden="true"
							className={cn(
								"size-4 text-gray-400 group-hover:text-gray-600 transition-transform",
								isOpen ? "rotate-180" : "",
							)}
						/>
					)}
				</span>
			</button>
			{isOpen && hasDetails && (
				<ul className="flex flex-col pl-2 pt-2 gap-1.5 text-xs text-gray-500 list-none">
					{feeDetails?.map((d, i) => (
						<li
							key={i}
							className="flex items-center justify-between"
						>
							<span>{d.label}</span>
							<span className="text-gray-900">
								{formatPrice(d.amount)}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
