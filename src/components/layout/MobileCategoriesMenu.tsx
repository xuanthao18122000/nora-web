"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/common/Drawer";
import { StatusCommon } from "@/constants/common";
import { formatPrice } from "@/lib/utils/format";
import { toHref } from "@/lib/utils/href";
import { getImageUrl } from "@/lib/utils/image";
import type { LayoutMenuItem } from "@/types/layout";

function hasSubLevel(item: LayoutMenuItem): boolean {
	const groups = item.data?.children ?? [];
	const linkGroups = groups.filter(
		(g) => g.key !== "featuredProducts" && g.key !== "hotProducts",
	);
	const all = linkGroups.flatMap((g) => g.items ?? []);
	return all.some((i) => i.status === StatusCommon.ACTIVE);
}

interface MobileCategoriesMenuProps {
	open: boolean;
	onClose: () => void;
	menuItems?: LayoutMenuItem[];
}

export function MobileCategoriesMenu({
	open,
	onClose,
	menuItems = [],
}: MobileCategoriesMenuProps) {
	const [activeItem, setActiveItem] = useState<LayoutMenuItem | null>(null);

	function closeAll() {
		setActiveItem(null);
		onClose();
	}

	// Group "brands" giờ chứa "Sản phẩm liên quan" (admin chọn qua tab "Sản phẩm liên quan").
	const categoryRelatedGroup = activeItem?.data.children.find(
		(c) => c.key === "brands",
	);
	const hotGroup = activeItem?.data.children.find(
		(c) => c.key === "hotProducts",
	);
	const featuredGroup = activeItem?.data.children.find(
		(c) => c.key === "featuredProducts",
	);

	return (
		<Drawer
			open={open}
			onOpenChange={(v) => !v && closeAll()}
			direction="left"
		>
			<DrawerContent className="fixed inset-0 z-200 bg-white flex flex-col w-full h-dvh outline-none">
				{/* Header */}
				<DrawerHeader
					className="px-3 pb-3 border-b border-gray-100 shrink-0 bg-white flex items-center justify-between"
					style={{
						paddingTop: "max(env(safe-area-inset-top, 16px), 16px)",
					}}
				>
					<DrawerTitle className="flex items-center shrink-0">
						{activeItem ? (
							<button
								type="button"
								onClick={() => setActiveItem(null)}
								className="flex items-center gap-1 text-sm font-bold text-gray-900 active:text-primary-600 transition-colors"
							>
								<ChevronLeft className="size-4" />
								Quay lại
							</button>
						) : (
							<Image
								src="/logo.jpg"
								alt="Ắc Quy HN Sài Gòn"
								width={120}
								height={28}
								className="w-[120px] h-auto object-contain bg-transparent"
								priority
								unoptimized
							/>
						)}
					</DrawerTitle>
					<Button
						variant="link"
						color="gray"
						onClick={
							activeItem ? () => setActiveItem(null) : closeAll
						}
						className="p-1 text-gray-500 bg-gray-100 active:bg-gray-200 rounded-full transition-colors flex items-center justify-center shrink-0"
					>
						<X className="size-3" />
					</Button>
				</DrawerHeader>

				{/* Content — slides between Level 1 and Level 2 */}
				<div className="flex-1 overflow-hidden relative">
					{/* Level 1: Categories list */}
					<div
						className="absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ease-in-out pb-[calc(32px+env(safe-area-inset-bottom))]"
						style={{
							transform: activeItem
								? "translateX(-100%)"
								: "translateX(0)",
						}}
					>
						{menuItems.map((item) => {
							const expandable = hasSubLevel(item);
							const itemHref = toHref(item.targetUrl) as Route;
							const rowClass =
								"flex items-center gap-2 w-full p-2 border-b border-gray-100 text-gray-900 active:bg-gray-50 transition-colors";
							const inner = (
								<>
									{item.data.icon ? (
										<div className="size-7 flex items-center justify-center shrink-0 overflow-hidden">
											<Image
												src={getImageUrl(item.data.icon)}
												alt=""
												width={24}
												height={24}
												className="size-5 object-contain"
												unoptimized
											/>
										</div>
									) : (
										<div className="size-7 shrink-0" />
									)}
									<span className="flex-1 text-left font-medium text-sm">
										{item.name}
									</span>
									{expandable && (
										<ChevronRight className="size-4 text-gray-400" />
									)}
								</>
							);
							return expandable ? (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveItem(item)}
									className={rowClass}
								>
									{inner}
								</button>
							) : (
								<Link
									key={item.id}
									href={itemHref}
									onClick={closeAll}
									className={rowClass}
								>
									{inner}
								</Link>
							);
						})}
					</div>

					{/* Level 2: Sub-category detail */}
					<div
						className="absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ease-in-out pb-[calc(32px+env(safe-area-inset-bottom))]"
						style={{
							transform: activeItem
								? "translateX(0)"
								: "translateX(100%)",
						}}
					>
						{activeItem && (
							<div className="p-2">
								{/* Sản phẩm liên quan category */}
								{categoryRelatedGroup &&
									categoryRelatedGroup.items.length > 0 && (
										<div className="mb-4">
											<h3 className="font-bold text-[13px] text-gray-900 mb-2">
												{activeItem.name}
											</h3>
											<div className="grid grid-cols-3 gap-2">
												{categoryRelatedGroup.items
													.filter(
														(p) =>
															p.status ===
															StatusCommon.ACTIVE,
													)
													.map((product) => (
														<Link
															key={product.id}
															href={
																(product.url ??
																	"/") as Route
															}
															onClick={closeAll}
															className="flex flex-col items-center gap-1.5 p-2 rounded-lg active:bg-gray-50 transition-colors text-center"
														>
															<div className="size-16 relative overflow-hidden rounded-md bg-gray-50 shrink-0">
																{product.icon ? (
																	<Image
																		src={getImageUrl(
																			product.icon,
																		)}
																		unoptimized
																		alt={
																			product.name
																		}
																		fill
																		className="object-cover"
																	/>
																) : null}
															</div>
															<span className="text-[11px] leading-tight line-clamp-2 text-gray-900">
																{product.name}
															</span>
														</Link>
													))}
											</div>
										</div>
									)}

								{/* Hot products */}
								{hotGroup && hotGroup.items.length > 0 && (
									<div className="mb-4">
										<h3 className="font-bold text-[13px] text-gray-900 mb-2">
											{hotGroup.title}
										</h3>
										<div className="grid grid-cols-3 gap-y-4 gap-x-2">
											{hotGroup.items
												.filter(
													(p) =>
														p.status ===
														StatusCommon.ACTIVE,
												)
												.map((product) => (
													<Link
														key={product.id}
														href={
															(product.url ??
																"#") as Route
														}
														onClick={closeAll}
														className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity"
													>
														{product.icon && (
															<div className="size-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden p-1">
																<Image
																	src={getImageUrl(
																		product.icon,
																	)}
																	unoptimized
																	alt={
																		product.name
																	}
																	width={56}
																	height={56}
																	className="w-full h-full object-contain"
																/>
															</div>
														)}
														<span className="text-[10px] text-center leading-[1.2] line-clamp-2 text-gray-800">
															{product.name}
														</span>
													</Link>
												))}
										</div>
									</div>
								)}

								{/* Featured products */}
								{featuredGroup &&
									featuredGroup.items.length > 0 && (
										<div className="mb-4">
											<h3 className="font-bold text-[13px] text-gray-900 mb-2 flex items-center gap-1.5">
												Sản phẩm nổi bật
											</h3>
											<div className="flex flex-col border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden">
												{featuredGroup.items
													.filter(
														(p) =>
															p.status ===
															StatusCommon.ACTIVE,
													)
													.map((product) => (
														<Link
															key={product.id}
															href={
																(product.url ??
																	"#") as Route
															}
															onClick={closeAll}
															className="flex gap-2 p-2 items-center bg-white active:bg-gray-50 transition-colors"
														>
															{product.icon && (
																<div className="size-16 shrink-0 relative flex items-center justify-center rounded-lg bg-gray-50 p-1">
																	<Image
																		src={getImageUrl(
																			product.icon,
																		)}
																		unoptimized
																		alt={
																			product.name
																		}
																		width={
																			40
																		}
																		height={
																			40
																		}
																		className="w-full h-full object-contain mix-blend-multiply"
																	/>
																</div>
															)}
															<div className="flex-1 min-w-0 pr-1">
																<p className="text-sm font-medium text-gray-900 truncate leading-snug mb-1">
																	{
																		product.name
																	}
																</p>
																{(() => {
																	const price =
																		product.price ??
																		product.minPrice ??
																		0;
																	const listed =
																		product.listedPrice ??
																		0;
																	if (price <= 0) {
																		return (
																			<span className="text-primary-600 font-semibold text-sm">
																				Liên hệ
																			</span>
																		);
																	}
																	return (
																		<div className="flex flex-col">
																			<span className="text-primary-600 font-semibold text-sm">
																				{formatPrice(
																					price,
																				)}
																			</span>
																			{listed >
																				price && (
																				<span className="text-gray-400 text-xs line-through mt-0.5">
																					{formatPrice(
																						listed,
																					)}
																				</span>
																			)}
																		</div>
																	);
																})()}
															</div>
														</Link>
													))}
											</div>
										</div>
									)}
							</div>
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
