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
	Pencil,
	Plus,
	Settings,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
import {
	EntitySearchSelect,
	type EntitySearchPayload,
} from "./EntitySearchSelect";

// ─── Types ────────────────────────────────────────────────────────────

interface SubItem {
	id: string;
	name: string;
	/** Prefix hiển thị ở FE. Optional — nếu có, render `title: name`. */
	title?: string | null;
	url?: string | null;
	icon?: string | null;
	status: StatusCommonEnum;
	/** Chỉ dùng cho group "featuredProducts" */
	price?: number | null;
	listedPrice?: number | null;
}

interface SubSection {
	key: string;
	title: string;
	items: SubItem[];
}

interface MenuItemData {
	icon?: string | null;
	children?: SubSection[];
}

interface MenuItemRow {
	id: string;
	name: string;
	url?: string | null;
	icon?: string | null;
	status: StatusCommonEnum;
	children: SubSection[];
}

const DEFAULT_CHILDREN: SubSection[] = [
	{ key: "brands", title: "Thương hiệu", items: [] },
	{ key: "hotProducts", title: "Dòng sản phẩm HOT", items: [] },
	{ key: "featuredProducts", title: "Sản phẩm nổi bật", items: [] },
];

// ─── Helpers parse / build payload ────────────────────────────────────

function safeParseJson<T>(s: string | undefined | null): T | null {
	if (!s) return null;
	try {
		return JSON.parse(s) as T;
	} catch {
		return null;
	}
}

function parseMenuItems(values: AdminPageSectionItem[] | null): MenuItemRow[] {
	if (!Array.isArray(values)) return [];
	return values.map((v) => {
		const data = safeParseJson<MenuItemData>(v?.data) ?? {};
		const url = v?.targetUrl ?? null;
		const children =
			Array.isArray(data?.children) && data.children.length > 0
				? data.children.map((child) => ({
						key: String(child.key || crypto.randomUUID()),
						title: String(child.title || ""),
						items: Array.isArray(child.items)
							? child.items.map((item) => ({
									id: String(item.id || crypto.randomUUID()),
									name: String(item.name || ""),
									title:
										typeof (item as SubItem).title === "string"
											? (item as SubItem).title
											: null,
									url: item.url ?? null,
									icon: item.icon ?? null,
									status:
										(item.status ??
											StatusCommonEnum.ACTIVE) as StatusCommonEnum,
									price:
										typeof (item as SubItem).price === "number"
											? (item as SubItem).price
											: null,
									listedPrice:
										typeof (item as SubItem).listedPrice ===
										"number"
											? (item as SubItem).listedPrice
											: null,
								}))
							: [],
					}))
				: DEFAULT_CHILDREN.map((s) => ({ ...s, items: [] }));

		return {
			id: String(v?.id || crypto.randomUUID()),
			name: String(v?.name || ""),
			url,
			icon: data?.icon ?? null,
			status: (v?.status ?? StatusCommonEnum.ACTIVE) as StatusCommonEnum,
			children,
		};
	});
}

export function buildMenuPayload(rows: MenuItemRow[]) {
	return rows.map((r, index) => {
		const data: MenuItemData = {};
		if (r.icon) data.icon = r.icon;
		data.children = r.children.map((section) => ({
			key: section.key,
			title: section.title,
			items: section.items.map((item) => ({
				id: item.id,
				name: item.name,
				...(item.title ? { title: item.title } : {}),
				url: item.url,
				icon: item.icon,
				status: item.status,
				...(item.price != null ? { price: item.price } : {}),
				...(item.listedPrice != null
					? { listedPrice: item.listedPrice }
					: {}),
			})),
		}));
		return {
			name: r.name,
			position: index,
			data: JSON.stringify(data),
			status: r.status,
			targetUrl: r.url || undefined,
			type: "link",
		};
	});
}

// ─── Sortable row primitives ──────────────────────────────────────────

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
		<tr ref={setNodeRef} style={style} className="border-b border-gray-100 last:border-0">
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

// ─── Item modal (add/edit main + sub) ─────────────────────────────────

interface ItemModalProps {
	open: boolean;
	title: string;
	disabled?: boolean;
	defaultName: string;
	defaultUrl: string;
	defaultIcon: string;
	defaultStatus: StatusCommonEnum;
	/** Bật khi modal dùng cho sub-item (footer) — hiện thêm input "Title" prefix */
	showTitleField?: boolean;
	defaultTitle?: string;
	onClose: () => void;
	onSave: (data: {
		name: string;
		title: string;
		url: string;
		icon: string;
		status: StatusCommonEnum;
	}) => void;
	onSaveAndContinue?: (data: {
		name: string;
		title: string;
		url: string;
		icon: string;
		status: StatusCommonEnum;
	}) => void;
}

function ItemModal({
	open,
	title,
	disabled,
	defaultName,
	defaultUrl,
	defaultIcon,
	defaultStatus,
	showTitleField = false,
	defaultTitle = "",
	onClose,
	onSave,
	onSaveAndContinue,
}: ItemModalProps) {
	const [name, setName] = useState(defaultName);
	const [titleValue, setTitleValue] = useState(defaultTitle);
	const [url, setUrl] = useState(defaultUrl);
	const [icon, setIcon] = useState(defaultIcon);
	const [status, setStatus] = useState<StatusCommonEnum>(defaultStatus);

	useEffect(() => {
		if (open) {
			setName(defaultName);
			setTitleValue(defaultTitle);
			setUrl(defaultUrl);
			setIcon(defaultIcon);
			setStatus(defaultStatus);
		}
	}, [
		open,
		defaultName,
		defaultTitle,
		defaultUrl,
		defaultIcon,
		defaultStatus,
	]);

	const buildPayload = () => ({
		name: name.trim(),
		title: titleValue.trim(),
		url: url.trim(),
		icon: icon.trim(),
		status,
	});

	const resetDraft = () => {
		setName("");
		setTitleValue("");
		setUrl("");
		setIcon("");
		setStatus(StatusCommonEnum.ACTIVE);
	};

	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<X className="size-5" />
					</button>
				</div>
				<div className="space-y-3">
					{showTitleField && (
						<Field
							label="Title"
							hint="Prefix hiển thị. Không bấm vào title được, chỉ name mới link."
						>
							<Input
								value={titleValue}
								onChange={(e) => setTitleValue(e.target.value)}
								disabled={disabled}
								placeholder="Title"
							/>
						</Field>
					)}
					<Field label="Tên" required>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={disabled}
							placeholder="Nhập tên"
						/>
					</Field>
					<Field label="URL">
						<Input
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							disabled={disabled}
							placeholder="/danh-muc-abc"
						/>
					</Field>
					<Field label="Icon" hint="Tải ảnh lên (PNG / SVG)">
						<UploadSingle
							value={icon || null}
							onChange={(p) => setIcon(p ?? "")}
							disabled={disabled}
						/>
					</Field>
					<Field label="Trạng thái">
						<label className="inline-flex cursor-pointer items-center gap-2">
							<input
								type="checkbox"
								disabled={disabled}
								checked={status === StatusCommonEnum.ACTIVE}
								onChange={(e) =>
									setStatus(
										e.target.checked
											? StatusCommonEnum.ACTIVE
											: StatusCommonEnum.INACTIVE,
									)
								}
								className="size-4 rounded border-gray-300"
							/>
							<span className="text-sm text-gray-700">
								Hiển thị
							</span>
						</label>
					</Field>
				</div>
				<div className="mt-5 flex justify-end gap-2">
					<Button variant="secondary" type="button" onClick={onClose}>
						Hủy
					</Button>
					{onSaveAndContinue && (
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								onSaveAndContinue(buildPayload());
								resetDraft();
							}}
							disabled={disabled || !name.trim()}
						>
							<Plus className="size-4" />
							Lưu & Tạo tiếp
						</Button>
					)}
					<Button
						type="button"
						onClick={() => onSave(buildPayload())}
						disabled={disabled || !name.trim()}
					>
						Lưu
					</Button>
				</div>
			</div>
		</div>
	);
}

// ─── Main component ───────────────────────────────────────────────────

interface LayoutMenuProps {
	defaultValues?: AdminPageSectionItem[] | null;
	disabled?: boolean;
	onChange?: (rows: MenuItemRow[]) => void;
	onSaveItems?: () => void | Promise<void>;
}

export interface LayoutMenuRef {
	getRows: () => MenuItemRow[];
}

export function LayoutMenu({
	defaultValues = null,
	disabled = false,
	onChange,
	onSaveItems,
}: LayoutMenuProps) {
	const [rows, setRowsState] = useState<MenuItemRow[]>(() =>
		parseMenuItems(defaultValues),
	);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [dragMain, setDragMain] = useState(false);
	const [subDrag, setSubDrag] = useState<Record<string, boolean>>({});

	// Modals
	const [mainModal, setMainModal] = useState<{
		open: boolean;
		editingId: string | null;
	}>({ open: false, editingId: null });
	const [subModal, setSubModal] = useState<{
		open: boolean;
		sectionKey: string | null;
		editingId: string | null;
	}>({ open: false, sectionKey: null, editingId: null });
	const [featuredModalRowId, setFeaturedModalRowId] = useState<string | null>(
		null,
	);
	const [productTab, setProductTab] = useState<"related" | "featured">(
		"related",
	);

	const RELATED_KEY = "brands";
	const FEATURED_KEY = "featuredProducts";
	const FEATURED_LIMIT = 5;
	const RELATED_LIMIT = 20;

	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Init from defaultValues khi nó thực sự đổi (tránh re-init từ render cha).
	// Cần gọi onChange ngay sau init để parent ref sync với rows hiện tại —
	// nếu không, parent gửi `items: []` lúc submit dù DB có data.
	const initSig = useRef("");
	useEffect(() => {
		const sig = JSON.stringify(defaultValues ?? []);
		if (sig !== initSig.current) {
			initSig.current = sig;
			const parsed = parseMenuItems(defaultValues);
			setRowsState(parsed);
			onChangeRef.current?.(parsed);
		}
	}, [defaultValues]);

	const setRows = useCallback((updater: (prev: MenuItemRow[]) => MenuItemRow[]) => {
		setRowsState((prev) => {
			const next = updater(prev);
			onChangeRef.current?.(next);
			return next;
		});
	}, []);

	const selectedItem = useMemo(
		() => rows.find((r) => r.id === selectedItemId) ?? null,
		[rows, selectedItemId],
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor),
	);

	// ─── Main item ops ────────────────────────────────────────────────
	const openAddItem = useCallback(() => {
		setMainModal({ open: true, editingId: null });
	}, []);
	const openEditItem = useCallback((id: string) => {
		setMainModal({ open: true, editingId: id });
	}, []);
	const closeMain = useCallback(() => {
		setMainModal({ open: false, editingId: null });
	}, []);
	const saveMain = useCallback(
		(data: {
			name: string;
			title: string;
			url: string;
			icon: string;
			status: StatusCommonEnum;
		}) => {
			setRows((prev) => {
				if (mainModal.editingId) {
					return prev.map((r) =>
						r.id === mainModal.editingId
							? {
									...r,
									name: data.name,
									url: data.url || null,
									icon: data.icon || null,
									status: data.status,
								}
							: r,
					);
				}
				const newRow: MenuItemRow = {
					id: crypto.randomUUID(),
					name: data.name,
					url: data.url || null,
					icon: data.icon || null,
					status: data.status,
					children: DEFAULT_CHILDREN.map((s) => ({ ...s, items: [] })),
				};
				return [...prev, newRow];
			});
			closeMain();
		},
		[mainModal.editingId, setRows, closeMain],
	);
	const deleteItem = useCallback(
		(id: string) => {
			setRows((prev) => prev.filter((r) => r.id !== id));
			if (selectedItemId === id) setSelectedItemId(null);
		},
		[setRows, selectedItemId],
	);

	const editingMain = useMemo(
		() => (mainModal.editingId ? rows.find((r) => r.id === mainModal.editingId) : null),
		[mainModal.editingId, rows],
	);

	function handleDragMainEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setRows((prev) => {
			const oldIdx = prev.findIndex((r) => r.id === active.id);
			const newIdx = prev.findIndex((r) => r.id === over.id);
			if (oldIdx < 0 || newIdx < 0) return prev;
			return arrayMove(prev, oldIdx, newIdx);
		});
	}

	// ─── Sub-section ops ──────────────────────────────────────────────
	const updateSelectedChildren = useCallback(
		(updater: (children: SubSection[]) => SubSection[]) => {
			if (!selectedItemId) return;
			setRows((prev) =>
				prev.map((r) =>
					r.id === selectedItemId
						? { ...r, children: updater(r.children) }
						: r,
				),
			);
		},
		[setRows, selectedItemId],
	);

	// ─── Sub-item ops ─────────────────────────────────────────────────
	const openAddSub = useCallback((sectionKey: string) => {
		setSubModal({ open: true, sectionKey, editingId: null });
	}, []);
	const openEditSub = useCallback((sectionKey: string, itemId: string) => {
		setSubModal({ open: true, sectionKey, editingId: itemId });
	}, []);
	const closeSub = useCallback(() => {
		setSubModal({ open: false, sectionKey: null, editingId: null });
	}, []);

	const editingSub = useMemo(() => {
		if (!subModal.editingId || !subModal.sectionKey || !selectedItem)
			return null;
		const sec = selectedItem.children.find((s) => s.key === subModal.sectionKey);
		return sec?.items.find((i) => i.id === subModal.editingId) ?? null;
	}, [subModal, selectedItem]);

	const appendSub = useCallback(
		(
			sectionKey: string,
			data: {
				name: string;
				title: string;
				url: string;
				icon: string;
				status: StatusCommonEnum;
			},
		) => {
			updateSelectedChildren((children) =>
				children.map((sec) =>
					sec.key === sectionKey
						? {
								...sec,
								items: [
									...sec.items,
									{
										id: crypto.randomUUID(),
										name: data.name,
										title: data.title || null,
										url: data.url || null,
										icon: data.icon || null,
										status: data.status,
									},
								],
							}
						: sec,
				),
			);
		},
		[updateSelectedChildren],
	);

	const saveSub = useCallback(
		(data: {
			name: string;
			title: string;
			url: string;
			icon: string;
			status: StatusCommonEnum;
		}) => {
			const { sectionKey, editingId } = subModal;
			if (!sectionKey) return;
			if (editingId) {
				updateSelectedChildren((children) =>
					children.map((sec) =>
						sec.key === sectionKey
							? {
									...sec,
									items: sec.items.map((it) =>
										it.id === editingId
											? {
													...it,
													name: data.name,
													title: data.title || null,
													url: data.url || null,
													icon: data.icon || null,
													status: data.status,
												}
											: it,
									),
								}
							: sec,
					),
				);
			} else {
				appendSub(sectionKey, data);
			}
			closeSub();
		},
		[subModal, updateSelectedChildren, appendSub, closeSub],
	);

	const saveSubAndContinue = useCallback(
		(data: {
			name: string;
			title: string;
			url: string;
			icon: string;
			status: StatusCommonEnum;
		}) => {
			const { sectionKey } = subModal;
			if (!sectionKey) return;
			appendSub(sectionKey, data);
			// Keep modal open: do not call closeSub()
		},
		[subModal, appendSub],
	);

	const deleteSubItem = useCallback(
		(sectionKey: string, itemId: string) => {
			updateSelectedChildren((children) =>
				children.map((sec) =>
					sec.key === sectionKey
						? { ...sec, items: sec.items.filter((i) => i.id !== itemId) }
						: sec,
				),
			);
		},
		[updateSelectedChildren],
	);

	function handleDragSubEnd(sectionKey: string, event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		updateSelectedChildren((children) =>
			children.map((sec) => {
				if (sec.key !== sectionKey) return sec;
				const oldIdx = sec.items.findIndex((i) => i.id === active.id);
				const newIdx = sec.items.findIndex((i) => i.id === over.id);
				if (oldIdx < 0 || newIdx < 0) return sec;
				return { ...sec, items: arrayMove(sec.items, oldIdx, newIdx) };
			}),
		);
	}

	// ─── Sub-config modal: flatten về 1 group đơn giản ────────────────
	// Auto-create group "links" nếu rỗng để user có chỗ add ngay.
	useEffect(() => {
		if (!selectedItemId) return;
		const item = rows.find((r) => r.id === selectedItemId);
		if (!item || item.children.length > 0) return;
		setRows((prev) =>
			prev.map((r) =>
				r.id === selectedItemId
					? {
							...r,
							children: [{ key: "links", title: "Mục", items: [] }],
						}
					: r,
			),
		);
	}, [selectedItemId, rows, setRows]);

	const flatSection = selectedItem?.children[0] ?? null;
	const flatSectionKey = flatSection?.key ?? null;
	const flatItems = flatSection?.items ?? [];

	// ─── Products config modal (2 tabs: Sản phẩm liên quan / Nổi bật) ─
	const productRow = useMemo(
		() => rows.find((r) => r.id === featuredModalRowId) ?? null,
		[rows, featuredModalRowId],
	);

	const updateRowChildren = useCallback(
		(rowId: string, updater: (children: SubSection[]) => SubSection[]) => {
			setRows((prev) =>
				prev.map((r) =>
					r.id === rowId ? { ...r, children: updater(r.children) } : r,
				),
			);
		},
		[setRows],
	);

	const upsertSection = useCallback(
		(rowId: string, key: string, title: string, items: SubItem[]) => {
			updateRowChildren(rowId, (children) => {
				const idx = children.findIndex((c) => c.key === key);
				if (idx >= 0) {
					return children.map((c, i) => (i === idx ? { ...c, items } : c));
				}
				return [...children, { key, title, items }];
			});
		},
		[updateRowChildren],
	);

	const tabConfig = useMemo(() => {
		if (productTab === "featured") {
			return {
				key: FEATURED_KEY,
				title: "Sản phẩm nổi bật",
				limit: FEATURED_LIMIT,
				placeholder: "Tìm sản phẩm để thêm...",
			};
		}
		return {
			key: RELATED_KEY,
			title: "Sản phẩm liên quan",
			limit: RELATED_LIMIT,
			placeholder: "Tìm sản phẩm để thêm...",
		};
	}, [productTab]);

	const tabItems = useMemo(() => {
		if (!productRow) return [];
		const sec = productRow.children.find((s) => s.key === tabConfig.key);
		return sec?.items ?? [];
	}, [productRow, tabConfig.key]);

	const handleAddProduct = useCallback(
		(payload: EntitySearchPayload) => {
			if (payload.type !== "product" || !featuredModalRowId) return;
			if (tabItems.length >= tabConfig.limit) return;
			if (tabItems.some((it) => it.id === String(payload.id))) return;
			const next: SubItem[] = [
				...tabItems,
				{
					id: String(payload.id),
					name: payload.name,
					url: payload.slug
						? `/${payload.slug.replace(/\.html$/, "")}`
						: null,
					icon: payload.thumbnailUrl ?? null,
					status: StatusCommonEnum.ACTIVE,
					price: payload.price ?? null,
					listedPrice: payload.listedPrice ?? null,
				},
			];
			upsertSection(featuredModalRowId, tabConfig.key, tabConfig.title, next);
		},
		[featuredModalRowId, tabItems, tabConfig, upsertSection],
	);

	const handleRemoveProduct = useCallback(
		(itemId: string) => {
			if (!featuredModalRowId) return;
			upsertSection(
				featuredModalRowId,
				tabConfig.key,
				tabConfig.title,
				tabItems.filter((it) => it.id !== itemId),
			);
		},
		[featuredModalRowId, tabConfig, tabItems, upsertSection],
	);

	const featuredModal = productRow ? (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
			role="dialog"
			aria-modal="true"
			onClick={() => setFeaturedModalRowId(null)}
		>
			<div
				className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<div>
						<h3 className="text-base font-semibold text-gray-900">
							Cấu hình sản phẩm cho menu
						</h3>
						<p className="mt-0.5 text-xs text-gray-500">
							Menu: <b>{productRow.name}</b>
						</p>
					</div>
					<button
						type="button"
						onClick={() => setFeaturedModalRowId(null)}
						aria-label="Đóng"
						className="text-gray-400 hover:text-gray-600"
					>
						<X className="size-5" />
					</button>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-gray-200 px-5">
					<button
						type="button"
						onClick={() => setProductTab("related")}
						className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
							productTab === "related"
								? "border-primary-500 text-primary-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
					>
						Sản phẩm liên quan
					</button>
					<button
						type="button"
						onClick={() => setProductTab("featured")}
						className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
							productTab === "featured"
								? "border-primary-500 text-primary-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
					>
						Sản phẩm nổi bật
					</button>
				</div>

				<div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700">
							Tìm sản phẩm
						</label>
						<EntitySearchSelect
							mode="product"
							placeholder={
								tabItems.length >= tabConfig.limit
									? `Đã đủ ${tabConfig.limit} sản phẩm — xoá bớt để thêm`
									: tabConfig.placeholder
							}
							disabled={disabled || tabItems.length >= tabConfig.limit}
							onSelect={handleAddProduct}
						/>
					</div>

					<div>
						<div className="mb-2 flex items-center justify-between">
							<div className="text-sm font-medium text-gray-700">
								Đã chọn
							</div>
							<span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
								{tabItems.length}/{tabConfig.limit}
							</span>
						</div>
						{tabItems.length === 0 ? (
							<div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
								Chưa chọn sản phẩm nào
							</div>
						) : (
							<ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
								{tabItems.map((it) => (
									<li
										key={it.id}
										className="flex items-center gap-3 px-3 py-2"
									>
										{it.icon ? (
											<img
												src={getImageUrl(it.icon)}
												alt=""
												className="size-12 shrink-0 rounded-md object-cover bg-gray-100"
											/>
										) : (
											<div className="size-12 shrink-0 rounded-md bg-gray-100" />
										)}
										<div className="min-w-0 flex-1">
											<div className="truncate text-sm font-medium text-gray-900">
												{it.name}
											</div>
											<div className="truncate text-xs text-gray-500">
												{it.url || "—"}
											</div>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveProduct(it.id)}
											disabled={disabled}
											className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
											aria-label="Xoá"
										>
											<Trash2 className="size-4" />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
					<Button
						type="button"
						variant="secondary"
						disabled={disabled}
						onClick={() => setFeaturedModalRowId(null)}
					>
						Đóng
					</Button>
					<Button
						type="button"
						disabled={disabled}
						onClick={async () => {
							if (onSaveItems) await onSaveItems();
							setFeaturedModalRowId(null);
						}}
					>
						Lưu
					</Button>
				</div>
			</div>
		</div>
	) : null;

	const subConfigModal = selectedItem ? (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<h3 className="text-base font-semibold text-gray-900">
						Danh sách mục: {selectedItem.name}
					</h3>
					<div className="flex items-center gap-2">
						{flatSectionKey && (
							<>
								<Button
									type="button"
									variant="secondary"
									size="sm"
									disabled={disabled}
									onClick={() =>
										setSubDrag((prev) => ({
											...prev,
											[flatSectionKey]: !prev[flatSectionKey],
										}))
									}
								>
									<GripVertical className="size-4" />
									{subDrag[flatSectionKey] ? "Hủy sắp xếp" : "Sắp xếp"}
								</Button>
								<Button
									type="button"
									size="sm"
									disabled={disabled}
									onClick={() => openAddSub(flatSectionKey)}
								>
									<Plus className="size-4" /> Thêm
								</Button>
							</>
						)}
						<button
							type="button"
							onClick={() => setSelectedItemId(null)}
							className="ml-1 text-gray-400 hover:text-gray-600"
							aria-label="Đóng"
						>
							<X className="size-5" />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-5 py-4">
					{flatSectionKey && (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={(e) => handleDragSubEnd(flatSectionKey, e)}
						>
							<SortableContext
								items={flatItems.map((i) => i.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="overflow-x-auto rounded-lg border border-gray-200">
									<table className="w-full text-sm">
										<thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
											<tr>
												{subDrag[flatSectionKey] && <th className="w-8" />}
												<th className="px-3 py-2 w-32">Title</th>
												<th className="px-3 py-2">Tên</th>
												<th className="px-3 py-2">URL</th>
												<th className="px-3 py-2 w-20">Icon</th>
												<th className="px-3 py-2 w-24">Trạng thái</th>
												<th className="px-3 py-2 w-24" />
											</tr>
										</thead>
										<tbody>
											{flatItems.length === 0 && (
												<tr>
													<td
														colSpan={7}
														className="px-3 py-10 text-center text-gray-400"
													>
														Chưa có mục nào
													</td>
												</tr>
											)}
											{flatItems.map((item) => (
												<SortableRow
													key={item.id}
													id={item.id}
													dragEnabled={
														subDrag[flatSectionKey] || false
													}
												>
													<td className="px-3 py-2 text-gray-700">
														{item.title || (
															<span className="text-gray-400">
																-
															</span>
														)}
													</td>
													<td className="px-3 py-2">
														{item.name || "-"}
													</td>
													<td className="px-3 py-2 text-gray-500">
														<span className="block max-w-[260px] truncate">
															{item.url || "-"}
														</span>
													</td>
													<td className="px-3 py-2">
														{item.icon ? (
															<img
																src={getImageUrl(item.icon)}
																alt=""
																className="size-8 object-contain"
															/>
														) : (
															<span className="text-gray-400">-</span>
														)}
													</td>
													<td className="px-3 py-2">
														<input
															type="checkbox"
															disabled={disabled}
															checked={
																item.status ===
																StatusCommonEnum.ACTIVE
															}
															onChange={(e) =>
																updateSelectedChildren((children) =>
																	children.map((sec) =>
																		sec.key === flatSectionKey
																			? {
																					...sec,
																					items: sec.items.map((i) =>
																						i.id === item.id
																							? {
																									...i,
																									status: e.target
																										.checked
																										? StatusCommonEnum.ACTIVE
																										: StatusCommonEnum.INACTIVE,
																								}
																							: i,
																					),
																				}
																			: sec,
																	),
																)
															}
															className="size-4 rounded border-gray-300"
														/>
													</td>
													<td className="px-3 py-2">
														<div className="flex items-center justify-end gap-1">
															<button
																type="button"
																onClick={() =>
																	openEditSub(
																		flatSectionKey,
																		item.id,
																	)
																}
																disabled={disabled}
																className="text-blue-600 hover:text-blue-800"
																aria-label="Sửa"
															>
																<Pencil className="size-4" />
															</button>
															<button
																type="button"
																onClick={() =>
																	deleteSubItem(
																		flatSectionKey,
																		item.id,
																	)
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
									</table>
								</div>
							</SortableContext>
						</DndContext>
					)}
				</div>

				<div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
					<Button
						type="button"
						variant="secondary"
						disabled={disabled}
						onClick={() => setSelectedItemId(null)}
					>
						Hủy
					</Button>
					<Button
						type="button"
						disabled={disabled}
						onClick={async () => {
							if (onSaveItems) {
								await onSaveItems();
							}
							setSelectedItemId(null);
						}}
					>
						Lưu
					</Button>
				</div>
			</div>
		</div>
	) : null;

	// ─── Render: list view ────────────────────────────────────────────
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="text-base font-semibold text-gray-900">
					Danh sách menu
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						disabled={disabled}
						onClick={() => setDragMain((v) => !v)}
					>
						<GripVertical className="size-4" />
						{dragMain ? "Hủy sắp xếp" : "Sắp xếp thứ tự"}
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={disabled}
						onClick={openAddItem}
					>
						<Plus className="size-4" /> Thêm
					</Button>
				</div>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragMainEnd}
			>
				<SortableContext
					items={rows.map((r) => r.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
								<tr>
									{dragMain && <th className="w-8" />}
									<th className="px-3 py-2">Tên</th>
									<th className="px-3 py-2">URL</th>
									<th className="px-3 py-2 w-20">Icon</th>
									<th className="px-3 py-2 w-28">Trạng thái</th>
									<th className="px-3 py-2 w-24">Menu con</th>
									<th className="px-3 py-2 w-32" />
								</tr>
							</thead>
							<tbody>
								{rows.length === 0 && (
									<tr>
										<td
											colSpan={7}
											className="px-3 py-6 text-center text-gray-400"
										>
											Chưa có menu nào
										</td>
									</tr>
								)}
								{rows.map((row) => {
									const subTotal = row.children.reduce(
										(sum, s) => sum + s.items.length,
										0,
									);
									return (
										<SortableRow
											key={row.id}
											id={row.id}
											dragEnabled={dragMain}
										>
											<td className="px-3 py-2 font-medium">
												{row.name || "-"}
											</td>
											<td className="px-3 py-2 text-gray-500">
												<span className="block max-w-[200px] truncate">
													{row.url || "-"}
												</span>
											</td>
											<td className="px-3 py-2">
												{row.icon ? (
													<img
														src={getImageUrl(row.icon)}
														alt=""
														className="size-8 object-contain"
													/>
												) : (
													<span className="text-gray-400">
														-
													</span>
												)}
											</td>
											<td className="px-3 py-2">
												<input
													type="checkbox"
													disabled={disabled}
													checked={
														row.status ===
														StatusCommonEnum.ACTIVE
													}
													onChange={(e) =>
														setRows((prev) =>
															prev.map((r) =>
																r.id === row.id
																	? {
																			...r,
																			status: e.target.checked
																				? StatusCommonEnum.ACTIVE
																				: StatusCommonEnum.INACTIVE,
																		}
																	: r,
															),
														)
													}
													className="size-4 rounded border-gray-300"
												/>
											</td>
											<td className="px-3 py-2 text-gray-500">
												{subTotal} mục
											</td>
											<td className="px-3 py-2">
												<div className="flex items-center justify-end gap-1">
													<button
														type="button"
														onClick={() =>
															setSelectedItemId(row.id)
														}
														disabled={disabled}
														className="text-gray-600 hover:text-gray-900"
														aria-label="Cấu hình menu con"
													>
														<Settings className="size-4" />
													</button>
													<button
														type="button"
														onClick={() => {
															setProductTab("related");
															setFeaturedModalRowId(row.id);
														}}
														disabled={disabled}
														className="text-amber-500 hover:text-amber-700"
														aria-label="Cấu hình sản phẩm"
														title="Sản phẩm liên quan & nổi bật"
													>
														<Sparkles className="size-4" />
													</button>
													<button
														type="button"
														onClick={() => openEditItem(row.id)}
														disabled={disabled}
														className="text-blue-600 hover:text-blue-800"
														aria-label="Sửa"
													>
														<Pencil className="size-4" />
													</button>
													<button
														type="button"
														onClick={() => deleteItem(row.id)}
														disabled={disabled}
														className="text-red-500 hover:text-red-700"
														aria-label="Xóa"
													>
														<Trash2 className="size-4" />
													</button>
												</div>
											</td>
										</SortableRow>
									);
								})}
							</tbody>
						</table>
					</div>
				</SortableContext>
			</DndContext>

			<ItemModal
				open={mainModal.open}
				title={mainModal.editingId ? "Sửa menu" : "Thêm menu"}
				disabled={disabled}
				defaultName={editingMain?.name ?? ""}
				defaultUrl={editingMain?.url ?? ""}
				defaultIcon={editingMain?.icon ?? ""}
				defaultStatus={editingMain?.status ?? StatusCommonEnum.ACTIVE}
				onClose={closeMain}
				onSave={saveMain}
			/>

			{subConfigModal}
			{featuredModal}

			<ItemModal
				open={subModal.open}
				title={subModal.editingId ? "Sửa mục" : "Thêm mục"}
				disabled={disabled}
				showTitleField
				defaultName={editingSub?.name ?? ""}
				defaultTitle={editingSub?.title ?? ""}
				defaultUrl={editingSub?.url ?? ""}
				defaultIcon={editingSub?.icon ?? ""}
				defaultStatus={editingSub?.status ?? StatusCommonEnum.ACTIVE}
				onClose={closeSub}
				onSave={saveSub}
				onSaveAndContinue={
					subModal.editingId ? undefined : saveSubAndContinue
				}
			/>
		</div>
	);
}
