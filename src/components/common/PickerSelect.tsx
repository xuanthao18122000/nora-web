"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type PickerSelectOption = {
	id: string | number;
	name: string;
	oldNames?: string[];
};

export interface PickerSelectProps {
	value: string;
	placeholder: string;
	disabled?: boolean;
	options: PickerSelectOption[];
	onChange: (id: string, name: string) => void;
	onClear?: () => void;
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
	className?: string;
	"aria-invalid"?: boolean;
}

export function PickerSelect({
	value,
	placeholder,
	disabled,
	options,
	onChange,
	onClear,
	isOpen,
	onToggle,
	onClose,
	className,
	"aria-invalid": ariaInvalid,
}: PickerSelectProps) {
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const searchRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (!isOpen) return;
		setSearch("");
		const timer = setTimeout(() => {
			searchRef.current?.focus({ preventScroll: true });
		}, 100);
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCloseRef.current();
		};
		const onClickOutside = (e: MouseEvent | TouchEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				onCloseRef.current();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("mousedown", onClickOutside);
		document.addEventListener("touchstart", onClickOutside);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("mousedown", onClickOutside);
			document.removeEventListener("touchstart", onClickOutside);
		};
	}, [isOpen]);

	const filteredOptions = useMemo(() => {
		if (!search.trim()) return options;
		const q = search.toLowerCase();
		return options.filter((opt) => {
			if (opt.name.toLowerCase().includes(q)) return true;
			if (opt.oldNames?.some((n) => n.toLowerCase().includes(q)))
				return true;
			return false;
		});
	}, [options, search]);

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onClear) {
			onClear();
		}
	};

	return (
		<div ref={containerRef} className={cn("relative flex-1", className)}>
			<button
				type="button"
				disabled={disabled}
				onClick={onToggle}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-invalid={ariaInvalid}
				className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-2 py-2.5 text-left text-sm transition md:px-3 ${
					disabled
						? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
						: isOpen
							? "border-primary-500 bg-white text-gray-900"
							: "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
				}`}
			>
				<span
					className={cn(
						"truncate flex-1 min-w-0",
						value ? "text-gray-900" : "text-gray-400",
					)}
				>
					{value || placeholder}
				</span>
				<div className="flex items-center gap-1 shrink-0">
					{value && onClear && !disabled && (
						<span
							role="button"
							tabIndex={0}
							onClick={handleClear}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ")
									handleClear(
										e as unknown as React.MouseEvent,
									);
							}}
							className="p-0.5 rounded-full hover:bg-gray-100 transition"
						>
							<X
								className="size-3.5 text-gray-400"
								aria-hidden="true"
								strokeWidth={2}
							/>
						</span>
					)}
					<ChevronDown
						className="size-4 text-gray-400"
						aria-hidden="true"
						strokeWidth={2}
					/>
				</div>
			</button>

			{isOpen && (
				<>
					<div className="absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
						{/* Search input */}
						{options.length > 0 && (
							<div className="px-2 pt-2 pb-1">
								<div className="relative">
									<Search
										className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none"
										strokeWidth={2}
									/>
									<input
										ref={searchRef}
										type="text"
										value={search}
										onChange={(e) =>
											setSearch(e.target.value)
										}
										placeholder="Tìm kiếm..."
										className="w-full rounded border border-gray-100 bg-transparent pl-8 pr-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 transition"
									/>
								</div>
							</div>
						)}
						{/* Options list */}
						<ul className="max-h-48 overflow-y-auto">
							{filteredOptions.length === 0 && (
								<li className="px-2 py-2.5 text-sm text-gray-400 md:px-3">
									Không tìm thấy
								</li>
							)}
							{filteredOptions.map((opt) => (
								<li key={opt.id}>
									<button
										type="button"
										onClick={() => {
											onChange(String(opt.id), opt.name);
											onClose();
										}}
										className="w-full cursor-pointer px-2 py-2.5 text-left text-sm text-gray-900 transition hover:bg-gray-50 md:px-3"
									>
										{opt.name}
										{opt.oldNames &&
											opt.oldNames.length > 0 && (
												<span className="mt-0.5 block max-w-[95%] truncate text-xs text-gray-400">
													{opt.oldNames.join(", ")}
												</span>
											)}
									</button>
								</li>
							))}
						</ul>
					</div>
				</>
			)}
		</div>
	);
}
