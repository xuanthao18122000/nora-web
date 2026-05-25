"use client";

import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Field,
	Select,
} from "@/features/admin/ui";
import {
	type AdminFacet,
	AdminApiError,
	FacetTypeEnum,
	bulkSetProductFacetValues,
} from "@/lib/api/admin";
import {
	useFacetsByCategoryIds,
	useProductFacetValues,
} from "./useProductFacetValues";

interface ProductFacetValuesProps {
	productId: number;
	categoryIds: number[];
}

/**
 * Section "Giá trị bộ lọc" trong product detail.
 *
 * Logic:
 * - Load facets áp dụng cho `categoryIds` (kèm `facetValues[]`).
 * - Bỏ facet RANGE (giá trị range tự sinh từ price, không gán thủ công) và BOOLEAN.
 * - SINGLE_SELECT → 1 dropdown chọn 1 value.
 * - MULTI_SELECT → checkbox list cho phép chọn nhiều value.
 * - Pre-fill từ `listProductFacetValues(productId)` — chỉ giữ value thuộc facets hiện đang load.
 * - Nút "Lưu" gom toàn bộ selected `facetValueIds` → PUT /cms/products/:id/facet-values.
 */
export function ProductFacetValues({
	productId,
	categoryIds,
}: ProductFacetValuesProps) {
	const { data: facetsData, isLoading: isLoadingFacets } =
		useFacetsByCategoryIds(categoryIds);
	const { data: productFacetValuesData, mutate } =
		useProductFacetValues(productId);

	const facets: AdminFacet[] = useMemo(() => {
		const all = facetsData?.data ?? [];
		// Bỏ RANGE (price range tự sinh) + BOOLEAN (chưa hỗ trợ multi-select trên UI này)
		return all.filter(
			(f) => f.type !== FacetTypeEnum.RANGE && f.type !== FacetTypeEnum.BOOLEAN,
		);
	}, [facetsData?.data]);

	const facetIdSet = useMemo(
		() => new Set(facets.map((f) => f.id)),
		[facets],
	);

	/** Selected = Map<facetId, Set<facetValueId>>. SINGLE_SELECT chỉ chứa tối đa 1 phần tử. */
	const [selected, setSelected] = useState<Record<number, number[]>>({});
	const [submitting, setSubmitting] = useState(false);

	/** Pre-fill từ existing mappings (chỉ giữ values thuộc facets đang load). */
	useEffect(() => {
		if (!productFacetValuesData) return;
		const next: Record<number, number[]> = {};
		for (const pfv of productFacetValuesData) {
			const facetId = pfv.facetValue?.facetId ?? pfv.facetValue?.facet?.id;
			const valueId = pfv.facetValueId;
			if (facetId == null || !facetIdSet.has(facetId)) continue;
			if (!next[facetId]) next[facetId] = [];
			if (!next[facetId].includes(valueId)) next[facetId].push(valueId);
		}
		setSelected(next);
		// Reset khi product/category set đổi
	}, [productFacetValuesData, facetIdSet]);

	function setSingle(facetId: number, valueId: number | null) {
		setSelected((prev) => {
			const next = { ...prev };
			if (valueId == null) {
				delete next[facetId];
			} else {
				next[facetId] = [valueId];
			}
			return next;
		});
	}

	function toggleMulti(facetId: number, valueId: number) {
		setSelected((prev) => {
			const current = prev[facetId] ?? [];
			const exists = current.includes(valueId);
			const nextValues = exists
				? current.filter((v) => v !== valueId)
				: [...current, valueId];
			const next = { ...prev };
			if (nextValues.length === 0) {
				delete next[facetId];
			} else {
				next[facetId] = nextValues;
			}
			return next;
		});
	}

	async function handleSave() {
		setSubmitting(true);
		try {
			const allValueIds = Object.values(selected).flat();
			const res = await bulkSetProductFacetValues(productId, allValueIds);
			toast.success(
				`Lưu thành công · ${res.created} mới · ${res.restored} khôi phục · ${res.deleted} đã gỡ`,
			);
			mutate();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Lưu thất bại",
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Card>
			<CardHeader
				title="Giá trị bộ lọc"
				count={facets.length || undefined}
				actions={
					<Button
						type="button"
						size="sm"
						onClick={handleSave}
						disabled={submitting || categoryIds.length === 0 || facets.length === 0}
					>
						<Save className="h-4 w-4" />
						{submitting ? "Đang lưu..." : "Lưu"}
					</Button>
				}
			/>
			<CardBody>
				{categoryIds.length === 0 ? (
					<EmptyState>
						Vui lòng chọn danh mục cho sản phẩm trước để hiển thị bộ lọc áp
						dụng.
					</EmptyState>
				) : isLoadingFacets ? (
					<EmptyState>Đang tải bộ lọc...</EmptyState>
				) : facets.length === 0 ? (
					<EmptyState>
						Không có bộ lọc nào áp dụng cho các danh mục đã chọn. Vui lòng cấu
						hình bộ lọc cho danh mục trước.
					</EmptyState>
				) : (
					<div className="space-y-4">
						{facets.map((facet) => (
							<FacetRow
								key={facet.id}
								facet={facet}
								selectedValueIds={selected[facet.id] ?? []}
								onSetSingle={(v) => setSingle(facet.id, v)}
								onToggleMulti={(v) => toggleMulti(facet.id, v)}
							/>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	);
}

function FacetRow({
	facet,
	selectedValueIds,
	onSetSingle,
	onToggleMulti,
}: {
	facet: AdminFacet;
	selectedValueIds: number[];
	onSetSingle: (valueId: number | null) => void;
	onToggleMulti: (valueId: number) => void;
}) {
	const values = facet.facetValues ?? [];

	if (values.length === 0) {
		return (
			<Field label={facet.label}>
				<div className="rounded-md border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500">
					Bộ lọc này chưa có giá trị nào.
				</div>
			</Field>
		);
	}

	if (facet.type === FacetTypeEnum.SINGLE_SELECT) {
		const current = selectedValueIds[0];
		return (
			<Field label={facet.label} hint="Chọn một giá trị">
				<Select
					value={current !== undefined ? String(current) : ""}
					onChange={(e) =>
						onSetSingle(e.target.value === "" ? null : Number(e.target.value))
					}
				>
					<option value="">— Không chọn —</option>
					{values.map((v) => (
						<option key={v.id} value={v.id}>
							{v.label}
						</option>
					))}
				</Select>
			</Field>
		);
	}

	// MULTI_SELECT (default)
	return (
		<Field label={facet.label} hint="Có thể chọn nhiều giá trị">
			<div className="flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-2">
				{values.map((v) => {
					const checked = selectedValueIds.includes(v.id);
					return (
						<label
							key={v.id}
							className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
								checked
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
							}`}
						>
							<input
								type="checkbox"
								checked={checked}
								onChange={() => onToggleMulti(v.id)}
								className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							{v.label}
						</label>
					);
				})}
			</div>
		</Field>
	);
}

function EmptyState({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
			{children}
		</div>
	);
}
