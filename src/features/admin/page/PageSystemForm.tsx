"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DetailPageHeader,
	Field,
	Input,
	Select,
	type TabItem,
	Tabs,
	Textarea,
} from "@/features/admin/ui";
import {
	type AdminPage,
	type AdminPageSection,
	AdminApiError,
	type CreatePagePayload,
	PageTypeEnum,
	StatusCommonEnum,
	clearPageCache,
	createAdminPage,
	updateAdminPage,
} from "@/lib/api/admin";
import { PAGE_CODE_OPTIONS, normalizeSlugValue } from "./constants";
import { SlugInput } from "./SlugInput";
import { SortableSectionsList } from "./SortableSectionsList";

interface PageSystemFormProps {
	mode: "create" | "edit";
	initialData?: AdminPage;
	/** Callback khi sections thay đổi (BE đã update). */
	onSectionsChanged?: () => void;
	/** Nội dung hiển thị bên trái thanh action (title + meta). */
	headerLeft?: React.ReactNode;
}

interface FormState {
	slug: string;
	code: string;
	title: string;
	status: StatusCommonEnum;
	description: string;
	metaTitle: string;
	metaDescription: string;
	seoImage: string;
	canonicalUrl: string;
	seoKeywords: string;
	seoRobots: string;
	isSitemap: boolean;
}

const DEFAULT_FORM: FormState = {
	slug: "",
	code: "",
	title: "",
	status: StatusCommonEnum.ACTIVE,
	description: "",
	metaTitle: "",
	metaDescription: "",
	seoImage: "",
	canonicalUrl: "",
	seoKeywords: "",
	seoRobots: "index, follow",
	isSitemap: true,
};

export function PageSystemForm({
	mode,
	initialData,
	onSectionsChanged,
	headerLeft,
}: PageSystemFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";

	const [form, setForm] = useState<FormState>(() =>
		initialData
			? {
					slug: normalizeSlugValue(initialData.slug || ""),
					code: initialData.code ?? "",
					title: initialData.title ?? "",
					status: initialData.status,
					description: initialData.description ?? "",
					metaTitle: initialData.metaTitle ?? "",
					metaDescription: initialData.metaDescription ?? "",
					seoImage: initialData.seoImage ?? "",
					canonicalUrl: initialData.canonicalUrl ?? "",
					seoKeywords: initialData.seoKeywords ?? "",
					seoRobots: initialData.seoRobots ?? "index, follow",
					isSitemap: initialData.isSitemap ?? true,
				}
			: DEFAULT_FORM,
	);
	const [submitting, setSubmitting] = useState(false);
	const [clearingCache, setClearingCache] = useState(false);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	async function handleClearCache() {
		if (!initialData) return;
		setClearingCache(true);
		try {
			const result = await clearPageCache(initialData.id);
			if (result.cleared) {
				toast.success(`Đã xóa cache page ${result.code ?? ""}`.trim());
			} else {
				toast.info("Page chưa có code, không có cache để xóa");
			}
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
		} finally {
			setClearingCache(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		try {
			const payload: CreatePagePayload = {
				slug: normalizeSlugValue(form.slug || ""),
				code: form.code?.trim() || undefined,
				type: PageTypeEnum.SYSTEM,
				title: form.title?.trim() || undefined,
				status: form.status,
				description: form.description?.trim() || undefined,
				metaTitle: form.metaTitle?.trim() || undefined,
				metaDescription: form.metaDescription?.trim() || undefined,
				seoImage: form.seoImage?.trim() || undefined,
				canonicalUrl: form.canonicalUrl?.trim() || undefined,
				seoKeywords: form.seoKeywords?.trim() || undefined,
				seoRobots: form.seoRobots?.trim() || undefined,
				isSitemap: form.isSitemap,
			};
			if (mode === "create") {
				const created = await createAdminPage(payload);
				toast.success("Tạo trang thành công");
				router.push(`/admin/pages/${created.id}`);
			} else if (initialData) {
				await updateAdminPage(initialData.id, payload);
				toast.success("Cập nhật trang thành công");
			}
			router.refresh();
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
		} finally {
			setSubmitting(false);
		}
	}

	const sections: AdminPageSection[] = initialData?.sections ?? [];

	const generalTab = (
		<div className="space-y-4">
			<Card>
				<CardHeader title="Thông tin chung" />
				<CardBody className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field label="Tiêu đề" required htmlFor="title">
							<Input
								id="title"
								value={form.title}
								onChange={(e) => update("title", e.target.value)}
								placeholder="Nhập tiêu đề trang"
							/>
						</Field>

						<Field label="Code" htmlFor="code">
							<Select
								id="code"
								value={form.code}
								onChange={(e) => update("code", e.target.value)}
								disabled={isEdit}
							>
								<option value="">-- Chọn code --</option>
								{PAGE_CODE_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</Select>
						</Field>
					</div>

					<Field label="Slug" required htmlFor="slug">
						<SlugInput
							id="slug"
							value={form.slug}
							onChange={(v) => update("slug", v)}
							titleSource={form.title}
							disabled={submitting}
							defaultEditable={!isEdit}
						/>
					</Field>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field label="Trạng thái" htmlFor="status">
							<Select
								id="status"
								value={String(form.status)}
								onChange={(e) =>
									update("status", Number(e.target.value) as StatusCommonEnum)
								}
							>
								<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
								<option value={StatusCommonEnum.INACTIVE}>Không hoạt động</option>
							</Select>
						</Field>

						<div className="flex items-end pb-1">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={form.isSitemap}
									onChange={(e) => update("isSitemap", e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								Hiển thị trên sitemap
							</label>
						</div>
					</div>

					<Field label="Mô tả" htmlFor="description">
						<Textarea
							id="description"
							value={form.description}
							onChange={(e) => update("description", e.target.value)}
							rows={3}
						/>
					</Field>
				</CardBody>
			</Card>

			{isEdit && initialData && (
				<SortableSectionsList
					pageId={initialData.id}
					sections={sections}
					onChanged={() => onSectionsChanged?.()}
				/>
			)}
		</div>
	);

	const seoTab = (
		<Card>
			<CardHeader title="SEO" />
			<CardBody className="space-y-4">
				<Field label="Meta title" htmlFor="metaTitle">
					<Input
						id="metaTitle"
						value={form.metaTitle}
						onChange={(e) => update("metaTitle", e.target.value)}
					/>
				</Field>

				<Field label="Meta description" htmlFor="metaDescription">
					<Textarea
						id="metaDescription"
						value={form.metaDescription}
						onChange={(e) => update("metaDescription", e.target.value)}
					/>
				</Field>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field label="SEO image URL" htmlFor="seoImage">
						<Input
							id="seoImage"
							value={form.seoImage}
							onChange={(e) => update("seoImage", e.target.value)}
						/>
					</Field>
					<Field label="Canonical URL" htmlFor="canonicalUrl">
						<Input
							id="canonicalUrl"
							value={form.canonicalUrl}
							onChange={(e) => update("canonicalUrl", e.target.value)}
						/>
					</Field>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field label="SEO keywords" htmlFor="seoKeywords">
						<Input
							id="seoKeywords"
							value={form.seoKeywords}
							onChange={(e) => update("seoKeywords", e.target.value)}
						/>
					</Field>
					<Field label="Robots" htmlFor="seoRobots">
						<Input
							id="seoRobots"
							value={form.seoRobots}
							onChange={(e) => update("seoRobots", e.target.value)}
							placeholder="index, follow"
						/>
					</Field>
				</div>
			</CardBody>
		</Card>
	);

	const tabItems: TabItem[] = [
		{ key: "general", label: "Thông tin chung", children: generalTab },
		{ key: "seo", label: "SEO", children: seoTab },
	];

	const titleText = isEdit
		? initialData?.title || initialData?.slug || "Chi tiết trang"
		: "Thêm trang";
	const subtitleText = isEdit
		? `/${initialData?.slug ?? ""}${initialData?.code ? ` · ${initialData.code}` : ""}`
		: "Tạo trang hệ thống mới";

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={titleText}
				subtitle={subtitleText}
				backHref="/admin/pages"
				extraActions={
					isEdit && initialData ? (
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={handleClearCache}
							disabled={clearingCache}
						>
							<Trash2 className="h-4 w-4" />
							{clearingCache ? "Đang xóa cache..." : "Xóa cache"}
						</Button>
					) : null
				}
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo trang"}
					</Button>
				}
			/>
			{headerLeft && <div>{headerLeft}</div>}
			<Tabs items={tabItems} />
		</form>
	);
}
