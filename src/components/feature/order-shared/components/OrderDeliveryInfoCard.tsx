import { MapPin, Phone, User } from "lucide-react";
import { resolveDeliveryDestination } from "@/lib/utils/delivery-destination";
import type { SharedDeliveryInfo } from "../types";
import { OrderDetailRow } from "./OrderDetailRow";

interface OrderDeliveryInfoCardProps {
	delivery: SharedDeliveryInfo;
}

/**
 * Shared delivery info card — receiver name/phone + shipping or pickup info.
 */
export function OrderDeliveryInfoCard({
	delivery,
}: OrderDeliveryInfoCardProps) {
	const destination = resolveDeliveryDestination(delivery);

	return (
		<div className="rounded-2xl bg-white p-4 md:p-5 shadow-sm">
			<h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">
				Thông tin giao hàng
			</h3>
			<div className="flex flex-col gap-3 text-sm text-gray-600">
				<OrderDetailRow
					label="Họ tên người nhận:"
					value={delivery.receiverName}
					icon={User}
				/>
				<OrderDetailRow
					label="SĐT người nhận:"
					value={delivery.receiverPhone}
					icon={Phone}
				/>
				{destination.kind === "pickup" ? (
					<OrderDetailRow
						label="Nhận tại cửa hàng:"
						value={
							<span className="text-right">
								{destination.storeName}
								{destination.storeAddress && (
									<span className="block text-gray-500 mt-0.5">
										{destination.storeAddress}
									</span>
								)}
							</span>
						}
						icon={MapPin}
					/>
				) : destination.kind === "shipping" ? (
					<OrderDetailRow
						label="Nơi nhận hàng:"
						value={destination.address}
						icon={MapPin}
					/>
				) : null}
			</div>
		</div>
	);
}
