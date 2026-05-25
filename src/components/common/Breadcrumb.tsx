"use client";

import type React from "react";
import Carousel from "@/components/common/Carousel";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

function Separator() {
	return (
		<svg
			aria-hidden="true"
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			className="text-gray-300 shrink-0"
		>
			<path
				d="M4.5 2.5L8 6L4.5 9.5"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/**
 * Breadcrumb — for PLP and PDP navigation
 *
 * @example
 * <Breadcrumb items={[
 *   { label: "Trang chủ", href: "/" },
 *   { label: "Điện thoại", href: "/dien-thoai" },
 *   { label: "Samsung Galaxy A56" },
 * ]} />
 */
export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
	const children: React.ReactNode[] = [];

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const isLast = i === items.length - 1;

		children.push(
			<div
				key={`${item.label}-${i}`}
				className="flex items-center gap-1.5 shrink-0 whitespace-nowrap"
			>
				{i > 0 && <Separator />}
				{isLast || !item.href ? (
					<span className="text-gray-500 font-normal text-sm">
						{item.label}
					</span>
				) : (
					<a
						href={item.href}
						className="text-gray-700 font-normal text-sm hover:text-blue-500 transition-colors"
					>
						{item.label}
					</a>
				)}
			</div>,
		);
	}

	return (
		<nav className={className} aria-label="Breadcrumb">
			<Carousel gap={0} showNav={false}>
				{children}
			</Carousel>
		</nav>
	);
}
