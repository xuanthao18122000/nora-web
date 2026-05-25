import { LayoutMenuColumn } from "@/components/layout/LayoutMenuColumn";
import { extractFooterMenu } from "@/lib/api/layout";
import type { GroupedSection } from "@/types/page";

interface FooterProps {
	className?: string;
	layoutSections?: GroupedSection[];
}

export default function Footer({
	className = "",
	layoutSections = [],
}: FooterProps) {
	const footerItems = extractFooterMenu(layoutSections);

	if (footerItems.length === 0) {
		return (
			<footer
				className={`bg-white text-slate-700 safe-bottom ${className}`}
			>
				<div className="container-inner py-8 text-center text-sm text-slate-400">
					© {new Date().getFullYear()} Ắc Quy HN Sài Gòn. All rights reserved.
				</div>
			</footer>
		);
	}

	return (
		<footer className={`bg-white text-slate-700 safe-bottom ${className}`}>
			<div className="container-inner py-6 md:py-12">
				<h2 className="sr-only">Thông tin và liên kết</h2>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
					{footerItems.map((col) => (
						<LayoutMenuColumn key={col.id} item={col} />
					))}
				</div>

				<div className="mt-8 pt-6 border-t border-gray-200 text-xs text-slate-500 text-center">
					© {new Date().getFullYear()} Ắc Quy HN Sài Gòn. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
