"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	Card,
	CardBody,
	CardHeader,
	useConfirm,
} from "@/features/admin/ui";
import {
	type AdminPageSection,
	AdminApiError,
	StatusCommonEnum,
	deleteAdminPageSection,
	updateAdminPageSection,
} from "@/lib/api/admin";
import { AddSectionDropdown } from "./AddSectionDropdown";
import { DELETABLE_SECTION_TYPES, getSectionLabel } from "./constants";
import { SortableSectionRow } from "./SortableSectionRow";

interface SortableSectionsListProps {
	pageId: string;
	sections: AdminPageSection[];
	onChanged: () => void;
}

interface SectionState {
	id: string;
	entity: AdminPageSection;
	isActive: boolean;
}

export function SortableSectionsList({
	pageId,
	sections,
	onChanged,
}: SortableSectionsListProps) {
	const confirm = useConfirm();

	const initial = useMemo<SectionState[]>(
		() =>
			[...sections]
				.sort((a, b) => a.position - b.position)
				.map((s) => ({
					id: String(s.id),
					entity: s,
					isActive: s.status === StatusCommonEnum.ACTIVE,
				})),
		[sections],
	);

	const [items, setItems] = useState(initial);
	// Sync khi sections từ server đổi (sau create/delete)
	const lastSig = useRef("");
	const sig = sections.map((s) => `${s.id}:${s.position}:${s.status}`).join(",");
	if (sig !== lastSig.current) {
		lastSig.current = sig;
		if (items.map((i) => `${i.entity.id}:${i.entity.position}:${i.entity.status}`).join(",") !== sig) {
			setItems(initial);
		}
	}

	const existingKeys = useMemo(() => {
		const set = new Set<string>();
		for (const s of sections) {
			if (s.key) set.add(s.key);
		}
		return set;
	}, [sections]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor),
	);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex((i) => i.id === active.id);
		const newIndex = items.findIndex((i) => i.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const reordered = arrayMove(items, oldIndex, newIndex);
		setItems(reordered);

		// Persist position cho từng section
		try {
			await Promise.all(
				reordered.map((it, idx) =>
					it.entity.position === idx
						? Promise.resolve()
						: updateAdminPageSection(it.entity.id, { position: idx }),
				),
			);
			toast.success("Đã cập nhật thứ tự");
			onChanged();
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Cập nhật thứ tự thất bại");
			setItems(initial);
		}
	}

	async function handleToggle(state: SectionState) {
		const next =
			state.entity.status === StatusCommonEnum.ACTIVE
				? StatusCommonEnum.INACTIVE
				: StatusCommonEnum.ACTIVE;
		// Optimistic
		setItems((arr) =>
			arr.map((i) =>
				i.id === state.id ? { ...i, isActive: next === StatusCommonEnum.ACTIVE } : i,
			),
		);
		try {
			await updateAdminPageSection(state.entity.id, { status: next });
			onChanged();
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Đổi trạng thái thất bại");
			setItems(initial);
		}
	}

	async function handleDelete(state: SectionState) {
		const label = state.entity.name || getSectionLabel(state.entity.key || state.entity.type);
		const ok = await confirm({
			title: "Xoá section",
			description: (
				<>
					Bạn có chắc chắn muốn xoá section <strong>{label}</strong> khỏi trang hệ
					thống?
				</>
			),
			confirmText: "Xoá",
			tone: "danger",
		});
		if (!ok) return;
		try {
			await deleteAdminPageSection(state.entity.id);
			toast.success("Xoá section thành công");
			onChanged();
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Xoá section thất bại");
		}
	}

	function buildSettingsHref(state: SectionState): string {
		const { key, type } = state.entity;
		const query = key ? `key=${key}` : `type=${type}`;
		return `/admin/pages/${pageId}/sections/${state.entity.id}?${query}`;
	}

	function isDeletable(s: AdminPageSection) {
		if (s.key && DELETABLE_SECTION_TYPES.has(s.key)) return true;
		if (DELETABLE_SECTION_TYPES.has(s.type)) return true;
		return false;
	}

	return (
		<Card>
			<CardHeader
				title="Thiết lập giao diện"
				actions={<AddSectionDropdown pageId={pageId} existingKeys={existingKeys} />}
			/>
			<CardBody className="space-y-2">
				<p className="text-xs text-gray-500">
					Kéo thả để thay đổi thứ tự hiển thị section
				</p>

				{items.length === 0 ? (
					<div className="rounded-md bg-gray-50 py-8 text-center text-sm text-gray-500">
						Chưa có section nào
					</div>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={items.map((i) => i.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-2">
								{items.map((state) => {
									const label =
										state.entity.name ||
										getSectionLabel(state.entity.key || state.entity.type) ||
										state.entity.type;
									return (
										<SortableSectionRow
											key={state.id}
											sectionId={state.id}
											label={label}
											isActive={state.isActive}
											onToggle={() => handleToggle(state)}
											canDelete={isDeletable(state.entity)}
											onDelete={() => handleDelete(state)}
											settingsHref={buildSettingsHref(state)}
										/>
									);
								})}
							</div>
						</SortableContext>
					</DndContext>
				)}
			</CardBody>
		</Card>
	);
}
