import type { Metadata } from "next";
import { Suspense } from "react";
import type { TrackOrderResponse } from "@/components/feature/order-tracking";
import OrderTrackingView from "@/components/feature/order-tracking";
import { mapBackendOrderToShared } from "@/components/feature/order-tracking/adapters/map-tracking";
import { api } from "@/lib/api/client";
import { API } from "@/lib/api/endpoints";

export const metadata: Metadata = {
	title: "Tra cứu đơn hàng",
	description: "Tra cứu thông tin đơn hàng của bạn",
};

export const dynamic = "force-dynamic";

interface PageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrderTrackingPage({ searchParams }: PageProps) {
	const sp = await searchParams;

	const preOrderId = (sp.preOrderId as string | undefined) ?? "";
	const isPreOrder = !!preOrderId;

	const orderId =
		preOrderId ||
		(((sp.orderId ?? sp.order_id) as string | undefined) ?? "");
	const phone =
		(sp.phone as string | undefined) ??
		(sp["amp;phone"] as string | undefined) ??
		(sp[";phone"] as string | undefined) ??
		"";

	// ── Order tracking ──
	let initialData: TrackOrderResponse | null = null;
	let initialList: Array<{
		id: number;
		customerName: string;
		phone: string;
		totalAmount: number | string;
		status: number;
		createdAt: string;
		items?: Array<{
			id: number;
			productName: string;
			quantity: number;
			unitPrice?: number | string | null;
			productImage?: string | null;
			product?: { thumbnailUrl?: string | null } | null;
		}>;
	}> | null = null;
	let initialError: string | null = null;

	if (orderId && phone) {
		// Step 3: detail
		try {
			const raw = await api.get<Parameters<typeof mapBackendOrderToShared>[0]>(
				`${API.ORDERS.TRACKING(orderId)}?phone=${phone}`,
				{ cache: "no-store" },
			);
			initialData = mapBackendOrderToShared(raw);
		} catch (e: unknown) {
			const err = e as Record<string, unknown> & {
				data?: { message?: string };
				message?: string;
			};
			initialError =
				(err?.data?.message as string) ||
				(err?.message as string) ||
				"Không thể tra cứu đơn hàng.";
		}
	} else if (phone) {
		// Step 2: list theo SĐT
		try {
			const res = await api.get<{
				items: Array<{
					id: number;
					customerName: string;
					phone: string;
					totalAmount: number | string;
					status: number;
					createdAt: string;
					items?: Array<{
						id: number;
						productName: string;
						quantity: number;
						unitPrice?: number | string | null;
						product?: { thumbnailUrl?: string | null } | null;
					}>;
				}>;
			}>(`${API.ORDERS.BY_PHONE}?phone=${encodeURIComponent(phone)}`, {
				cache: "no-store",
			});
			initialList = (res.items ?? []).map((o) => ({
				...o,
				items: (o.items ?? []).map((it) => ({
					...it,
					productImage: it.product?.thumbnailUrl ?? null,
				})),
			}));
		} catch (e: unknown) {
			const err = e as Record<string, unknown> & {
				data?: { message?: string };
				message?: string;
			};
			initialError =
				(err?.data?.message as string) ||
				(err?.message as string) ||
				"Không tra cứu được đơn hàng.";
		}
	}

	return (
		<Suspense
			fallback={<div className="min-h-screen animate-pulse bg-bg-page" />}
		>
			<OrderTrackingView
				initialOrderId={orderId}
				initialPhone={phone}
				initialData={initialData}
				initialList={initialList}
				initialError={initialError}
			/>
		</Suspense>
	);
}
