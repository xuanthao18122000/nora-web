"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	GripVertical,
	LayoutGrid,
	Package,
	Plus,
	SlidersHorizontal,
	Tag,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Field, Input } from "@/features/admin/ui";
import {
	type AdminPageSectionItem,
	StatusCommonEnum,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";
import {
	EntitySearchSelect,
	type EntitySearchPayload,
} from "./EntitySearchSelect";

// ─── Types ───────────────────────────────────────────────────────────

const PageSectionItemTypeEnum = {
	LIST_PRODUCTS: "list_products",
	LIST_TABS: "list_tabs",
} as const;

interface ProductRow {
	localId: string;
	productId: number;
	name: string;
	thumbnailUrl?: string | null;
	price: number;
	stockQuantity: number;
	position: number;
	status: StatusCommonEnum;
}

interface TabRow {
	localId: string;
	name: string;
	slug: string;
	position: number;
}

export interface ProductBoxExtra {
	displayMode?: "grid" | "carousel";
	slidesPerView?: number;
	autoSlide?: boolean;
	showTitle?: boolean;
	rows?: number;
}

interface ProductItemData {
	productId: number;
	thumbnailUrl?: string | null;
	price?: number;
	stockQuantity?: number;
}

interface TabItemData {
	slug?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function safeParseJson<T>(s: string | undefined | null): T | null {
	if (!s) return null;
	try {
		return JSON.parse(s) as T;
	} catch {
		return null;
	}
}

function makeKey() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function parseInitialData(values: AdminPageSectionItem[] | null) {
	const products: ProductRow[] = [];
	const tabs: TabRow[] = [];
	if (!Array.isArray(values)) return { products, tabs };

	values.forEach((v, idx) => {
		const data = safeParseJson<Record<string, unknown>>(v?.data) ?? {};
		if (v.type === PageSectionItemTypeEnum.LIST_TABS) {
			tabs.push({
				localId: String(v.id ?? makeKey()),
				name: v.name ?? "",
				slug: String((data as TabItemData).slug ?? ""),
				position: v.position ?? idx,
			});
			return;
		}
		// Default to LIST_PRODUCTS
		const pData = data as unknown as ProductItemData;
		products.push({
			localId: String(v.id ?? makeKey()),
			productId: Number(pData.productId ?? 0),
			name: v.name ?? "",
			thumbnailUrl: pData.thumbnailUrl ?? null,
			price: Number(pData.price ?? 0),
			stockQuantity: Number(pData.stockQuantity ?? 0),
			position: v.position ?? idx,
			status: (v.status ?? StatusCommonEnum.ACTIVE) as StatusCommonEnum,
		});
	});
	return { products, tabs };
}

export function buildProductBoxPayload(
	products: ProductRow[],
	tabs: TabRow[],
) {
	const productItems = products.map((p, index) => ({
		type: PageSectionItemTypeEnum.LIST_PRODUCTS,
		name: p.name,
		position: index,
		status: p.status,
		data: JSON.stringify({
			productId: p.productId,
			thumbnailUrl: p.thumbnailUrl ?? null,
			price: p.price,
			stockQuantity: p.stockQuantity,
		}),
	}));
	const tabItems = tabs.map((t, index) => ({
		type: PageSectionItemTypeEnum.LIST_TABS,
		name: t.name,
		position: products.length + index,
		status: StatusCommonEnum.ACTIVE,
		data: JSON.stringify({ slug: t.slug }),
	}));
	return [...productItems, ...tabItems];
}

// ─── Sortable row primitive ──────────────────────────────────────────

function SortableRow({
	id,
	dragEnabled,
	children,
}: {
	id: string;
	dragEnabled: boolean;
	children: React.ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id, disabled: !dragEnabled });
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};
	return (
		<tr
			ref={setNodeRef}
			style={style}
			className="border-b border-gray-100 last:border-0"
		>
			{dragEnabled && (
				<td className="w-8 px-2">
					<button
						type="button"
						{...attributes}
						{...listeners}
						className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
						aria-label="Kéo để sắp xếp"
					>
						<GripVertical className="size-4" />
					</button>
				</td>
			)}
			{children}
		</tr>
	);
}

// ─── Main component ──────────────────────────────────────────────────

interface ProductBoxSectionProps {
	defaultValues?: AdminPageSectionItem[] | null;
	defaultExtra?: ProductBoxExtra | null;
	disabled?: boolean;
	onChange?: (state: {
		products: ProductRow[];
		tabs: TabRow[];
		extra: ProductBoxExtra;
	}) => void;
}

const SECTION_HEADER =
	"flex items-center gap-2 mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500";

export function ProductBoxSection({
	defaultValues = null,
	defaultExtra = null,
	disabled = false,
	onChange,
}: ProductBoxSectionProps) {
	const init = useMemo(() => parseInitialData(defaultValues), [defaultValues]);

	const [products, setProductsState] = useState<ProductRow[]>(init.products);
	const [tabs, setTabsState] = useState<TabRow[]>(init.tabs);

	const [showTitle, setShowTitle] = useState<boolean>(
		defaultExtra?.showTitle ?? true,
	);
	const [displayMode, setDisplayMode] = useState<"grid" | "carousel">(
		defaultExtra?.displayMode ?? "grid",
	);
	const [slidesPerView, setSlidesPerView] = useState<number>(
		defaultExtra?.slidesPerView ?? 4,
	);
	const [autoSlide, setAutoSlide] = useState<boolean>(
		defaultExtra?.autoSlide ?? false,
	);
	const [boxRows, setBoxRows] = useState<number>(
		Number(defaultExtra?.rows) > 0 ? Number(defaultExtra?.rows) : 1,
	);

	const [productDrag, setProductDrag] = useState(false);

	// Init lại khi defaultValues đổi (edit mode load xong)
	const initSig = useRef("");
	useEffect(() => {
		const sig = JSON.stringify({ values: defaultValues, extra: defaultExtra });
		if (sig === initSig.current) return;
		initSig.current = sig;
		const parsed = parseInitialData(defaultValues);
		setProductsState(parsed.products);
		setTabsState(parsed.tabs);
		if (defaultExtra) {
			setShowTitle(defaultExtra.showTitle ?? true);
			setDisplayMode(defaultExtra.displayMode ?? "grid");
			setSlidesPerView(defaultExtra.slidesPerView ?? 4);
			setAutoSlide(defaultExtra.autoSlide ?? false);
			setBoxRows(Number(defaultExtra.rows) > 0 ? Number(defaultExtra.rows) : 1);
		}
	}, [defaultValues, defaultExtra]);

	// Notify cha mỗi khi state đổi
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	});
	useEffect(() => {
		const extra: ProductBoxExtra = {
			showTitle,
			displayMode,
			slidesPerView,
			autoSlide,
			rows: boxRows,
		};
		onChangeRef.current?.({ products, tabs, extra });
	}, [products, tabs, showTitle, displayMode, slidesPerView, autoSlide, boxRows]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor),
	);

	// ─── Product ops ─────────────────────────────────────────────────
	const handleAddProduct = useCallback(
		(p: EntitySearchPayload) => {
			if (p.type !== "product") return;
			setProductsState((prev) => {
				if (prev.some((r) => r.productId === p.id)) return prev;
				return [
					...prev,
					{
						localId: makeKey(),
						productId: p.id,
						name: p.name,
						thumbnailUrl: p.thumbnailUrl ?? null,
						price: 0,
						stockQuantity: 0,
						position: prev.length,
						status: StatusCommonEnum.ACTIVE,
					},
				];
			});
		},
		[],
	);

	const removeProduct = useCallback((localId: string) => {
		setProductsState((prev) => prev.filter((p) => p.localId !== localId));
	}, []);

	function handleDragProductsEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setProductsState((prev) => {
			const oldIdx = prev.findIndex((p) => p.localId === active.id);
			const newIdx = prev.findIndex((p) => p.localId === over.id);
			if (oldIdx < 0 || newIdx < 0) return prev;
			return arrayMove(prev, oldIdx, newIdx);
		});
	}

	// ─── Tab ops ─────────────────────────────────────────────────────
	const addTab = useCallback(() => {
		setTabsState((prev) => [
			...prev,
			{
				localId: makeKey(),
				name: "",
				slug: "",
				position: prev.length,
			},
		]);
	}, []);

	const updateTab = useCallback(
		(localId: string, patch: Partial<TabRow>) => {
			setTabsState((prev) =>
				prev.map((t) => (t.localId === localId ? { ...t, ...patch } : t)),
			);
		},
		[],
	);

	const removeTab = useCallback((localId: string) => {
		setTabsState((prev) => prev.filter((t) => t.localId !== localId));
	}, []);

	// ─── Render ──────────────────────────────────────────────────────
	return (
		<div className="space-y-5">
			{/* Section 1: Box info */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<Tag className="size-4" />
					Thông tin box sản phẩm
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field label="Tên box sản phẩm">
						<div className="space-y-2">
							<label className="flex items-center gap-2 mt-1 cursor-pointer">
								<input
									type="checkbox"
									checked={showTitle}
									onChange={(e) => setShowTitle(e.target.checked)}
									disabled={disabled}
									className="rounded border-gray-300"
								/>
								<span className="text-sm text-gray-600">
									Hiển thị tên box trên storefront
								</span>
							</label>
						</div>
					</Field>
				</div>
			</div>

			{/* Section 2: Display config */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<SlidersHorizontal className="size-4" />
					Cấu hình hiển thị sản phẩm
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<div className="text-sm font-medium text-gray-700">
							Kiểu hiển thị
						</div>
						<div className="flex gap-2">
							<Button
								type="button"
								variant={displayMode === "grid" ? "primary" : "secondary"}
								size="sm"
								onClick={() => setDisplayMode("grid")}
								disabled={disabled}
							>
								<LayoutGrid className="size-3.5" /> Lưới
							</Button>
							<Button
								type="button"
								variant={
									displayMode === "carousel" ? "primary" : "secondary"
								}
								size="sm"
								onClick={() => setDisplayMode("carousel")}
								disabled={disabled}
							>
								<SlidersHorizontal className="size-3.5" /> Cuộn ngang
							</Button>
						</div>
					</div>

					{displayMode === "carousel" && (
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								Tự động cuộn
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									variant={autoSlide ? "primary" : "secondary"}
									size="sm"
									onClick={() => setAutoSlide(true)}
									disabled={disabled}
								>
									Bật
								</Button>
								<Button
									type="button"
									variant={!autoSlide ? "primary" : "secondary"}
									size="sm"
									onClick={() => setAutoSlide(false)}
									disabled={disabled}
								>
									Tắt
								</Button>
							</div>
						</div>
					)}

					<div className="space-y-2">
						<div className="text-sm font-medium text-gray-700">Số hàng</div>
						<input
							type="number"
							min={1}
							max={10}
							value={boxRows}
							onChange={(e) => {
								const v = Number(e.target.value);
								setBoxRows(v > 0 ? v : 1);
							}}
							disabled={disabled}
							className="w-24 rounded-sm! border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
						/>
					</div>
				</div>
			</div>

			{/* Section 4: Tabs */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className="flex items-center justify-between mb-4">
					<div className={`${SECTION_HEADER} mb-0`}>
						<Tag className="size-4" />
						Danh sách tab
						{tabs.length > 0 && (
							<span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
								{tabs.length}
							</span>
						)}
					</div>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={addTab}
						disabled={disabled}
					>
						<Plus className="size-3.5" /> Thêm tab
					</Button>
				</div>

				{tabs.length === 0 ? (
					<div className="border border-dashed border-gray-300 rounded-lg py-6 text-center text-sm text-gray-400">
						Chưa có tab nào
					</div>
				) : (
					<div className="space-y-2">
						{tabs.map((tab, idx) => (
							<div
								key={tab.localId}
								className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"
							>
								<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-600">
									{idx + 1}
								</div>
								<Input
									value={tab.name}
									onChange={(e) =>
										updateTab(tab.localId, { name: e.target.value })
									}
									placeholder="Tên tab"
									disabled={disabled}
									className="!h-8 flex-1"
								/>
								<Input
									value={tab.slug}
									onChange={(e) =>
										updateTab(tab.localId, { slug: e.target.value })
									}
									placeholder="slug"
									disabled={disabled}
									className="!h-8 flex-1 font-mono text-xs"
								/>
								<button
									type="button"
									onClick={() => removeTab(tab.localId)}
									disabled={disabled}
									className="text-red-500 hover:text-red-700"
									aria-label="Xóa tab"
								>
									<Trash2 className="size-4" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Section 5: Products */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className="flex items-center justify-between mb-4">
					<div className={`${SECTION_HEADER} mb-0`}>
						<Package className="size-4" />
						Danh sách sản phẩm
						{products.length > 0 && (
							<span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
								{products.length}
							</span>
						)}
					</div>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={() => setProductDrag((v) => !v)}
						disabled={disabled || products.length === 0}
					>
						<GripVertical className="size-3.5" />
						{productDrag ? "Hủy sắp xếp" : "Sắp xếp"}
					</Button>
				</div>

				<div className="mb-3">
					<EntitySearchSelect
						mode="product"
						placeholder="Tìm sản phẩm để thêm..."
						disabled={disabled}
						onSelect={handleAddProduct}
					/>
				</div>

				{products.length === 0 ? (
					<div className="border border-dashed border-gray-300 rounded-lg py-8 text-center">
						<Package className="mx-auto size-8 text-gray-300 mb-2" />
						<p className="text-sm text-gray-400">Chưa có sản phẩm nào</p>
					</div>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
								<tr>
									{productDrag && <th className="w-8" />}
									<th className="px-3 py-2 w-16">Ảnh</th>
									<th className="px-3 py-2">Tên sản phẩm</th>
									<th className="px-3 py-2 w-24">Trạng thái</th>
									<th className="px-3 py-2 w-16" />
								</tr>
							</thead>
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragProductsEnd}
							>
								<SortableContext
									items={products.map((p) => p.localId)}
									strategy={verticalListSortingStrategy}
								>
									<tbody>
										{products.map((p) => (
											<SortableRow
												key={p.localId}
												id={p.localId}
												dragEnabled={productDrag}
											>
												<td className="px-3 py-2">
													{p.thumbnailUrl ? (
														<img
															src={getImageUrl(p.thumbnailUrl)}
															alt=""
															className="size-10 object-contain"
														/>
													) : (
														<span className="text-gray-300">-</span>
													)}
												</td>
												<td className="px-3 py-2 font-medium">
													{p.name || "-"}
												</td>
												<td className="px-3 py-2">
													<input
														type="checkbox"
														checked={
															p.status === StatusCommonEnum.ACTIVE
														}
														onChange={(e) =>
															setProductsState((prev) =>
																prev.map((row) =>
																	row.localId === p.localId
																		? {
																				...row,
																				status: e.target.checked
																					? StatusCommonEnum.ACTIVE
																					: StatusCommonEnum.INACTIVE,
																			}
																		: row,
																),
															)
														}
														disabled={disabled}
														className="size-4 rounded border-gray-300"
													/>
												</td>
												<td className="px-3 py-2">
													<button
														type="button"
														onClick={() => removeProduct(p.localId)}
														disabled={disabled}
														className="text-red-500 hover:text-red-700"
														aria-label="Xóa"
													>
														<Trash2 className="size-4" />
													</button>
												</td>
											</SortableRow>
										))}
									</tbody>
								</SortableContext>
							</DndContext>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
