"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryTreeNode } from "@/lib/api/admin";

interface MultiCategoryPickerProps {
	tree: CategoryTreeNode[];
	value: number[];
	onChange: (ids: number[]) => void;
	placeholder?: string;
}

interface FlatNode {
	id: number;
	name: string;
	depth: number;
}

function flattenTree(nodes: CategoryTreeNode[], depth = 0): FlatNode[] {
	const out: FlatNode[] = [];
	for (const n of nodes) {
		out.push({ id: n.id, name: n.name, depth });
		if (n.children?.length) {
			out.push(...flattenTree(n.children as CategoryTreeNode[], depth + 1));
		}
	}
	return out;
}

export function MultiCategoryPicker({
	tree,
	value,
	onChange,
	placeholder = "Chọn danh mục...",
}: MultiCategoryPickerProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const ref = useRef<HTMLDivElement>(null);

	const flat = useMemo(() => flattenTree(tree), [tree]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return flat;
		return flat.filter((n) => n.name.toLowerCase().includes(q));
	}, [flat, search]);

	const selectedById = useMemo(() => {
		const map = new Map<number, FlatNode>();
		for (const n of flat) if (value.includes(n.id)) map.set(n.id, n);
		return map;
	}, [flat, value]);

	useEffect(() => {
		function onClick(e: MouseEvent) {
			if (!ref.current?.contains(e.target as Node)) setOpen(false);
		}
		if (open) document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, [open]);

	function toggle(id: number) {
		if (value.includes(id)) {
			onChange(value.filter((x) => x !== id));
		} else {
			onChange([...value, id]);
		}
	}

	function remove(id: number) {
		onChange(value.filter((x) => x !== id));
	}

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-left text-sm hover:border-gray-400"
			>
				<div className="flex flex-1 flex-wrap gap-1">
					{value.length === 0 && <span className="text-gray-400">{placeholder}</span>}
					{Array.from(selectedById.values()).map((n) => (
						<span
							key={n.id}
							className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
						>
							{n.name}
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									remove(n.id);
								}}
								className="rounded-full hover:bg-blue-100"
								aria-label="Bỏ chọn"
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
				<ChevronDown
					className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
					<div className="border-b border-gray-100 p-2">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Tìm danh mục..."
							className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
							autoFocus
						/>
					</div>
					<div className="max-h-60 overflow-y-auto py-1">
						{filtered.length === 0 && (
							<div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy</div>
						)}
						{filtered.map((n) => {
							const selected = value.includes(n.id);
							return (
								<button
									key={n.id}
									type="button"
									onClick={() => toggle(n.id)}
									className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${selected ? "bg-blue-50" : ""}`}
									style={{ paddingLeft: `${12 + n.depth * 16}px` }}
								>
									<span className="flex h-4 w-4 shrink-0 items-center justify-center">
										{selected && <Check className="h-3.5 w-3.5 text-blue-600" />}
									</span>
									<span className="truncate text-gray-700">{n.name}</span>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
