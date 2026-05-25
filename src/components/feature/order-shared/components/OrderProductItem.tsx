import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VariantLabel } from "@/components/common/VariantLabel";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import type { SharedOrderProduct } from "../types";

interface OrderProductItemProps {
	item: SharedOrderProduct;
	extraClasses?: string;
}

/**
 * Shared product row for order-detail views (order-tracking + account).
 * Wraps image and title in `<Link>` when `item.href` is provided.
 */
export function OrderProductItem({
	item,
	extraClasses,
}: OrderProductItemProps) {
	const imageNode = item.productImage ? (
		<Image
			width={64}
			height={64}
			className="object-contain w-full h-full mix-blend-multiply"
			src={getImageUrl(item.productImage)}
			alt={item.productName}
		/>
	) : (
		<ImageIcon className="text-gray-300 w-6 h-6" aria-hidden="true" />
	);

	const imageBlock = (
		<div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-lg overflow-hidden">
			{imageNode}
		</div>
	);

	const titleNode = (
		<span
			className={cn(
				"text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-0.5",
				item.href &&
					"hover:text-blue-500 transition-colors duration-150",
			)}
		>
			{item.productName}
		</span>
	);

	return (
		<div className={cn("flex items-start gap-4", extraClasses)}>
			{item.href ? (
				<Link
					href={item.href}
					className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
				>
					{imageBlock}
				</Link>
			) : (
				imageBlock
			)}
			<div className="flex-1 min-w-0 flex flex-col pt-0.5">
				{item.href ? (
					<Link
						href={item.href}
						className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
					>
						{titleNode}
					</Link>
				) : (
					titleNode
				)}
				<VariantLabel
					variantAttributes={item.variantAttributes ?? undefined}
					fallbackName={item.variantName ?? undefined}
				/>
				<div className="flex flex-col min-w-0 mt-auto pt-1">
					<span className="text-sm md:text-base font-bold text-primary-500">
						{formatPrice(item.price)}
					</span>
					{item.listedPrice && item.listedPrice > item.price && (
						<span className="text-xs text-gray-400 line-through">
							{formatPrice(item.listedPrice)}
						</span>
					)}
					<div className="flex items-center gap-2 mt-2 md:hidden">
						<span className="text-xs font-medium whitespace-nowrappx-2 py-0.5 rounded">
							Số lượng: {item.quantity}
						</span>
						{item.action}
					</div>
				</div>
			</div>
			<div className="hidden md:flex items-center gap-2 shrink-0 pt-0.5">
				<span className="text-sm font-medium whitespace-nowrap x-2 py-0.5 rounded">
					Số lượng: {item.quantity}
				</span>
				{item.action}
			</div>
		</div>
	);
}
