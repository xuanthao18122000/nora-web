"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem as NavItemType } from "./nav-data";

interface NavItemProps {
	item: NavItemType;
}

// Class chung — đảm bảo parent + sub item cùng chiều cao + spacing
const ROW_BASE =
	"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
const ROW_DEFAULT = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
const ROW_ACTIVE = "bg-blue-50 text-blue-700";
const ROW_PARENT_ACTIVE = "bg-blue-50/60 text-blue-700";

function isPathActive(currentPath: string | null, target: string): boolean {
	if (!currentPath) return false;
	if (target === "/admin") return currentPath === "/admin";
	return currentPath === target || currentPath.startsWith(`${target}/`);
}

export function NavItem({ item }: NavItemProps) {
	const pathname = usePathname();
	const Icon = item.icon;
	const hasChildren = !!item.children?.length;

	const childActive = item.children?.some((c) => isPathActive(pathname, c.path)) ?? false;
	const selfActive = item.path ? isPathActive(pathname, item.path) : false;
	const isActive = selfActive || childActive;

	const [open, setOpen] = useState(childActive);
	useEffect(() => {
		if (childActive) setOpen(true);
	}, [childActive]);

	if (!hasChildren && item.path) {
		return (
			<Link
				href={item.path}
				className={`${ROW_BASE} ${selfActive ? ROW_ACTIVE : ROW_DEFAULT}`}
			>
				<Icon className="h-5 w-5 shrink-0" />
				<span className="truncate">{item.title}</span>
			</Link>
		);
	}

	return (
		<div className="flex flex-col gap-0.5">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className={`${ROW_BASE} w-full text-left ${isActive ? ROW_PARENT_ACTIVE : ROW_DEFAULT}`}
				aria-expanded={open}
			>
				<Icon className="h-5 w-5 shrink-0" />
				<span className="flex-1 truncate">{item.title}</span>
				<ChevronRight
					className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
				/>
			</button>

			{hasChildren && (
				<div
					className={`grid overflow-hidden transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
				>
					<div className="min-h-0">
						<div className="flex flex-col gap-0.5">
							{item.children?.map((child) => {
								const active = isPathActive(pathname, child.path);
								return (
									<Link
										key={child.path}
										href={child.path}
										className={`${ROW_BASE} ${active ? ROW_ACTIVE : ROW_DEFAULT}`}
									>
										{/* Icon spacer để align với parent — giữ chiều rộng đúng 18px */}
										<span className="flex h-5 w-5 shrink-0 items-center justify-center">
											<span
												className={`h-1.5 w-1.5 rounded-full ${active ? "bg-blue-600" : "bg-gray-300"}`}
											/>
										</span>
										<span className="truncate">{child.title}</span>
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
