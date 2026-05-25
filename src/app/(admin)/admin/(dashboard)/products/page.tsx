"use client";

import { CheckCircle2, Layers, Package, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import {
	useAdminCategoryTreeForProduct,
	useAdminProducts,
} from "@/features/admin/product/useAdminProducts";
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
	type AdminProduct,
	type CategoryTreeNode,
	AdminApiError,
	ListProductParams,
	StatusCommonEnum,
	deleteAdminProduct,
} from "@/lib/api/admin";

interface ProductFilters {
	searchName?: string;
	searchSku?: string;
	searchBarcode?: string;
	status?: string | number;
	categoryId?: string | number;
	sortBy?: string;
	order?: string;
}

function formatVND(value: number | undefined | null): string {
	if (value === undefined || value === null) return "—";
	return Number(value).toLocaleString("vi-VN") + " ₫";
}

function formatNumber(value: number | undefined | null): string {
	if (value === undefined || value === null) return "0";
	return Number(value).toLocaleString("vi-VN");
}

function flattenCategoryTree(
	nodes: CategoryTreeNode[] | undefined,
	depth = 0,
): { value: number; label: string }[] {
	if (!nodes) return [];
	const out: { value: number; label: string }[] = [];
	for (const n of nodes) {
		out.push({ value: n.id, label: `${"— ".repeat(depth)}${n.name}` });
		if (n.children?.length) out.push(...flattenCategoryTree(n.children, depth + 1));
	}
	return out;
}

export default function ProductsPage() {
	const confirm = useConfirm();
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & ProductFilters>({ defaultPageSize: 10 });

	const { data: categoryTree } = useAdminCategoryTreeForProduct();
	const categoryOptions = useMemo(
		() => flattenCategoryTree(categoryTree),
		[categoryTree],
	);

	const { data, isLoading, mutate } = useAdminProducts(queryParams as ListProductParams);

	const filterFields: FilterField[] = useMemo(
		() => [
			{
				id: "searchName",
				label: "Tên sản phẩm",
				type: "text",
				placeholder: "Nhập tên sản phẩm",
			},
			{
				id: "searchBarcode",
				label: "Mã vạch",
				type: "text",
				placeholder: "Nhập mã vạch",
			},
			{ id: "searchSku", label: "SKU", type: "text", placeholder: "Nhập SKU" },
			{
				id: "categoryId",
				label: "Danh mục",
				type: "select",
				placeholder: "Chọn danh mục",
				options: categoryOptions,
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
				id: "sortBy",
				label: "Sắp xếp theo",
				type: "select",
				placeholder: "Chọn sắp xếp theo",
				options: [
					{ value: "createdAt", label: "Ngày tạo" },
					{ value: "updatedAt", label: "Ngày cập nhật" },
					{ value: "price", label: "Giá" },
					{ value: "soldCount", label: "Đã bán" },
					{ value: "stockQuantity", label: "Tồn kho" },
				],
			},
			{
				id: "order",
				label: "Thứ tự",
				type: "select",
				placeholder: "Chọn thứ tự",
				options: [
					{ value: "DESC", label: "Giảm dần" },
					{ value: "ASC", label: "Tăng dần" },
				],
			},
		],
		[categoryOptions],
	);

	async function handleDelete(p: AdminProduct) {
		const ok = await confirm({
			title: "Xoá sản phẩm",
			description: (
				<>
					Bạn có chắc muốn xoá <strong>{p.name}</strong>? Hành động không thể
					hoàn tác.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;

		try {
			await deleteAdminProduct(p.id);
			toast.success("Xoá sản phẩm thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Xoá sản phẩm thất bại",
			);
		}
	}

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminProduct>[] = [
		{
			id: "type",
			header: "Loại",
			width: "100px",
			align: "center",
			cell: (row) => (
				<div className="flex justify-center">
					<ProductTypeIcon product={row} />
				</div>
			),
		},
		{
			id: "name",
			header: "Tên sản phẩm",
			cell: (row) => (
				<div className="flex items-start gap-3">
					<ListThumb url={row.thumbnailUrl} alt={row.name} />
					<div className="min-w-0 flex-1">
						<Link
							href={`/admin/products/${row.id}`}
							className="line-clamp-2 text-[13px] font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							{row.name}
						</Link>
						<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
							{row.barcode && (
								<span>
									Mã vạch: <span className="text-gray-700">{row.barcode}</span>
								</span>
							)}
							{row.sku && (
								<span>
									SKU: <span className="text-gray-700">{row.sku}</span>
								</span>
							)}
						</div>
					</div>
				</div>
			),
		},
		{
			id: "updated",
			header: "Cập nhật",
			width: "120px",
			cell: () => (
				<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20">
					<CheckCircle2 className="h-3 w-3" />
					Đã cập nhật
				</span>
			),
		},
		{
			id: "stockQuantity",
			header: "Tồn kho",
			width: "90px",
			align: "right",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{formatNumber(row.stockQuantity)}
				</span>
			),
		},
		{
			id: "soldCount",
			header: "Đã bán",
			width: "80px",
			align: "right",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{formatNumber(row.soldCount)}
				</span>
			),
		},
		{
			id: "price",
			header: "Giá bán lẻ",
			align: "right",
			width: "140px",
			cell: (row) => (
				<div className="flex flex-col items-end">
					<span className="text-[13px] font-medium text-gray-900">
						{formatVND(row.price)}
					</span>
					{row.salePrice !== undefined && row.salePrice !== null && (
						<span className="text-[11px] text-red-600">
							{formatVND(row.salePrice)}
						</span>
					)}
				</div>
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
			id: "actions",
			header: "Thao tác",
			width: "80px",
			align: "center",
			cell: (row) => (
				<ActionMenu
					editHref={`/admin/products/${row.id}`}
					onDelete={() => handleDelete(row)}
				/>
			),
		},
	];

	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="space-y-4 mt-4">
			<FilterPanel
				fields={filterFields}
				onFilter={onFilter}
				onReset={handleResetFilter}
				isFetching={isLoading}
			/>

			<Card>
				<CardHeader
					title="Danh sách sản phẩm"
					count={total}
					actions={
						<Link href="/admin/products/new">
							<Button size="sm">
								<Plus className="h-4 w-4" />
								Thêm sản phẩm
							</Button>
						</Link>
					}
				/>
				<DataTable<AdminProduct>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="sản phẩm"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}

function ProductTypeIcon({ product }: { product: AdminProduct }) {
	// Heuristic: có gán category → sản phẩm chính, không thì coi như phụ kiện.
	const isMain = (product.productCategories?.length ?? 0) > 0;
	const Icon = isMain ? Layers : Package;
	const title = isMain ? "Sản phẩm chính" : "Phụ kiện";
	return (
		<span
			className="inline-flex h-6 w-6 items-center justify-center rounded-md text-rose-600"
			title={title}
		>
			<Icon className="h-4 w-4" />
		</span>
	);
}
