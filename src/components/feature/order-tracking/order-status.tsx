import { cn } from "@/lib/utils";

/**
 * Mapping ID khớp BE acquyhn-api `OrderStatusEnum`:
 *   1 = NEW (Chờ xác nhận)
 *   2 = CONFIRMED (Đã xác nhận)
 *   3 = SHIPPING (Đang giao)
 *   4 = COMPLETED (Hoàn thành)
 *   5 = CANCELLED (Đã huỷ)
 *
 * `ALL` không phải status thực — chỉ dùng làm filter key, value = 0 để khỏi đụng
 * tới các status thật.
 */
export enum FeOrderStatus {
	ALL = 0,
	PENDING_CONFIRM = 1,
	CONFIRMED = 2,
	SHIPPING = 3,
	DELIVERED = 4,
	CANCELLED = 5,
}

export const FE_ORDER_STATUS_LABEL: Record<FeOrderStatus, string> = {
	[FeOrderStatus.ALL]: "Tất cả",
	[FeOrderStatus.PENDING_CONFIRM]: "Chờ xác nhận",
	[FeOrderStatus.CONFIRMED]: "Đã xác nhận",
	[FeOrderStatus.SHIPPING]: "Đang giao",
	[FeOrderStatus.DELIVERED]: "Thành công",
	[FeOrderStatus.CANCELLED]: "Đã huỷ",
};

const STATUS_STYLE: Record<FeOrderStatus, string> = {
	[FeOrderStatus.ALL]: "bg-gray-100 text-gray-700",
	[FeOrderStatus.PENDING_CONFIRM]: "bg-amber-100 text-amber-700",
	[FeOrderStatus.CONFIRMED]: "bg-blue-100 text-blue-700",
	[FeOrderStatus.SHIPPING]: "bg-indigo-100 text-indigo-700",
	[FeOrderStatus.DELIVERED]: "bg-emerald-100 text-emerald-700",
	[FeOrderStatus.CANCELLED]: "bg-red-50 text-red-600",
};

interface OrderStatusBadgeProps {
	status: FeOrderStatus;
	className?: string;
}

export default function OrderStatusBadge({
	status,
	className,
}: OrderStatusBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center rounded-xs px-1 py-0.5 text-xs font-medium",
				STATUS_STYLE[status] ?? "bg-gray-100 text-text-primary",
				className,
			)}
		>
			{FE_ORDER_STATUS_LABEL[status] ?? ""}
		</span>
	);
}
