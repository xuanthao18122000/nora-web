"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
	type DataTableColumn,
	DataTable,
	type FilterField,
	FilterPanel,
	type FilterValue,
	useDataTable,
} from "@/features/admin/data-table";
import { useAdminPostLists } from "@/features/admin/post-list/useAdminPostLists";
import {
	ActionMenu,
	Button,
	Card,
	CardHeader,
	StatusBadge,
	useConfirm,
} from "@/features/admin/ui";
import {
	type AdminPostList,
	AdminApiError,
	StatusCommonEnum,
	deleteAdminPostList,
	ListPostListParams,
} from "@/lib/api/admin";

interface PostListFilters {
	name?: string;
	status?: string | number;
}

const FILTER_FIELDS: FilterField[] = [
	{ id: "name", label: "Tên", type: "text", placeholder: "VD: Tin tức" },
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

export default function PostListsPage() {
	const confirm = useConfirm();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & PostListFilters>({ defaultPageSize: 10 });

	const { data, isLoading, mutate } = useAdminPostLists(queryParams as ListPostListParams);
	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	async function handleDelete(p: AdminPostList) {
		const ok = await confirm({
			title: "Xoá danh sách",
			description: (
				<>
					Bạn có chắc muốn xoá <strong>{p.name}</strong>?
					<br />
					Các bài viết thuộc danh sách này sẽ không bị xoá nhưng mất liên kết.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;
		try {
			await deleteAdminPostList(p.id);
			toast.success("Xoá thành công");
			mutate();
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Xoá thất bại");
		}
	}

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminPostList>[] = [
		{
			id: "name",
			header: "Danh sách",
			cell: (row) => (
				<div className="min-w-0">
					<Link
						href={`/admin/post-lists/${row.id}`}
						className="block text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						title={row.name}
					>
						{row.name}
					</Link>
					<div className="font-mono text-xs text-gray-500" title={row.slug}>
						/{row.slug}
					</div>
				</div>
			),
		},
		{
			id: "description",
			header: "Mô tả",
			cell: (row) => (
				<span className="line-clamp-2 text-[13px] text-gray-700">
					{row.description || "—"}
				</span>
			),
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
			id: "status",
			header: "Trạng thái",
			width: "130px",
			align: "center",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			id: "actions",
			header: "Thao tác",
			width: "80px",
			align: "center",
			cell: (row) => (
				<ActionMenu
					editHref={`/admin/post-lists/${row.id}`}
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
					title="Danh sách bài viết"
					count={total}
					actions={
						<Link href="/admin/post-lists/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm danh sách
							</Button>
						</Link>
					}
				/>
				<DataTable<AdminPostList>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="danh sách"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}
