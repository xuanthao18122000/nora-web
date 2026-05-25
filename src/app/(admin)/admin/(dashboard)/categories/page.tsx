"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { useAdminCategoryTree } from "@/features/admin/category/useAdminCategories";
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
	type AdminCategory,
	AdminApiError,
	StatusCommonEnum,
	deleteAdminCategory,
} from "@/lib/api/admin";

const FILTER_FIELDS: FilterField[] = [
	{
		id: "searchName",
		label: "Tên / slug",
		type: "text",
		placeholder: "VD: ắc quy, ac-quy-o-to",
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
];

interface CategoryRow extends AdminCategory {
	children?: CategoryRow[];
}

interface CategoryFilters {
	searchName?: string;
	status?: string;
}

function filterTree(
	nodes: CategoryRow[],
	predicate: (n: CategoryRow) => boolean,
): CategoryRow[] {
	const out: CategoryRow[] = [];
	for (const node of nodes) {
		const filteredChildren = node.children
			? filterTree(node.children, predicate)
			: [];
		if (predicate(node) || filteredChildren.length) {
			out.push({ ...node, children: filteredChildren });
		}
	}
	return out;
}

export default function CategoriesPage() {
	const confirm = useConfirm();
	const { handleFilter, handleResetFilter, filters } =
		useDataTable<Record<string, unknown> & CategoryFilters>();
	const { data: tree, isLoading, mutate } = useAdminCategoryTree();

	const filteredRows: CategoryRow[] = useMemo(() => {
		if (!tree) return [];
		const data = tree as CategoryRow[];

		const searchName = filters.searchName?.toLowerCase().trim();
		const status = filters.status;
		const hasFilter = !!(searchName || status);
		if (!hasFilter) return data;

		return filterTree(data, (n) => {
			if (
				searchName &&
				!n.name.toLowerCase().includes(searchName) &&
				!n.slug.toLowerCase().includes(searchName)
			) {
				return false;
			}
			if (status !== undefined && status !== "" && n.status !== Number(status)) {
				return false;
			}
			return true;
		});
	}, [tree, filters]);

	const hasSearch = !!(filters.searchName || filters.status);

	async function handleDelete(cat: CategoryRow) {
		const ok = await confirm({
			title: "Xoá danh mục",
			description: (
				<>
					Bạn có chắc muốn xoá danh mục <strong>{cat.name}</strong>? Hành động
					không thể hoàn tác.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;

		try {
			await deleteAdminCategory(cat.id);
			toast.success("Xoá danh mục thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Xoá danh mục thất bại",
			);
		}
	}

	const columns: DataTableColumn<CategoryRow>[] = [
		{
			id: "name",
			header: "Tên danh mục",
			cell: (row) => (
				<div className="min-w-0">
					<Link
						href={`/admin/categories/${row.id}`}
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
			id: "position",
			header: "Vị trí",
			width: "100px",
			align: "right",
			cell: (row) => <span className="text-[13px] text-gray-700">{row.position}</span>,
		},
		{
			id: "status",
			header: "Trạng thái",
			width: "140px",
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
					editHref={`/admin/categories/${row.id}`}
					onDelete={() => handleDelete(row)}
				/>
			),
		},
	];

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

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
					title="Danh mục sản phẩm"
					count={filteredRows.length}
					actions={
						<Link href="/admin/categories/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm danh mục
							</Button>
						</Link>
					}
				/>
				<DataTable<CategoryRow>
					columns={columns}
					data={filteredRows}
					isLoading={isLoading}
					enableRowExpansion
					childrenColumnName="children"
					defaultExpandAllRows={hasSearch}
					showPagination={false}
				/>
			</Card>
		</div>
	);
}
