import type { Route } from "next";
import Link from "next/link";
import { StatusCommon } from "@/constants/common";
import { cn } from "@/lib/utils/cn";
import type { LayoutMenuItem } from "@/types/layout";

interface LayoutMenuColumnProps {
	item: LayoutMenuItem;
	className?: string;
	titleClassName?: string;
	linkClassName?: string;
	/** Render group title cho mỗi `data.children` group (true) hoặc flatten thành 1 list (false). */
	showGroupTitle?: boolean;
}

/**
 * Render 1 menu item layout-menu thành cột links.
 * Dùng chung cho Footer & các nơi cần render `LayoutMenuItem` dưới dạng list link.
 */
export function LayoutMenuColumn({
	item,
	className,
	titleClassName = "text-base font-bold text-slate-900",
	linkClassName = "text-slate-600 hover:text-blue-500 transition-colors",
	showGroupTitle = false,
}: LayoutMenuColumnProps) {
	const groups = item.data?.children ?? [];

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<h3 className={titleClassName}>{item.name}</h3>
			<div className="flex flex-col gap-3">
				{groups.map((group) => {
					const links = (group.items ?? []).filter(
						(it) => it.status === StatusCommon.ACTIVE,
					);
					if (links.length === 0) return null;
					return (
						<div key={group.key} className="flex flex-col gap-2">
							{showGroupTitle && group.title && (
								<h4 className="text-xs font-semibold text-slate-700">
									{group.title}
								</h4>
							)}
							<ul className="space-y-2 text-sm">
								{links.map((link) => {
									const hasTitle = !!link.title?.trim();
									const hasUrl = !!link.url?.trim();
									return (
										<li key={link.id}>
											{hasTitle ? (
												<>
													<span className="text-slate-700">
														{link.title}:
													</span>{" "}
													{hasUrl ? (
														<Link
															href={
																link.url as Route
															}
															className={
																linkClassName
															}
														>
															{link.name}
														</Link>
													) : (
														<span className="text-slate-600">
															{link.name}
														</span>
													)}
												</>
											) : hasUrl ? (
												<Link
													href={link.url as Route}
													className={linkClassName}
												>
													{link.name}
												</Link>
											) : (
												<span className="text-slate-600">
													{link.name}
												</span>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					);
				})}
			</div>
		</div>
	);
}
