"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, Input, Select } from "@/features/admin/ui";
import {
	type AdminFacetValue,
	AdminApiError,
	type CreateFacetValuePayload,
	StatusCommonEnum,
	type UpdateFacetValuePayload,
	createAdminFacetValue,
	updateAdminFacetValue,
} from "@/lib/api/admin";

interface FacetValueDialogProps {
	open: boolean;
	onClose: () => void;
	onSaved: () => void;
	facetId: number;
	/** Nếu có → edit mode; nếu không → create mode */
	initialData?: AdminFacetValue | null;
}

interface FormState {
	key: string;
	label: string;
	icon: string;
	status: StatusCommonEnum;
}

const DEFAULT_FORM: FormState = {
	key: "",
	label: "",
	icon: "",
	status: StatusCommonEnum.ACTIVE,
};

const KEY_PATTERN = /^[a-z0-9][a-z0-9-_]*$/;

/** Modal create/edit FacetValue. Tách riêng để dùng inline trong FacetValueList. */
export function FacetValueDialog({
	open,
	onClose,
	onSaved,
	facetId,
	initialData,
}: FacetValueDialogProps) {
	const isEdit = !!initialData;
	const [form, setForm] = useState<FormState>(DEFAULT_FORM);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
		{},
	);
	const [submitting, setSubmitting] = useState(false);

	// Reset form khi mở dialog hoặc đổi initialData
	useEffect(() => {
		if (!open) return;
		if (initialData) {
			setForm({
				key: initialData.key,
				label: initialData.label,
				icon: initialData.icon ?? "",
				status: initialData.status,
			});
		} else {
			setForm(DEFAULT_FORM);
		}
		setErrors({});
	}, [open, initialData]);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	function validate(): boolean {
		const next: Partial<Record<keyof FormState, string>> = {};
		const trimmedKey = form.key.trim();
		const trimmedLabel = form.label.trim();

		if (!trimmedKey) {
			next.key = "Key là bắt buộc";
		} else if (trimmedKey.length > 100) {
			next.key = "Key không được vượt quá 100 ký tự";
		} else if (!KEY_PATTERN.test(trimmedKey)) {
			next.key =
				"Key chỉ chứa chữ thường, số, dấu - hoặc _; bắt đầu bằng chữ/số";
		}

		if (!trimmedLabel) {
			next.label = "Tên hiển thị là bắt buộc";
		} else if (trimmedLabel.length > 255) {
			next.label = "Tên hiển thị không được vượt quá 255 ký tự";
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		e?.stopPropagation();
		if (!validate()) return;

		setSubmitting(true);
		try {
			if (isEdit && initialData) {
				const payload: UpdateFacetValuePayload = {
					key: form.key.trim(),
					label: form.label.trim(),
					icon: form.icon.trim() || undefined,
					status: form.status,
				};
				await updateAdminFacetValue(facetId, initialData.id, payload);
				toast.success("Cập nhật giá trị thành công");
			} else {
				const payload: CreateFacetValuePayload = {
					facetId,
					key: form.key.trim(),
					label: form.label.trim(),
					icon: form.icon.trim() || undefined,
					status: form.status,
				};
				await createAdminFacetValue(facetId, payload);
				toast.success("Tạo giá trị thành công");
			}
			onSaved();
			onClose();
		} catch (err) {
			const msg =
				err instanceof AdminApiError
					? err.message
					: "Có lỗi xảy ra, vui lòng thử lại";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	}

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onClick={(e) => {
				// Close khi click overlay
				if (e.target === e.currentTarget && !submitting) onClose();
			}}
		>
			<div
				className="w-full max-w-md rounded-xl bg-white shadow-xl"
				role="dialog"
				aria-modal="true"
				aria-labelledby="facet-value-dialog-title"
			>
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<h3
						id="facet-value-dialog-title"
						className="text-base font-semibold text-gray-900"
					>
						{isEdit ? "Sửa giá trị bộ lọc" : "Thêm giá trị bộ lọc"}
					</h3>
					<button
						type="button"
						onClick={onClose}
						disabled={submitting}
						className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Đóng"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div
					className="space-y-4 px-5 py-4"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !submitting) {
							e.preventDefault();
							e.stopPropagation();
							handleSubmit();
						}
					}}
				>
					<Field
						label="Key"
						required
						error={errors.key}
						hint="Định danh duy nhất trong bộ lọc. VD: panasonic, 12v"
						htmlFor="value-key"
					>
						<Input
							id="value-key"
							value={form.key}
							onChange={(e) => update("key", e.target.value)}
							placeholder="VD: panasonic"
						/>
					</Field>

					<Field
						label="Tên hiển thị"
						required
						error={errors.label}
						htmlFor="value-label"
					>
						<Input
							id="value-label"
							value={form.label}
							onChange={(e) => update("label", e.target.value)}
							placeholder="VD: Panasonic"
						/>
					</Field>

					<Field
						label="Icon / Biểu tượng"
						hint="URL ảnh hoặc emoji (tuỳ chọn)"
						htmlFor="value-icon"
					>
						<Input
							id="value-icon"
							value={form.icon}
							onChange={(e) => update("icon", e.target.value)}
							placeholder="https://... hoặc 🔋"
						/>
					</Field>

					<Field label="Trạng thái" htmlFor="value-status">
						<Select
							id="value-status"
							value={String(form.status)}
							onChange={(e) =>
								update("status", Number(e.target.value) as StatusCommonEnum)
							}
						>
							<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
							<option value={StatusCommonEnum.INACTIVE}>Lưu trữ</option>
						</Select>
					</Field>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={onClose}
							disabled={submitting}
						>
							Hủy
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={submitting}
							onClick={() => handleSubmit()}
						>
							{submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
