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
	Newspaper,
	SlidersHorizontal,
	Tag,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Field } from "@/features/admin/ui";
import {
	type AdminPageSectionItem,
	StatusCommonEnum,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";
import {
	type AdminPostList,
	listAdminPostLists,
} from "@/lib/api/admin/post-list";
import {
	EntitySearchSelect,
	type EntitySearchPayload,
} from "./EntitySearchSelect";

// ─── Types ───────────────────────────────────────────────────────────

const PageSectionItemTypeEnum = {
	ARTICLE: "article",
} as const;

export interface PostBoxExtra {
	cols?: 3 | 4 | 5;
	rows?: 1 | 2;
	showTitle?: boolean;
	/** "auto": tin mới nhất trong postList. "manual": dùng items đã chọn. */
	mode?: "auto" | "manual";
	/** Bắt buộc — luôn đi theo 1 danh mục */
	postListId?: number | null;
	/** = cols × rows */
	limit?: number;
}

interface PostRow {
	localId: string;
	postId: number;
	name: string;
	thumbnailUrl?: string | null;
	slug?: string;
	position: number;
	status: StatusCommonEnum;
}

interface PostItemData {
	postId: number;
	thumbnailUrl?: string | null;
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

function parseInitialData(values: AdminPageSectionItem[] | null): PostRow[] {
	if (!Array.isArray(values)) return [];
	return values.map((v, idx) => {
		const data = safeParseJson<PostItemData>(v?.data) ?? ({} as PostItemData);
		return {
			localId: String(v.id ?? makeKey()),
			postId: Number(data.postId ?? 0),
			name: v.name ?? "",
			thumbnailUrl: data.thumbnailUrl ?? null,
			slug: data.slug,
			position: v.position ?? idx,
			status: (v.status ?? StatusCommonEnum.ACTIVE) as StatusCommonEnum,
		};
	});
}

export function buildPostBoxPayload(posts: PostRow[]) {
	return posts.map((p, index) => ({
		type: PageSectionItemTypeEnum.ARTICLE,
		name: p.name,
		position: index,
		status: p.status,
		data: JSON.stringify({
			postId: p.postId,
			thumbnailUrl: p.thumbnailUrl ?? null,
			slug: p.slug ?? null,
		}),
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

// ─── Main component ──────────────────────────────────────────────────

interface PostBoxSectionProps {
	defaultValues?: AdminPageSectionItem[] | null;
	defaultExtra?: PostBoxExtra | null;
	disabled?: boolean;
	onChange?: (state: { posts: PostRow[]; extra: PostBoxExtra }) => void;
}

const SECTION_HEADER =
	"flex items-center gap-2 mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500";

export function PostBoxSection({
	defaultValues = null,
	defaultExtra = null,
	disabled = false,
	onChange,
}: PostBoxSectionProps) {
	const init = useMemo(() => parseInitialData(defaultValues), [defaultValues]);

	const [showTitle, setShowTitle] = useState<boolean>(
		defaultExtra?.showTitle ?? true,
	);
	const [cols, setCols] = useState<3 | 4 | 5>(() => {
		const c = defaultExtra?.cols;
		return c === 3 || c === 5 ? c : 4;
	});
	const [rows, setRows] = useState<1 | 2>(defaultExtra?.rows === 2 ? 2 : 1);
	const [mode, setMode] = useState<"auto" | "manual">(
		defaultExtra?.mode === "manual" ? "manual" : "auto",
	);
	const [postListId, setPostListId] = useState<number | null>(
		defaultExtra?.postListId ?? null,
	);
	const [posts, setPostsState] = useState<PostRow[]>(init);
	const [postDrag, setPostDrag] = useState(false);

	// Postlists dropdown
	const [postLists, setPostLists] = useState<AdminPostList[]>([]);
	const [loadingLists, setLoadingLists] = useState(false);

	const totalSlots = cols * rows;
	const limit = totalSlots;

	// Clamp posts khi totalSlots giảm
	useEffect(() => {
		setPostsState((prev) =>
			prev.length > totalSlots ? prev.slice(0, totalSlots) : prev,
		);
	}, [totalSlots]);

	// Reset selected posts khi đổi postList (vì posts cũ không còn thuộc list mới)
	const prevPostListId = useRef(postListId);
	useEffect(() => {
		if (prevPostListId.current !== postListId) {
			prevPostListId.current = postListId;
			// Chỉ clear khi user chủ động đổi (không phải lần init)
			setPostsState([]);
		}
	}, [postListId]);

	// Load postLists 1 lần
	useEffect(() => {
		let cancelled = false;
		setLoadingLists(true);
		listAdminPostLists({ page: 1, limit: 100 })
			.then((res) => {
				if (!cancelled) setPostLists(res.data ?? []);
			})
			.catch(() => {
				if (!cancelled) setPostLists([]);
			})
			.finally(() => {
				if (!cancelled) setLoadingLists(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	// Re-init khi defaultExtra/defaultValues đổi (edit mode load xong)
	const initSig = useRef("");
	useEffect(() => {
		const sig = JSON.stringify({ values: defaultValues, extra: defaultExtra });
		if (sig === initSig.current) return;
		initSig.current = sig;
		setPostsState(parseInitialData(defaultValues));
		if (defaultExtra) {
			setShowTitle(defaultExtra.showTitle ?? true);
			const c = defaultExtra.cols;
			setCols(c === 3 || c === 5 ? c : 4);
			setRows(defaultExtra.rows === 2 ? 2 : 1);
			setMode(defaultExtra.mode === "manual" ? "manual" : "auto");
			setPostListId(defaultExtra.postListId ?? null);
			prevPostListId.current = defaultExtra.postListId ?? null;
		}
	}, [defaultValues, defaultExtra]);

	// Notify cha
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	});
	useEffect(() => {
		onChangeRef.current?.({
			posts: mode === "manual" ? posts : [],
			extra: { cols, rows, showTitle, mode, postListId, limit },
		});
	}, [posts, cols, rows, showTitle, mode, postListId, limit]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor),
	);

	const addPost = useCallback(
		(p: EntitySearchPayload) => {
			if (p.type !== "post") return;
			setPostsState((prev) => {
				if (prev.length >= totalSlots) return prev;
				if (prev.some((r) => r.postId === p.id)) return prev;
				return [
					...prev,
					{
						localId: makeKey(),
						postId: p.id,
						name: p.name,
						thumbnailUrl: p.thumbnailUrl ?? null,
						slug: p.slug,
						position: prev.length,
						status: StatusCommonEnum.ACTIVE,
					},
				];
			});
		},
		[totalSlots],
	);

	const removePost = useCallback((localId: string) => {
		setPostsState((prev) => prev.filter((p) => p.localId !== localId));
	}, []);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setPostsState((prev) => {
			const oldIdx = prev.findIndex((p) => p.localId === active.id);
			const newIdx = prev.findIndex((p) => p.localId === over.id);
			if (oldIdx < 0 || newIdx < 0) return prev;
			return arrayMove(prev, oldIdx, newIdx);
		});
	}

	return (
		<div className="space-y-5">
			{/* Section 1: Box info */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<Tag className="size-4" />
					Thông tin box bài viết
				</div>
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
			</div>

			{/* Section 2: Display config */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<SlidersHorizontal className="size-4" />
					Cấu hình hiển thị
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="text-sm font-medium text-gray-700">Số cột</div>
						<div className="flex gap-1.5">
							{([3, 4, 5] as const).map((n) => (
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

					<div className="space-y-2">
						<div className="text-sm font-medium text-gray-700">Số hàng</div>
						<div className="flex gap-1.5">
							{([1, 2] as const).map((n) => (
								<Button
									key={n}
									type="button"
									variant={rows === n ? "primary" : "secondary"}
									size="sm"
									onClick={() => setRows(n)}
									disabled={disabled}
								>
									{n}
								</Button>
							))}
						</div>
					</div>
				</div>

				<div className="mt-3 text-xs text-gray-500">
					Tổng slot: <b>{totalSlots}</b> ({cols} × {rows})
				</div>
			</div>

			{/* Section 3: Danh mục bài viết */}
			<div className="rounded-lg border border-gray-200 p-5">
				<div className={SECTION_HEADER}>
					<Newspaper className="size-4" />
					Danh mục bài viết
				</div>

				<Field label="Chọn danh mục" required>
					<select
						value={postListId ?? ""}
						onChange={(e) => {
							const v = e.target.value;
							setPostListId(v ? Number(v) : null);
						}}
						disabled={disabled || loadingLists}
						className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						<option value="">-- Chọn danh mục --</option>
						{postLists.map((pl) => (
							<option key={pl.id} value={pl.id}>
								{pl.name}
							</option>
						))}
					</select>
					{!loadingLists && postLists.length === 0 && (
						<p className="mt-1 text-xs text-amber-600">
							Chưa có danh mục — vào /admin/post-lists để tạo.
						</p>
					)}
					{!postListId && (
						<p className="mt-1 text-xs text-red-500">
							Cần chọn 1 danh mục bài viết
						</p>
					)}
				</Field>

				<div className="mt-4">
					<div className="text-sm font-medium text-gray-700 mb-2">
						Cách hiển thị
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							variant={mode === "auto" ? "primary" : "secondary"}
							size="sm"
							onClick={() => setMode("auto")}
							disabled={disabled}
						>
							<LayoutGrid className="size-3.5" />
							Tin mới nhất
						</Button>
						<Button
							type="button"
							variant={mode === "manual" ? "primary" : "secondary"}
							size="sm"
							onClick={() => setMode("manual")}
							disabled={disabled}
						>
							<Newspaper className="size-3.5" />
							Chọn thủ công
						</Button>
					</div>
					{mode === "auto" && postListId && (
						<p className="mt-2 text-xs text-gray-500">
							Tự lấy {totalSlots} bài mới nhất trong danh mục đã chọn.
						</p>
					)}
				</div>
			</div>

			{/* Section 4: Manual list */}
			{mode === "manual" && postListId && (
				<div className="rounded-lg border border-gray-200 p-5">
					<div className="flex items-center justify-between mb-4">
						<div className={`${SECTION_HEADER} mb-0`}>
							<Newspaper className="size-4" />
							Bài viết đã chọn
							<span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
								{posts.length}/{totalSlots}
							</span>
						</div>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={() => setPostDrag((v) => !v)}
							disabled={disabled || posts.length === 0}
						>
							<GripVertical className="size-3.5" />
							{postDrag ? "Hủy sắp xếp" : "Sắp xếp"}
						</Button>
					</div>

					<div className="mb-3">
						<EntitySearchSelect
							mode="post"
							postListId={postListId}
							placeholder={
								posts.length >= totalSlots
									? `Đã đủ ${totalSlots} bài — xoá bớt để thêm`
									: "Tìm bài viết để thêm..."
							}
							disabled={disabled || posts.length >= totalSlots}
							onSelect={addPost}
						/>
					</div>

					{posts.length === 0 ? (
						<div className="border border-dashed border-gray-300 rounded-lg py-6 text-center">
							<Newspaper className="mx-auto size-7 text-gray-300 mb-1" />
							<p className="text-sm text-gray-400">Chưa chọn bài nào</p>
						</div>
					) : (
						<div className="overflow-x-auto rounded-lg border border-gray-200">
							<table className="w-full text-sm">
								<thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
									<tr>
										{postDrag && <th className="w-8" />}
										<th className="px-3 py-2 w-16">Ảnh</th>
										<th className="px-3 py-2">Tiêu đề</th>
										<th className="px-3 py-2 w-16" />
									</tr>
								</thead>
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={handleDragEnd}
								>
									<SortableContext
										items={posts.map((p) => p.localId)}
										strategy={verticalListSortingStrategy}
									>
										<tbody>
											{posts.map((p) => (
												<SortableRow
													key={p.localId}
													id={p.localId}
													dragEnabled={postDrag}
												>
													<td className="px-3 py-2">
														{p.thumbnailUrl ? (
															<img
																src={getImageUrl(p.thumbnailUrl)}
																alt=""
																className="size-10 object-cover rounded"
															/>
														) : (
															<span className="text-gray-300">-</span>
														)}
													</td>
													<td className="px-3 py-2 font-medium">
														<div className="truncate">{p.name || "-"}</div>
														{p.slug && (
															<div className="text-xs text-gray-400 truncate">
																/{p.slug}
															</div>
														)}
													</td>
													<td className="px-3 py-2">
														<button
															type="button"
															onClick={() => removePost(p.localId)}
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
			)}
		</div>
	);
}
