import { formatPrice } from "@/lib/utils/format";
import type { SharedOrderHeader, SharedOrderSummaryInfo } from "../types";
import { OrderDetailRow } from "./OrderDetailRow";

interface OrderHeaderCardProps {
	header: SharedOrderHeader;
	summary: SharedOrderSummaryInfo;
}

function formatOrderDate(value: string | Date): string {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return typeof value === "string" ? value : "";
	}
	return date.toLocaleString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

/**
 * Top summary card showing order code + status badge + basic info
 * (created date, total items, total amount).
 */
export function OrderHeaderCard({ header, summary }: OrderHeaderCardProps) {
	return (
		<div className="rounded-2xl bg-white p-4 shadow-sm space-y-4">
			<div className="flex justify-between items-center gap-2 pb-3 border-b border-gray-100">
				<h2 className="text-base font-bold text-gray-900 min-w-0 truncate">
					Đơn hàng: {header.orderCode}
				</h2>
				{header.statusBadge}
			</div>
			<div className="flex flex-col gap-2 text-sm text-gray-600">
				<OrderDetailRow
					label="Thời gian đặt hàng"
					value={formatOrderDate(header.createdAt)}
				/>
				<OrderDetailRow label="Số lượng" value={summary.totalItems} />
				<OrderDetailRow
					label="Tổng:"
					value={formatPrice(summary.totalAmount)}
				/>
			</div>
		</div>
	);
}
