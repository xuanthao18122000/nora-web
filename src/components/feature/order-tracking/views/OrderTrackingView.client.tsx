"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { TrackingOrderDetail } from "../components/TrackingOrderDetail";
import { TrackingOrderList } from "../components/TrackingOrderList";
import { TrackingSearchForm } from "../components/TrackingSearchForm";
import type { TrackingFormValues } from "../schemas/tracking.schema";
import type { OrderTrackingViewProps } from "../types";
import "@/app/animations.css";

export default function OrderTrackingView({
	initialOrderId,
	initialPhone,
	initialData,
	initialList,
	initialError,
}: OrderTrackingViewProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleSearch = ({ phone }: TrackingFormValues) => {
		const params = new URLSearchParams();
		params.set("phone", phone.trim());
		startTransition(() => {
			router.push(`/order-tracking?${params.toString()}`);
		});
	};

	const handleSelectOrder = (orderId: number) => {
		const params = new URLSearchParams();
		params.set("orderId", String(orderId));
		params.set("phone", initialPhone.trim());
		startTransition(() => {
			router.push(`/order-tracking?${params.toString()}`);
		});
	};

	const clearAll = () => {
		startTransition(() => {
			router.push("/order-tracking");
		});
	};

	// Step 3: Detail của 1 order cụ thể
	if (initialData) {
		return (
			<TrackingOrderDetail data={initialData} onClearSearch={clearAll} />
		);
	}

	// Step 2: List orders theo SĐT
	if (initialList) {
		return (
			<TrackingOrderList
				phone={initialPhone}
				orders={initialList}
				onSelect={handleSelectOrder}
				onClear={clearAll}
			/>
		);
	}

	// Step 1: Form nhập SĐT
	return (
		<TrackingSearchForm
			defaultPhone={initialPhone}
			error={initialError}
			isLoading={isPending}
			onSubmit={handleSearch}
			onBack={() => {
				startTransition(() => {
					router.back();
				});
			}}
		/>
	);
}
