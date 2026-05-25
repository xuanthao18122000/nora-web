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
import { GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Button,
	Field,
	Input,
	Select,
	UploadSingle,
} from "@/features/admin/ui";
import {
	type AdminPageSectionItem,
	DeviceTypeEnum,
	StatusCommonEnum,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

// ─── Types ───────────────────────────────────────────────────────────

export interface BannerExtra {
	slidesPerView?: number;
	autoScroll?: boolean;
}

interface BannerRow {
	localId: string;
	title: string;
	url: string;
	image: string | null;
	deviceType: DeviceTypeEnum;
	startDate: string | null;
	endDate: string | null;
	position: number;
	backgroundColor: string;
	status: StatusCommonEnum;
}

interface BannerItemData {
	image?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	backgroundColor?: string | null;
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
): BannerRow[] {
	if (!Array.isArray(values)) return [];
	return values.map((v, idx) => {
		// data có thể là string path hoặc JSON string
		let image: string | null = null;
		let startDate: string | null = null;
		let endDate: string | null = null;
		let backgroundColor = "";
		if (typeof v.data === "string" && v.data.trim()) {
			const parsed = safeParseJson<BannerItemData>(v.data);
			if (parsed) {
				image = parsed.image ?? null;
				startDate = parsed.startDate ?? null;
				endDate = parsed.endDate ?? null;
				backgroundColor = parsed.backgroundColor ?? "";
			} else {
				image = v.data;
			}
		}
		return {
			localId: String(v.id ?? makeKey()),
			title: v.name ?? "",
			url: v.targetUrl ?? "",
			image,
			deviceType:
				v.deviceType === DeviceTypeEnum.MOBILE
					? DeviceTypeEnum.MOBILE
					: DeviceTypeEnum.DESKTOP,
			startDate,
			endDate,
			position: v.position ?? idx,
			backgroundColor,
			status: (v.status ?? StatusCommonEnum.ACTIVE) as StatusCommonEnum,
		};
	});
}

export function buildBannerPayload(items: BannerRow[]) {
	return items.map((r) => {
		const dataObj: Record<string, unknown> = {};
		if (r.image) dataObj.image = r.image;
		if (r.startDate) dataObj.startDate = r.startDate;
		if (r.endDate) dataObj.endDate = r.endDate;
		if (r.backgroundColor) dataObj.backgroundColor = r.backgroundColor;
		const hasJsonFields =
			r.startDate || r.endDate || r.backgroundColor;
		return {
			type: "banner",
			name: r.title || undefined,
			targetUrl: r.url || undefined,
			position: r.position,
			deviceType: r.deviceType,
			status: r.status,
			data: hasJsonFields
				? JSON.stringify(dataObj)
				: r.image ?? undefined,
		};
	});
}

// ─── Sortable row ────────────────────────────────────────────────────

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

// ─── Banner Modal ────────────────────────────────────────────────────

interface BannerModalProps {
	open: boolean;
	disabled?: boolean;
	editing: BannerRow | null;
	defaultDeviceType: DeviceTypeEnum;
	nextPosition: number;
	onClose: () => void;
	onSave: (row: BannerRow) => void;
}

function BannerModal({
	open,
	disabled,
	editing,
	defaultDeviceType,
	nextPosition,
	onClose,
	onSave,
}: BannerModalProps) {
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [deviceType, setDeviceType] =
		useState<DeviceTypeEnum>(defaultDeviceType);
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [position, setPosition] = useState<number>(0);
	const [backgroundColor, setBackgroundColor] = useState("");
	const [status, setStatus] = useState<StatusCommonEnum>(
		StatusCommonEnum.ACTIVE,
	);

	useEffect(() => {
		if (!open) return;
		if (editing) {
			setTitle(editing.title);
			setUrl(editing.url);
			setImage(editing.image);
			setDeviceType(editing.deviceType);
			setStartDate(editing.startDate ?? "");
			setEndDate(editing.endDate ?? "");
			setPosition(editing.position);
			setBackgroundColor(editing.backgroundColor);
			setStatus(editing.status);
		} else {
			setTitle("");
			setUrl("");
			setImage(null);
			setDeviceType(defaultDeviceType);
			setStartDate("");
			setEndDate("");
			setPosition(nextPosition);
			setBackgroundColor("");
			setStatus(StatusCommonEnum.ACTIVE);
		}
	}, [open, editing, defaultDeviceType, nextPosition]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<h3 className="text-base font-semibold text-gray-900">
						{editing ? "Sửa banner" : "Thêm banner"}
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Field label="Tiêu đề (alt)">
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Nhập tiêu đề"
								disabled={disabled}
							/>
						</Field>
						<Field label="Vị trí">
							<Input
								type="number"
								value={position}
								onChange={(e) =>
									setPosition(Number(e.target.value) || 0)
								}
								disabled={disabled}
							/>
						</Field>
						<Field label="Thời gian bắt đầu">
							<Input
								type="datetime-local"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								disabled={disabled}
							/>
						</Field>
						<Field label="Thời gian kết thúc">
							<Input
								type="datetime-local"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								disabled={disabled}
							/>
						</Field>
						<Field label="Thiết bị">
							<Select
								value={deviceType}
								onChange={(e) =>
									setDeviceType(e.target.value as DeviceTypeEnum)
								}
								disabled={disabled}
							>
								<option value={DeviceTypeEnum.DESKTOP}>Desktop</option>
								<option value={DeviceTypeEnum.MOBILE}>Mobile</option>
							</Select>
						</Field>
						<Field label="URL">
							<Input
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								placeholder="/danh-muc-abc"
								disabled={disabled}
							/>
						</Field>
						<Field label="Background">
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={backgroundColor || "#000000"}
									onChange={(e) =>
										setBackgroundColor(e.target.value)
									}
									disabled={disabled}
									className="h-9 w-16 cursor-pointer rounded border border-gray-300"
								/>
								<Input
									value={backgroundColor}
									onChange={(e) =>
										setBackgroundColor(e.target.value)
									}
									placeholder="#000000"
									disabled={disabled}
									className="flex-1"
								/>
							</div>
						</Field>
						<Field label="Trạng thái hiển thị">
							<label className="inline-flex items-center gap-2 cursor-pointer pt-2">
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

					<Field label="Ảnh banner">
						<UploadSingle
							value={image}
							onChange={(p) => setImage(p)}
							disabled={disabled}
						/>
					</Field>

					{image && (
						<div className="space-y-1.5">
							<div className="text-sm font-medium text-gray-700">
								Preview
							</div>
							<div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-3">
								<div
									className="relative w-full"
									style={{ aspectRatio: "16/9" }}
								>
									<img
										src={getImageUrl(image)}
										alt={title}
										className="absolute inset-0 h-full w-full object-contain rounded"
									/>
								</div>
							</div>
						</div>
					)}
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
					<Button
						type="button"
						disabled={disabled}
						onClick={() =>
							onSave({
								localId: editing?.localId ?? makeKey(),
								title: title.trim(),
								url: url.trim(),
								image,
								deviceType,
								startDate: startDate || null,
								endDate: endDate || null,
								position,
								backgroundColor: backgroundColor.trim(),
								status,
							})
						}
					>
						Lưu
					</Button>
				</div>
			</div>
		</div>
	);
}

// ─── Main component ──────────────────────────────────────────────────

interface BannerSectionProps {
	defaultValues?: AdminPageSectionItem[] | null;
	defaultExtra?: BannerExtra | null;
	disabled?: boolean;
	onChange?: (state: { items: BannerRow[]; extra: BannerExtra }) => void;
}

export function BannerSection({
	defaultValues = null,
	defaultExtra = null,
	disabled = false,
	onChange,
}: BannerSectionProps) {
	const [items, setItemsState] = useState<BannerRow[]>(() =>
		parseInitialItems(defaultValues),
	);
	const [slidesPerView, setSlidesPerView] = useState<number>(
		defaultExtra?.slidesPerView ?? 1,
	);
	const [autoScroll, setAutoScroll] = useState<boolean>(
		defaultExtra?.autoScroll ?? true,
	);
	const [activeTab, setActiveTab] = useState<DeviceTypeEnum>(
		DeviceTypeEnum.DESKTOP,
	);
	const [drag, setDrag] = useState(false);
	const [modal, setModal] = useState<{
		open: boolean;
		editing: BannerRow | null;
	}>({ open: false, editing: null });

	// Sync khi default đổi
	const initSig = useRef("");
	useEffect(() => {
		const sig = JSON.stringify({ values: defaultValues, extra: defaultExtra });
		if (sig === initSig.current) return;
		initSig.current = sig;
		setItemsState(parseInitialItems(defaultValues));
		if (defaultExtra) {
			setSlidesPerView(defaultExtra.slidesPerView ?? 1);
			setAutoScroll(defaultExtra.autoScroll ?? true);
		}
	}, [defaultValues, defaultExtra]);

	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	});
	useEffect(() => {
		onChangeRef.current?.({
			items,
			extra: { slidesPerView, autoScroll },
		});
	}, [items, slidesPerView, autoScroll]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor),
	);

	const filteredItems = useMemo(
		() => items.filter((it) => it.deviceType === activeTab),
		[items, activeTab],
	);

	const nextPosition = useMemo(() => {
		const tabItems = items.filter((it) => it.deviceType === activeTab);
		if (tabItems.length === 0) return 0;
		return Math.max(...tabItems.map((it) => it.position)) + 1;
	}, [items, activeTab]);

	const openAdd = useCallback(() => {
		setModal({ open: true, editing: null });
	}, []);

	const openEdit = useCallback((row: BannerRow) => {
		setModal({ open: true, editing: row });
	}, []);

	const closeModal = useCallback(() => {
		setModal({ open: false, editing: null });
	}, []);

	const saveBanner = useCallback(
		(row: BannerRow) => {
			setItemsState((prev) => {
				const exists = prev.some((p) => p.localId === row.localId);
				if (exists) {
					return prev.map((p) =>
						p.localId === row.localId ? row : p,
					);
				}
				return [...prev, row];
			});
			closeModal();
		},
		[closeModal],
	);

	const removeBanner = useCallback((localId: string) => {
		setItemsState((prev) => prev.filter((p) => p.localId !== localId));
	}, []);

	const toggleStatus = useCallback((localId: string) => {
		setItemsState((prev) =>
			prev.map((p) =>
				p.localId === localId
					? {
							...p,
							status:
								p.status === StatusCommonEnum.ACTIVE
									? StatusCommonEnum.INACTIVE
									: StatusCommonEnum.ACTIVE,
						}
					: p,
			),
		);
	}, []);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setItemsState((prev) => {
			// Reorder chỉ trong tab đang active
			const tabItems = prev.filter((p) => p.deviceType === activeTab);
			const otherItems = prev.filter((p) => p.deviceType !== activeTab);
			const oldIdx = tabItems.findIndex((p) => p.localId === active.id);
			const newIdx = tabItems.findIndex((p) => p.localId === over.id);
			if (oldIdx < 0 || newIdx < 0) return prev;
			const reordered = arrayMove(tabItems, oldIdx, newIdx).map(
				(p, idx) => ({
					...p,
					position: idx,
				}),
			);
			return [...reordered, ...otherItems];
		});
	}

	return (
		<div className="space-y-5">
			{/* Section config: slidesPerView + autoScroll */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Field label="Số ảnh trên 1 trang">
					<Input
						type="number"
						min={1}
						max={10}
						value={slidesPerView}
						onChange={(e) =>
							setSlidesPerView(
								Math.max(1, Number(e.target.value) || 1),
							)
						}
						disabled={disabled}
					/>
				</Field>
				<Field label="Tự động cuộn">
					<label className="inline-flex items-center gap-2 cursor-pointer pt-2">
						<input
							type="checkbox"
							checked={autoScroll}
							onChange={(e) => setAutoScroll(e.target.checked)}
							disabled={disabled}
							className="size-4 rounded border-gray-300"
						/>
						<span className="text-sm text-gray-700">Bật</span>
					</label>
				</Field>
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<div className="text-sm font-medium text-gray-700">
					Danh sách banner ({filteredItems.length})
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						disabled={disabled || filteredItems.length === 0}
						onClick={() => setDrag((v) => !v)}
					>
						<GripVertical className="size-3.5" />
						{drag ? "Hủy sắp xếp" : "Sắp xếp"}
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={disabled}
						onClick={openAdd}
					>
						<Plus className="size-3.5" /> Thêm banner
					</Button>
				</div>
			</div>

			{/* Tabs Desktop / Mobile */}
			<div className="border-b border-gray-200">
				<div className="flex gap-1">
					{[
						{ value: DeviceTypeEnum.DESKTOP, label: "Desktop" },
						{ value: DeviceTypeEnum.MOBILE, label: "Mobile" },
					].map((tab) => (
						<button
							key={tab.value}
							type="button"
							onClick={() => setActiveTab(tab.value)}
							className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								activeTab === tab.value
									? "border-primary-600 text-primary-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.label} (
							{
								items.filter((it) => it.deviceType === tab.value)
									.length
							}
							)
						</button>
					))}
				</div>
			</div>

			{/* Banner table */}
			{filteredItems.length === 0 ? (
				<div className="border border-dashed border-gray-300 rounded-lg py-10 text-center text-sm text-gray-400">
					Chưa có banner nào cho{" "}
					{activeTab === DeviceTypeEnum.DESKTOP ? "Desktop" : "Mobile"}
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
							<tr>
								{drag && <th className="w-8" />}
								<th className="px-3 py-2">Tiêu đề</th>
								<th className="px-3 py-2 w-32">Ảnh</th>
								<th className="px-3 py-2">URL</th>
								<th className="px-3 py-2 w-24">Trạng thái</th>
								<th className="px-3 py-2 w-24" />
							</tr>
						</thead>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={filteredItems.map((p) => p.localId)}
								strategy={verticalListSortingStrategy}
							>
								<tbody>
									{filteredItems.map((row) => (
										<SortableRow
											key={row.localId}
											id={row.localId}
											dragEnabled={drag}
										>
											<td className="px-3 py-2 font-medium">
												{row.title || "-"}
											</td>
											<td className="px-3 py-2">
												{row.image ? (
													<img
														src={getImageUrl(row.image)}
														alt=""
														className="h-12 w-20 object-cover rounded border border-gray-200"
													/>
												) : (
													<span className="text-gray-300">-</span>
												)}
											</td>
											<td className="px-3 py-2 text-gray-500">
												<span className="block max-w-[260px] truncate">
													{row.url || "-"}
												</span>
											</td>
											<td className="px-3 py-2">
												<input
													type="checkbox"
													checked={
														row.status ===
														StatusCommonEnum.ACTIVE
													}
													onChange={() =>
														toggleStatus(row.localId)
													}
													disabled={disabled}
													className="size-4 rounded border-gray-300"
												/>
											</td>
											<td className="px-3 py-2">
												<div className="flex items-center justify-end gap-1">
													<button
														type="button"
														onClick={() => openEdit(row)}
														disabled={disabled}
														className="text-blue-600 hover:text-blue-800"
														aria-label="Sửa"
													>
														<Pencil className="size-4" />
													</button>
													<button
														type="button"
														onClick={() =>
															removeBanner(row.localId)
														}
														disabled={disabled}
														className="text-red-500 hover:text-red-700"
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

			<BannerModal
				open={modal.open}
				disabled={disabled}
				editing={modal.editing}
				defaultDeviceType={activeTab}
				nextPosition={nextPosition}
				onClose={closeModal}
				onSave={saveBanner}
			/>
		</div>
	);
}
