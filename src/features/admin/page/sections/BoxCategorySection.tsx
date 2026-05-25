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
	Pencil,
	Plus,
	SlidersHorizontal,
	Trash2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Button,
	Field,
	Input,
	UploadSingle,
} from "@/features/admin/ui";
import {
	type AdminPageSectionItem,
	StatusCommonEnum,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

// ─── Types ───────────────────────────────────────────────────────────

const PageSectionItemTypeEnum = {
	LINK: "link",
} as const;

export interface BoxCategoryExtra {
	subtitle?: string;
	cols?: 4 | 5 | 6;
	showTitle?: boolean;
}

interface CategoryRow {
	localId: string;
	name: string;
	imageUrl: string | null;
	targetUrl: string;
	position: number;
	status: StatusCommonEnum;
}

interface CategoryItemData {
	imageUrl?: string | null;
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

function parseInitialItems(
	values: AdminPageSectionItem[] | null,
): CategoryRow[] {
	if (!Array.isArray(values)) return [];
	return values.map((v, idx) => {
		const data = safeParseJson<CategoryItemData>(v?.data) ?? {};
		return {
			localId: String(v.id ?? makeKey()),
			name: v.name ?? "",
			imageUrl: data.imageUrl ?? null,
			targetUrl: v.targetUrl ?? "",
			position: v.position ?? idx,
			status: (v.status ?? StatusCommonEnum.ACTIVE) as StatusCommonEnum,
		};
	});
}

export function buildBoxCategoryPayload(items: CategoryRow[]) {
	return items.map((c, index) => ({
		type: PageSectionItemTypeEnum.LINK,
		name: c.name,
		targetUrl: c.targetUrl,
		position: index,
		status: c.status,
		data: JSON.stringify({ imageUrl: c.imageUrl ?? null }),
	}));
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

// ─── Modal ───────────────────────────────────────────────────────────

interface CategoryModalProps {
	open: boolean;
	disabled?: boolean;
	editing: CategoryRow | null;
	nextPosition: number;
	onClose: () => void;
	onSave: (row: CategoryRow) => void;
}

function CategoryModal({
	open,
	disabled,
	editing,
	nextPosition,
	onClose,
	onSave,
}: CategoryModalProps) {
	const [name, setName] = useState("");
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [targetUrl, setTargetUrl] = useState("");
	const [position, setPosition] = useState<number>(0);
	const [status, setStatus] = useState<StatusCommonEnum>(
		StatusCommonEnum.ACTIVE,
	);
	const [errors, setErrors] = useState<{ name?: string }>({});

	useEffect(() => {
		if (!open) return;
		setErrors({});
		if (editing) {
			setName(editing.name);
			setImageUrl(editing.imageUrl);
			setTargetUrl(editing.targetUrl);
			setPosition(editing.position);
			setStatus(editing.status);
		} else {
			setName("");
			setImageUrl(null);
			setTargetUrl("");
			setPosition(nextPosition);
			setStatus(StatusCommonEnum.ACTIVE);
		}
	}, [open, editing, nextPosition]);

	if (!open) return null;

	function handleSave() {
		const trimmedName = name.trim();
		if (!trimmedName) {
			setErrors({ name: "Tên không được trống" });
			return;
		}
		onSave({
			localId: editing?.localId ?? makeKey(),
			name: trimmedName,
			imageUrl,
			targetUrl: targetUrl.trim(),
			position,
			status,
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<h3 className="text-base font-semibold text-gray-900">
						{editing ? "Sửa mục" : "Thêm mục"}
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
						aria-label="Đóng"
					>
						<X className="size-5" />
					</button>
				</div>

				<div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field label="Tên" required error={errors.name}>
							<Input
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									if (errors.name) setErrors({});
								}}
								placeholder="Vd: Ắc quy Toplite"
								disabled={disabled}
							/>
						</Field>
						<Field label="Vị trí">
							<Input
								type="number"
								min={0}
								value={position}
								onChange={(e) => setPosition(Number(e.target.value) || 0)}
								disabled={disabled}
							/>
						</Field>
					</div>

					<Field
						label="URL đích"
						hint="Vd: /ac-quy-toplite hoặc full URL"
					>
						<Input
							value={targetUrl}
							onChange={(e) => setTargetUrl(e.target.value)}
							placeholder="/ac-quy-toplite"
							disabled={disabled}
							className="font-mono text-xs"
						/>
					</Field>

					<Field label="Ảnh">
						<UploadSingle
							value={imageUrl}
							onChange={(p) => setImageUrl(p)}
							disabled={disabled}
						/>
					</Field>

					<Field label="Trạng thái hiển thị">
						<label className="inline-flex items-center gap-2 cursor-pointer pt-1">
							<input
								type="checkbox"
								checked={status === StatusCommonEnum.ACTIVE}
								onChange={(e) =>
									setStatus(
										e.target.checked
											? StatusCommonEnum.ACTIVE
											: StatusCommonEnum.INACTIVE,
									)
								}
								disabled={disabled}
								className="size-4 rounded border-gray-300"
							/>
							<span className="text-sm text-gray-700">Hiển thị</span>
						</label>
					</Field>
				</div>

				<div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
					<Button
						type="button"
						variant="secondary"
						disabled={disabled}
						onClick={onClose}
					>
						Hủy
					</Button>
					<Button type="button" disabled={disabled} onClick={handleSave}>
						Lưu
					</Button>
				</div>
			</div>
		</div>
	);
}

// ─── Main component ──────────────────────────────────────────────────

interface BoxCategorySectionProps {
	defaultValues?: AdminPageSectionItem[] | null;
	defaultExtra?: BoxCategoryExtra | null;
	disabled?: boolean;
	onChange?: (state: { items: CategoryRow[]; extra: BoxCategoryExtra }) => void;
}

const SECTION_HEADER =
	"flex items-center gap-2 mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500";

export function BoxCategorySection({
	defaultValues = null,
	defaultExtra = null,
	disabled = false,
	onChange,
}: BoxCategorySectionProps) {
	const init = useMemo(() => parseInitialItems(defaultValues), [defaultValues]);

	const [items, setItemsState] = useState<CategoryRow[]>(init);
	const [showTitle, setShowTitle] = useState<boolean>(
		defaultExtra?.showTitle ?? true,
	);
	const [subtitle, setSubtitle] = useState<string>(defaultExtra?.subtitle ?? "");
	const [cols, setCols] = useState<4 | 5 | 6>(() => {
		const c = defaultExtra?.cols;
		return c === 4 || c === 6 ? c : 5;
	});
	const [drag, setDrag] = useState(false);
	const [modal, setModal] = useState<{
		open: boolean;
		editing: CategoryRow | null;
	}>({ open: false, editing: null });

	// Re-init khi default đổi
	const initSig = useRef("");
	useEffect(() => {
		const sig = JSON.stringify({ values: defaultValues, extra: defaultExtra });
		if (sig === initSig.current) return;
		initSig.current = sig;
		setItemsState(parseInitialItems(defaultValues));
		if (defaultExtra) {
			setShowTitle(defaultExtra.showTitle ?? true);
			setSubtitle(defaultExtra.subtitle ?? "");
			const c = defaultExtra.cols;
			setCols(c === 4 || c === 6 ? c : 5);
		}
	}, [defaultValues, defaultExtra]);

	// Notify parent
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	});
	useEffect(() => {
		onChangeRef.current?.({
			items,
			extra: { subtitle: subtitle.trim() || undefined, cols, showTitle },
		});
	}, [items, subtitle, cols, showTitle]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor),
	);

	const openCreate = useCallback(() => {
		setModal({ open: true, editing: null });
	}, []);

	const openEdit = useCallback((row: CategoryRow) => {
		setModal({ open: true, editing: row });
	}, []);

	const closeModal = useCallback(() => {
		setModal({ open: false, editing: null });
	}, []);

	const handleSave = useCallback(
		(row: CategoryRow) => {
			setItemsState((prev) => {
				const idx = prev.findIndex((it) => it.localId === row.localId);
				if (idx >= 0) {
					const next = prev.slice();
					next[idx] = row;
					return next;
				}
				return [...prev, row];
			});
			closeModal();
		},
		[closeModal],
	);

	const removeItem = useCallback((localId: string) => {
		setItemsState((prev) => prev.filter((it) => it.localId !== localId));
	}, []);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setItemsState((prev) => {
			const oldIdx = prev.findIndex((it) => it.localId === active.id);
			const newIdx = prev.findIndex((it) => it.localId === over.id);
			if (oldIdx < 0 || newIdx < 0) return prev;
			return arrayMove(prev, oldIdx, newIdx);
		});
	}

	return (
		<div className="space-y-5">
			{/* Section 1: Box info */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<LayoutGrid className="size-4" />
					Thông tin box danh mục
				</div>
				<div className="space-y-4">
					<Field label="Hiển thị tên box">
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
					</Field>
					<Field
						label="Mô tả phụ"
						hint="Tuỳ chọn — dòng mô tả nhỏ phía dưới tên box"
					>
						<Input
							value={subtitle}
							onChange={(e) => setSubtitle(e.target.value)}
							placeholder="Vd: Phân phối độc quyền các thương hiệu hàng đầu..."
							disabled={disabled}
						/>
					</Field>
				</div>
			</div>

			{/* Section 2: Display config */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<SlidersHorizontal className="size-4" />
					Cấu hình hiển thị
				</div>
				<div className="space-y-2">
					<div className="text-sm font-medium text-gray-700">Số cột</div>
					<div className="flex gap-1.5">
						{([4, 5, 6] as const).map((n) => (
							<Button
								key={n}
								type="button"
								variant={cols === n ? "primary" : "secondary"}
								size="sm"
								onClick={() => setCols(n)}
								disabled={disabled}
							>
								{n}
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Section 3: Items list */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className="flex items-center justify-between mb-4">
					<div className={`${SECTION_HEADER} mb-0`}>
						<LayoutGrid className="size-4" />
						Danh sách mục
						{items.length > 0 && (
							<span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
								{items.length}
							</span>
						)}
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={() => setDrag((v) => !v)}
							disabled={disabled || items.length === 0}
						>
							<GripVertical className="size-3.5" />
							{drag ? "Hủy sắp xếp" : "Sắp xếp"}
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={openCreate}
							disabled={disabled}
						>
							<Plus className="size-3.5" />
							Thêm mục
						</Button>
					</div>
				</div>

				{items.length === 0 ? (
					<div className="border border-dashed border-gray-300 rounded-lg py-8 text-center">
						<LayoutGrid className="mx-auto size-8 text-gray-300 mb-2" />
						<p className="text-sm text-gray-400">Chưa có mục nào</p>
					</div>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
								<tr>
									{drag && <th className="w-8" />}
									<th className="px-3 py-2 w-20">Ảnh</th>
									<th className="px-3 py-2">Tên</th>
									<th className="px-3 py-2">URL</th>
									<th className="px-3 py-2 w-24">Trạng thái</th>
									<th className="px-3 py-2 w-28" />
								</tr>
							</thead>
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={items.map((it) => it.localId)}
									strategy={verticalListSortingStrategy}
								>
									<tbody>
										{items.map((it) => (
											<SortableRow
												key={it.localId}
												id={it.localId}
												dragEnabled={drag}
											>
												<td className="px-3 py-2">
													{it.imageUrl ? (
														<img
															src={getImageUrl(it.imageUrl)}
															alt={it.name}
															className="size-12 rounded object-contain bg-gray-50"
														/>
													) : (
														<div className="flex size-12 items-center justify-center rounded bg-gray-50 text-gray-300">
															<LayoutGrid className="size-5" />
														</div>
													)}
												</td>
												<td className="px-3 py-2 font-medium">
													{it.name || (
														<span className="text-gray-300">—</span>
													)}
												</td>
												<td className="px-3 py-2">
													{it.targetUrl ? (
														<span className="font-mono text-xs text-gray-500">
															{it.targetUrl}
														</span>
													) : (
														<span className="text-gray-300">—</span>
													)}
												</td>
												<td className="px-3 py-2">
													<span
														className={
															it.status === StatusCommonEnum.ACTIVE
																? "inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
																: "inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
														}
													>
														{it.status === StatusCommonEnum.ACTIVE
															? "Hiển thị"
															: "Đã ẩn"}
													</span>
												</td>
												<td className="px-3 py-2">
													<div className="flex items-center gap-1">
														<button
															type="button"
															onClick={() => openEdit(it)}
															disabled={disabled}
															className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
															aria-label="Sửa"
														>
															<Pencil className="size-4" />
														</button>
														<button
															type="button"
															onClick={() => removeItem(it.localId)}
															disabled={disabled}
															className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
															aria-label="Xóa"
														>
															<Trash2 className="size-4" />
														</button>
													</div>
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

			<CategoryModal
				open={modal.open}
				disabled={disabled}
				editing={modal.editing}
				nextPosition={items.length}
				onClose={closeModal}
				onSave={handleSave}
			/>
		</div>
	);
}
