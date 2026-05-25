"use client";

import { ImageOff, Mail, MapPin, Phone, User } from "lucide-react";
import { useParams } from "next/navigation";
import { OrderStatusBadge } from "@/features/admin/order/OrderStatusBadge";
import { StatusUpdater } from "@/features/admin/order/StatusUpdater";
import { useAdminOrder } from "@/features/admin/order/useAdminOrders";
import {
	Card,
	CardBody,
	CardHeader,
	DetailPageHeader,
} from "@/features/admin/ui";
import {
	type AdminOrder,
	type AdminOrderItem,
	PAYMENT_METHOD_LABEL,
	PaymentMethodEnum,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

function formatVND(value: number | string | undefined | null): string {
	if (value === undefined || value === null) return "—";
	return Number(value).toLocaleString("vi-VN") + " ₫";
}

function formatDateTime(iso?: string): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function OrderDetailPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);
	const { data, isLoading, error, mutate } = useAdminOrder(
		Number.isFinite(id) ? id : null,
	);

	if (isLoading) {
		return (
			<Card>
				<CardBody>
					<div className="text-sm text-gray-500">Đang tải...</div>
				</CardBody>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardBody>
					<div className="text-sm text-red-600">Không tải được đơn hàng.</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return <OrderDetailView order={data} onUpdated={() => mutate()} />;
}

function OrderDetailView({
	order,
	onUpdated,
}: {
	order: AdminOrder;
	onUpdated: () => void;
}) {
	return (
		<div className="space-y-4">
			<DetailPageHeader
				title={`Đơn #${order.id}`}
				subtitle={`Đặt ngày ${formatDateTime(order.createdAt)}`}
				backHref="/admin/orders"
				primaryAction={<OrderStatusBadge status={order.status} />}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader
							title="Sản phẩm"
							count={order.items?.length ?? 0}
						/>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900">
									<tr>
										<th className="px-4 py-3.5">Sản phẩm</th>
										<th className="px-4 py-3.5 text-right">Đơn giá</th>
										<th className="px-4 py-3.5 text-right">SL</th>
										<th className="px-4 py-3.5 text-right">Thành tiền</th>
									</tr>
								</thead>
								<tbody>
									{(order.items ?? []).map((item) => (
										<OrderItemRow key={item.id} item={item} />
									))}
									{(!order.items || order.items.length === 0) && (
										<tr>
											<td
												colSpan={4}
												className="px-4 py-8 text-center text-sm text-gray-500"
											>
												Đơn chưa có sản phẩm
											</td>
										</tr>
									)}
								</tbody>
								<tfoot>
									<tr className="border-t-2 border-gray-200 bg-gray-50">
										<td
											colSpan={3}
											className="px-4 py-3 text-right text-sm font-medium text-gray-700"
										>
											Tổng cộng
										</td>
										<td className="px-4 py-3 text-right text-base font-bold text-gray-900">
											{formatVND(order.totalAmount)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Card>

					{order.note && (
						<Card>
							<CardHeader title="Ghi chú khách hàng" />
							<CardBody>
								<p className="text-sm text-gray-700">{order.note}</p>
							</CardBody>
						</Card>
					)}
				</div>

				<div className="space-y-4">
					<Card>
						<CardBody>
							<StatusUpdater
								orderId={order.id}
								current={order.status}
								onUpdated={onUpdated}
							/>
						</CardBody>
					</Card>

					<Card>
						<CardHeader title="Khách hàng" />
						<CardBody className="space-y-3">
							<InfoRow icon={User} label="Họ tên" value={order.customerName} />
							<InfoRow icon={Phone} label="SĐT" value={order.phone} />
							<InfoRow icon={Mail} label="Email" value={order.email} />
							<InfoRow
								icon={MapPin}
								label="Địa chỉ giao"
								value={order.shippingAddress}
							/>

							{order.customer && (
								<div className="mt-3 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
									<div>
										Tổng đơn: <strong>{order.customer.totalOrders}</strong>
									</div>
									<div>
										Đã chi:{" "}
										<strong>{formatVND(order.customer.totalSpent)}</strong>
									</div>
								</div>
							)}
						</CardBody>
					</Card>

					<Card>
						<CardHeader title="Thanh toán" />
						<CardBody className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Phương thức</span>
								<span className="font-medium text-gray-900">
									{PAYMENT_METHOD_LABEL[order.paymentMethod as PaymentMethodEnum]}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Tổng tiền</span>
								<span className="font-bold text-gray-900">
									{formatVND(order.totalAmount)}
								</span>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardHeader title="Mốc thời gian" />
						<CardBody className="space-y-2 text-sm">
							<TimelineRow label="Đặt đơn" iso={order.createdAt} />
							<TimelineRow label="Duyệt" iso={order.confirmedAt} />
							<TimelineRow label="Hoàn tất" iso={order.completedAt} />
							<TimelineRow label="Cập nhật cuối" iso={order.updatedAt} />
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}

function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value?: string;
}) {
	return (
		<div className="flex items-start gap-2.5">
			<Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
			<div className="min-w-0 flex-1">
				<div className="text-xs text-gray-500">{label}</div>
				<div className="text-sm text-gray-900">{value || "—"}</div>
			</div>
		</div>
	);
}

function TimelineRow({ label, iso }: { label: string; iso?: string }) {
	return (
		<div className="flex justify-between">
			<span className="text-gray-600">{label}</span>
			<span className="font-medium text-gray-900">{formatDateTime(iso)}</span>
		</div>
	);
}

function OrderItemRow({ item }: { item: AdminOrderItem }) {
	const thumb = item.product?.thumbnailUrl;
	return (
		<tr className="border-b border-gray-200 hover:bg-gray-50/60">
			<td className="px-4 py-3">
				<div className="flex items-center gap-3">
					{thumb ? (
						// biome-ignore lint/performance/noImgElement: external URL
						<img
							src={getImageUrl(thumb)}
							alt={item.productName}
							className="h-10 w-10 shrink-0 rounded-md border border-gray-200 object-cover"
						/>
					) : (
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-300">
							<ImageOff className="h-4 w-4" />
						</div>
					)}
					<div className="min-w-0">
						<div className="truncate text-[13px] font-medium text-gray-900">
							{item.productName}
						</div>
						{item.productSlug && (
							<div className="truncate text-[11px] text-gray-500">
								/{item.productSlug}
							</div>
						)}
					</div>
				</div>
			</td>
			<td className="px-4 py-3 text-right text-[13px] text-gray-700">
				{formatVND(item.unitPrice)}
			</td>
			<td className="px-4 py-3 text-right text-[13px] text-gray-700">
				{item.quantity}
			</td>
			<td className="px-4 py-3 text-right text-[13px] font-medium text-gray-900">
				{formatVND(item.totalPrice)}
			</td>
		</tr>
	);
}
