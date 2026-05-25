import { cn } from "@/lib/utils/cn";

interface OrderDetailRowProps {
	label: React.ReactNode;
	value: React.ReactNode;
	icon?: React.ElementType;
	valueClass?: string;
}

/**
 * Generic label/value row used across the shared order-detail cards.
 * Matches the style previously used in `TrackingOrderDetail.DetailRow`.
 */
export function OrderDetailRow({
	label,
	value,
	icon: Icon,
	valueClass,
}: OrderDetailRowProps) {
	return (
		<div
			className={cn(
				"flex justify-between",
				Icon ? "items-start gap-4" : "items-center",
			)}
		>
			<div className="flex items-center gap-2 text-gray-500 shrink-0">
				{Icon && (
					<Icon
						className="w-[18px] h-[18px] shrink-0"
						aria-hidden="true"
					/>
				)}
				<span>{label}</span>
			</div>
			<span
				className={
					valueClass ||
					(Icon
						? "text-gray-900 text-right"
						: "text-gray-900 font-medium")
				}
			>
				{value}
			</span>
		</div>
	);
}
