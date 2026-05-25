"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/features/admin/ui";
import {
	type AdminFacet,
	AdminApiError,
	FACET_TYPE_LABEL,
	addCategoryFacets,
} from "@/lib/api/admin";
import { useAvailableFacetsForCategory } from "./useCategoryFacets";

interface AddFacetToCategoryModalProps {
	open: boolean;
	categoryId: number;
	onClose: () => void;
	onSaved: () => void;
}

export function AddFacetToCategoryModal({
	open,
	categoryId,
	onClose,
	onSaved,
}: AddFacetToCategoryModalProps) {
	const [search, setSearch] = useState("");
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [submitting, setSubmitting] = useState(false);

	const { data, isLoading } = useAvailableFacetsForCategory(categoryId, open);
	const facets: AdminFacet[] = data?.data ?? [];

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return facets;
		return facets.filter(
			(f) =>
				f.key.toLowerCase().includes(term) ||
				f.label.toLowerCase().includes(term),
		);
	}, [facets, search]);

	// Reset state khi đóng/mở dialog
	useEffect(() => {
		if (!open) {
			setSearch("");
			setSelectedIds([]);
			setSubmitting(false);
		}
	}, [open]);

	function toggle(id: number) {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	}

	function toggleAll() {
		if (selectedIds.length === filtered.length && filtered.length > 0) {
			setSelectedIds([]);
		} else {
			setSelectedIds(filtered.map((f) => f.id));
		}
	}

	async function handleSubmit() {
		if (selectedIds.length === 0) {
			toast.error("Vui lòng chọn ít nhất một bộ lọc");
			return;
		}
		setSubmitting(true);
		try {
			const res = await addCategoryFacets(categoryId, {
				items: selectedIds.map((facetId) => ({
					facetId,
					displayOrder: 0,
					isVisible: true,
				})),
			});
			toast.success(
				`Thêm thành công ${res.success}/${selectedIds.length} bộ lọc` +
					(res.skipped > 0 ? ` (đã bỏ qua ${res.skipped} đã tồn tại)` : ""),
			);
			onSaved();
			onClose();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Thêm bộ lọc thất bại",
			);
		} finally {
			setSubmitting(false);
		}
	}

	if (!open) return null;

	const allSelected =
		filtered.length > 0 && selectedIds.length === filtered.length;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onClick={(e) => {
				if (e.target === e.currentTarget && !submitting) onClose();
			}}
		>
			<div
				className="flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl"
				role="dialog"
				aria-modal="true"
				aria-labelledby="add-facet-dialog-title"
			>
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<div>
						<h3
							id="add-facet-dialog-title"
							className="text-base font-semibold text-gray-900"
						>
							Thêm bộ lọc vào danh mục
						</h3>
						<p className="mt-0.5 text-xs text-gray-500">
							Chọn các bộ lọc chưa được gắn để áp dụng cho danh mục này
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={submitting}
						className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Đóng"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="space-y-3 px-5 py-4">
					<div className="relative">
						<Search
							className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
							aria-hidden="true"
						/>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Tìm theo key hoặc tên hiển thị..."
							className="pl-9"
						/>
					</div>

					<div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200">
						{isLoading ? (
							<div className="px-4 py-6 text-center text-sm text-gray-500">
								Đang tải...
							</div>
						) : filtered.length === 0 ? (
							<div className="px-4 py-6 text-center text-sm text-gray-500">
								{facets.length === 0
									? "Tất cả bộ lọc đã được gắn vào danh mục này."
									: "Không tìm thấy bộ lọc phù hợp."}
							</div>
						) : (
							<>
								<label className="flex cursor-pointer items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
									<input
										type="checkbox"
										checked={allSelected}
										onChange={toggleAll}
										className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-xs font-medium text-gray-700">
										Chọn tất cả ({selectedIds.length}/{filtered.length})
									</span>
								</label>
								<ul className="divide-y divide-gray-100">
									{filtered.map((facet) => {
										const checked = selectedIds.includes(facet.id);
										return (
											<li key={facet.id}>
												<label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-gray-50">
													<input
														type="checkbox"
														checked={checked}
														onChange={() => toggle(facet.id)}
														className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
													/>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="text-sm font-medium text-gray-900">
																{facet.label}
															</span>
															<span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-600">
																{facet.key}
															</span>
														</div>
														<div className="mt-0.5 text-xs text-gray-500">
															{FACET_TYPE_LABEL[facet.type]}
															{facet.facetValuesCount !== undefined && (
																<span className="ml-2">
																	· {facet.facetValuesCount} giá trị
																</span>
															)}
														</div>
													</div>
												</label>
											</li>
										);
									})}
								</ul>
							</>
						)}
					</div>
				</div>

				<div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={onClose}
						disabled={submitting}
					>
						Hủy
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleSubmit}
						disabled={submitting || selectedIds.length === 0}
					>
						{submitting
							? "Đang thêm..."
							: `Thêm ${selectedIds.length || ""} bộ lọc`.trim()}
					</Button>
				</div>
			</div>
		</div>
	);
}
