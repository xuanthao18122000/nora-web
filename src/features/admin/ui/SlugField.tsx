"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";

import { slugify } from "@/lib/utils/slugify";

import { Field, Input } from "./Field";

interface SlugFieldProps {
	/** ID của <input>, dùng cho <label htmlFor> */
	id?: string;
	/** Nhãn hiển thị, mặc định "Slug" */
	label?: string;
	hint?: string;
	error?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	/** Giá trị slug hiện tại trong form */
	value: string;
	/** Callback khi slug đổi (user gõ tay hoặc bấm regenerate) */
	onChange: (value: string) => void;
	/** Chuỗi nguồn (name/title) để sinh slug khi bấm nút refresh */
	source: string;
}

/**
 * Field slug đơn — chỉ có nút refresh để sinh lại từ `source`.
 * Tự đánh dấu dirty khi user gõ tay (caller dùng `useAutoSlug` để tránh override).
 */
export function SlugField({
	id = "slug",
	label = "Slug",
	hint = "Tự sinh từ tên — hoặc nhập tay để chỉnh URL",
	error,
	placeholder = "vd: may-bom-hayward-1-5hp",
	required,
	disabled,
	value,
	onChange,
	source,
}: SlugFieldProps) {
	function handleRegenerate() {
		const generated = slugify(source);
		if (!generated) return;
		onChange(generated);
	}

	return (
		<Field label={label} hint={hint} required={required} error={error} htmlFor={id}>
			<div className="flex items-center gap-2">
				<Input
					id={id}
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
				/>
				<button
					type="button"
					onClick={handleRegenerate}
					disabled={disabled || !source.trim()}
					title="Tạo lại slug từ tên"
					aria-label="Tạo lại slug từ tên"
					className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<RefreshCw className="h-4 w-4" />
				</button>
			</div>
		</Field>
	);
}

interface UseAutoSlugOptions {
	/** Tên/tiêu đề — nguồn sinh slug. */
	source: string;
	/** Giá trị slug hiện tại. */
	value: string;
	/** Setter để patch slug. */
	setValue: (next: string) => void;
	/** Đang ở mode edit? Mặc định không auto-sync. */
	isEdit: boolean;
}

/**
 * Auto-sync slug từ `source` khi tạo mới.
 * - Mode edit hoặc đã có slug → bỏ qua (dirty = true ngay từ đầu).
 * - User gõ tay vào slug → dirty = true, dừng auto-sync.
 * - Xoá rỗng slug → dirty = false, tiếp tục auto-sync.
 *
 * Trả về `handleSlugChange` để truyền vào <SlugField onChange>.
 */
export function useAutoSlug({
	source,
	value,
	setValue,
	isEdit,
}: UseAutoSlugOptions) {
	const dirtyRef = useRef(isEdit || Boolean(value));

	useEffect(() => {
		if (isEdit) return;
		if (dirtyRef.current) return;
		const generated = slugify(source);
		// Tránh setValue khi không đổi để không trigger re-render thừa
		if (generated !== value) setValue(generated);
	}, [source, isEdit, value, setValue]);

	function handleSlugChange(next: string) {
		dirtyRef.current = next.trim().length > 0;
		setValue(next);
	}

	return { handleSlugChange };
}
