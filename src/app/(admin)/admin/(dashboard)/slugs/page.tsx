"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";
import {
	type DataTableColumn,
	DataTable,
	type FilterField,
	FilterPanel,
	type FilterValue,
	useDataTable,
} from "@/features/admin/data-table";
import { Card, CardHeader } from "@/features/admin/ui";
import {
	type AdminSlug,
	type ListSlugParams,
	type ResolvedEntity,
	SLUG_TYPE_LABEL,
	SlugTypeEnum,
	listAdminSlugs,
	resolveSlugEntities,
} from "@/lib/api/admin";

interface SlugFilters {
	slug?: string;
	type?: string | number;
	entityId?: string | number;
}

const FILTER_FIELDS: FilterField[] = [
	{ id: "slug", label: "Slug", type: "text", placeholder: "VD: ac-quy-pinaco" },
	{
		id: "type",
		label: "Loại",
		type: "select",
		placeholder: "Chọn loại",
		options: [
			{
				value: SlugTypeEnum.PRODUCT,
				label: SLUG_TYPE_LABEL[SlugTypeEnum.PRODUCT],
			},
			{
				value: SlugTypeEnum.CATEGORY,
				label: SLUG_TYPE_LABEL[SlugTypeEnum.CATEGORY],
			},
			{ value: SlugTypeEnum.POST, label: SLUG_TYPE_LABEL[SlugTypeEnum.POST] },
			{
				value: SlugTypeEnum.POST_LIST,
				label: SLUG_TYPE_LABEL[SlugTypeEnum.POST_LIST],
			},
			{ value: SlugTypeEnum.PAGE, label: SLUG_TYPE_LABEL[SlugTypeEnum.PAGE] },
		],
	},
	{
		id: "entityId",
		label: "Entity ID",
		type: "text",
		placeholder: "ID entity",
	},
	{ id: "createdAt", label: "Ngày tạo", type: "dateRange" },
];

const ADMIN_PATH: Partial<Record<SlugTypeEnum, string>> = {
	[SlugTypeEnum.PRODUCT]: "/admin/products",
	[SlugTypeEnum.CATEGORY]: "/admin/categories",
	[SlugTypeEnum.POST]: "/admin/posts",
	[SlugTypeEnum.POST_LIST]: "/admin/post-lists",
	[SlugTypeEnum.PAGE]: "/admin/pages",
};

function formatDate(iso?: string): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function SlugsPage() {
	const {
		queryParams,
		currentPage,
		pageSize,
		handleFilter,
		handleResetFilter,
		handlePaginationChange,
	} = useDataTable<Record<string, unknown> & SlugFilters>({ defaultPageSize: 10 });

	const { data, isLoading } = useSWR(
		["admin/slugs", queryParams],
		() => listAdminSlugs(queryParams as unknown as ListSlugParams),
		{ keepPreviousData: true },
	);
	const items = data?.data ?? [];
	const total = data?.total ?? 0;

	// Gom unique (type, entityId) → 1 batch resolve cho cả page
	const pairsKey = useMemo(() => {
		const set = new Set<string>();
		for (const it of items) {
			if (!it.entityId) continue;
			set.add(`${it.type}:${it.entityId}`);
		}
		return Array.from(set).sort().join(",");
	}, [items]);

	const { data: entityMap } = useSWR(
		pairsKey ? ["admin/slugs/resolve", pairsKey] : null,
		() => {
			const pairs = pairsKey
				.split(",")
				.filter(Boolean)
				.map((s) => {
					const [type, entityId] = s.split(":");
					return { type: Number(type) as SlugTypeEnum, entityId: Number(entityId) };
				});
			return resolveSlugEntities(pairs);
		},
		{ keepPreviousData: true },
	);

	function onFilter(values: FilterValue) {
		handleFilter(values);
	}

	const columns: DataTableColumn<AdminSlug>[] = [
		{
			id: "entity",
			header: "Đối tượng",
			cell: (row) => <EntityCell row={row} entityMap={entityMap} />,
		},
		{
			id: "slug",
			header: "Slug",
			cell: (row) => (
				<span className="font-mono text-[13px] font-medium text-gray-900">
					{row.slug}
				</span>
			),
		},
		{
			id: "type",
			header: "Loại",
			width: "140px",
			align: "center",
			cell: (row) => <TypeBadge type={row.type} />,
		},
		{
			id: "createdAt",
			header: "Ngày tạo",
			width: "130px",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{formatDate(row.createdAt)}
				</span>
			),
		},
		{
			id: "updatedAt",
			header: "Cập nhật",
			width: "130px",
			cell: (row) => (
				<span className="text-[13px] text-gray-700">
					{formatDate(row.updatedAt)}
				</span>
			),
		},
	];

	return (
		<div className="space-y-4 mt-4">
			<FilterPanel
				fields={FILTER_FIELDS}
				onFilter={onFilter}
				onReset={handleResetFilter}
				isFetching={isLoading}
			/>

			<Card>
				<CardHeader title="Danh sách slug" count={total} />
				<DataTable<AdminSlug>
					columns={columns}
					data={items}
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					isLoading={isLoading}
					itemLabel="slug"
					onPageChange={(p) => handlePaginationChange(p)}
					onPageSizeChange={(s) => handlePaginationChange(undefined, s)}
				/>
			</Card>
		</div>
	);
}

const TYPE_COLOR: Record<SlugTypeEnum, string> = {
	[SlugTypeEnum.PRODUCT]: "bg-blue-50 text-blue-700 ring-blue-600/20",
	[SlugTypeEnum.CATEGORY]: "bg-amber-50 text-amber-700 ring-amber-600/20",
	[SlugTypeEnum.POST]: "bg-purple-50 text-purple-700 ring-purple-600/20",
	[SlugTypeEnum.POST_LIST]: "bg-rose-50 text-rose-700 ring-rose-600/20",
	[SlugTypeEnum.PAGE]: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

function TypeBadge({ type }: { type: SlugTypeEnum }) {
	return (
		<span
			className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${TYPE_COLOR[type]}`}
		>
			{SLUG_TYPE_LABEL[type]}
		</span>
	);
}

function EntityCell({
	row,
	entityMap,
}: {
	row: AdminSlug;
	entityMap?: Record<string, ResolvedEntity>;
}) {
	if (!row.entityId) {
		return <span className="text-gray-400">—</span>;
	}
	const key = `${row.type}:${row.entityId}`;
	const entity = entityMap?.[key];
	const adminPath = ADMIN_PATH[row.type];

	if (!entity) {
		return (
			<span className="text-gray-500">
				#{row.entityId}{" "}
				<span className="text-xs text-gray-400">(không tồn tại)</span>
			</span>
		);
	}

	if (adminPath) {
		return (
			<Link
				href={`${adminPath}/${entity.entityId}`}
				className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
			>
				<span className="truncate">{entity.name}</span>
				<ExternalLink className="h-3 w-3 shrink-0" />
			</Link>
		);
	}

	return <span className="font-medium text-blue-600">{entity.name}</span>;
}
