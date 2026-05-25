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
	Textarea,
} from "@/features/admin/ui";
import {
	type AdminCustomer,
	AdminApiError,
	type CreateCustomerPayload,
	StatusCommonEnum,
	createAdminCustomer,
	updateAdminCustomer,
} from "@/lib/api/admin";

interface CustomerFormProps {
	mode: "create" | "edit";
	initialData?: AdminCustomer;
}

interface FormState extends CreateCustomerPayload {}

const DEFAULT_FORM: FormState = {
	name: "",
	phoneNumber: "",
	email: "",
	address: "",
	status: StatusCommonEnum.ACTIVE,
};

export function CustomerForm({ mode, initialData }: CustomerFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";
	const [form, setForm] = useState<FormState>(() =>
		initialData
			? {
					name: initialData.name,
					phoneNumber: initialData.phoneNumber,
					email: initialData.email ?? "",
					address: initialData.address ?? "",
					status: initialData.status,
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

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const newErrors: Partial<Record<keyof FormState, string>> = {};
		if (!form.name.trim()) newErrors.name = "Tên là bắt buộc";
		if (!form.phoneNumber.trim()) newErrors.phoneNumber = "SĐT là bắt buộc";
		setErrors(newErrors);
		if (Object.keys(newErrors).length) return;

		setSubmitting(true);
		try {
			const payload: CreateCustomerPayload = {
				name: form.name.trim(),
				phoneNumber: form.phoneNumber.trim(),
				email: form.email?.trim() || undefined,
				address: form.address?.trim() || undefined,
				status: form.status,
			};
			if (mode === "create") {
				const created = await createAdminCustomer(payload);
				toast.success("Tạo khách hàng thành công");
				router.push(`/admin/customers/${created.id}`);
			} else if (initialData) {
				await updateAdminCustomer(initialData.id, payload);
				toast.success("Cập nhật khách hàng thành công");
				router.push(`/admin/customers/${initialData.id}`);
			}
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
		} finally {
			setSubmitting(false);
		}
	}

	const backHref = isEdit && initialData
		? `/admin/customers/${initialData.id}`
		: "/admin/customers";

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={isEdit ? "Chi tiết khách hàng" : "Thêm khách hàng"}
				subtitle={
					isEdit
						? "Chỉnh sửa thông tin khách hàng"
						: "Nhập thông tin khách hàng mới"
				}
				backHref={backHref}
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: isEdit
								? "Cập nhật"
								: "Tạo khách hàng"}
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader title="Thông tin liên hệ" />
						<CardBody className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Field label="Họ tên" required error={errors.name} htmlFor="name">
									<Input
										id="name"
										value={form.name}
										onChange={(e) => update("name", e.target.value)}
									/>
								</Field>
								<Field
									label="Số điện thoại"
									required
									error={errors.phoneNumber}
									htmlFor="phoneNumber"
								>
									<Input
										id="phoneNumber"
										value={form.phoneNumber}
										onChange={(e) => update("phoneNumber", e.target.value)}
										placeholder="0901234567"
									/>
								</Field>
							</div>

							<Field label="Email" htmlFor="email">
								<Input
									id="email"
									type="email"
									value={form.email ?? ""}
									onChange={(e) => update("email", e.target.value)}
									placeholder="user@example.com"
								/>
							</Field>

							<Field label="Địa chỉ" htmlFor="address">
								<Textarea
									id="address"
									value={form.address ?? ""}
									onChange={(e) => update("address", e.target.value)}
									rows={3}
								/>
							</Field>
						</CardBody>
					</Card>
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader title="Trạng thái" />
						<CardBody>
							<Select
								value={String(form.status ?? StatusCommonEnum.ACTIVE)}
								onChange={(e) =>
									update("status", Number(e.target.value) as StatusCommonEnum)
								}
							>
								<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
								<option value={StatusCommonEnum.INACTIVE}>Lưu trữ</option>
							</Select>
						</CardBody>
					</Card>
				</div>
			</div>
		</form>
	);
}
