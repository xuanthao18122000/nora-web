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
import { CategoryFacetConfig } from "@/features/admin/category-facets";
import {
	type AdminCategory,
	AdminApiError,
	type CreateCategoryPayload,
	StatusCommonEnum,
	createAdminCategory,
	updateAdminCategory,
} from "@/lib/api/admin";
import { useAdminCategoryTree } from "./useAdminCategories";

interface CategoryFormProps {
	mode: "create" | "edit";
	initialData?: AdminCategory;
}

interface FormState extends CreateCategoryPayload {
	parentId: number | null;
}

const DEFAULT_FORM: FormState = {
	parentId: null,
	name: "",
	slug: "",
	description: "",
	priority: 0,
	position: 0,
	iconUrl: "",
	thumbnailUrl: "",
	canonicalUrl: "",
	metaTitle: "",
	metaDescription: "",
	metaKeywords: "",
	metaRobots: "noindex,nofollow",
	status: StatusCommonEnum.ACTIVE,
};

function buildTreeOptions(
	nodes: { id: number; name: string; children: any[] }[],
	excludeId?: number,
	depth = 0,
): { id: number; label: string }[] {
	const out: { id: number; label: string }[] = [];
	for (const node of nodes) {
		if (node.id === excludeId) continue;
		out.push({ id: node.id, label: `${"— ".repeat(depth)}${node.name}` });
		if (node.children?.length) {
			out.push(...buildTreeOptions(node.children, excludeId, depth + 1));
		}
	}
	return out;
}

export function CategoryForm({ mode, initialData }: CategoryFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";
	const { data: tree } = useAdminCategoryTree();

	const [form, setForm] = useState<FormState>(() =>
		initialData
			? {
					parentId: initialData.parent?.id ?? initialData.parentId ?? null,
					name: initialData.name,
					slug: initialData.slug,
					description: initialData.description ?? "",
					priority: initialData.priority,
					position: initialData.position,
					iconUrl: initialData.iconUrl ?? "",
					thumbnailUrl: initialData.thumbnailUrl ?? "",
					canonicalUrl: initialData.canonicalUrl ?? "",
					metaTitle: initialData.metaTitle ?? "",
					metaDescription: initialData.metaDescription ?? "",
					metaKeywords: initialData.metaKeywords ?? "",
					metaRobots: initialData.metaRobots,
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

	const parentOptions = buildTreeOptions(
		(tree as any) ?? [],
		mode === "edit" ? initialData?.id : undefined,
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErrors({});

		if (!form.name.trim()) {
			setErrors({ name: "Tên danh mục là bắt buộc" });
			return;
		}

		setSubmitting(true);
		try {
			const payload: CreateCategoryPayload = {
				...form,
				name: form.name.trim(),
				slug: form.slug?.trim() || undefined,
				description: form.description?.trim() || undefined,
				iconUrl: form.iconUrl?.trim() || undefined,
				thumbnailUrl: form.thumbnailUrl?.trim() || undefined,
				canonicalUrl: form.canonicalUrl?.trim() || undefined,
				metaTitle: form.metaTitle?.trim() || undefined,
				metaDescription: form.metaDescription?.trim() || undefined,
				metaKeywords: form.metaKeywords?.trim() || undefined,
				metaRobots: form.metaRobots?.trim() || undefined,
				parentId: form.parentId ?? null,
			};

			if (mode === "create") {
				await createAdminCategory(payload);
				toast.success("Tạo danh mục thành công");
				router.push("/admin/categories");
			} else if (initialData) {
				await updateAdminCategory(initialData.id, payload);
				toast.success("Cập nhật danh mục thành công");
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

	const generalTab = (
		<Card>
			<CardBody className="space-y-4">
				<Field
					label="Tên danh mục"
					required
					error={errors.name}
					htmlFor="name"
				>
					<Input
						id="name"
						value={form.name}
						onChange={(e) => update("name", e.target.value)}
						placeholder="VD: Ắc quy ô tô"
					/>
				</Field>

				<SlugField
					value={form.slug ?? ""}
					onChange={handleSlugChange}
					source={form.name}
					placeholder="thiet-bi-ho-boi"
				/>

				<Field label="Mô tả" htmlFor="description">
					<TextEditor
						value={form.description ?? ""}
						onChange={(description) => update("description", description)}
					/>
				</Field>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Ảnh đại diện">
						<UploadSingle
							value={form.thumbnailUrl}
							onChange={(path) => update("thumbnailUrl", path ?? "")}
						/>
					</Field>
					<Field label="Icon">
						<UploadSingle
							value={form.iconUrl}
							onChange={(path) => update("iconUrl", path ?? "")}
						/>
					</Field>
				</div>
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
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Meta keywords" htmlFor="metaKeywords">
						<Input
							id="metaKeywords"
							value={form.metaKeywords ?? ""}
							onChange={(e) => update("metaKeywords", e.target.value)}
							placeholder="từ khoá 1, từ khoá 2"
						/>
					</Field>
					<Field label="Meta robots" htmlFor="metaRobots">
						<Input
							id="metaRobots"
							value={form.metaRobots ?? ""}
							onChange={(e) => update("metaRobots", e.target.value)}
						/>
					</Field>
				</div>
				<Field label="Canonical URL" htmlFor="canonicalUrl">
					<Input
						id="canonicalUrl"
						value={form.canonicalUrl ?? ""}
						onChange={(e) => update("canonicalUrl", e.target.value)}
					/>
				</Field>
			</CardBody>
		</Card>
	);

	const tabs: TabItem[] = [
		{ key: "general", label: "Thông tin danh mục", children: generalTab },
		{ key: "seo", label: "SEO", children: seoTab },
	];

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={isEdit ? "Chi tiết danh mục" : "Thêm danh mục"}
				subtitle={
					isEdit
						? "Chỉnh sửa thông tin danh mục"
						: "Nhập thông tin danh mục mới"
				}
				backHref="/admin/categories"
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: isEdit
								? "Cập nhật"
								: "Tạo danh mục"}
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Tabs items={tabs} />
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
							>
								<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
								<option value={StatusCommonEnum.INACTIVE}>Lưu trữ</option>
							</Select>
						</CardBody>
					</Card>

					<Card>
						<CardHeader title="Cấu trúc" />
						<CardBody className="space-y-4">
							<Field label="Danh mục cha" htmlFor="parentId">
								<Select
									id="parentId"
									value={form.parentId === null ? "" : String(form.parentId)}
									onChange={(e) =>
										update(
											"parentId",
											e.target.value === "" ? null : Number(e.target.value),
										)
									}
								>
									<option value="">— Không có (cấp 1) —</option>
									{parentOptions.map((opt) => (
										<option key={opt.id} value={opt.id}>
											{opt.label}
										</option>
									))}
								</Select>
							</Field>

							<div className="grid grid-cols-2 gap-3">
								<Field
									label="Vị trí"
									hint="Số nhỏ hiển thị trước"
									htmlFor="position"
								>
									<Input
										id="position"
										type="number"
										value={form.position ?? 0}
										onChange={(e) =>
											update("position", Number(e.target.value))
										}
									/>
								</Field>
								<Field label="Ưu tiên" htmlFor="priority">
									<Input
										id="priority"
										type="number"
										value={form.priority ?? 0}
										onChange={(e) =>
											update("priority", Number(e.target.value))
										}
									/>
								</Field>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>

			{isEdit && initialData && (
				<CategoryFacetConfig categoryId={initialData.id} />
			)}
		</form>
	);
}
