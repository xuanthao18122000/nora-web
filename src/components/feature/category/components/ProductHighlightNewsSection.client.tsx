"use client";

import FaqSection from "@/components/common/FaqSection";
import ParseHtmlContent from "@/components/common/ParseHtmlContent";
import type { FaqItem } from "@/components/feature/category/api/get-faqs";

export interface ProductHighlightNewsSectionProps {
	name: string;
	description: string;
	faqItems?: FaqItem[];
}

export default function ProductHighlightNewsSection({
	name,
	description,
	faqItems,
}: ProductHighlightNewsSectionProps) {
	return (
		<section
			className="grid grid-cols-1 gap-4"
			aria-label={`Đặc điểm nổi bật — ${name}`}
		>
			<div>
				{description && description.trim().length > 0 && (
					<ParseHtmlContent html={description} />
				)}
				{faqItems && faqItems.length > 0 && (
					<FaqSection className="mt-4" items={faqItems} />
				)}
			</div>
		</section>
	);
}
