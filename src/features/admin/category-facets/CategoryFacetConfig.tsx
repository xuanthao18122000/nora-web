"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	ActionMenu,
	Button,
	Card,
	CardHeader,
	useConfirm,
} from "@/features/admin/ui";
import {
	type AdminCategoryFacet,
	AdminApiError,
	FACET_TYPE_LABEL,
	removeCategoryFacet,
	updateCategoryFacet,
} from "@/lib/api/admin";
import { AddFacetToCategoryModal } from "./AddFacetToCategoryModal";
import { useCategoryFacets } from "./useCategoryFacets";

interface CategoryFacetConfigProps {
	categoryId: number;
}

export function CategoryFacetConfig({ categoryId }: CategoryFacetConfigProps) {
	const confirm = useConfirm();
	const [addOpen, setAddOpen] = useState(false);
	const { data, isLoading, mutate } = useCategoryFacets(categoryId);

	const items: AdminCategoryFacet[] = data ?? [];

	async function handleToggleVisible(item: AdminCategoryFacet) {
		try {
			await updateCategoryFacet(categoryId, item.facetId, {
				isVisible: !item.isVisible,
			});
			toast.success("Cập nhật hiển thị thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Cập nhật thất bại",
			);
		}
	}

	async function handleUpdateOrder(item: AdminCategoryFacet, value: number) {
		if (!Number.isFinite(value) || value === item.displayOrder) return;
		try {
			await updateCategoryFacet(categoryId, item.facetId, {
				displayOrder: value,
			});
			toast.success("Cập nhật thứ tự thành công");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Cập nhật thất bại",
			);
		}
	}

	async function handleDelete(item: AdminCategoryFacet) {
		const ok = await confirm({
			title: "Gỡ bộ lọc khỏi danh mục",
			description: (
				<>
					Bạn có chắc muốn gỡ bộ lọc{" "}
					<strong>{item.facet?.label || `#${item.facetId}`}</strong> khỏi danh
					mục này?
				</>
			),
			confirmText: "Gỡ",
			tone: "danger",
		});
		if (!ok) return;

		try {
			await removeCategoryFacet(categoryId, item.facetId);
			toast.success("Đã gỡ bộ lọc");
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Gỡ bộ lọc thất bại",
			);
		}
	}

	return (
		<>
			<Card>
				<CardHeader
					title="Cấu hình bộ lọc"
					count={items.length}
					actions={
						<Button
							type="button"
							size="sm"
							onClick={() => setAddOpen(true)}
						>
							<Plus className="h-4 w-4" />
							Thêm bộ lọc
						</Button>
					}
				/>

				{isLoading ? (
					<div className="px-5 py-6 text-center text-sm text-gray-500">
						Đang tải...
					</div>
				) : items.length === 0 ? (
					<div className="px-5 py-8 text-center text-sm text-gray-500">
						Chưa có bộ lọc nào. Bấm "Thêm bộ lọc" để gắn bộ lọc cho danh mục.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									<th className="px-5 py-3">Bộ lọc</th>
									<th className="px-3 py-3">Key</th>
									<th className="px-3 py-3">Loại</th>
									<th className="px-3 py-3 w-32">Thứ tự</th>
									<th className="px-3 py-3 w-24 text-center">Hiển thị</th>
									<th className="px-5 py-3 w-24 text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{items.map((item) => (
									<tr key={item.facetId} className="hover:bg-gray-50">
										<td className="px-5 py-3">
											<Link
												href={`/admin/facets/${item.facetId}`}
												className="font-medium text-gray-900 hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
											>
												{item.facet?.label || `#${item.facetId}`}
											</Link>
										</td>
										<td className="px-3 py-3">
											<span className="font-mono text-[12px] text-gray-600">
												{item.facet?.key || "—"}
											</span>
										</td>
										<td className="px-3 py-3 text-gray-600">
											{item.facet?.type !== undefined
												? FACET_TYPE_LABEL[item.facet.type]
												: "—"}
										</td>
										<td className="px-3 py-3">
											<DisplayOrderInput
												value={item.displayOrder}
												onCommit={(v) => handleUpdateOrder(item, v)}
											/>
										</td>
										<td className="px-3 py-3 text-center">
											<Switch
												checked={item.isVisible}
												onChange={() => handleToggleVisible(item)}
												ariaLabel="Bật/tắt hiển thị"
											/>
										</td>
										<td className="px-5 py-3 text-center">
											<ActionMenu onDelete={() => handleDelete(item)} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>

			<AddFacetToCategoryModal
				open={addOpen}
				categoryId={categoryId}
				onClose={() => setAddOpen(false)}
				onSaved={() => mutate()}
			/>
		</>
	);
}

/** Inline editable number input — commit khi blur hoặc Enter. */
function DisplayOrderInput({
	value,
	onCommit,
}: {
	value: number;
	onCommit: (value: number) => void;
}) {
	const [local, setLocal] = useState(String(value));
	const [focused, setFocused] = useState(false);

	// Sync khi parent value đổi (chỉ khi không đang focus để không ghi đè input)
	useEffect(() => {
		if (!focused) setLocal(String(value));
	}, [value, focused]);

	return (
		<input
			type="number"
			value={local}
			onFocus={() => setFocused(true)}
			onChange={(e) => setLocal(e.target.value)}
			onBlur={() => {
				setFocused(false);
				const next = Number(local);
				if (Number.isFinite(next) && next !== value) {
					onCommit(next);
				} else {
					setLocal(String(value));
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					(e.target as HTMLInputElement).blur();
				}
				if (e.key === "Escape") {
					setLocal(String(value));
					(e.target as HTMLInputElement).blur();
				}
			}}
			className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
		/>
	);
}

/** Toggle switch tối giản — không phụ thuộc lib. */
function Switch({
	checked,
	onChange,
	ariaLabel,
}: {
	checked: boolean;
	onChange: () => void;
	ariaLabel: string;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={ariaLabel}
			onClick={onChange}
			className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
				checked ? "bg-emerald-500" : "bg-gray-300"
			}`}
		>
			<span
				className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
					checked ? "translate-x-4" : "translate-x-0.5"
				}`}
			/>
		</button>
	);
}
