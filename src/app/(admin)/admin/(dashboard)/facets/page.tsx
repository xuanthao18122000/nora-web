"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAdminFacets } from "@/features/admin/facets";
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
	type AdminFacet,
	AdminApiError,
	FACET_TYPE_LABEL,
	type FacetTypeEnum,
	type ListFacetsParams,
	StatusCommonEnum,
	deleteAdminFacet,
} from "@/lib/api/admin";

interface FacetFilters {
	search?: string;
	status?: string | number;
}

const FILTER_FIELDS: FilterField[] = [
	{
		id: "search",
		label: "Tìm kiếm",
		type: "text",
		placeholder: "Key hoặc tên hiển thị",
	},
	{
		id: "status",
		label: "Trạng thái",
		type: "select",
		placeholder: "Tất cả",
		options: [
			{ value: StatusCommonEnum.ACTIVE, label: "Hoạt động" },
			{ value: StatusCommonEnum.INACTIVE, label: "Lưu trữ" },
		],
	},
	{ id: "createdAt", label: "Ngày tạo", type: "dateRange" },
];

const TYPE_COLORS: Record<number, string> = {
	1: "bg-blue-50 text-blue-700 ring-blue-600/20",
	2: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
	3: "bg-amber-50 text-amber-700 ring-amber-600/20",
	4: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

function formatDate(iso?: string): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

export default function FacetsPage() {
	const confirm = useConfirm();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & FacetFilters>({
		defaultPageSize: 10,
	});

	const { data, isLoading, mutate } = useAdminFacets(
		queryParams as unknown as ListFacetsParams,
	);

	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	async function handleDelete(facet: AdminFacet) {
		const ok = await confirm({
			title: "Xoá bộ lọc",
			description: (
				<>
					Bạn có chắc muốn xoá bộ lọc <strong>{facet.label}</strong>? Toàn bộ
					giá trị thuộc bộ lọc cũng sẽ bị ẩn. Hành động không thể hoàn tác.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;

		try {
			await deleteAdminFacet(facet.id);
			toast.success("Xoá bộ lọc thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Xoá bộ lọc thất bại",
			);
		}
	}

	const columns: DataTableColumn<AdminFacet>[] = [
		{
			id: "label",
			header: "Tên bộ lọc",
			cell: (row) => (
				<div className="min-w-0">
					<Link
						href={`/admin/facets/${row.id}`}
						className="block text-[13px] font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						{row.label}
					</Link>
					<div className="font-mono text-[11px] text-gray-500">{row.key}</div>
				</div>
			),
		},
		{
			id: "type",
			header: "Loại",
			width: "180px",
			align: "center",
			cell: (row) => <TypeBadge type={row.type} />,
		},
		{
			id: "displayOrder",
			header: "Thứ tự",
			width: "90px",
			align: "right",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">{row.displayOrder}</span>
			),
		},
		{
			id: "facetValuesCount",
			header: "Số giá trị",
			width: "110px",
			align: "right",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{row.facetValuesCount ?? row.facetValues?.length ?? 0}
				</span>
			),
		},
		{
			id: "status",
			header: "Trạng thái",
			width: "120px",
			align: "center",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			id: "createdAt",
			header: "Ngày tạo",
			width: "120px",
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
					editHref={`/admin/facets/${row.id}`}
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
					title="Bộ lọc"
					count={total}
					actions={
						<Link href="/admin/facets/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm bộ lọc
							</Button>
						</Link>
					}
				/>
				<DataTable<AdminFacet>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="bộ lọc"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}

function TypeBadge({ type }: { type: FacetTypeEnum }) {
	return (
		<span
			className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${TYPE_COLORS[type] ?? "bg-gray-50 text-gray-700 ring-gray-600/20"}`}
		>
			{FACET_TYPE_LABEL[type] ?? `#${type}`}
		</span>
	);
}
