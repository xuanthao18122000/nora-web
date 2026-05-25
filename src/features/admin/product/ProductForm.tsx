"use client";

import { Save, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { ProductFacetValues } from "@/features/admin/product-facet-values";
import {
	type AdminProduct,
	AdminApiError,
	type CreateProductPayload,
	StatusCommonEnum,
	createAdminProduct,
	updateAdminProduct,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";
import { MultiCategoryPicker } from "./MultiCategoryPicker";
import { useAdminCategoryTreeForProduct } from "./useAdminProducts";

interface ProductFormProps {
	mode: "create" | "edit";
	initialData?: AdminProduct;
	/** Action bổ sung hiển thị bên cạnh các nút mặc định ở header. */
	extraHeaderActions?: React.ReactNode;
}

interface FormState extends Omit<CreateProductPayload, "categoryIds"> {
	categoryIds: number[];
}

const DEFAULT_FORM: FormState = {
	name: "",
	slug: "",
	sku: "",
	shortDescription: "",
	description: "",
	price: 0,
	salePrice: undefined,
	costPrice: 0,
	stockQuantity: 0,
	unit: "",
	thumbnailUrl: "",
	images: [],
	categoryIds: [],
	origin: "",
	barcode: "",
	priority: 0,
	isBestSeller: false,
	showPrice: true,
	metaTitle: "",
	metaDescription: "",
	metaKeywords: "",
	metaRobots: "index,follow",
	canonicalUrl: "",
	status: StatusCommonEnum.ACTIVE,
};

function parseRobots(value: string | undefined) {
	const tokens = (value ?? "")
		.split(",")
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean);
	return {
		index: tokens.includes("index"),
		follow: tokens.includes("follow"),
	};
}

function buildRobots(index: boolean, follow: boolean) {
	const parts: string[] = [];
	parts.push(index ? "index" : "noindex");
	parts.push(follow ? "follow" : "nofollow");
	return parts.join(",");
}

export function ProductForm({
	mode,
	initialData,
	extraHeaderActions,
}: ProductFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";

	const { data: tree } = useAdminCategoryTreeForProduct();

	const [form, setForm] = useState<FormState>(() => {
		if (!initialData) return DEFAULT_FORM;
		return {
			name: initialData.name,
			slug: initialData.slug,
			sku: initialData.sku,
			shortDescription: initialData.shortDescription ?? "",
			description: initialData.description ?? "",
			price: Number(initialData.price),
			salePrice:
				initialData.salePrice !== undefined && initialData.salePrice !== null
					? Number(initialData.salePrice)
					: undefined,
			costPrice: Number(initialData.costPrice ?? 0),
			stockQuantity: Number(initialData.stockQuantity ?? 0),
			unit: initialData.unit ?? "",
			thumbnailUrl: initialData.thumbnailUrl ?? "",
			images: initialData.images ?? [],
			categoryIds: (initialData.productCategories ?? []).map(
				(rel) => rel.category.id,
			),
			origin: initialData.origin ?? "",
			barcode: initialData.barcode ?? "",
			priority: initialData.priority ?? 0,
			isBestSeller: initialData.isBestSeller ?? false,
			showPrice: initialData.showPrice ?? true,
			metaTitle: initialData.metaTitle ?? "",
			metaDescription: initialData.metaDescription ?? "",
			metaKeywords: initialData.metaKeywords ?? "",
			metaRobots: initialData.metaRobots ?? "index,follow",
			canonicalUrl: initialData.canonicalUrl ?? "",
			status: initialData.status,
		};
	});
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
		{},
	);
	const robots = useMemo(() => parseRobots(form.metaRobots), [form.metaRobots]);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	const { handleSlugChange } = useAutoSlug({
		source: form.name,
		value: form.slug ?? "",
		setValue: (next) => update("slug", next),
		isEdit,
	});

	const { handleSlugChange: handleSkuChange } = useAutoSlug({
		source: form.name,
		value: form.sku ?? "",
		setValue: (next) => update("sku", next),
		isEdit,
	});

	function updateRobots(part: "index" | "follow", value: boolean) {
		const next = { ...robots, [part]: value };
		update("metaRobots", buildRobots(next.index, next.follow));
	}

	function removeImage(index: number) {
		const next = (form.images ?? []).filter((_, i) => i !== index);
		update("images", next);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const newErrors: Partial<Record<keyof FormState, string>> = {};
		if (!form.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
		if (!form.sku.trim()) newErrors.sku = "SKU là bắt buộc";
		if (form.price < 0) newErrors.price = "Giá không được âm";
		setErrors(newErrors);
		if (Object.keys(newErrors).length) return;

		setSubmitting(true);
		try {
			const payload: CreateProductPayload = {
				...form,
				name: form.name.trim(),
				slug: form.slug?.trim() || undefined,
				sku: form.sku.trim(),
				shortDescription: form.shortDescription?.trim() || undefined,
				description: form.description?.trim() || undefined,
				unit: form.unit?.trim() || undefined,
				thumbnailUrl: form.thumbnailUrl?.trim() || undefined,
				origin: form.origin?.trim() || undefined,
				barcode: form.barcode?.trim() || undefined,
				metaTitle: form.metaTitle?.trim() || undefined,
				metaDescription: form.metaDescription?.trim() || undefined,
				metaKeywords: form.metaKeywords?.trim() || undefined,
				metaRobots: form.metaRobots?.trim() || undefined,
				canonicalUrl: form.canonicalUrl?.trim() || undefined,
				salePrice:
					form.salePrice === undefined ? undefined : Number(form.salePrice),
				costPrice: Number(form.costPrice ?? 0),
				stockQuantity: Number(form.stockQuantity ?? 0),
				price: Number(form.price),
				categoryIds: form.categoryIds,
				images: form.images?.length ? form.images : undefined,
			};

			if (mode === "create") {
				await createAdminProduct(payload);
				toast.success("Tạo sản phẩm thành công");
				router.push("/admin/products");
			} else if (initialData) {
				await updateAdminProduct(initialData.id, payload);
				toast.success("Cập nhật sản phẩm thành công");
				router.refresh();
			}
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
		} finally {
			setSubmitting(false);
		}
	}

	// ─── Tabs content ───────────────────────────────────────────────

	const generalTab = (
		<div className="space-y-4">
			<Card>
				<CardBody className="space-y-4">
					<Field
						label="Tên sản phẩm"
						required
						error={errors.name}
						htmlFor="name"
					>
						<Input
							id="name"
							value={form.name}
							onChange={(e) => update("name", e.target.value)}
						/>
					</Field>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<SlugField
							id="sku"
							label="SKU"
							required
							error={errors.sku}
							value={form.sku}
							onChange={handleSkuChange}
							source={form.name}
							hint="Tự sinh từ tên — hoặc nhập tay"
							placeholder="vd: may-bom-hayward-1-5hp"
						/>
						<Field label="Mã vạch" htmlFor="barcode">
							<Input
								id="barcode"
								value={form.barcode ?? ""}
								onChange={(e) => update("barcode", e.target.value)}
							/>
						</Field>
					</div>

					<SlugField
						value={form.slug ?? ""}
						onChange={handleSlugChange}
						source={form.name}
						placeholder="vd: may-bom-hayward-1-5hp"
					/>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						<Field
							label="Giá bán"
							required
							error={errors.price}
							htmlFor="price"
						>
							<Input
								id="price"
								type="number"
								min={0}
								value={form.price}
								onChange={(e) => update("price", Number(e.target.value))}
							/>
						</Field>
						<Field label="Giá khuyến mãi" htmlFor="salePrice">
							<Input
								id="salePrice"
								type="number"
								min={0}
								value={form.salePrice ?? ""}
								onChange={(e) =>
									update(
										"salePrice",
										e.target.value === "" ? undefined : Number(e.target.value),
									)
								}
							/>
						</Field>
						<Field label="Giá vốn" htmlFor="costPrice">
							<Input
								id="costPrice"
								type="number"
								min={0}
								value={form.costPrice ?? 0}
								onChange={(e) => update("costPrice", Number(e.target.value))}
							/>
						</Field>
						<Field label="Tồn kho" htmlFor="stockQuantity">
							<Input
								id="stockQuantity"
								type="number"
								min={0}
								value={form.stockQuantity ?? 0}
								onChange={(e) =>
									update("stockQuantity", Number(e.target.value))
								}
							/>
						</Field>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field label="Đơn vị" htmlFor="unit">
							<Input
								id="unit"
								value={form.unit ?? ""}
								onChange={(e) => update("unit", e.target.value)}
								placeholder="cái"
							/>
						</Field>
						<Field label="Xuất xứ" htmlFor="origin">
							<Input
								id="origin"
								value={form.origin ?? ""}
								onChange={(e) => update("origin", e.target.value)}
								placeholder="Việt Nam"
							/>
						</Field>
					</div>

					<Field label="Mô tả ngắn" htmlFor="shortDescription">
						<Textarea
							id="shortDescription"
							value={form.shortDescription ?? ""}
							onChange={(e) => update("shortDescription", e.target.value)}
							rows={3}
						/>
					</Field>

					<Field label="Mô tả chi tiết" htmlFor="description">
						<TextEditor
							value={form.description ?? ""}
							onChange={(description) => update("description", description)}
						/>
					</Field>
				</CardBody>
			</Card>
		</div>
	);

	function appendImage(path: string | null) {
		if (!path) return;
		const next = [...(form.images ?? []), path];
		update("images", next);
	}

	const imageTab = (
		<Card>
			<CardBody className="space-y-5">
				<Field label="Ảnh đại diện">
					<UploadSingle
						value={form.thumbnailUrl}
						onChange={(path) => update("thumbnailUrl", path ?? "")}
					/>
				</Field>

				<Field
					label="Thư viện ảnh"
					hint="Tải ảnh hoặc dán link — hỗ trợ tối đa 20 ảnh"
				>
					<div className="space-y-3">
						{/* `key` reset UploadSingle sau mỗi lần thêm để slot mới sạch */}
						<UploadSingle
							key={`gallery-${form.images?.length ?? 0}`}
							value={null}
							onChange={appendImage}
						/>
						{form.images && form.images.length > 0 && (
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
								{form.images.map((url, i) => (
									<div
										key={`${url}-${i}`}
										className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
									>
										{/* biome-ignore lint/performance/noImgElement: external URL */}
										<img
											src={getImageUrl(url)}
											alt=""
											className="h-full w-full object-cover"
										/>
										<button
											type="button"
											onClick={() => removeImage(i)}
											className="absolute right-1.5 top-1.5 rounded-full bg-white/95 p-1.5 text-gray-600 shadow-sm hover:bg-white hover:text-red-600"
											aria-label="Xoá ảnh"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
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
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field label="Meta keywords" htmlFor="metaKeywords">
						<Input
							id="metaKeywords"
							value={form.metaKeywords ?? ""}
							onChange={(e) => update("metaKeywords", e.target.value)}
						/>
					</Field>
					<Field label="Canonical URL" htmlFor="canonicalUrl">
						<Input
							id="canonicalUrl"
							value={form.canonicalUrl ?? ""}
							onChange={(e) => update("canonicalUrl", e.target.value)}
						/>
					</Field>
				</div>
			</CardBody>
		</Card>
	);

	const tabs: TabItem[] = [
		{ key: "general", label: "Thông tin sản phẩm", children: generalTab },
		{ key: "images", label: "Hình ảnh", children: imageTab },
		{ key: "seo", label: "SEO", children: seoTab },
	];

	// ─── Sidebar ────────────────────────────────────────────────────

	const sidebar = (
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
					<Field label="Ưu tiên" hint="Số nhỏ hiển thị trước" htmlFor="priority">
						<Input
							id="priority"
							type="number"
							min={0}
							value={form.priority ?? 0}
							onChange={(e) => update("priority", Number(e.target.value))}
						/>
					</Field>
				</CardBody>
			</Card>

			<Card>
				<CardHeader title="Robots" />
				<CardBody className="space-y-2">
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={robots.index}
							onChange={(e) => updateRobots("index", e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
						/>
						Index
					</label>
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={robots.follow}
							onChange={(e) => updateRobots("follow", e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
						/>
						Follow
					</label>
				</CardBody>
			</Card>

			<Card>
				<CardHeader title="Phân loại" />
				<CardBody className="space-y-4">
					<Field label="Danh mục">
						<MultiCategoryPicker
							tree={(tree as any) ?? []}
							value={form.categoryIds}
							onChange={(ids) => update("categoryIds", ids)}
						/>
					</Field>
				</CardBody>
			</Card>

			<Card>
				<CardHeader title="Cấu hình" />
				<CardBody className="space-y-3">
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={form.isBestSeller ?? false}
							onChange={(e) => update("isBestSeller", e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
						/>
						Best seller
					</label>
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={form.showPrice ?? true}
							onChange={(e) => update("showPrice", e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
						/>
						Hiển thị giá <span className="text-gray-500">(bỏ chọn = "Liên hệ")</span>
					</label>
				</CardBody>
			</Card>

			{form.thumbnailUrl && (
				<Card>
					<CardHeader title="Ảnh thumbnail" />
					<CardBody>
						<div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
							{/* biome-ignore lint/performance/noImgElement: external URL */}
							<img
								src={getImageUrl(form.thumbnailUrl)}
								alt=""
								className="h-full w-full object-cover"
							/>
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);

	// ─── Page ───────────────────────────────────────────────────────

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={isEdit ? "Chi tiết sản phẩm" : "Thêm sản phẩm"}
				subtitle={
					isEdit
						? "Chỉnh sửa thông tin sản phẩm"
						: "Nhập thông tin sản phẩm mới"
				}
				backHref="/admin/products"
				extraActions={extraHeaderActions}
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: isEdit
								? "Cập nhật"
								: "Tạo sản phẩm"}
					</Button>
				}
			/>

			{/* Body */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Tabs items={tabs} />
				</div>
				<div className="lg:col-span-1">{sidebar}</div>
			</div>

			{isEdit && initialData && (
				<ProductFacetValues
					productId={initialData.id}
					categoryIds={form.categoryIds}
				/>
			)}
		</form>
	);
}
