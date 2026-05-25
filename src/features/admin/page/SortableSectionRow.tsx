"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/features/admin/ui";

interface SortableSectionRowProps {
	sectionId: string;
	label: string;
	isActive: boolean;
	onToggle: () => void;
	toggleDisabled?: boolean;
	canDelete?: boolean;
	onDelete: () => void;
	settingsHref: string;
}

export function SortableSectionRow({
	sectionId,
	label,
	isActive,
	onToggle,
	toggleDisabled,
	canDelete,
	onDelete,
	settingsHref,
}: SortableSectionRowProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: sectionId,
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-3 rounded-lg border bg-white p-3 ${
				isDragging ? "border-blue-400 shadow-lg" : "border-gray-200"
			}`}
		>
			<button
				type="button"
				className="flex h-8 w-8 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-gray-100 active:cursor-grabbing"
				{...attributes}
				{...listeners}
				aria-label="Kéo để sắp xếp"
			>
				<GripVertical className="h-5 w-5" />
			</button>

			<Link
				href={settingsHref}
				className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				title="Mở cài đặt section"
			>
				{label}
			</Link>

			<ToggleSwitch checked={isActive} onChange={onToggle} disabled={toggleDisabled} />

			<Link
				href={settingsHref}
				className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				title="Cài đặt"
				aria-label="Cài đặt"
			>
				<Settings className="h-3.5 w-3.5" />
			</Link>

			<Button
				type="button"
				variant="danger"
				size="sm"
				onClick={onDelete}
				disabled={!canDelete}
				className="!h-8 !w-8 !p-0"
				title={canDelete ? "Xoá" : "Section này không thể xoá"}
				aria-label="Xoá"
			>
				<Trash2 className="h-3.5 w-3.5" />
			</Button>
		</div>
	);
}

function ToggleSwitch({
	checked,
	onChange,
	disabled,
}: {
	checked: boolean;
	onChange: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={onChange}
			disabled={disabled}
			className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 ${
				checked ? "bg-blue-600" : "bg-gray-300"
			}`}
		>
			<span
				className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
					checked ? "translate-x-[18px]" : "translate-x-0.5"
				}`}
			/>
		</button>
	);
}
