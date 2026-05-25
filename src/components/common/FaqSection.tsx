"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/components/feature/category/api/get-faqs";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
	className?: string;
	items: FaqItem[];
}

interface FaqAccordionItemProps {
	item: FaqItem;
}

function FaqAccordionItem({ item }: FaqAccordionItemProps) {
	const [open, setOpen] = useState(false);
	const panelId = useId();

	if (!item.question) return null;

	return (
		<div className="accordion-custom rounded-2xl bg-gray-100">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={panelId}
				className="w-full cursor-pointer list-none px-4 py-3 text-left focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<div className="flex items-center justify-between gap-3">
					<span className="min-w-0 text-sm font-medium leading-6 tracking-normal text-gray-900">
						{item.question}
					</span>
					<ChevronDown
						size={18}
						aria-hidden="true"
						className={cn(
							"shrink-0 text-gray-500 transition-transform duration-300 ease-out",
							open && "rotate-180",
						)}
					/>
				</div>
			</button>
			{item.answer && (
				<div
					id={panelId}
					role="region"
					className={cn(
						"accordion-custom-content",
						open && "is-open",
					)}
				>
					<div className="accordion-custom-inner">
						<div className="px-4 pb-3 text-sm leading-6 text-gray-600 **:text-sm! **:leading-6!">
							{item.answer}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default function FaqSection({ className, items }: FaqSectionProps) {
	if (items.length === 0) return null;

	return (
		<section className={cn("rounded-2xl bg-white p-2 md:p-4", className)}>
			<div className="mb-2 md:mb-3">
				<h2 className="text-base font-medium leading-6 tracking-normal">
					Câu hỏi thường gặp
				</h2>
			</div>

			<div className="flex flex-col gap-3">
				{items.map((item) => (
					<FaqAccordionItem key={item.id} item={item} />
				))}
			</div>
		</section>
	);
}
