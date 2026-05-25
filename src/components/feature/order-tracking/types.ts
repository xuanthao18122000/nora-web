import type {
	SharedOrderDetail,
	SharedOrderDetailItem,
} from "@/components/feature/order-shared";

/**
 * Alias to the unified SharedOrderDetailItem — kept for backwards compat
 * with existing consumers of `TrackOrderItem`.
 */
export type TrackOrderItem = SharedOrderDetailItem;

/**
 * Response shape of `GET /fe/orders/:id/tracking` — unified with
 * `GET /fe/orders/:id` (both now return `TrackOrderResponseDto` on BE).
 */
export type TrackOrderResponse = SharedOrderDetail;

import type { TrackingOrderListItem } from "./components/TrackingOrderList";

export interface OrderTrackingViewProps {
	initialOrderId: string;
	initialPhone: string;
	initialData: TrackOrderResponse | null;
	initialList: TrackingOrderListItem[] | null;
	initialError: string | null;
}
