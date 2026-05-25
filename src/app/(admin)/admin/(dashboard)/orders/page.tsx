"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderStatusBadge } from "@/features/admin/order/OrderStatusBadge";
import { useAdminOrders } from "@/features/admin/order/useAdminOrders";
import {
	type DataTableColumn,
	DataTable,
	type FilterField,
	FilterPanel,
	type FilterValue,
	useDataTable,
} from "@/features/admin/data-table";
import { ActionMenu, Card, CardHeader } from "@/features/admin/ui";
import {
	type AdminOrder,
	type AdminOrderItem,
	ListOrderParams,
	ORDER_STATUS_LABEL,
	OrderStatusEnum,
	PAYMENT_METHOD_LABEL,
	PaymentMethodEnum,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

interface OrderFilters {
	customerName?: string;
	phone?: string;
	email?: string;
	status?: string | number;
	paymentMethod?: string | number;
}

const FILTER_FIELDS: FilterField[] = [
	{
		id: "customerName",
		label: "Tên khách",
		type: "text",
		placeholder: "VD: Nguyễn Văn A",
	},
	{ id: "phone", label: "SĐT", type: "text", placeholder: "0901234567" },
	{
		id: "status",
		label: "Trạng thái",
		type: "select",
		placeholder: "Chọn trạng thái",
		options: Object.entries(ORDER_STATUS_LABEL).map(([k, v]) => ({
			value: Number(k),
			label: v,
		})),
	},
	{
		id: "paymentMethod",
		label: "Thanh toán",
		type: "select",
		placeholder: "Chọn phương thức",
		options: Object.entries(PAYMENT_METHOD_LABEL).map(([k, v]) => ({
			value: Number(k),
			label: v,
		})),
	},
	{ id: "createdAt", label: "Ngày đặt", type: "dateRange" },
];

function formatVND(value: number | string | undefined | null): string {
	if (value === undefined || value === null) return "—";
	return Number(value).toLocaleString("vi-VN") + " ₫";
}

function formatDate(iso?: string): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function OrderItemsCell({ items }: { items?: AdminOrderItem[] }) {
	const list = items ?? [];
	if (list.length === 0) {
		return <div className="text-xs text-gray-400">—</div>;
	}
	const maxVisible = 5;
	const visible = list.slice(0, maxVisible);
	const remaining = list.length - visible.length;

	return (
		<div className="min-w-[280px] lg:min-w-[360px] space-y-0">
			{visible.map((item) => {
				const name = item.productName ?? item.product?.name ?? "—";
				const slug = item.productSlug ?? item.product?.slug ?? null;
				const thumb = item.product?.thumbnailUrl;
				return (
					<div
						key={item.id}
						className="flex items-center gap-2 border-t border-gray-100 pt-1 first:border-t-0 first:pt-0 py-2"
					>
						<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-gray-100">
							{thumb ? (
								<Image
									src={getImageUrl(thumb)}
									alt={name}
									fill
									sizes="32px"
									className="object-cover"
								/>
							) : null}
						</div>
						<div className="min-w-0 flex-1">
							<div
								className="truncate text-[13px] font-medium text-gray-900"
								title={name}
							>
								{name}
							</div>
							{slug && (
								<div
									className="truncate text-[11px] text-gray-500"
									title={slug}
								>
									{slug}
								</div>
							)}
						</div>
						<div className="w-10 shrink-0 text-right text-[12px] text-gray-500">
							x{item.quantity ?? 1}
						</div>
					</div>
				);
			})}
			{remaining > 0 && (
				<div className="pt-1 text-[11px] text-gray-500">
					+{remaining} sản phẩm khác
				</div>
			)}
		</div>
	);
}

export default function OrdersPage() {
	const router = useRouter();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & OrderFilters>({ defaultPageSize: 10 });

	const { data, isLoading } = useAdminOrders({
		...(queryParams as ListOrderParams),
		getFull: true,
	});
	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminOrder>[] = [
		{
			id: "id",
			header: "Mã đơn",
			width: "100px",
			cell: (row) => (
				<Link
					href={`/admin/orders/${row.id}`}
					className="inline-block font-mono text-[13px] font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					#{row.id}
				</Link>
			),
		},
		{
			id: "customer",
			header: "Khách hàng",
			cell: (row) => (
				<div className="min-w-0">
					<div
						className="truncate text-[13px] font-medium text-gray-900"
						title={row.customerName}
					>
						{row.customerName}
					</div>
					<div
						className="truncate text-[11px] text-gray-500"
						title={row.phone}
					>
						{row.phone}
					</div>
				</div>
			),
		},
		{
			id: "items",
			header: "Sản phẩm trong đơn",
			cell: (row) => <OrderItemsCell items={row.items} />,
		},
		{
			id: "totalAmount",
			header: "Tổng tiền",
			width: "150px",
			align: "right",
			cell: (row) => (
				<span className="text-[13px] font-semibold text-gray-900">
					{formatVND(row.totalAmount)}
				</span>
			),
		},
		{
			id: "paymentMethod",
			header: "Thanh toán",
			width: "120px",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{PAYMENT_METHOD_LABEL[row.paymentMethod as PaymentMethodEnum]}
				</span>
			),
		},
		{
			id: "status",
			header: "Trạng thái",
			width: "130px",
			align: "center",
			cell: (row) => <OrderStatusBadge status={row.status as OrderStatusEnum} />,
		},
		{
			id: "createdAt",
			header: "Ngày đặt",
			width: "150px",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{formatDate(row.createdAt)}
				</span>
			),
		},
		{
			id: "actions",
			header: "Thao tác",
			width: "80px",
			align: "center",
			cell: (row) => (
				<ActionMenu
					extra={[
						{
							label: "Xem chi tiết",
							icon: <Eye className="h-3.5 w-3.5" />,
							onClick: () => router.push(`/admin/orders/${row.id}`),
						},
					]}
				/>
			),
		},
	];

	return (
		<div className="space-y-4 mt-4">
			<FilterPanel
				fields={FILTER_FIELDS}
				onFilter={onFilter}
				onReset={handleResetFilter}
				isFetching={isLoading}
			/>

			<Card>
				<CardHeader title="Danh sách đơn hàng" count={total} />
				<DataTable<AdminOrder>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="đơn"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}
