"use client";

import { useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "./useClickOutside";

interface DropdownProps {
	trigger: ReactNode;
	children: ReactNode | ((close: () => void) => ReactNode);
	align?: "start" | "end";
	className?: string;
}

export function Dropdown({ trigger, children, align = "end", className = "" }: DropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, open, () => setOpen(false));

	const close = () => setOpen(false);

	return (
		<div ref={ref} className={`relative ${className}`}>
			<div onClick={() => setOpen((v) => !v)}>{trigger}</div>
			{open && (
				<div
					className={`absolute top-full z-30 mt-1 min-w-[220px] max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 ${
						align === "end" ? "right-0" : "left-0"
					}`}
				>
					{typeof children === "function" ? children(close) : children}
				</div>
			)}
		</div>
	);
}

interface DropdownItemProps {
	onClick?: () => void;
	children: ReactNode;
	disabled?: boolean;
}

export function DropdownItem({ onClick, children, disabled }: DropdownItemProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{children}
		</button>
	);
}

export function DropdownGroupLabel({ children }: { children: ReactNode }) {
	return (
		<div className="border-t border-gray-100 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500 first:border-t-0 first:pt-1">
			{children}
		</div>
	);
}
