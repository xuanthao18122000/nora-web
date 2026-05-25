"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { PolicyTreeNode } from "@/types";
import PolicySidebar from "./PolicySidebar";

interface Props {
	tree: PolicyTreeNode[];
	activeSlug: string;
	activeTitle: string;
}

export default function PolicyMobileNav({
	tree,
	activeSlug,
	activeTitle,
}: Props) {
	const [open, setOpen] = useState(false);

	return (
		<div className="lg:hidden">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-2 text-left text-sm font-medium text-gray-900"
				aria-expanded={open}
			>
				<span className="line-clamp-1">{activeTitle}</span>
				<ChevronDown
					size={16}
					className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && (
				<div className="mt-2 rounded-xl border border-gray-200 bg-white p-2">
					<PolicySidebar tree={tree} activeSlug={activeSlug} />
				</div>
			)}
		</div>
	);
}
