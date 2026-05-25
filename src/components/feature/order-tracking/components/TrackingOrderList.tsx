"use client";

import { ChevronRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";
import OrderStatusBadge, { type FeOrderStatus } from "../order-status";

interface OrderListItemProduct {
	id: number;
	productName: string;
	productImage?: string | null;
	unitPrice?: number | string | null;
	quantity: number;
}

export interface TrackingOrderListItem {
	id: number;
	customerName: string;
	phone: string;
	totalAmount: number | string;
	status: number;
	createdAt: string;
	items?: OrderListItemProduct[];
}

interface TrackingOrderListProps {
	phone: string;
	orders: TrackingOrderListItem[];
	onSelect: (orderId: number) => void;
	onClear: () => void;
}

const formatVND = (n: number) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(n);

const formatDate = (s: string) => {
	try {
		return new Date(s).toLocaleString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return s;
	}
};

const formatOrderNumber = (id: number) => String(id).padStart(7, "0");

const toNumber = (v: unknown): number => {
	if (v == null) return 0;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : 0;
};

export function TrackingOrderList({
	phone,
	orders,
	onSelect,
	onClear,
}: TrackingOrderListProps) {
	return (
		<div className="space-y-3">
			{/* Header — phone search context */}
			<div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4">
				<div className="min-w-0">
					<div className="text-xs text-gray-500">SĐT tra cứu</div>
					<div className="truncate text-sm font-semibold text-gray-900">
						{phone}
					</div>
				</div>
				<button
					type="button"
					onClick={onClear}
					className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
				>
					Tra cứu SĐT khác
				</button>
			</div>

			{orders.length === 0 ? (
				<div className="rounded-2xl bg-white p-10 text-center">
					<div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gray-100">
						<ShoppingBag className="size-7 text-gray-400" />
					</div>
					<div className="text-base font-medium text-gray-900">
						Không tìm thấy đơn hàng nào
					</div>
					<div className="mt-1 text-sm text-gray-500">
						Kiểm tra lại số điện thoại đã đặt hàng.
					</div>
				</div>
			) : (
				<ul className="flex flex-col gap-3">
					{orders.map((o) => (
						<li key={o.id}>
							<OrderRow order={o} onSelect={onSelect} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

interface OrderRowProps {
	order: TrackingOrderListItem;
	onSelect: (orderId: number) => void;
}

function OrderRow({ order, onSelect }: OrderRowProps) {
	const items = order.items ?? [];
	const firstItem = items[0];
	const otherCount = Math.max(0, items.length - 1);

	return (
		<button
			type="button"
			onClick={() => onSelect(order.id)}
			className={cn(
				"block w-full overflow-hidden rounded-2xl bg-white text-left transition-all",
				"border border-gray-200 hover:border-primary-300 hover:shadow-md",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
			)}
		>
			{/* Header bar */}
			<div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
				<div className="flex min-w-0 flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-2">
					<div className="flex items-center gap-2">
						<span className="text-gray-500">Đơn hàng:</span>
						<span className="font-semibold text-gray-900">
							#{formatOrderNumber(order.id)}
						</span>
					</div>
					<span
						aria-hidden="true"
						className="hidden size-1 rounded-full bg-gray-400 sm:inline-block"
					/>
					<div className="flex items-center gap-2">
						<span className="text-gray-500">Ngày đặt:</span>
						<span className="font-medium text-gray-900">
							{formatDate(order.createdAt)}
						</span>
					</div>
				</div>
				<OrderStatusBadge status={order.status as FeOrderStatus} />
			</div>

			{/* Body — image | content */}
			<div className="flex gap-3 px-4 py-3">
				<div className="size-[74px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
					{firstItem?.productImage ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={getImageUrl(firstItem.productImage)}
							alt={firstItem.productName ?? ""}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex size-full items-center justify-center">
							<ShoppingBag className="size-6 text-gray-300" />
						</div>
					)}
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
					{/* Product info */}
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						{firstItem ? (
							<>
								<p className="line-clamp-2 text-sm font-medium text-gray-900">
									{firstItem.productName}
								</p>
								{firstItem.unitPrice != null && (
									<p className="text-xs font-medium text-primary-600">
										{formatVND(toNumber(firstItem.unitPrice))}
									</p>
								)}
								{otherCount > 0 && (
									<p className="text-xs text-gray-500">
										Cùng {otherCount} sản phẩm khác
									</p>
								)}
							</>
						) : (
							<p className="text-sm text-gray-400">Không có sản phẩm</p>
						)}
					</div>

					{/* Totals + CTA */}
					<div className="flex shrink-0 flex-col items-end gap-0.5 pt-1 sm:pt-0">
						<div className="flex items-center gap-1">
							<span className="text-xs text-gray-500">Tổng tiền:</span>
							<span className="text-sm font-semibold text-primary-600">
								{formatVND(toNumber(order.totalAmount))}
							</span>
						</div>
						<span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:translate-x-0.5 transition-transform">
							Xem chi tiết
							<ChevronRight className="size-4" aria-hidden="true" />
						</span>
					</div>
				</div>
			</div>
		</button>
	);
}
