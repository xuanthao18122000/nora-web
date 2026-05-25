"use client";

import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAdminPosts } from "@/features/admin/post/useAdminPosts";
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
	ListThumb,
	StatusBadge,
	useConfirm,
} from "@/features/admin/ui";
import {
	type AdminPost,
	AdminApiError,
	StatusCommonEnum,
	deleteAdminPost,
	ListPostParams,
} from "@/lib/api/admin";

interface PostFilters {
	title?: string;
	slug?: string;
	status?: string | number;
}

const FILTER_FIELDS: FilterField[] = [
	{
		id: "title",
		label: "Tiêu đề",
		type: "text",
		placeholder: "VD: Bảo dưỡng ắc quy",
	},
	{
		id: "slug",
		label: "Slug",
		type: "text",
		placeholder: "vd: bao-duong-ac-quy",
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
	{ id: "createdAt", label: "Ngày tạo", type: "dateRange" },
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

export default function PostsPage() {
	const confirm = useConfirm();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & PostFilters>({ defaultPageSize: 10 });

	const { data, isLoading, mutate } = useAdminPosts(queryParams as ListPostParams);
	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	async function handleDelete(p: AdminPost) {
		const ok = await confirm({
			title: "Xoá bài viết",
			description: (
				<>
					Bạn có chắc muốn xoá bài <strong>{p.title}</strong>?
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;
		try {
			await deleteAdminPost(p.id);
			toast.success("Xoá bài viết thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Xoá bài viết thất bại",
			);
		}
	}

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminPost>[] = [
		{
			id: "title",
			header: "Bài viết",
			cell: (row) => (
				<div className="flex items-center gap-3">
					<ListThumb url={row.featuredImage} alt={row.title} />
					<div className="min-w-0">
						<Link
							href={`/admin/posts/${row.id}`}
							className="block text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
							title={row.title}
						>
							{row.title}
						</Link>
						<div className="font-mono text-xs text-gray-500" title={row.slug}>
							/{row.slug}
						</div>
					</div>
				</div>
			),
		},
		{
			id: "views",
			header: "Lượt xem",
			width: "200px",
			align: "left",
			headerClassName: "whitespace-nowrap",
			cell: (row) => {
				const views = Math.floor((Number(row.views) || 0) / 3);
				return (
					<span
						className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-base font-semibold ${
							views === 0
								? "bg-gray-50 text-gray-400"
								: "bg-blue-50 text-blue-700"
						}`}
					>
						<Eye className="h-5 w-5" />
						{views.toLocaleString("vi-VN")}
					</span>
				);
			},
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
					editHref={`/admin/posts/${row.id}`}
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
						<Link href="/admin/posts/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm bài viết
							</Button>
						</Link>
					}
				/>
				<DataTable<AdminPost>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="bài viết"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}
