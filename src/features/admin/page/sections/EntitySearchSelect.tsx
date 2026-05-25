"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input, useClickOutside } from "@/features/admin/ui";
import {
	type AdminCategory,
	type AdminProduct,
	listAdminCategories,
	listAdminProducts,
} from "@/lib/api/admin";
import { type AdminPost, listAdminPosts } from "@/lib/api/admin/post";
import { getImageUrl } from "@/lib/utils/image";

export interface EntitySearchProductPayload {
	type: "product";
	id: number;
	name: string;
	slug: string;
	thumbnailUrl?: string | null;
	/** Giá hiển thị (salePrice nếu có, fallback price) */
	price?: number;
	/** Giá niêm yết (gạch ngang khi salePrice < price) */
	listedPrice?: number;
}

export interface EntitySearchCategoryPayload {
	type: "category";
	id: number;
	name: string;
	slug: string;
	thumbnailUrl?: string | null;
	iconUrl?: string | null;
}

export interface EntitySearchPostPayload {
	type: "post";
	id: number;
	name: string;
	slug: string;
	thumbnailUrl?: string | null;
}

export type EntitySearchPayload =
	| EntitySearchProductPayload
	| EntitySearchCategoryPayload
	| EntitySearchPostPayload;

interface Props {
	mode: "product" | "category" | "post";
	placeholder?: string;
	disabled?: boolean;
	/** Khi mode = "post", filter theo postListId. */
	postListId?: number | null;
	onSelect: (payload: EntitySearchPayload) => void;
}

const DEBOUNCE_MS = 300;
const LIMIT = 10;

export function EntitySearchSelect({
	mode,
	placeholder = "Tìm kiếm...",
	disabled,
	postListId,
	onSelect,
}: Props) {
	const [keyword, setKeyword] = useState("");
	const [debounced, setDebounced] = useState("");
	const [results, setResults] = useState<EntitySearchPayload[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useClickOutside(containerRef, open, () => setOpen(false));

	useEffect(() => {
		const t = setTimeout(() => setDebounced(keyword.trim()), DEBOUNCE_MS);
		return () => clearTimeout(t);
	}, [keyword]);

	useEffect(() => {
		// Mode "post" / "product" / "category" đều load mặc định khi mở dropdown
		// (debounced rỗng → không truyền filter, lấy list mới nhất)
		let cancelled = false;
		setLoading(true);
		(async () => {
			try {
				if (mode === "product") {
					const res = await listAdminProducts({
						page: 1,
						limit: LIMIT,
						...(debounced ? { searchName: debounced } : {}),
					});
					if (cancelled) return;
					const mapped: EntitySearchProductPayload[] = res.data.map(
						(p: AdminProduct) => ({
							type: "product",
							id: p.id,
							name: p.name,
							slug: p.slug,
							thumbnailUrl: p.thumbnailUrl ?? null,
							price: Number(p.salePrice ?? p.price ?? 0),
							listedPrice: Number(p.price ?? 0),
						}),
					);
					setResults(mapped);
				} else if (mode === "post") {
					const res = await listAdminPosts({
						page: 1,
						limit: LIMIT,
						sortBy: "id",
						order: "DESC",
						...(postListId ? { postListId } : {}),
						...(debounced ? { title: debounced } : {}),
					});
					if (cancelled) return;
					const mapped: EntitySearchPostPayload[] = res.data.map(
						(p: AdminPost) => ({
							type: "post",
							id: p.id,
							name: p.title,
							slug: p.slug,
							thumbnailUrl: p.featuredImage ?? null,
						}),
					);
					setResults(mapped);
				} else {
					const res = await listAdminCategories({
						page: 1,
						limit: LIMIT,
						...(debounced ? { searchName: debounced } : {}),
					});
					if (cancelled) return;
					const mapped: EntitySearchCategoryPayload[] = res.data.map(
						(c: AdminCategory) => ({
							type: "category",
							id: c.id,
							name: c.name,
							slug: c.slug,
							thumbnailUrl: c.thumbnailUrl ?? null,
							iconUrl: c.iconUrl ?? null,
						}),
					);
					setResults(mapped);
				}
			} catch (e) {
				if (!cancelled) setResults([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [debounced, mode, postListId]);

	const showDropdown = open;

	function handleSelect(item: EntitySearchPayload) {
		onSelect(item);
		setKeyword("");
		setDebounced("");
		setResults([]);
		setOpen(false);
	}

	return (
		<div ref={containerRef} className="relative">
			<div className="relative">
				<Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
				<Input
					type="text"
					value={keyword}
					onChange={(e) => {
						setKeyword(e.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					disabled={disabled}
					placeholder={placeholder}
					className="pl-8"
				/>
			</div>

			{showDropdown && (
				<div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
					{loading && (
						<div className="px-3 py-2 text-sm text-gray-500">
							Đang tìm...
						</div>
					)}
					{!loading && results.length === 0 && debounced && (
						<div className="px-3 py-2 text-sm text-gray-500">
							Không tìm thấy "{debounced}"
						</div>
					)}
					{results.map((item) => (
						<button
							type="button"
							key={`${item.type}-${item.id}`}
							onClick={() => handleSelect(item)}
							className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
						>
							{item.thumbnailUrl ? (
								<img
									src={getImageUrl(item.thumbnailUrl)}
									alt=""
									className="size-14 shrink-0 rounded-md object-cover bg-gray-100"
								/>
							) : (
								<div className="size-14 shrink-0 rounded-md bg-gray-100" />
							)}
							<div className="min-w-0 flex-1">
								<div className="truncate text-sm font-medium text-gray-900">
									{item.name}
								</div>
								<div className="truncate text-xs text-gray-500">
									/{item.slug}
								</div>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
