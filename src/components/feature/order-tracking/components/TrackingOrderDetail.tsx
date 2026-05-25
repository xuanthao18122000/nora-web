"use client";

import OrderStatusBadge, { FeOrderStatus } from "../order-status";
import CartHeader from "@/components/feature/cart/components/cart-header.client";
import { OrderDetailView } from "@/components/feature/order-shared";
import type { TrackOrderResponse } from "../types";

interface TrackingOrderDetailProps {
	data: TrackOrderResponse;
	onClearSearch: () => void;
}

export function TrackingOrderDetail({
	data,
	onClearSearch,
}: TrackingOrderDetailProps) {
	const feStatus =
		(data.feStatus as FeOrderStatus | undefined) ??
		FeOrderStatus.PENDING_CONFIRM;

	return (
		<OrderDetailView
			data={data}
			statusBadge={<OrderStatusBadge status={feStatus} />}
			leadingContent={
				<CartHeader title="Chi tiết đơn hàng" onBack={onClearSearch} />
			}
			animateSections
		/>
	);
}
