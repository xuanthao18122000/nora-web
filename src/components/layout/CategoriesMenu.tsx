"use client";

import { Menu } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Backdrop } from "@/components/common/Backdrop";
import {
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from "@/components/common/Popover";
import { StatusCommon } from "@/constants/common";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import { useHeaderMenuStore } from "@/store/useHeaderMenuStore";
import type { LayoutMenuItem } from "@/types/layout";

interface CategoriesMenuProps {
	className?: string;
	menuItems?: LayoutMenuItem[];
}

export function CategoriesMenu({
	className,
	menuItems = [],
}: CategoriesMenuProps) {
	const isOpen = useHeaderMenuStore((s) => s.categoriesOpen);
	const setIsOpen = useHeaderMenuStore((s) => s.setCategoriesOpen);
	const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
		null,
	);

	const activeItem =
		menuItems.find((m) => m.id === activeCategoryId) ?? menuItems[0];

	const children = activeItem?.data?.children ?? [];
	// Group "brands" giờ render dưới dạng grid card (sản phẩm liên quan category)
	const categoryRelatedGroup = children.find((c) => c.key === "brands");
	// Group sản phẩm nổi bật (admin chọn tối đa 5 sản phẩm)
	const featuredGroup = children.find((c) => c.key === "featuredProducts");
	const hasFeatured =
		featuredGroup &&
		featuredGroup.items.filter((i) => i.status === StatusCommon.ACTIVE).length >
			0;

	useEffect(() => {
		if (!isOpen && menuItems.length > 0) {
			setActiveCategoryId(menuItems[0].id);
		}
	}, [isOpen, menuItems]);

	return (
		<PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg outline-none transition-colors",
						isOpen ? "bg-primary-700" : "hover:bg-primary-700",
						className,
					)}
				>
					<Menu className="size-5" />
					<span>Danh mục</span>
				</button>
			</PopoverTrigger>

			<Backdrop open={isOpen} lockScroll />

			<PopoverContent
				align="start"
				sideOffset={14}
				className="w-[1200px] p-0 rounded-2xl shadow-xl border-gray-200 z-50"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className="flex h-[532px] bg-white rounded-2xl overflow-hidden">
					{/* Column 1: Categories sidebar */}
					<div className="w-[246px] shrink-0 border-r border-gray-200 p-3 flex flex-col overflow-y-auto custom-scrollbar">
						{menuItems.map((item) => (
							<button
								key={item.id}
								type="button"
								className={cn(
									"flex items-center gap-2 w-full p-2 rounded-lg text-sm text-gray-900 transition-colors text-left",
									activeCategoryId === item.id
										? "bg-gray-100 font-medium"
										: "hover:bg-gray-50",
								)}
								onMouseEnter={() =>
									setActiveCategoryId(item.id)
								}
							>
								{item.data?.icon && (
									<Image
										src={getImageUrl(item.data.icon)}
										alt=""
										width={24}
										height={24}
										className="size-6 shrink-0 object-contain"
										unoptimized
									/>
								)}
								<span className="truncate">{item.name}</span>
							</button>
						))}
					</div>

					{/* Column 2: Sản phẩm liên quan category */}
					<div className="flex-1 min-w-0 border-r border-gray-200 p-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
						{categoryRelatedGroup &&
						(categoryRelatedGroup.items?.length ?? 0) > 0 ? (
							<div className="flex flex-col gap-3">
								<h3 className="font-bold text-sm text-gray-900">
									{activeItem?.name ?? categoryRelatedGroup.title}
								</h3>
								<div className="grid grid-cols-5 gap-3">
									{categoryRelatedGroup.items
										.filter(
											(p) =>
												p.status === StatusCommon.ACTIVE,
										)
										.map((item) => (
											<Link
												key={item.id}
												href={(item.url ?? "/") as Route}
												className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-center group"
											>
												{item.icon ? (
													<div className="size-16 relative overflow-hidden shrink-0 rounded-md bg-gray-50 group-hover:scale-105 transition-transform duration-300">
														<Image
															src={getImageUrl(item.icon)}
															alt={item.name}
															fill
															className="object-cover"
															unoptimized
														/>
													</div>
												) : (
													<div className="size-16 shrink-0 rounded-md bg-gray-100" />
												)}
												<span className="text-xs text-gray-900 line-clamp-2 h-8">
													{item.name}
												</span>
											</Link>
										))}
								</div>
							</div>
						) : (
							<div className="flex-1 flex items-center justify-center text-sm text-gray-400">
								Chưa có dữ liệu
							</div>
						)}
					</div>

					{/* Column 3: Sản phẩm nổi bật (luôn giữ chỗ; trống nếu chưa cấu hình) */}
					<div className="w-[334px] shrink-0 p-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar bg-white">
						{hasFeatured && featuredGroup && (
							<div className="flex flex-col gap-3">
								<h3 className="font-bold text-sm text-gray-900 px-2">
									Sản phẩm nổi bật
								</h3>
								<div className="flex flex-col gap-2">
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
														"/") as Route
												}
												className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white hover:border-primary-500 hover:shadow-sm transition-all group"
											>
												{product.icon && (
													<div className="size-16 relative shrink-0 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300">
														<Image
															src={getImageUrl(
																product.icon,
															)}
															alt={product.name}
															fill
															className="object-contain"
															unoptimized
														/>
													</div>
												)}
												<div className="flex-1 min-w-0 flex flex-col gap-1">
													<p className="text-sm font-medium text-gray-900 truncate">
														{product.name}
													</p>
													{(() => {
														const price =
															product.price ??
															product.minPrice ??
															0;
														const listed =
															product.listedPrice ?? 0;
														if (price <= 0) {
															return (
																<p className="text-xs font-semibold text-primary-600">
																	Liên hệ
																</p>
															);
														}
														return (
															<div>
																<p className="text-xs font-semibold text-primary-600">
																	{formatPrice(price)}
																</p>
																{listed > 0 &&
																	listed > price && (
																		<p className="text-xs text-gray-400 line-through">
																			{formatPrice(listed)}
																		</p>
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
				</div>
			</PopoverContent>
		</PopoverRoot>
	);
}
