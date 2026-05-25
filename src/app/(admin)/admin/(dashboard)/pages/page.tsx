"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAdminPages } from "@/features/admin/page/useAdminPages";
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
	type AdminPage,
	AdminApiError,
	PageTypeEnum,
	StatusCommonEnum,
	deleteAdminPage,
	ListPageParams,
} from "@/lib/api/admin";

interface PageFilters {
	title?: string;
	slug?: string;
	code?: string;
	status?: string | number;
}

const FILTER_FIELDS: FilterField[] = [
	{ id: "title", label: "Tiêu đề", type: "text", placeholder: "Nhập tiêu đề" },
	{ id: "slug", label: "Slug", type: "text", placeholder: "Nhập slug" },
	{ id: "code", label: "Code", type: "text", placeholder: "VD: home_page" },
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
];

function formatDate(iso?: string): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

export default function PagesPage() {
	const confirm = useConfirm();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & PageFilters>({ defaultPageSize: 10 });

	const mergedParams = { ...queryParams, type: PageTypeEnum.SYSTEM };
	const { data, isLoading, mutate } = useAdminPages(mergedParams as ListPageParams);
	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	async function handleDelete(p: AdminPage) {
		const ok = await confirm({
			title: "Xoá trang",
			description: (
				<>
					Bạn có chắc muốn xoá <strong>{p.title || p.slug}</strong>? Toàn bộ
					sections sẽ bị xoá theo.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;
		try {
			await deleteAdminPage(p.id);
			toast.success("Xoá trang thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Xoá trang thất bại",
			);
		}
	}

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminPage>[] = [
		{
			id: "title",
			header: "Trang",
			cell: (row) => (
				<div className="min-w-0">
					<Link
						href={`/admin/pages/${row.id}`}
						className="block text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						title={row.title || row.slug}
					>
						{row.title || (
							<span className="text-gray-400">(chưa có tiêu đề)</span>
						)}
					</Link>
					<div className="font-mono text-xs text-gray-500" title={row.slug}>
						/{row.slug}
					</div>
				</div>
			),
		},
		{
			id: "code",
			header: "Code",
			width: "180px",
			cell: (row) =>
				row.code ? (
					<span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-700">
						{row.code}
					</span>
				) : (
					<span className="text-gray-400">—</span>
				),
		},
		{
			id: "sections",
			header: "Sections",
			width: "100px",
			align: "right",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{row.sections?.length ?? 0}
				</span>
			),
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
			width: "130px",
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
					editHref={`/admin/pages/${row.id}`}
					onDelete={() => handleDelete(row)}
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
					title="Danh sách trang hệ thống"
					count={total}
					actions={
						<Link href="/admin/pages/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm trang
							</Button>
						</Link>
					}
				/>
				<DataTable<AdminPage>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="trang"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}
