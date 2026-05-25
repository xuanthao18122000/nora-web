"use client";

import { Mail, MapPin, Pencil, Phone, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { OrderStatusBadge } from "@/features/admin/order/OrderStatusBadge";
import { useAdminCustomerOrders } from "@/features/admin/customer/useAdminCustomers";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DetailPageHeader,
	StatusBadge,
} from "@/features/admin/ui";
import {
	type AdminCustomer,
	type AdminOrder,
	OrderStatusEnum,
	getAdminCustomer,
} from "@/lib/api/admin";

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

export default function CustomerDetailPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);

	const { data, isLoading, error } = useSWR(
		Number.isFinite(id) ? ["admin/customer", id] : null,
		() => getAdminCustomer(id),
	);
	const { data: ordersResp } = useAdminCustomerOrders(
		Number.isFinite(id) ? id : null,
	);
	const orders = ordersResp?.data ?? [];
	const totalOrders = ordersResp?.total ?? 0;

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
					<div className="text-sm text-red-600">Không tải được khách hàng.</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return (
		<CustomerView customer={data} orders={orders} totalOrders={totalOrders} />
	);
}

function CustomerView({
	customer,
	orders,
	totalOrders,
}: {
	customer: AdminCustomer;
	orders: AdminOrder[];
	totalOrders: number;
}) {
	return (
		<div className="space-y-4">
			<DetailPageHeader
				title={customer.name}
				subtitle={customer.phoneNumber}
				backHref="/admin/customers"
				primaryAction={
					<Link href={`/admin/customers/${customer.id}/edit`}>
						<Button size="sm">
							<Pencil className="h-4 w-4" />
							Chỉnh sửa
						</Button>
					</Link>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader title="Thông tin liên hệ" />
						<CardBody className="space-y-3">
							<InfoRow icon={User} label="Họ tên" value={customer.name} />
							<InfoRow icon={Phone} label="SĐT" value={customer.phoneNumber} />
							<InfoRow icon={Mail} label="Email" value={customer.email} />
							<InfoRow icon={MapPin} label="Địa chỉ" value={customer.address} />
						</CardBody>
					</Card>

					<Card>
						<CardHeader
							title="Lịch sử đơn hàng"
							count={totalOrders}
						/>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900">
									<tr>
										<th className="px-4 py-3.5">Mã đơn</th>
										<th className="px-4 py-3.5 text-right">Tổng tiền</th>
										<th className="px-4 py-3.5 text-center">Trạng thái</th>
										<th className="px-4 py-3.5">Ngày đặt</th>
										<th className="px-4 py-3.5" />
									</tr>
								</thead>
								<tbody>
									{orders.length === 0 && (
										<tr>
											<td
												colSpan={5}
												className="px-4 py-8 text-center text-sm text-gray-500"
											>
												Chưa có đơn hàng
											</td>
										</tr>
									)}
									{orders.map((o) => (
										<tr
											key={o.id}
											className="border-b border-gray-200 hover:bg-gray-50/60"
										>
											<td className="px-4 py-3 font-mono text-[13px] font-medium text-gray-900">
												#{o.id}
											</td>
											<td className="px-4 py-3 text-right text-[13px] font-medium text-gray-900">
												{formatVND(o.totalAmount)}
											</td>
											<td className="px-4 py-3 text-center">
												<OrderStatusBadge status={o.status as OrderStatusEnum} />
											</td>
											<td className="px-4 py-3 text-[13px] text-gray-700">
												{formatDateTime(o.createdAt)}
											</td>
											<td className="px-4 py-3 text-right">
												<Link
													href={`/admin/orders/${o.id}`}
													className="text-[13px] font-medium text-red-600 hover:text-red-700"
												>
													Xem
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader title="Trạng thái" />
						<CardBody>
							<StatusBadge status={customer.status} />
						</CardBody>
					</Card>

					<Card>
						<CardHeader title="Thống kê" />
						<CardBody className="space-y-4">
							<StatRow
								icon={ShoppingBag}
								label="Tổng số đơn"
								value={String(customer.totalOrders)}
							/>
							<StatRow
								icon={ShoppingBag}
								label="Tổng đã chi"
								value={formatVND(customer.totalSpent)}
								highlight
							/>
						</CardBody>
					</Card>

					<Card>
						<CardHeader title="Mốc thời gian" />
						<CardBody className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">Tham gia</span>
								<span className="font-medium text-gray-900">
									{formatDateTime(customer.createdAt)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Cập nhật</span>
								<span className="font-medium text-gray-900">
									{formatDateTime(customer.updatedAt)}
								</span>
							</div>
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

function StatRow({
	icon: Icon,
	label,
	value,
	highlight,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string;
	highlight?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-3">
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<Icon className="h-4 w-4 text-gray-400" />
				{label}
			</div>
			<div
				className={
					highlight
						? "text-base font-bold text-gray-900"
						: "text-base font-semibold text-gray-900"
				}
			>
				{value}
			</div>
		</div>
	);
}
