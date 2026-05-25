"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
	PopoverAnchor,
	PopoverContent,
	PopoverRoot,
} from "@/components/common/Popover";
import { StatusCommon } from "@/constants/common";
import { cn } from "@/lib/utils/cn";
import { toHref } from "@/lib/utils/href";
import { getImageUrl } from "@/lib/utils/image";
import { useHeaderMenuStore } from "@/store/useHeaderMenuStore";
import type { LayoutMenuChildItem, LayoutMenuItem } from "@/types/layout";

const CLOSE_DELAY_MS = 140;

interface HeaderNavItemProps {
	item: LayoutMenuItem;
}

function getSubLinks(item: LayoutMenuItem): LayoutMenuChildItem[] {
	const groups = item.data?.children ?? [];
	// Chỉ lấy group "brands" (sản phẩm liên quan) — bỏ qua "featuredProducts"
	// (nổi bật) và "hotProducts" — các group này render ở dropdown danh mục lớn,
	// không phải hover top nav.
	const linkGroups = groups.filter(
		(g) => g.key !== "featuredProducts" && g.key !== "hotProducts",
	);
	const all = linkGroups.flatMap((g) => g.items ?? []);
	return all.filter((i) => i.status === StatusCommon.ACTIVE);
}

export function HeaderNavItem({ item }: HeaderNavItemProps) {
	const [open, setOpen] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const closeCategories = useHeaderMenuStore((s) => s.closeCategories);

	const subLinks = getSubLinks(item);
	const hasSubLinks = subLinks.length > 0;
	const href = toHref(item.targetUrl);
	const ITEMS_PER_COL = 8;
	const isMultiCol = subLinks.length > ITEMS_PER_COL;

	const cancelClose = () => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	};

	const scheduleClose = () => {
		cancelClose();
		closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
	};

	const handleEnter = () => {
		if (!hasSubLinks) return;
		cancelClose();
		closeCategories();
		setOpen(true);
	};

	const trigger = (
		<Link
			href={href}
			className={cn(
				"group relative flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-gray-900 transition-colors outline-none rounded-md",
				"hover:text-primary-500",
				"focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
				"after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary-500 after:transition-opacity after:duration-150",
				open ? "text-primary-500 after:opacity-100" : "after:opacity-0",
			)}
			onMouseEnter={handleEnter}
			onMouseLeave={scheduleClose}
			onFocus={handleEnter}
			onBlur={scheduleClose}
		>
			{item.data?.icon ? (
				<Image
					src={getImageUrl(item.data.icon)}
					alt={item.name}
					width={18}
					height={18}
					className="size-[18px] shrink-0 object-contain"
					unoptimized={item.data.icon.endsWith(".svg")}
				/>
			) : null}
			<span>{item.name}</span>
			{hasSubLinks ? (
				<ChevronDown
					aria-hidden="true"
					className={cn(
						"size-3.5 shrink-0 text-gray-400 transition-transform duration-150",
						"group-hover:text-primary-500",
						open && "rotate-180 text-primary-500",
					)}
				/>
			) : null}
		</Link>
	);

	if (!hasSubLinks) {
		return trigger;
	}

	return (
		<PopoverRoot open={open} onOpenChange={setOpen}>
			<PopoverAnchor asChild>{trigger}</PopoverAnchor>
			<PopoverContent
				align="start"
				sideOffset={0}
				className={cn(
					"pt-3 z-50 bg-transparent border-none drop-shadow-none shadow-none",
					isMultiCol ? "w-[600px]" : "w-[300px]",
				)}
				onOpenAutoFocus={(e) => e.preventDefault()}
				onMouseEnter={cancelClose}
				onMouseLeave={scheduleClose}
			>
				<div className="relative rounded-2xl bg-white ring-1 ring-gray-200/80 shadow-[0_12px_32px_-8px_rgba(2,72,138,0.18),0_4px_12px_-4px_rgba(15,23,42,0.08)] overflow-hidden">
					{/* List */}
					<ul
						className={cn(
							"p-1.5 max-h-[min(80vh,640px)] overflow-y-auto custom-scrollbar",
							"[overscroll-behavior:contain]",
							isMultiCol
								? "grid grid-cols-2 gap-x-2 grid-flow-col grid-rows-[repeat(8,minmax(0,auto))]"
								: "flex flex-col",
						)}
					>
						{subLinks.map((link) => (
							<li key={link.id}>
								<Link
									href={(link.url ?? "/") as Route}
									className={cn(
										"group relative flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg text-sm text-gray-800 transition-colors",
										"hover:bg-primary-50 hover:text-primary-600",
										"before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:rounded-r-full before:bg-primary-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
									)}
								>
									{link.icon ? (
										<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white ring-1 ring-gray-100 group-hover:ring-primary-100 transition-colors">
											<Image
												src={getImageUrl(link.icon)}
												alt=""
												width={22}
												height={22}
												className="size-[22px] object-contain"
												unoptimized
											/>
										</span>
									) : (
										<span
											aria-hidden="true"
											className="size-9 shrink-0 rounded-lg bg-gray-50 ring-1 ring-gray-100 group-hover:bg-white group-hover:ring-primary-100 transition-colors"
										/>
									)}
									<span className="flex-1 min-w-0 font-medium truncate">
										{link.name}
									</span>
									<ChevronRight className="size-4 shrink-0 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-[color,transform] duration-150" />
								</Link>
							</li>
						))}
					</ul>
				</div>
			</PopoverContent>
		</PopoverRoot>
	);
}
