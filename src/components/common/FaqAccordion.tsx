"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqAccordionEntry {
	question: string;
	/** Body có thể là ReactNode (p, ul, div...) — khác `FaqSection` chỉ nhận string. */
	body: ReactNode;
}

interface FaqAccordionItemProps {
	entry: FaqAccordionEntry;
	/** Chỉ số hiển thị trước câu hỏi (vd "1. "). */
	index?: number;
	defaultOpen?: boolean;
}

function FaqAccordionItem({
	entry,
	index,
	defaultOpen = false,
}: FaqAccordionItemProps) {
	const [open, setOpen] = useState(defaultOpen);
	const panelId = useId();

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
					<span className="min-w-0 text-sm font-medium leading-6 tracking-normal text-gray-900 md:text-base">
						{typeof index === "number" ? `${index}. ` : ""}
						{entry.question}
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
			<div
				id={panelId}
				role="region"
				className={cn("accordion-custom-content", open && "is-open")}
			>
				<div className="accordion-custom-inner">
					<div className="px-4 pb-4 text-sm leading-6 text-gray-700">
						{entry.body}
					</div>
				</div>
			</div>
		</div>
	);
}

interface FaqAccordionProps {
	className?: string;
	entries: FaqAccordionEntry[];
	/** Hiện số thứ tự "1. ", "2. " trước câu hỏi. Default true. */
	showIndex?: boolean;
	/** Mở sẵn entry đầu tiên (default false). */
	defaultOpenFirst?: boolean;
}

/**
 * Accordion FAQ cho các trang tĩnh — accept ReactNode body để giữ format
 * (paragraph, bullet list, link...). Dùng chung style accordion-custom với
 * `FaqSection` (dynamic) để đồng nhất UI.
 */
export default function FaqAccordion({
	className,
	entries,
	showIndex = true,
	defaultOpenFirst = false,
}: FaqAccordionProps) {
	if (entries.length === 0) return null;

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			{entries.map((entry, i) => (
				<FaqAccordionItem
					key={entry.question}
					entry={entry}
					index={showIndex ? i + 1 : undefined}
					defaultOpen={defaultOpenFirst && i === 0}
				/>
			))}
		</div>
	);
}
