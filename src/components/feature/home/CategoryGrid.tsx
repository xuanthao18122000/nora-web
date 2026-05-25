import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { getImageUrl } from "@/lib/utils/image";
import type { CategoryGridConfig, GroupedSection } from "@/types/page";

interface CategoryGridProps {
	group: GroupedSection;
}

export default function CategoryGrid({ group }: CategoryGridProps) {
	const config = group.section.config as CategoryGridConfig | undefined;
	const groups = config?.groups || [];

	if (groups.length === 0) return null;

	return (
		<div className="flex flex-col gap-4 md:flex-row">
			{groups.map((g, groupIndex) => (
				<SectionWrapper
					key={groupIndex}
					className="flex-1"
					title={g.title}
					contentClassName="flex-none"
					footer={
						g.viewAllText || g.viewAllLink ? (
							<div className="flex items-center justify-center">
								<Link
									href={(g.viewAllLink || "#") as never}
									className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-100"
								>
									{g.viewAllText || "Xem tất cả"}
									<ChevronRight
										className="h-4 w-4"
										aria-hidden
									/>
								</Link>
							</div>
						) : null
					}
				>
					{/* Grid */}
					{g.items && g.items.length > 0 ? (
						<div className="grid grid-cols-4 gap-2">
							{g.items.map((item, itemIndex) => {
								const src = getImageUrl(item.icon);
								if (!src) return null;
								return (
									<Link
										key={
											`${item.link}-${itemIndex}` ||
											`${g.title}-${itemIndex}`
										}
										href={(item.link || "#") as never}
										className="group/item flex flex-col items-center gap-1 rounded-lg"
									>
										<div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100 p-2">
											<div className="relative h-full w-full">
												<Image
													src={src}
													alt={item.name}
													fill
													sizes="(max-width: 768px) 25vw, 15vw"
													className="object-contain transition-transform duration-300 group-hover/item:scale-105"
												/>
											</div>
										</div>
										<p className="w-full truncate text-center text-xs text-gray-900">
											{item.name}
										</p>
									</Link>
								);
							})}
						</div>
					) : null}
				</SectionWrapper>
			))}
		</div>
	);
}
