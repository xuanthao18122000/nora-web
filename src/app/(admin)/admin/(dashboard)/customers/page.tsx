"use client";

import { Eye, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminCustomers } from "@/features/admin/customer/useAdminCustomers";
import {
	type DataTableColumn,
	DataTable,
	type FilterField,
	FilterPanel,
	type FilterValue,
	useDataTable,
} from "@/features/admin/data-table";
import {
	ActionMenu,
	Button,
	Card,
	CardHeader,
	StatusBadge,
	useConfirm,
} from "@/features/admin/ui";
import {
	type AdminCustomer,
	AdminApiError,
	ListCustomerParams,
	StatusCommonEnum,
	deleteAdminCustomer,
} from "@/lib/api/admin";

interface CustomerFilters {
	name?: string;
	phoneNumber?: string;
	email?: string;
	status?: string | number;
	createdAtFrom?: string;
	createdAtTo?: string;
}

const FILTER_FIELDS: FilterField[] = [
	{
		id: "name",
		label: "Tên khách",
		type: "text",
		placeholder: "VD: Nguyễn Văn A",
	},
	{ id: "phoneNumber", label: "SĐT", type: "text", placeholder: "0901234567" },
	{
		id: "email",
		label: "Email",
		type: "text",
		placeholder: "user@example.com",
	},
	{
		id: "status",
		label: "Trạng thái",
		type: "select",
		placeholder: "Chọn trạng thái",
		options: [
			{ value: StatusCommonEnum.ACTIVE, label: "Hoạt động" },
			{ value: StatusCommonEnum.INACTIVE, label: "Lưu trữ" },
		],
	},
	{
		id: "createdAt",
		label: "Ngày tham gia",
		type: "dateRange",
		rangeKey: { from: "createdAtFrom", to: "createdAtTo" },
	},
];

const AVATAR_PALETTES = [
	{ bg: "bg-rose-100", fg: "text-rose-700" },
	{ bg: "bg-amber-100", fg: "text-amber-700" },
	{ bg: "bg-emerald-100", fg: "text-emerald-700" },
	{ bg: "bg-sky-100", fg: "text-sky-700" },
	{ bg: "bg-indigo-100", fg: "text-indigo-700" },
	{ bg: "bg-fuchsia-100", fg: "text-fuchsia-700" },
	{ bg: "bg-teal-100", fg: "text-teal-700" },
	{ bg: "bg-orange-100", fg: "text-orange-700" },
];

const VIP_SPENT_THRESHOLD = 10_000_000;

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
	});
}

export default function CustomersPage() {
	const router = useRouter();
	const confirm = useConfirm();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & CustomerFilters>({ defaultPageSize: 10 });

	const { data, isLoading, mutate } = useAdminCustomers(queryParams as ListCustomerParams);
	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	async function handleDelete(c: AdminCustomer) {
		const ok = await confirm({
			title: "Xoá khách hàng",
			description: (
				<>
					Bạn có chắc muốn xoá <strong>{c.name}</strong>? Hành động không thể
					hoàn tác.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;
		try {
			await deleteAdminCustomer(c.id);
			toast.success("Xoá khách hàng thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Xoá khách hàng thất bại",
			);
		}
	}

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminCustomer>[] = [
		{
			id: "customer",
			header: "Khách hàng",
			cell: (row) => (
				<div className="flex items-center gap-3">
					<Avatar name={row.name} />
					<div className="min-w-0">
						<Link
							href={`/admin/customers/${row.id}`}
							className="block truncate text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							{row.name}
						</Link>
						<div className="truncate text-xs text-gray-500">
							{row.phoneNumber}
						</div>
					</div>
				</div>
			),
		},
		{
			id: "email",
			header: "Email",
			cell: (row) =>
				row.email ? (
					<div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
						<Mail className="size-3.5 shrink-0 text-gray-400" />
						<span className="truncate" title={row.email}>
							{row.email}
						</span>
					</div>
				) : (
					<span className="text-gray-400">—</span>
				),
		},
		{
			id: "address",
			header: "Địa chỉ",
			cell: (row) =>
				row.address ? (
					<span
						className="block max-w-[200px] truncate text-sm text-gray-700"
						title={row.address}
					>
						{row.address}
					</span>
				) : (
					<span className="text-gray-400">—</span>
				),
		},
		{
			id: "totalOrders",
			header: "Đơn",
			width: "80px",
			align: "right",
			cell: (row) => {
				const isZero = row.totalOrders === 0;
				return (
					<span
						className={`inline-flex min-w-[2rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
							isZero
								? "bg-gray-50 text-gray-400"
								: "bg-gray-100 text-gray-700"
						}`}
					>
						{row.totalOrders}
					</span>
				);
			},
		},
		{
			id: "totalSpent",
			header: "Đã chi",
			width: "150px",
			align: "right",
			cell: (row) => {
				const spent = Number(row.totalSpent ?? 0);
				const isVip = spent > VIP_SPENT_THRESHOLD;
				return (
					<span
						className={`text-sm font-semibold ${
							isVip ? "text-emerald-700" : "text-gray-900"
						}`}
					>
						{formatVND(row.totalSpent)}
					</span>
				);
			},
		},
		{
			id: "status",
			header: "Trạng thái",
			width: "130px",
			align: "center",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			id: "createdAt",
			header: "Ngày tạo",
			width: "140px",
			cell: (row) => (
				<span className="text-sm text-gray-700">
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
					editHref={`/admin/customers/${row.id}/edit`}
					onDelete={() => handleDelete(row)}
					extra={[
						{
							label: "Xem chi tiết",
							icon: <Eye className="h-3.5 w-3.5" />,
							onClick: () => router.push(`/admin/customers/${row.id}`),
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
				<CardHeader
					title="Danh sách khách hàng"
					count={total}
					actions={
						<Link href="/admin/customers/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm khách hàng
							</Button>
						</Link>
					}
				/>
				<DataTable<AdminCustomer>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="khách hàng"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}

function getAvatarInitials(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	const parts = trimmed.split(/\s+/).filter(Boolean);
	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase();
	}
	const first = parts[0][0] ?? "";
	const last = parts[parts.length - 1][0] ?? "";
	return (first + last).toUpperCase();
}

function getAvatarPalette(name: string) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = (hash + name.charCodeAt(i)) % AVATAR_PALETTES.length;
	}
	return AVATAR_PALETTES[hash] ?? AVATAR_PALETTES[0];
}

function Avatar({ name }: { name: string }) {
	const initials = getAvatarInitials(name);
	const { bg, fg } = getAvatarPalette(name);
	return (
		<div
			className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-white shadow-sm ${bg} ${fg}`}
		>
			{initials}
		</div>
	);
}
