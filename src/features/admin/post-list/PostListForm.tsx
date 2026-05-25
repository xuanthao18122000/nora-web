"use client";

import { Save } from "lucide-react";
import dynamic from "next/dynamic";
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
	SlugField,
	useAutoSlug,
} from "@/features/admin/ui";

const TextEditor = dynamic(
	() => import("@/features/admin/ui/TextEditor").then((m) => m.TextEditor),
	{
		ssr: false,
		loading: () => (
			<div className="h-[300px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
				Đang tải editor...
			</div>
		),
	},
);
import {
	type AdminPostList,
	AdminApiError,
	type CreatePostListPayload,
	StatusCommonEnum,
	createAdminPostList,
	updateAdminPostList,
} from "@/lib/api/admin";

interface PostListFormProps {
	mode: "create" | "edit";
	initialData?: AdminPostList;
}

interface FormState extends CreatePostListPayload {}

const DEFAULT_FORM: FormState = {
	name: "",
	slug: "",
	description: "",
	status: StatusCommonEnum.ACTIVE,
};

export function PostListForm({ mode, initialData }: PostListFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";
	const [form, setForm] = useState<FormState>(() =>
		initialData
			? {
					name: initialData.name,
					slug: initialData.slug,
					description: initialData.description ?? "",
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

	const { handleSlugChange } = useAutoSlug({
		source: form.name,
		value: form.slug ?? "",
		setValue: (next) => update("slug", next),
		isEdit,
	});

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErrors({});
		if (!form.name.trim()) {
			setErrors({ name: "Tên là bắt buộc" });
			return;
		}

		setSubmitting(true);
		try {
			const payload: CreatePostListPayload = {
				...form,
				name: form.name.trim(),
				slug: form.slug?.trim() || undefined,
				description: form.description?.trim() || undefined,
			};
			if (mode === "create") {
				await createAdminPostList(payload);
				toast.success("Tạo danh sách bài viết thành công");
				router.push("/admin/post-lists");
			} else if (initialData) {
				await updateAdminPostList(initialData.id, payload);
				toast.success("Cập nhật thành công");
				router.refresh();
			}
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={isEdit ? "Chi tiết danh sách bài viết" : "Thêm danh sách bài viết"}
				subtitle={
					isEdit ? "Chỉnh sửa thông tin danh sách" : "Tạo danh sách bài viết mới"
				}
				backHref="/admin/post-lists"
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: isEdit
								? "Cập nhật"
								: "Tạo danh sách"}
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader title="Thông tin danh sách" />
						<CardBody className="space-y-4">
							<Field label="Tên" required error={errors.name} htmlFor="name">
								<Input
									id="name"
									value={form.name}
									onChange={(e) => update("name", e.target.value)}
									placeholder="VD: Tin tức, Dịch vụ"
								/>
							</Field>

							<SlugField
								value={form.slug ?? ""}
								onChange={handleSlugChange}
								source={form.name}
								hint="Tự sinh từ tên — đây là URL của trang list (vd: /tin-tuc)"
								placeholder="tin-tuc"
							/>

							<Field label="Mô tả" htmlFor="description">
								<TextEditor
									value={form.description ?? ""}
									onChange={(content) => update("description", content)}
									height={300}
									placeholder="Mô tả ngắn hiển thị ở đầu trang list"
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
