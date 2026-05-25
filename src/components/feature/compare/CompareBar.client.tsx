"use client";

import { ChevronUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BOTTOM_BAR_CONTAINER } from "@/components/layout/BottomFloatingStack";
import { cn } from "@/lib/utils/cn";
import { getImageUrl } from "@/lib/utils/image";
import { useCompareStore } from "@/store/useCompareStore";
import { useDeviceStore } from "@/store/useDeviceStore";

import { SearchModal } from "./SearchModal.client";

const MAX_SLOTS = 3;

// ── CompareBar ─────────────────────────────────────────────────────
export default function CompareBar() {
	const isMobile = useDeviceStore((s) => s.isMobile);
	const pathname = usePathname();
	const {
		items: rawItems,
		removeItem,
		collapsed,
		setCollapsed,
	} = useCompareStore();
	// Ensure items always has exactly MAX_SLOTS entries (localStorage may persist fewer)
	const items = [...rawItems];
	while (items.length < MAX_SLOTS) items.push(null);
	const validItems = items.filter((i) => i !== null);
	const [showModal, setShowModal] = useState(false);
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const desktopCollapsed = collapsed && !isMobile;

	if (!mounted || validItems.length === 0 || pathname === "/compare")
		return null;

	return (
		<>
			{/* Fixed pill on desktop — fade in/out */}
			{!isMobile && (
				<button
					type="button"
					onClick={() => setCollapsed(false)}
					className={cn(
						"fixed left-6 z-50 bg-white rounded-full shadow-[0px_0px_16px_0px_rgba(0,0,0,0.12)] px-5 py-2.5 text-sm font-medium text-gray-700 hover:shadow-lg cursor-pointer pointer-events-auto",
						"transition-[opacity,transform] duration-300 ease-in-out",
						desktopCollapsed
							? "opacity-100 scale-100"
							: "opacity-0 scale-95 pointer-events-none",
					)}
					style={{ bottom: 24 }}
				>
					So sánh{" "}
					<span className="text-red-500">({validItems.length})</span>
				</button>
			)}

			{/* Bar — grid-rows wraps entire bar for smooth collapse/expand */}
			<div
				data-sticky="compare-bar"
				className={cn(
					"w-full pointer-events-auto",
					!isMobile &&
						"transition-[max-height,opacity] duration-300 ease-in-out",
					!isMobile && desktopCollapsed
						? "max-h-0 opacity-0 pointer-events-none"
						: "max-h-[500px] opacity-100",
				)}
			>
				<div className={cn(BOTTOM_BAR_CONTAINER)}>
					<div className="bg-white rounded-2xl shadow-[0px_0px_16px_0px_rgba(0,0,0,0.12)] w-full">
						{/* Header — always visible when bar is shown */}
						<div className="flex items-center justify-between px-4 py-2.5">
							<span className="text-sm text-gray-600 font-medium">
								So sánh ({validItems.length} sản phẩm)
							</span>
							<button
								type="button"
								onClick={() => setCollapsed(!collapsed)}
								className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-blue-500"
							>
								<ChevronUp
									size={16}
									className={cn(
										"transition-transform duration-300",
										collapsed ? "" : "rotate-180",
									)}
								/>
								{collapsed ? "Mở rộng" : "Thu gọn"}
							</button>
						</div>

						{/* Expandable content — grid-rows animation */}
						<div
							className={cn(
								"grid transition-[grid-template-rows] duration-300 ease-out",
								collapsed
									? "grid-rows-[0fr]"
									: "grid-rows-[1fr]",
							)}
						>
							<div className="overflow-hidden">
								{isMobile ? (
									/* ── Mobile ── */
									<div className="flex flex-col gap-2 px-3 pb-3">
										<div className="flex gap-2 overflow-x-auto hide-scrollbar">
											{items.map((item, idx) => {
												if (item) {
													return (
														<div
															key={item.productId}
															className="relative flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-1.5"
															style={{
																width: "calc(50% - 4px)",
															}}
														>
															<div className="relative size-10 shrink-0">
																<Image
																	src={getImageUrl(
																		item.image,
																	)}
																	alt={
																		item.name
																	}
																	fill
																	className="object-contain"
																	sizes="40px"
																/>
															</div>
															<p className="min-w-0 flex-1 text-xs leading-4 text-gray-800 line-clamp-2 pr-4">
																{item.name}
															</p>
															<button
																type="button"
																onClick={() =>
																	removeItem(
																		item.productId,
																	)
																}
																className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-gray-300 p-0.5 text-white transition-colors hover:bg-red-500"
																aria-label="Xóa sản phẩm"
															>
																<X size={10} />
															</button>
														</div>
													);
												}
												return (
													<button
														key={`empty-${idx}`}
														type="button"
														onClick={() =>
															setShowModal(true)
														}
														className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-primary-300 hover:text-blue-500"
														style={{
															width: "calc(50% - 4px)",
														}}
													>
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															aria-hidden="true"
														>
															<circle
																cx="12"
																cy="12"
																r="10"
															/>
															<path d="M8 12h8" />
															<path d="M12 8v8" />
														</svg>
														<span className="text-xs">
															Thêm
														</span>
													</button>
												);
											})}
										</div>
										<div className="flex items-center gap-2">
											<Link
												href="/compare"
												className={cn(
													"flex-1 rounded-lg border border-transparent px-3 py-2 text-center text-sm font-medium transition-colors",
													validItems.length >= 2
														? "bg-primary-500 text-white hover:bg-primary-600"
														: "pointer-events-none bg-gray-200 text-gray-400",
												)}
												aria-disabled={
													validItems.length < 2
												}
											>
												So sánh
											</Link>
										</div>
									</div>
								) : (
									/* ── Desktop ── */
									<div className="flex items-center gap-2 px-3 pb-3">
										{items.map((item, idx) => {
											if (item) {
												return (
													<div
														key={item.productId}
														className="relative flex flex-1 items-center gap-1 rounded-lg border border-solid border-gray-200 bg-white h-[86px] p-2 min-w-0"
													>
														<div className="relative size-[60px] shrink-0">
															<Image
																src={getImageUrl(
																	item.image,
																)}
																alt={item.name}
																fill
																className="object-contain"
																sizes="60px"
															/>
														</div>
														<div className="min-w-0 flex-1 pr-4">
															<p className="text-xs leading-4 text-gray-800 line-clamp-2">
																{item.name}
															</p>
														</div>
														<button
															type="button"
															onClick={() =>
																removeItem(
																	item.productId,
																)
															}
															className="absolute right-[7px] top-[9px] flex items-center justify-center rounded-full bg-gray-300 p-1 text-white transition-colors hover:bg-red-500"
															title="Xóa"
															aria-label="Xóa sản phẩm"
														>
															<X size={12} />
														</button>
													</div>
												);
											}
											return (
												<button
													key={`empty-${idx}`}
													type="button"
													onClick={() =>
														setShowModal(true)
													}
													className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 bg-white h-[86px] p-2 text-gray-800 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-blue-500 min-w-0"
													title="Thêm sản phẩm"
												>
													<span className="flex size-6 items-center justify-center">
														<svg
															width="24"
															height="24"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															aria-hidden="true"
														>
															<circle
																cx="12"
																cy="12"
																r="10"
															/>
															<path d="M8 12h8" />
															<path d="M12 8v8" />
														</svg>
													</span>
													<span className="text-xs">
														Thêm sản phẩm
													</span>
												</button>
											);
										})}
										<div className="flex flex-1 flex-col items-start justify-center gap-1 h-[86px] p-2 min-w-0">
											<span className="text-xs text-gray-800 whitespace-nowrap">
												Tối đa {MAX_SLOTS} sản phẩm
											</span>
											<div className="flex w-full items-center gap-2">
												<Link
													href="/compare"
													className={cn(
														"flex-1 whitespace-nowrap rounded-lg border border-transparent px-3 py-2.5 text-center text-sm font-medium transition-colors",
														validItems.length >= 2
															? "bg-primary-500 text-white hover:bg-primary-600"
															: "pointer-events-none bg-gray-200 text-gray-400",
													)}
													aria-disabled={
														validItems.length < 2
													}
												>
													So sánh
												</Link>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{showModal && <SearchModal onClose={() => setShowModal(false)} />}
		</>
	);
}
