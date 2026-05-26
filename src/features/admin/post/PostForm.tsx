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
	type TabItem,
	Tabs,
	Textarea,
	UploadSingle,
	useAutoSlug,
} from "@/features/admin/ui";

const TextEditor = dynamic(
	() => import("@/features/admin/ui/TextEditor").then((m) => m.TextEditor),
	{
		ssr: false,
		loading: () => (
			<div className="h-[400px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
				Đang tải editor...
			</div>
		),
	},
);
import {
	type AdminPost,
	AdminApiError,
	type CreatePostPayload,
	StatusCommonEnum,
	createAdminPost,
	updateAdminPost,
} from "@/lib/api/admin";
import { useAdminPostLists } from "@/features/admin/post-list/useAdminPostLists";

interface PostFormProps {
	mode: "create" | "edit";
	initialData?: AdminPost;
}

interface FormState extends CreatePostPayload {}

const DEFAULT_FORM: FormState = {
	title: "",
	slug: "",
	content: "",
	shortDescription: "",
	featuredImage: "",
	authorId: undefined,
	postListId: null,
	metaTitle: "",
	metaDescription: "",
	metaKeywords: "",
	status: StatusCommonEnum.ACTIVE,
};

export function PostForm({ mode, initialData }: PostFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";
	const [form, setForm] = useState<FormState>(() =>
		initialData
			? {
					title: initialData.title,
					slug: initialData.slug,
					content: initialData.content ?? "",
					shortDescription: initialData.shortDescription ?? "",
					featuredImage: initialData.featuredImage ?? "",
					authorId: initialData.authorId,
					postListId: initialData.postList?.id ?? null,
					metaTitle: initialData.metaTitle ?? "",
					metaDescription: initialData.metaDescription ?? "",
					metaKeywords: initialData.metaKeywords ?? "",
					status: initialData.status,
				}
			: DEFAULT_FORM,
	);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
		{},
	);

	const { data: postListData } = useAdminPostLists({ limit: 100, page: 1 });
	const postLists = postListData?.data ?? [];

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	const { handleSlugChange } = useAutoSlug({
		source: form.title,
		value: form.slug ?? "",
		setValue: (next) => update("slug", next),
		isEdit,
	});

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErrors({});
		if (!form.title.trim()) {
			setErrors({ title: "Tiêu đề là bắt buộc" });
			return;
		}

		setSubmitting(true);
		try {
			const payload: CreatePostPayload = {
				...form,
				title: form.title.trim(),
				slug: form.slug?.trim() || undefined,
				content: form.content?.trim() || undefined,
				shortDescription: form.shortDescription?.trim() || undefined,
				featuredImage: form.featuredImage?.trim() || undefined,
				postListId: form.postListId ?? undefined,
				metaTitle: form.metaTitle?.trim() || undefined,
				metaDescription: form.metaDescription?.trim() || undefined,
				metaKeywords: form.metaKeywords?.trim() || undefined,
			};
			if (mode === "create") {
				await createAdminPost(payload);
				toast.success("Tạo bài viết thành công");
				router.push("/admin/posts");
			} else if (initialData) {
				await updateAdminPost(initialData.id, payload);
				toast.success("Cập nhật bài viết thành công");
				router.refresh();
			}
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
		} finally {
			setSubmitting(false);
		}
	}

	const contentTab = (
		<Card>
			<CardBody className="space-y-4">
				<Field label="Tiêu đề" required error={errors.title} htmlFor="title">
					<Input
						id="title"
						value={form.title}
						onChange={(e) => update("title", e.target.value)}
						placeholder="VD: Cách bảo dưỡng ắc quy ô tô"
					/>
				</Field>

				<SlugField
					value={form.slug ?? ""}
					onChange={handleSlugChange}
					source={form.title}
					hint="Tự sinh từ tiêu đề — hoặc nhập tay"
					placeholder="huong-dan-lap-thiet-bi-ho-boi"
				/>

				<Field label="Mô tả ngắn" htmlFor="shortDescription">
					<Textarea
						id="shortDescription"
						value={form.shortDescription ?? ""}
						onChange={(e) => update("shortDescription", e.target.value)}
						placeholder="Tóm tắt hiển thị trên list, mạng xã hội..."
						rows={3}
					/>
				</Field>

				<Field label="Nội dung" htmlFor="content">
					<TextEditor
						value={form.content ?? ""}
						onChange={(content) => update("content", content)}
						height={500}
						placeholder="Nhập nội dung bài viết..."
					/>
				</Field>
			</CardBody>
		</Card>
	);

	const seoTab = (
		<Card>
			<CardBody className="space-y-4">
				<Field label="Meta title" htmlFor="metaTitle">
					<Input
						id="metaTitle"
						value={form.metaTitle ?? ""}
						onChange={(e) => update("metaTitle", e.target.value)}
					/>
				</Field>
				<Field label="Meta description" htmlFor="metaDescription">
					<Textarea
						id="metaDescription"
						value={form.metaDescription ?? ""}
						onChange={(e) => update("metaDescription", e.target.value)}
						rows={3}
					/>
				</Field>
				<Field label="Meta keywords" htmlFor="metaKeywords">
					<Input
						id="metaKeywords"
						value={form.metaKeywords ?? ""}
						onChange={(e) => update("metaKeywords", e.target.value)}
						placeholder="ắc quy, bảo dưỡng"
					/>
				</Field>
			</CardBody>
		</Card>
	);

	const tabs: TabItem[] = [
		{ key: "content", label: "Nội dung", children: contentTab },
		{ key: "seo", label: "SEO", children: seoTab },
	];

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={isEdit ? "Chi tiết bài viết" : "Thêm bài viết"}
				subtitle={
					isEdit ? "Chỉnh sửa thông tin bài viết" : "Tạo bài viết mới"
				}
				backHref="/admin/posts"
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: isEdit
								? "Cập nhật"
								: "Tạo bài viết"}
					</Button>
				}
			/>

			<Tabs items={tabs} />

			<Card>
				<CardHeader title="Thiết lập" />
				<CardBody className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field label="Trạng thái">
							<Select
								value={String(form.status ?? StatusCommonEnum.ACTIVE)}
								onChange={(e) =>
									update("status", Number(e.target.value) as StatusCommonEnum)
								}
							>
								<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
								<option value={StatusCommonEnum.INACTIVE}>Lưu trữ</option>
							</Select>
						</Field>

						<Field
							label="Danh sách bài viết"
							hint="Bài viết thuộc về danh sách nào (vd: Tin tức, Dịch vụ)"
							htmlFor="postListId"
						>
							<Select
								id="postListId"
								value={form.postListId ? String(form.postListId) : ""}
								onChange={(e) =>
									update(
										"postListId",
										e.target.value === "" ? null : Number(e.target.value),
									)
								}
							>
								<option value="">— Không thuộc danh sách —</option>
								{postLists.map((pl) => (
									<option key={pl.id} value={pl.id}>
										{pl.name}
									</option>
								))}
							</Select>
						</Field>
					</div>
				</CardBody>
			</Card>

			<Card>
				<CardHeader title="Ảnh đại diện" />
				<CardBody>
					<UploadSingle
						value={form.featuredImage}
						onChange={(path) => update("featuredImage", path ?? "")}
					/>
				</CardBody>
			</Card>
		</form>
	);
}
