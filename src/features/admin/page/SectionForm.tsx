"use client";

import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
	type AdminPageSection,
	AdminApiError,
	type CreatePageSectionItemPayload,
	type CreatePageSectionPayload,
	DeviceTypeEnum,
	StatusCommonEnum,
	createAdminPageSection,
	replaceAdminPageSectionItems,
	updateAdminPageSection,
} from "@/lib/api/admin";
import {
	PageSectionKeyEnum,
	PageSectionTypeEnum,
	SECTION_KEY_TO_DB_TYPE,
	getSectionLabel,
} from "./constants";
import { LayoutMenu, buildMenuPayload } from "./sections/LayoutMenu";
import {
	ProductBoxSection,
	type ProductBoxExtra,
	buildProductBoxPayload,
} from "./sections/ProductBoxSection";
import {
	BannerSection,
	type BannerExtra,
	buildBannerPayload,
} from "./sections/BannerSection";
import {
	PostBoxSection,
	type PostBoxExtra,
	buildPostBoxPayload,
} from "./sections/PostBoxSection";
import {
	BoxCategorySection,
	type BoxCategoryExtra,
	buildBoxCategoryPayload,
} from "./sections/BoxCategorySection";

interface SectionFormProps {
	mode: "create" | "edit";
	pageId: string;
	initialData?: AdminPageSection;
	/** Preset khi tạo mới — từ query param ?type=banner. */
	presetType?: string;
	/** Preset khi tạo mới — từ query param ?key=hero_banner. Sẽ resolve type qua SECTION_KEY_TO_DB_TYPE. */
	presetKey?: string;
	/** Position mặc định khi tạo mới (thường = số sections hiện có để nằm dưới cùng). */
	defaultPosition?: number;
}

interface ItemState extends CreatePageSectionItemPayload {
	_localKey: string;
}

interface FormState {
	type: string;
	key: string;
	name: string;
	url: string;
	position: number;
	status: StatusCommonEnum;
	extraJson: string;
	items: ItemState[];
}

const DEFAULT_FORM: FormState = {
	type: "",
	key: "",
	name: "",
	url: "",
	position: 0,
	status: StatusCommonEnum.ACTIVE,
	extraJson: "",
	items: [],
};

function makeKey() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function toItemState(item: any): ItemState {
	return {
		_localKey: makeKey(),
		type: item.type ?? "",
		name: item.name ?? "",
		targetUrl: item.targetUrl ?? "",
		position: item.position ?? 0,
		data: item.data ?? "",
		extra: item.extra,
		deviceType: item.deviceType ?? DeviceTypeEnum.ALL,
		status: item.status ?? StatusCommonEnum.ACTIVE,
	};
}

function safeParseJson(text: string): Record<string, unknown> | null {
	if (!text.trim()) return null;
	try {
		return JSON.parse(text);
	} catch {
		throw new Error("Extra JSON không hợp lệ");
	}
}

export function SectionForm({
	mode,
	pageId,
	initialData,
	presetType,
	presetKey,
	defaultPosition,
}: SectionFormProps) {
	const router = useRouter();
	const [form, setForm] = useState<FormState>(() => {
		if (initialData) {
			return {
				type: initialData.type,
				key: initialData.key ?? "",
				name: initialData.name ?? "",
				url: initialData.url ?? "",
				position: initialData.position ?? 0,
				status: initialData.status,
				extraJson: initialData.extra ? JSON.stringify(initialData.extra, null, 2) : "",
				items: (initialData.items ?? []).map(toItemState),
			};
		}
		// Resolve preset values cho create mode
		const resolvedType = presetKey
			? SECTION_KEY_TO_DB_TYPE.get(presetKey) ?? presetType ?? ""
			: presetType ?? "";
		const resolvedKey = presetKey ?? "";
		const resolvedName = presetKey ? getSectionLabel(presetKey) : "";
		return {
			...DEFAULT_FORM,
			type: resolvedType,
			key: resolvedKey,
			name: resolvedName,
			position: defaultPosition ?? 0,
		};
	});
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

	const isLayoutMenu =
		form.key === PageSectionKeyEnum.LAYOUT_MENU ||
		form.key === PageSectionKeyEnum.LAYOUT_FOOTER;
	const isPostBox = form.key === PageSectionKeyEnum.NEWS;
	const isBoxCategory = form.key === PageSectionKeyEnum.BOX_DANH_MUC;
	const isProductBox = form.type === PageSectionTypeEnum.PRODUCT;
	const isBanner =
		form.type === PageSectionTypeEnum.BANNER && !isPostBox && !isBoxCategory;
	// LayoutMenu tự manage state nội bộ, ta giữ rows mới nhất qua ref để dùng khi submit
	const layoutMenuRowsRef = useRef<unknown[]>([]);
	const productBoxStateRef = useRef<{
		products: Parameters<typeof buildProductBoxPayload>[0];
		tabs: Parameters<typeof buildProductBoxPayload>[1];
		extra: ProductBoxExtra;
	}>({ products: [], tabs: [], extra: {} });
	const bannerStateRef = useRef<{
		items: Parameters<typeof buildBannerPayload>[0];
		extra: BannerExtra;
	}>({ items: [], extra: {} });
	const postBoxStateRef = useRef<{
		posts: Parameters<typeof buildPostBoxPayload>[0];
		extra: PostBoxExtra;
	}>({ posts: [], extra: {} });
	const boxCategoryStateRef = useRef<{
		items: Parameters<typeof buildBoxCategoryPayload>[0];
		extra: BoxCategoryExtra;
	}>({ items: [], extra: {} });

	// Lock fields đã có giá trị từ preset (create) hoặc từ DB (edit)
	const typeLocked = mode === "edit" || Boolean(presetType || presetKey);
	const keyLocked = mode === "edit" ? Boolean(initialData?.key) : Boolean(presetKey);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	function addItem() {
		setForm((s) => ({
			...s,
			items: [
				...s.items,
				{
					_localKey: makeKey(),
					type: "",
					name: "",
					targetUrl: "",
					position: s.items.length,
					data: "",
					deviceType: DeviceTypeEnum.ALL,
					status: StatusCommonEnum.ACTIVE,
				},
			],
		}));
	}

	function updateItem(index: number, patch: Partial<ItemState>) {
		setForm((s) => {
			const items = s.items.slice();
			items[index] = { ...items[index], ...patch };
			return { ...s, items };
		});
	}

	function removeItem(index: number) {
		setForm((s) => ({ ...s, items: s.items.filter((_, i) => i !== index) }));
	}

	async function persistAll(opts?: { silent?: boolean; redirect?: boolean }) {
		const newErrors: Partial<Record<keyof FormState, string>> = {};
		if (!form.type.trim()) newErrors.type = "Type là bắt buộc";
		setErrors(newErrors);
		if (Object.keys(newErrors).length) return false;

		let extra: Record<string, unknown> | null;
		try {
			extra = safeParseJson(form.extraJson);
		} catch (err) {
			toast.error((err as Error).message);
			return false;
		}
		// ProductBox / Banner / PostBox / BoxCategory: extra lấy từ component state ref
		if (isProductBox) {
			extra = productBoxStateRef.current.extra as Record<string, unknown>;
		} else if (isBanner) {
			extra = bannerStateRef.current.extra as Record<string, unknown>;
		} else if (isPostBox) {
			extra = postBoxStateRef.current.extra as Record<string, unknown>;
		} else if (isBoxCategory) {
			extra = boxCategoryStateRef.current.extra as Record<string, unknown>;
		}

		setSubmitting(true);
		try {
			let itemsPayload: CreatePageSectionItemPayload[];
			if (isLayoutMenu) {
				itemsPayload = buildMenuPayload(
					layoutMenuRowsRef.current as Parameters<typeof buildMenuPayload>[0],
				).map((it) => ({
					type: it.type,
					name: it.name,
					targetUrl: it.targetUrl,
					position: it.position,
					data: it.data,
					deviceType: DeviceTypeEnum.ALL,
					status: it.status,
				}));
			} else if (isProductBox) {
				const { products, tabs } = productBoxStateRef.current;
				itemsPayload = buildProductBoxPayload(products, tabs).map((it) => ({
					type: it.type,
					name: it.name,
					position: it.position,
					data: it.data,
					deviceType: DeviceTypeEnum.ALL,
					status: it.status,
				}));
			} else if (isBanner) {
				itemsPayload = buildBannerPayload(bannerStateRef.current.items).map(
					(it) => ({
						type: it.type,
						name: it.name,
						position: it.position,
						data: it.data,
						deviceType: DeviceTypeEnum.ALL,
						status: it.status,
					}),
				);
			} else if (isPostBox) {
				// PostBox: mode "auto" → items rỗng (BE tự fetch theo extra.postListId).
				// Mode "manual" → posts admin chọn.
				itemsPayload = buildPostBoxPayload(postBoxStateRef.current.posts).map(
					(it) => ({
						type: it.type,
						name: it.name,
						position: it.position,
						data: it.data,
						deviceType: DeviceTypeEnum.ALL,
						status: it.status,
					}),
				);
			} else if (isBoxCategory) {
				itemsPayload = buildBoxCategoryPayload(
					boxCategoryStateRef.current.items,
				).map((it) => ({
					type: it.type,
					name: it.name,
					targetUrl: it.targetUrl,
					position: it.position,
					data: it.data,
					deviceType: DeviceTypeEnum.ALL,
					status: it.status,
				}));
			} else {
				itemsPayload = form.items.map((it, i) => ({
					type: it.type?.trim() || undefined,
					name: it.name?.trim() || undefined,
					targetUrl: it.targetUrl?.trim() || undefined,
					position: it.position ?? i,
					data: it.data?.trim() || undefined,
					extra: it.extra,
					deviceType: it.deviceType ?? DeviceTypeEnum.ALL,
					status: it.status ?? StatusCommonEnum.ACTIVE,
				}));
			}

			if (mode === "create") {
				const payload: CreatePageSectionPayload = {
					pageId,
					type: form.type.trim(),
					key: form.key?.trim() || undefined,
					name: form.name?.trim() || undefined,
					url: form.url?.trim() || undefined,
					position: form.position,
					status: form.status,
					extra: extra ?? undefined,
					items: itemsPayload,
				};
				await createAdminPageSection(payload);
				if (!opts?.silent) toast.success("Tạo section thành công");
			} else if (initialData) {
				await updateAdminPageSection(initialData.id, {
					type: form.type.trim(),
					key: form.key?.trim() || undefined,
					name: form.name?.trim() || undefined,
					url: form.url?.trim() || undefined,
					position: form.position,
					status: form.status,
					extra: extra ?? undefined,
				});
				await replaceAdminPageSectionItems(initialData.id, itemsPayload);
				if (!opts?.silent) toast.success("Cập nhật section thành công");
			}
			if (opts?.redirect) {
				router.push(`/admin/pages/${pageId}`);
			}
			router.refresh();
			return true;
		} catch (err) {
			toast.error(err instanceof AdminApiError ? err.message : "Có lỗi xảy ra");
			return false;
		} finally {
			setSubmitting(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		await persistAll({ redirect: true });
	}

	const sectionLabel = form.name || form.key || form.type || "section";

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<DetailPageHeader
				title={mode === "edit" ? `Section: ${sectionLabel}` : "Thêm section"}
				subtitle={
					mode === "edit"
						? "Chỉnh sửa cấu hình section"
						: "Tạo section mới cho trang"
				}
				backHref={`/admin/pages/${pageId}`}
				primaryAction={
					<Button type="submit" size="sm" disabled={submitting}>
						<Save className="h-4 w-4" />
						{submitting
							? "Đang lưu..."
							: mode === "create"
								? "Tạo section"
								: "Cập nhật"}
					</Button>
				}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader title="Thông tin section" />
						<CardBody className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Field
									label="Type"
									required
									error={errors.type}
									hint="Vd: banner, product, text, faq, link_item"
									htmlFor="type"
								>
									<Input
										id="type"
										value={form.type}
										onChange={(e) => update("type", e.target.value)}
										disabled={typeLocked}
									/>
								</Field>
								<Field
									label="Key"
									hint="FE dùng để map component (vd hero_banner)"
									htmlFor="key"
								>
									<Input
										id="key"
										value={form.key}
										onChange={(e) => update("key", e.target.value)}
										disabled={keyLocked}
									/>
								</Field>
							</div>

							<Field label="Tên section" htmlFor="name">
								<Input
									id="name"
									value={form.name}
									onChange={(e) => update("name", e.target.value)}
									placeholder="Banner đầu trang"
								/>
							</Field>

							<Field label="URL" htmlFor="url">
								<Input
									id="url"
									value={form.url}
									onChange={(e) => update("url", e.target.value)}
								/>
							</Field>

							{!isProductBox && !isLayoutMenu && !isBanner && !isPostBox && !isBoxCategory && (
								<Field
									label="Extra (JSON)"
									hint='Cấu hình riêng — vd {"autoPlay": true, "duration": 5000}'
									htmlFor="extraJson"
								>
									<Textarea
										id="extraJson"
										value={form.extraJson}
										onChange={(e) => update("extraJson", e.target.value)}
										rows={5}
										className="font-mono text-xs"
									/>
								</Field>
							)}
						</CardBody>
					</Card>
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader title="Cấu hình" />
						<CardBody className="space-y-4">
							<Field label="Trạng thái" htmlFor="status">
								<Select
									id="status"
									value={String(form.status)}
									onChange={(e) =>
										update("status", Number(e.target.value) as StatusCommonEnum)
									}
								>
									<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
									<option value={StatusCommonEnum.INACTIVE}>Lưu trữ</option>
								</Select>
							</Field>

							<Field
								label="Vị trí"
								hint="Số nhỏ hiển thị trước"
								htmlFor="position"
							>
								<Input
									id="position"
									type="number"
									min={0}
									value={form.position}
									onChange={(e) => update("position", Number(e.target.value))}
								/>
							</Field>
						</CardBody>
					</Card>

				</div>
			</div>

			{isLayoutMenu ? (
				<Card>
					<CardHeader title="Cấu hình menu" />
					<CardBody>
						<LayoutMenu
							defaultValues={initialData?.items ?? null}
							disabled={submitting}
							onChange={(rows) => {
								layoutMenuRowsRef.current = rows;
							}}
							onSaveItems={async () => {
								await persistAll({ silent: false });
							}}
						/>
					</CardBody>
				</Card>
			) : isProductBox ? (
				<Card>
					<CardHeader title="Cấu hình box sản phẩm" />
					<CardBody>
						<ProductBoxSection
							defaultValues={initialData?.items ?? null}
							defaultExtra={
								(initialData?.extra ?? null) as ProductBoxExtra | null
							}
							disabled={submitting}
							onChange={(state) => {
								productBoxStateRef.current = state;
							}}
						/>
					</CardBody>
				</Card>
			) : isBanner ? (
				<Card>
					<CardHeader title="Cấu hình banner" />
					<CardBody>
						<BannerSection
							defaultValues={initialData?.items ?? null}
							defaultExtra={
								(initialData?.extra ?? null) as BannerExtra | null
							}
							disabled={submitting}
							onChange={(state) => {
								bannerStateRef.current = state;
							}}
						/>
					</CardBody>
				</Card>
			) : isPostBox ? (
				<Card>
					<CardHeader title="Cấu hình box bài viết" />
					<CardBody>
						<PostBoxSection
							defaultValues={initialData?.items ?? null}
							defaultExtra={
								(initialData?.extra ?? null) as PostBoxExtra | null
							}
							disabled={submitting}
							onChange={(state) => {
								postBoxStateRef.current = state;
							}}
						/>
					</CardBody>
				</Card>
			) : isBoxCategory ? (
				<Card>
					<CardHeader title="Cấu hình box danh mục" />
					<CardBody>
						<BoxCategorySection
							defaultValues={initialData?.items ?? null}
							defaultExtra={
								(initialData?.extra ?? null) as BoxCategoryExtra | null
							}
							disabled={submitting}
							onChange={(state) => {
								boxCategoryStateRef.current = state;
							}}
						/>
					</CardBody>
				</Card>
			) : (
			<Card>
				<CardHeader
					title={`Items (${form.items.length})`}
					actions={
						<Button type="button" size="sm" onClick={addItem}>
							Thêm item
						</Button>
					}
				/>
				<CardBody>
					{form.items.length === 0 ? (
						<div className="py-6 text-center text-sm text-gray-500">
							Chưa có item nào. Click "Thêm item" để bắt đầu.
						</div>
					) : (
						<div className="space-y-3">
							{form.items.map((item, i) => (
								<div
									key={item._localKey}
									className="rounded-lg border border-gray-200 bg-gray-50 p-4"
								>
									<div className="mb-3 flex items-center justify-between">
										<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
											Item #{i + 1}
										</span>
										<Button
											type="button"
											variant="danger"
											size="sm"
											onClick={() => removeItem(i)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>

									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										<Field label="Type" htmlFor={`item-type-${i}`}>
											<Input
												id={`item-type-${i}`}
												value={item.type ?? ""}
												onChange={(e) => updateItem(i, { type: e.target.value })}
												placeholder="banner, link, ..."
											/>
										</Field>
										<Field label="Tên" htmlFor={`item-name-${i}`}>
											<Input
												id={`item-name-${i}`}
												value={item.name ?? ""}
												onChange={(e) => updateItem(i, { name: e.target.value })}
											/>
										</Field>
									</div>

									<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
										<Field label="Target URL" htmlFor={`item-url-${i}`}>
											<Input
												id={`item-url-${i}`}
												value={item.targetUrl ?? ""}
												onChange={(e) => updateItem(i, { targetUrl: e.target.value })}
											/>
										</Field>
										<Field
											label="Vị trí"
											htmlFor={`item-pos-${i}`}
										>
											<Input
												id={`item-pos-${i}`}
												type="number"
												min={0}
												value={item.position ?? 0}
												onChange={(e) =>
													updateItem(i, { position: Number(e.target.value) })
												}
											/>
										</Field>
									</div>

									<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
										<Field label="Device" htmlFor={`item-device-${i}`}>
											<Select
												id={`item-device-${i}`}
												value={item.deviceType ?? DeviceTypeEnum.ALL}
												onChange={(e) =>
													updateItem(i, { deviceType: e.target.value as DeviceTypeEnum })
												}
											>
												<option value={DeviceTypeEnum.ALL}>Tất cả</option>
												<option value={DeviceTypeEnum.MOBILE}>Mobile</option>
												<option value={DeviceTypeEnum.DESKTOP}>Desktop</option>
											</Select>
										</Field>
										<Field label="Trạng thái" htmlFor={`item-status-${i}`}>
											<Select
												id={`item-status-${i}`}
												value={String(item.status ?? StatusCommonEnum.ACTIVE)}
												onChange={(e) =>
													updateItem(i, {
														status: Number(e.target.value) as StatusCommonEnum,
													})
												}
											>
												<option value={StatusCommonEnum.ACTIVE}>Hoạt động</option>
												<option value={StatusCommonEnum.INACTIVE}>Tắt</option>
											</Select>
										</Field>
									</div>

									<div className="mt-3">
										<Field
											label="Data"
											hint="String / JSON stringified"
											htmlFor={`item-data-${i}`}
										>
											<Textarea
												id={`item-data-${i}`}
												value={item.data ?? ""}
												onChange={(e) => updateItem(i, { data: e.target.value })}
												rows={2}
												className="font-mono text-xs"
											/>
										</Field>
									</div>
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
			)}
		</form>
	);
}
