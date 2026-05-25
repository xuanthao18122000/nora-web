"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toRoman } from "@/lib/utils/roman";
import type { PolicyTreeNode } from "@/types";

interface PolicySidebarProps {
	tree: PolicyTreeNode[];
	activeSlug: string;
}

function findActivePath(
	nodes: PolicyTreeNode[],
	targetSlug: string,
	path: number[] = [],
): number[] | null {
	for (const n of nodes) {
		const next = [...path, n.id];
		if (n.slug === targetSlug) return next;
		if (n.children?.length) {
			const found = findActivePath(n.children, targetSlug, next);
			if (found) return found;
		}
	}
	return null;
}

function getPrefix(depth: number, index: number): string {
	// Web cũ: root → La Mã (I, II, III...), level 1+ → 1, 2, 3...
	return depth === 0 ? `${toRoman(index + 1)}.` : `${index + 1}.`;
}

interface BranchProps {
	node: PolicyTreeNode;
	depth: number;
	index: number;
	activeSlug: string;
	expanded: Set<number>;
	onToggle: (id: number) => void;
	className?: string;
}

function Branch({
	className,
	node,
	depth,
	index,
	activeSlug,
	expanded,
	onToggle,
}: BranchProps) {
	const hasChildren = (node.children?.length ?? 0) > 0;
	const isOpen = expanded.has(node.id);
	const isActive = node.slug === activeSlug;
	const indentPx = depth * 12;
	const prefix = getPrefix(depth, index);

	return (
		<li className="accordion-custom">
			<div
				className={cn(
					"relative flex items-center gap-1 rounded-lg py-2 pr-1 text-sm transition-colors",
					isActive
						? "bg-bg-primary-soft text-primary-500 font-medium"
						: "text-gray-700 hover:bg-gray-50",
					className,
				)}
				style={{ paddingLeft: 6 + indentPx }}
			>
				<Link
					href={`/${node.slug.replace(/\.html$/, "")}`}
					aria-label={node.title}
					className="absolute inset-0 z-0 rounded-lg"
				/>
				<span className="line-clamp-2 flex-1 leading-snug pointer-events-none">
					<span className="mr-1 inline-block min-w-[1.25rem] text-xs font-semibold tabular-nums opacity-70">
						{prefix}
					</span>
					{node.title}
				</span>
				{hasChildren ? (
					<button
						type="button"
						onClick={() => onToggle(node.id)}
						aria-label={isOpen ? "Thu gọn" : "Mở rộng"}
						aria-expanded={isOpen}
						className="relative z-10 shrink-0 rounded p-0.5 text-gray-500 transition-transform duration-300 ease-out hover:bg-gray-100 hover:text-gray-900"
					>
						<ChevronRight
							size={14}
							className={cn(
								"transition-transform duration-300 ease-out",
								isOpen && "rotate-90",
							)}
						/>
					</button>
				) : (
					<span className="w-[18px] shrink-0" />
				)}
			</div>
			{hasChildren && (
				<div
					className={cn(
						"accordion-custom-content",
						isOpen && "is-open",
					)}
				>
					<div className="accordion-custom-inner">
						<ul className="flex flex-col gap-1">
							{node.children.map((c, i) => (
								<Branch
									key={c.id}
									node={c}
									depth={depth + 1}
									index={i}
									activeSlug={activeSlug}
									expanded={expanded}
									onToggle={onToggle}
									className={cn(i === 0 && "mt-1")}
								/>
							))}
						</ul>
					</div>
				</div>
			)}
		</li>
	);
}

export default function PolicySidebar({
	tree,
	activeSlug,
}: PolicySidebarProps) {
	const initialExpanded = useMemo(() => {
		const ids = findActivePath(tree, activeSlug) ?? [];
		return new Set(ids);
	}, [tree, activeSlug]);

	const [expanded, setExpanded] = useState<Set<number>>(initialExpanded);

	const handleToggle = (id: number) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	return (
		<nav aria-label="Danh sách chính sách">
			<ul className="space-y-1">
				{tree.map((node, i) => (
					<Branch
						key={node.id}
						node={node}
						depth={0}
						index={i}
						activeSlug={activeSlug}
						expanded={expanded}
						onToggle={handleToggle}
					/>
				))}
			</ul>
		</nav>
	);
}
