import { ORDER_STATUS_LABEL, OrderStatusEnum } from "@/lib/api/admin";

const STATUS_COLOR: Record<OrderStatusEnum, string> = {
	[OrderStatusEnum.NEW]: "bg-blue-50 text-blue-700 ring-blue-600/20",
	[OrderStatusEnum.CONFIRMED]: "bg-purple-50 text-purple-700 ring-purple-600/20",
	[OrderStatusEnum.SHIPPING]: "bg-amber-50 text-amber-700 ring-amber-600/20",
	[OrderStatusEnum.COMPLETED]: "bg-green-50 text-green-700 ring-green-600/20",
	[OrderStatusEnum.CANCELLED]: "bg-red-50 text-red-700 ring-red-600/20",
};

export function OrderStatusBadge({ status }: { status: OrderStatusEnum }) {
	return (
		<span
			className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STATUS_COLOR[status]}`}
		>
			{ORDER_STATUS_LABEL[status]}
		</span>
	);
}
