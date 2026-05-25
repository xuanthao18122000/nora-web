"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DetailPageHeader,
	Field,
	Input,
	Select,
} from "@/features/admin/ui";
import {
	type AdminFacet,
	AdminApiError,
	type CreateFacetPayload,
	FACET_TYPE_LABEL,
	FacetTypeEnum,
	StatusCommonEnum,
	type UpdateFacetPayload,
	createAdminFacet,
	updateAdminFacet,
} from "@/lib/api/admin";
import { FacetValueList } from "./FacetValueList";

interface FacetFormProps {
	mode: "create" | "edit";
	initialData?: AdminFacet;
}

interface FormState {
	key: string;
	label: string;
	displayOrder: number;
	status: StatusCommonEnum;
	type: FacetTypeEnum;
}

const DEFAULT_FORM: FormState = {
	key: "",
	label: "",
	displayOrder: 0,
	status: StatusCommonEnum.ACTIVE,
	type: FacetTypeEnum.MULTI_SELECT,
};

const KEY_PATTERN = /^[a-z0-9][a-z0-9-_]*$/;

export function FacetForm({ mode, initialData }: FacetFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";

	const [form, setForm] = useState<FormState>(() =>
		initialData
			? {
					key: initialData.key,
					label: initialData.label,
					displayOrder: initialData.displayOrder ?? 0,
					status: initialData.status,
					type: initialData.type,
				}
			: DEFAULT_FORM,
	);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
		{},
	);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	function validate(): boolean {
		const next: Partial<Record<keyof FormState, string>> = {};
		const trimmedKey = form.key.trim();
		const trimmedLabel = form.label.trim();

		if (!trimmedLabel) {
			next.label = "Tên hiển thị là bắt buộc";
		} else if (trimmedLabel.length > 255) {
			next.label = "Tên hiển thị không được vượt quá 255 ký tự";
		}

		if (!isEdit) {
			// key chỉ validate khi tạo mới — edit không cho đổi key
			if (!trimmedKey) {
				next.key = "Key là bắt buộc";
			} else if (trimmedKey.length > 100) {
				next.key = "Key không được vượt quá 100 ký tự";
			} else if (!KEY_PATTERN.test(trimmedKey)) {
				next.key =
					"Key chỉ chứa chữ thường, số, dấu - hoặc _; bắt đầu bằng chữ/số";
			}
		}

		if (!Number.isFinite(form.displayOrder)) {
			next.displayOrder = "Thứ tự không hợp lệ";
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;

		setSubmitting(true);
		try {
			if (mode === "create") {
				const payload: CreateFacetPayload = {
					key: form.key.trim(),
					label: form.label.trim(),
					displayOrder: form.displayOrder,
					status: form.status,
					type: form.type,
				};
				const created = await createAdminFacet(payload);
				toast.success("Tạo bộ lọc thành công");
				router.push(`/admin/facets/${created.id}`);
			} else if (initialData) {
				const payload: UpdateFacetPayload = {
					label: form.label.trim(),
					displayOrder: form.displayOrder,
					status: form.status,
					type: form.type,
				};
				await updateAdminFacet(initialData.id, payload);
				toast.success("Cập nhật bộ lọc thành công");
				router.refresh();
			}
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

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={isEdit ? "Chi tiết bộ lọc" : "Thêm bộ lọc"}
				subtitle={
					isEdit
						? "Chỉnh sửa thông tin bộ lọc & quản lý giá trị"
						: "Nhập thông tin bộ lọc mới"
				}
				backHref="/admin/facets"
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: isEdit
								? "Cập nhật"
								: "Tạo bộ lọc"}
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader title="Thông tin bộ lọc" />
						<CardBody className="space-y-4">
							<Field
								label="Key"
								required
								error={errors.key}
								hint={
									isEdit
										? "Không thể thay đổi key sau khi tạo"
										: "Định danh duy nhất, dùng cho URL & API. VD: brand, capacity"
								}
								htmlFor="key"
							>
								<Input
									id="key"
									value={form.key}
									onChange={(e) => update("key", e.target.value)}
									placeholder="VD: brand"
									disabled={isEdit}
								/>
							</Field>

							<Field
								label="Tên hiển thị"
								required
								error={errors.label}
								htmlFor="label"
							>
								<Input
									id="label"
									value={form.label}
									onChange={(e) => update("label", e.target.value)}
									placeholder="VD: Thương hiệu"
								/>
							</Field>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<Field
									label="Loại bộ lọc"
									htmlFor="type"
									hint="Cách hiển thị bộ lọc trên storefront"
								>
									<Select
										id="type"
										value={String(form.type)}
										onChange={(e) =>
											update("type", Number(e.target.value) as FacetTypeEnum)
										}
									>
										<option value={FacetTypeEnum.SINGLE_SELECT}>
											{FACET_TYPE_LABEL[FacetTypeEnum.SINGLE_SELECT]}
										</option>
										<option value={FacetTypeEnum.MULTI_SELECT}>
											{FACET_TYPE_LABEL[FacetTypeEnum.MULTI_SELECT]}
										</option>
										<option value={FacetTypeEnum.RANGE}>
											{FACET_TYPE_LABEL[FacetTypeEnum.RANGE]}
										</option>
										<option value={FacetTypeEnum.BOOLEAN}>
											{FACET_TYPE_LABEL[FacetTypeEnum.BOOLEAN]}
										</option>
									</Select>
								</Field>

								<Field
									label="Thứ tự hiển thị"
									htmlFor="displayOrder"
									hint="Số nhỏ hiển thị trước"
									error={errors.displayOrder}
								>
									<Input
										id="displayOrder"
										type="number"
										value={form.displayOrder}
										onChange={(e) =>
											update("displayOrder", Number(e.target.value))
										}
									/>
								</Field>
							</div>
						</CardBody>
					</Card>

					{isEdit && initialData && (
						<FacetValueList
							facetId={initialData.id}
							facetLabel={initialData.label}
						/>
					)}
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader title="Trạng thái" />
						<CardBody className="space-y-3">
							<Select
								value={String(form.status)}
								onChange={(e) =>
									update("status", Number(e.target.value) as StatusCommonEnum)
								}
								aria-label="Trạng thái"
							>
								<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
								<option value={StatusCommonEnum.INACTIVE}>Lưu trữ</option>
							</Select>
						</CardBody>
					</Card>

					{isEdit && initialData && (
						<Card>
							<CardHeader title="Thông tin hệ thống" />
							<CardBody className="space-y-2 text-sm text-gray-600">
								<div className="flex justify-between gap-2">
									<span className="text-gray-500">ID</span>
									<span className="font-medium text-gray-900">
										#{initialData.id}
									</span>
								</div>
								<div className="flex justify-between gap-2">
									<span className="text-gray-500">Ngày tạo</span>
									<span>{formatDate(initialData.createdAt)}</span>
								</div>
								<div className="flex justify-between gap-2">
									<span className="text-gray-500">Cập nhật</span>
									<span>{formatDate(initialData.updatedAt)}</span>
								</div>
							</CardBody>
						</Card>
					)}
				</div>
			</div>
		</form>
	);
}

function formatDate(iso?: string): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}
