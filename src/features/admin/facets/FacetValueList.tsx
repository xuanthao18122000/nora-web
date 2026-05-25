"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	type DataTableColumn,
	DataTable,
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
	type AdminFacetValue,
	AdminApiError,
	deleteAdminFacetValue,
} from "@/lib/api/admin";
import { useAdminFacetValues } from "./useAdminFacets";
import { FacetValueDialog } from "./FacetValueDialog";

interface FacetValueListProps {
	facetId: number;
	facetLabel: string;
}

export function FacetValueList({ facetId, facetLabel }: FacetValueListProps) {
	const confirm = useConfirm();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [editing, setEditing] = useState<AdminFacetValue | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const { data, isLoading, mutate } = useAdminFacetValues(facetId, {
		page,
		limit: pageSize,
	});

	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	function openCreate() {
		setEditing(null);
		setDialogOpen(true);
	}

	function openEdit(value: AdminFacetValue) {
		setEditing(value);
		setDialogOpen(true);
	}

	async function handleDelete(value: AdminFacetValue) {
		const ok = await confirm({
			title: "Xoá giá trị bộ lọc",
			description: (
				<>
					Bạn có chắc muốn xoá giá trị <strong>{value.label}</strong> khỏi bộ
					lọc <strong>{facetLabel}</strong>? Hành động không thể hoàn tác.
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;

		try {
			await deleteAdminFacetValue(facetId, value.id);
			toast.success("Xoá giá trị thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError
					? err.message
					: "Xoá giá trị thất bại",
			);
		}
	}

	const columns: DataTableColumn<AdminFacetValue>[] = [
		{
			id: "key",
			header: "Key",
			cell: (row) => (
				<span className="font-mono text-[13px] text-gray-700">{row.key}</span>
			),
		},
		{
			id: "label",
			header: "Tên hiển thị",
			cell: (row) => (
				<span className="text-[13px] font-medium text-gray-900">
					{row.label}
				</span>
			),
		},
		{
			id: "icon",
			header: "Icon",
			width: "100px",
			cell: (row) => <IconCell icon={row.icon} />,
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
					extra={[
						{
							label: "Chỉnh sửa",
							onClick: () => openEdit(row),
						},
					]}
					onDelete={() => handleDelete(row)}
				/>
			),
		},
	];

	return (
		<>
			<Card>
				<CardHeader
					title="Giá trị bộ lọc"
					count={total}
					actions={
						<Button size="sm" type="button" onClick={openCreate}>
							<Plus className="h-4 w-4" />
							Thêm giá trị
						</Button>
					}
				/>
				<DataTable<AdminFacetValue>
					columns={columns}
					data={items}
					isLoading={isLoading}
					total={total}
					currentPage={page}
					pageSize={pageSize}
					itemLabel="giá trị"
					onPageChange={(p) => setPage(p)}
					onPageSizeChange={(s) => {
						setPageSize(s);
						setPage(1);
					}}
					emptyText="Chưa có giá trị nào. Bấm 'Thêm giá trị' để tạo mới."
				/>
			</Card>

			<FacetValueDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onSaved={() => mutate()}
				facetId={facetId}
				initialData={editing}
			/>
		</>
	);
}

function IconCell({ icon }: { icon?: string | null }) {
	if (!icon) return <span className="text-gray-300">—</span>;

	const isUrl = /^https?:\/\//i.test(icon);
	if (isUrl) {
		// biome-ignore lint/performance/noImgElement: external URL preview, no SSR
		return (
			<img
				src={icon}
				alt=""
				className="h-6 w-6 rounded border border-gray-200 bg-white object-contain p-0.5"
			/>
		);
	}
	// emoji or short text
	return <span className="text-base">{icon}</span>;
}
