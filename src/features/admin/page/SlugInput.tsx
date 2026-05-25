"use client";

import { Check, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "@/features/admin/ui";
import { generateSlugFromLabel, normalizeSlugValue, toSlugDisplayValue } from "./constants";

interface SlugInputProps {
	value: string;
	onChange: (slug: string) => void;
	titleSource: string;
	disabled?: boolean;
	defaultEditable?: boolean;
	id?: string;
}

export function SlugInput({
	value,
	onChange,
	titleSource,
	disabled,
	defaultEditable = false,
	id = "slug",
}: SlugInputProps) {
	const [editable, setEditable] = useState(defaultEditable);

	function handleRegen() {
		if (!titleSource) return;
		const generated = generateSlugFromLabel(titleSource);
		if (generated) onChange(normalizeSlugValue(generated));
	}

	return (
		<div className="flex items-center gap-2">
			<Input
				id={id}
				placeholder="Nhập slug (ví dụ: /khuyen-mai-tet)"
				disabled={disabled || !editable}
				className={editable ? "" : "text-gray-500"}
				value={toSlugDisplayValue(value || "")}
				onChange={(e) => onChange(normalizeSlugValue(e.target.value))}
			/>
			<Button
				type="button"
				variant="secondary"
				size="sm"
				onClick={handleRegen}
				disabled={disabled || !titleSource}
				className="!h-9 !w-9 !p-0"
				title="Tạo lại slug từ tiêu đề"
				aria-label="Tạo lại slug từ tiêu đề"
			>
				<RefreshCw className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant="secondary"
				size="sm"
				onClick={() => setEditable((v) => !v)}
				disabled={disabled}
				className="!h-9 !w-9 !p-0"
				title={editable ? "Khoá chỉnh sửa" : "Mở chỉnh sửa"}
				aria-label={editable ? "Khoá chỉnh sửa" : "Mở chỉnh sửa"}
			>
				{editable ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
			</Button>
		</div>
	);
}
