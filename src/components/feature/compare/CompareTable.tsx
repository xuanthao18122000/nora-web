"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import { useElementHeight } from "@/lib/hooks/useStickyOffset";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import { useCompareStore } from "@/store/useCompareStore";

import { SearchModal } from "./SearchModal.client";

// Spec types từ POST /fe/products/by-ids + GET /fe/products/:id/specifications
export interface CompareProductSpec {
	label: string;
	values: (string | null)[];
}

export interface CompareProductDetail {
	productId: string;
	name: string;
	slug: string;
	urlPath: string;
	image: string;
	price: number;
	originalPrice: number | null;
	discountPercent: number;
	avgRating: string | null;
	reviewCount: number;
	specifications: CompareProductSpec[];
}

function SpecRows({
	labels,
	slots,
	getSpecValue,
	gridColsClass,
}: {
	labels: string[];
	slots: (CompareProductDetail | null)[];
	getSpecValue: (
		product: CompareProductDetail | null,
		label: string,
	) => string;
	gridColsClass: string;
}) {
	return (
		<div className="flex flex-col">
			{labels.map((label) => {
				const rowValues = slots.map((p) => getSpecValue(p, label));
				return (
					<div
						key={label}
						className="flex flex-col border-b border-gray-100 last:border-0"
					>
						<div className="bg-gray-100 px-2 py-1 md:px-4 md:py-2 text-sm font-medium text-gray-900">
							{label}
						</div>
						<div className={cn("grid bg-white", gridColsClass)}>
							{rowValues.map((val, idx) => (
								<div
									key={idx}
									className="px-2 py-1 md:px-4 md:py-2 text-sm leading-snug text-gray-700"
								>
									{val || "—"}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default function CompareTable({
	products,
}: {
	products: CompareProductDetail[];
}) {
	const { items, removeItem } = useCompareStore();
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [activeSlotIndex, setActiveSlotIndex] = useState<number | undefined>(
		undefined,
	);
	const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
	const headerOffset = useElementHeight("header");

	const slots = items.map((item) => {
		if (!item) return null;
		return products.find((p) => p.productId === item.productId) || null;
	});

	const allSpecLabels = Array.from(
		new Set(products.flatMap((p) => p.specifications.map((s) => s.label))),
	);

	const getSpecValue = (
		product: CompareProductDetail | null,
		label: string,
	) => {
		if (!product) return "";
		const spec = product.specifications.find((s) => s.label === label);
		return spec?.values.join(", ") ?? "—";
	};

	const visibleSpecLabels = allSpecLabels.filter((label) => {
		if (!showDifferencesOnly) return true;
		const values = products.map((p) => getSpecValue(p, label));
		return new Set(values).size > 1;
	});

	const getGroupedSpecs = () => {
		const groups = {
			"So sánh nhanh": [] as string[],
			"Thiết kế & Trọng lượng": [] as string[],
			"Bộ xử lý": [] as string[],
			"RAM & Lưu trữ": [] as string[],
			Camera: [] as string[],
			"Thông tin khác": [] as string[],
		};

		visibleSpecLabels.forEach((label) => {
			const lower = label.toLowerCase();
			if (
				lower.includes("kích thước") ||
				lower.includes("trọng lượng") ||
				lower.includes("chuẩn kháng") ||
				lower.includes("chất liệu")
			) {
				groups["Thiết kế & Trọng lượng"].push(label);
			} else if (
				lower.includes("cpu") ||
				lower.includes("nhân") ||
				lower.includes("chip")
			) {
				groups["Bộ xử lý"].push(label);
			} else if (
				lower.includes("ram") ||
				lower.includes("dung lượng") ||
				lower.includes("bộ nhớ")
			) {
				groups["RAM & Lưu trữ"].push(label);
			} else if (
				lower.includes("camera") ||
				lower.includes("độ phân giải")
			) {
				groups.Camera.push(label);
			} else {
				groups["Thông tin khác"].push(label);
			}
		});

		groups["So sánh nhanh"] = visibleSpecLabels
			.filter((label) => {
				const lower = label.toLowerCase();
				return (
					lower.includes("màn hình") ||
					lower === "camera" ||
					lower === "ram" ||
					lower.includes("dung lượng")
				);
			})
			.slice(0, 5);

		return groups;
	};

	const groupedSpecs = getGroupedSpecs();

	const gridColsClass = "grid-cols-3";

	// Compact mode: collapse images when sticky header is pinned.
	// Uses scroll position check instead of IntersectionObserver to avoid
	// oscillation caused by height change when toggling compact.
	const stickyRef = useRef<HTMLDivElement>(null);
	const [isCompact, setIsCompact] = useState(false);
	const [userExpanded, setUserExpanded] = useState(false);

	useEffect(() => {
		const el = stickyRef.current;
		if (!el) return;
		const check = () => {
			const rect = el.getBoundingClientRect();
			const pinned = rect.top <= headerOffset + 9;
			setIsCompact(pinned);
			if (!pinned) setUserExpanded(false);
		};
		window.addEventListener("scroll", check, { passive: true });
		check();
		return () => window.removeEventListener("scroll", check);
	}, [headerOffset]);

	// When user scrolls after manually expanding, collapse back
	useEffect(() => {
		if (!userExpanded) return;
		const timer = setTimeout(() => {
			const onScroll = () => setUserExpanded(false);
			window.addEventListener("scroll", onScroll, {
				passive: true,
				once: true,
			});
		}, 400);
		return () => clearTimeout(timer);
	}, [userExpanded]);

	const showCompact = isCompact && !userExpanded;

	return (
		<div className="flex flex-col gap-2 md:gap-4 relative">
			{/* Differences filter */}
			<div className="flex items-center">
				<Checkbox
					id="showDifferences"
					checked={showDifferencesOnly}
					onChange={(e) => setShowDifferencesOnly(e.target.checked)}
					label="Chỉ xem điểm khác biệt"
				/>
			</div>

			{/* Product slots — sticky, compact when scrolled */}
			<div
				ref={stickyRef}
				className="sticky z-20"
				style={{ top: headerOffset }}
			>
				<div
					className={cn(
						"bg-white p-2 md:p-4 shadow-sm rounded-b-2xl",
						showCompact ? "rounded-t-none" : "rounded-t-2xl",
					)}
				>
					<div className={cn("grid gap-2 md:gap-4", gridColsClass)}>
						{slots.map((product, idx) => (
							<div
								key={
									product ? product.productId : `empty-${idx}`
								}
								className={cn(
									"relative flex flex-col rounded-xl transition-all duration-300 gap-2 p-2 md:p-4",
									product
										? "bg-white border border-gray-100"
										: "bg-white border border-gray-100",
								)}
							>
								{product ? (
									<>
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												removeItem(product.productId);
											}}
											onMouseDown={(e) =>
												e.stopPropagation()
											}
											className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/70 backdrop-blur text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors z-20"
											aria-label="Xóa sản phẩm"
										>
											<X size={14} />
										</button>

										{/* Image — hidden when compact */}
										{!showCompact && (
											<Link
												href={`/${product.urlPath}`}
												className="flex items-center justify-center"
											>
												<div className="relative w-[88px] md:w-[100px] aspect-square">
													<Image
														src={getImageUrl(
															product.image,
														)}
														alt={product.name}
														fill
														className="object-contain"
														sizes="(max-width: 768px) 88px, 100px"
													/>
												</div>
											</Link>
										)}

										{/* Name + Price — always visible */}
										<Link href={`/${product.urlPath}`}>
											<h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug hover:text-blue-500 transition-colors">
												{product.name}
											</h3>
										</Link>
										<div className="text-primary-500 font-semibold text-sm md:text-base">
											{formatPrice(product.price)}
										</div>

										{/* Discount + Buy button — hidden when compact */}
										{!showCompact && (
											<div className="flex flex-col gap-2 pt-1">
												{product.originalPrice &&
													product.originalPrice >
														product.price && (
														<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
															<span className="text-xs text-gray-400 line-through">
																{formatPrice(
																	product.originalPrice,
																)}
															</span>
															{product.discountPercent >
																0 && (
																<span className="hidden md:inline text-xs font-semibold text-white bg-red-500 px-1 rounded">
																	-
																	{
																		product.discountPercent
																	}
																	%
																</span>
															)}
														</div>
													)}
												<Link
													href={`/${product.urlPath}`}
												>
													<Button
														variant="filled"
														color="softPrimary"
														size="sm"
														className="w-full rounded-lg!"
													>
														Mua ngay
													</Button>
												</Link>
											</div>
										)}
									</>
								) : (
									<button
										type="button"
										onClick={() => {
											setSearchModalOpen(true);
											setActiveSlotIndex(idx);
										}}
										className="flex-1 w-full flex flex-col items-center justify-center gap-2 py-4 text-primary-500 cursor-pointer"
									>
										<div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
											<Plus
												size={20}
												strokeWidth={1.75}
												className="text-primary-500"
											/>
										</div>
										{!showCompact && (
											<span className="text-sm font-medium text-primary-500">
												Thêm sản phẩm
											</span>
										)}
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Specs */}
			<div className="flex flex-col gap-2 md:gap-4">
				{/* So sánh nhanh — kept separate */}
				{groupedSpecs["So sánh nhanh"].length > 0 && (
					<div className="rounded-2xl overflow-hidden bg-white border border-primary-200">
						<div className="w-full text-left px-2 py-1 md:px-4 md:py-2 text-sm font-semibold text-primary-500 bg-primary-50/40 border-b border-primary-100">
							So sánh nhanh
						</div>
						<SpecRows
							labels={groupedSpecs["So sánh nhanh"]}
							slots={slots}
							getSpecValue={getSpecValue}
							gridColsClass={gridColsClass}
						/>
					</div>
				)}

				{/* All other specs merged into one section */}
				{(() => {
					const allLabels = Object.entries(groupedSpecs)
						.filter(([name]) => name !== "So sánh nhanh")
						.flatMap(([, labels]) => labels);
					if (allLabels.length === 0) return null;
					return (
						<div className="rounded-2xl overflow-hidden bg-white border border-gray-200">
							<SpecRows
								labels={allLabels}
								slots={slots}
								getSpecValue={getSpecValue}
								gridColsClass={gridColsClass}
							/>
						</div>
					);
				})()}
			</div>

			{searchModalOpen && (
				<SearchModal
					onClose={() => {
						setSearchModalOpen(false);
						setActiveSlotIndex(undefined);
					}}
					slotIndex={activeSlotIndex}
				/>
			)}
		</div>
	);
}
