import Image from "next/image";
import type React from "react";
import { cn } from "../../lib/utils";

/* ── Badge variants from Figma ── */

interface BadgeProps {
	children?: React.ReactNode;
	className?: string;
}

/** Badge "Trả góp 0% trả trước 0đ" */
export function BadgeOffer({ children, className = "" }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center px-1 py-0.5 rounded-xs text-xxs font-normal bg-gray-200 text-gray-900 ${className}`}
		>
			{children}
		</span>
	);
}

/** Badge "Mới về" */
export function BadgeNew({ children = "Mới về", className = "" }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center px-1 py-0.5 rounded-xs text-xxs font-normal bg-red-100 text-red-500 ${className}`}
		>
			{children}
		</span>
	);
}

/** Badge "Online giá sốc" */
export function BadgeOnline({
	children = "Online giá sốc",
	className = "",
}: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-xs text-xs font-medium bg-blue-50 text-blue-600 ${className}`}
		>
			{children}
		</span>
	);
}

/** Badge countdown "Còn 04 ngày 04:25:54" */
export function BadgeHotSale({ children, className = "" }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex h-5 items-center gap-1 rounded-full bg-red-50 pr-2 text-xxs! font-medium leading-xxs! text-red-500 whitespace-nowrap",
				className,
			)}
		>
			<Image
				src="/thunder-flash-sale.svg"
				alt=""
				width={20}
				height={20}
				priority
			/>
			{children}
		</span>
	);
}

/** Offer link "+2 ưu đãi cho bạn" */
export function BadgeOfferLink({ children, className = "" }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-1 rounded-xs text-xs font-medium bg-yellow-100 text-gray-900 cursor-pointer hover:bg-yellow-400/30 transition-colors ${className}`}
		>
			{children}
			<svg
				aria-hidden="true"
				width="12"
				height="12"
				viewBox="0 0 12 12"
				fill="none"
				className="text-gray-500"
			>
				<path
					d="M4.5 2.5L8 6L4.5 9.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}
