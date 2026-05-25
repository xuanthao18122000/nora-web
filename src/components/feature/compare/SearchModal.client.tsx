"use client";

import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ResponsiveDrawer } from "@/components/common/ResponsiveDrawer";
import { API, api } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import { type CompareItem, useCompareStore } from "@/store/useCompareStore";

const MAX_SLOTS = 3;

function ProductRow({
	image,
	name,
	price,
	listedPrice,
	trailing,
	className,
}: {
	image: string | null | undefined;
	name: string;
	price: number;
	listedPrice?: number | null;
	trailing?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-2 md:gap-4", className)}>
			<div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-gray-50">
				{image ? (
					<Image
						src={getImageUrl(image)}
						alt={name}
						fill
						className="object-contain"
						sizes="48px"
					/>
				) : (
					<div className="w-full h-full bg-gray-100" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1.5">
					{name}
				</p>
				<div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
					<span className="text-sm font-bold text-primary-600">
						{formatPrice(price)}
					</span>
					{listedPrice && listedPrice > 0 && listedPrice > price && (
						<span className="text-xs text-gray-400 line-through">
							{formatPrice(listedPrice)}
						</span>
					)}
				</div>
			</div>
			{trailing}
		</div>
	);
}

export interface SearchResult {
	id: string;
	name: string;
	slug: string;
	urlPath: string;
	thumbnailUrl: string | null;
	categoryKey?: string;
	minPrice: number;
	listedPrice: number | null;
	discountPercent: number | null;
}

export function SearchModal({
	open = true,
	onClose,
	slotIndex,
}: {
	open?: boolean;
	onClose: () => void;
	slotIndex?: number;
}) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const { addItem, removeItem, items } = useCompareStore();
	const inputRef = useRef<HTMLInputElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	const validItems = items.filter((i): i is CompareItem => i !== null);
	const currentCategoryKey =
		validItems.length > 0 ? validItems[0].categoryKey : undefined;
	const basePrice = validItems.length > 0 ? validItems[0].price : undefined;

	// biome-ignore lint/correctness/useExhaustiveDependencies: Run only once on mount
	useEffect(() => {
		inputRef.current?.focus();

		// Fetch initial suggestions
		if (currentCategoryKey && basePrice) {
			search("", true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const search = async (term: string, isInitialSuggest = false) => {
		if (!isInitialSuggest && (!term || term.length < 2)) {
			setResults([]);
			return;
		}

		setLoading(true);
		try {
			const res = await api.get<SearchResult[]>(
				API.PRODUCTS.QUICK_SEARCH,
				{
					params: {
						q: term,
						limit: "10",
						...(currentCategoryKey
							? { categoryKey: currentCategoryKey }
							: {}),
						...(isInitialSuggest && basePrice
							? { basePrice: basePrice.toString() }
							: {}),
					},
				},
			);
			setResults(res || []);
		} catch (_error) {
			// Silently fail autocomplete fetch
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const q = e.target.value;
		setQuery(q);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => search(q), 350);
	};

	const addedIds = new Set(validItems.map((i) => i.productId));

	const handleClose = () => {
		onClose();
	};

	const handleAdd = (p: SearchResult) => {
		const result = addItem(
			{
				productId: p.id,
				name: p.name,
				slug: p.slug,
				image: p.thumbnailUrl ?? "",
				price: p.minPrice,
				listedPrice: p.listedPrice,
				categoryKey: p.categoryKey ?? "",
			},
			slotIndex,
		);
		if (result.success) {
			handleClose();
		} else if (result.error === "WRONG_CATEGORY") {
			toast.error("Chỉ so sánh sản phẩm cùng danh mục");
		} else if (result.error === "MAX_REACHED") {
			toast.error("Đã đạt tối đa sản phẩm so sánh");
		}
	};

	const handleToggle = (p: SearchResult) => {
		if (addedIds.has(p.id)) {
			removeItem(p.id);
		} else {
			handleAdd(p);
		}
	};

	return (
		<ResponsiveDrawer
			open={open}
			onClose={onClose}
			title="Chọn sản phẩm so sánh"
			maxWidth={480}
			className="p-0"
			footer={
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleClose}
						className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
					>
						Đóng
					</button>
					<Link
						href="/compare"
						onClick={handleClose}
						className={cn(
							"flex-1 rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors",
							validItems.length >= 2
								? "bg-primary-500 text-white hover:bg-primary-600"
								: "pointer-events-none bg-gray-200 text-gray-400",
						)}
						aria-disabled={validItems.length < 2}
					>
						So sánh ngay
						{validItems.length > 0 && ` (${validItems.length})`}
					</Link>
				</div>
			}
		>
			<div className="flex flex-col h-full bg-gray-50">
				{/* Search bar */}
				<div className="p-2 md:p-4 shrink-0 bg-white">
					<div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-primary-400 transition-colors">
						<Search size={16} className="text-gray-400 shrink-0" />
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={handleChange}
							placeholder="Tìm kiếm sản phẩm so sánh"
							className="flex-1 text-sm outline-none placeholder-gray-400 text-gray-800"
						/>
						{loading ? (
							<Loader2
								size={15}
								className="animate-spin text-gray-400 shrink-0"
							/>
						) : query ? (
							<button
								type="button"
								onClick={() => {
									setQuery("");
									setResults([]);
								}}
							>
								<X
									size={14}
									className="text-gray-400 hover:text-gray-600"
								/>
							</button>
						) : null}
					</div>
				</div>

				{/* Results list */}
				<div className="overflow-y-auto flex-1 p-2 md:p-4">
					{results.length === 0 && query.length >= 2 && !loading && (
						<div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl">
							<Search size={36} className="mb-2 opacity-30" />
							<p className="text-sm">
								Không tìm thấy sản phẩm phù hợp
							</p>
						</div>
					)}
					{results.length === 0 && query.length < 2 && !loading && (
						<div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl">
							<Search size={36} className="mb-2 opacity-30" />
							<p className="text-sm">
								Nhập tên sản phẩm để tìm kiếm
							</p>
						</div>
					)}
					{results.length > 0 && (
						<div className="bg-white rounded-xl p-2 md:p-4">
							{query.length < 2 && (
								<h4 className="text-sm font-bold text-gray-600 mb-2 md:mb-4">
									Sản phẩm gợi ý
								</h4>
							)}
							<div className="flex flex-col gap-4">
								{results.map((p) => {
									const isAdded = addedIds.has(p.id);
									return (
										<ProductRow
											key={p.id}
											image={p.thumbnailUrl}
											name={p.name}
											price={p.minPrice}
											listedPrice={p.listedPrice}
											trailing={
												<button
													type="button"
													onClick={() =>
														handleToggle(p)
													}
													className={cn(
														"shrink-0 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
														isAdded
															? "border-green-200 text-green-600 bg-green-50 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
															: "border-gray-300 text-gray-700 hover:border-primary-500 hover:text-blue-500",
													)}
												>
													{isAdded
														? "Đã thêm"
														: "Thêm so sánh"}
												</button>
											}
										/>
									);
								})}
							</div>
						</div>
					)}

					{/* Added products — anchored below suggestions */}
					{validItems.length > 0 && (
						<div className="mt-2 md:mt-4 bg-white rounded-xl p-2 md:p-4">
							<div className="flex items-center justify-between mb-2 md:mb-4">
								<h4 className="text-sm font-bold text-gray-700">
									Đã thêm ({validItems.length}/{MAX_SLOTS})
								</h4>
							</div>
							<div className="flex flex-col gap-2">
								{validItems.map((item) => (
									<ProductRow
										key={item.productId}
										image={item.image}
										name={item.name}
										price={item.price}
										listedPrice={item.listedPrice}
										className="rounded-lg bg-gray-50 p-2"
										trailing={
											<button
												type="button"
												onClick={() =>
													removeItem(item.productId)
												}
												className="shrink-0 flex size-6 items-center justify-center rounded-full bg-white text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
												aria-label="Xóa sản phẩm"
											>
												<X size={12} />
											</button>
										}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</ResponsiveDrawer>
	);
}
