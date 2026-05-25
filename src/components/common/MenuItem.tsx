"use client";

import type React from "react";

interface MenuItemProps {
	icon?: React.ReactNode;
	label: string;
	active?: boolean;
	onClick?: () => void;
	href?: string;
	className?: string;
}

/**
 * Menu Item — matches Figma `item` (129:12612)
 * Used in header bottom-nav for category navigation.
 *
 * State: Default / Active
 */
export default function MenuItem({
	icon,
	label,
	active = false,
	onClick,
	href,
	className = "",
}: MenuItemProps) {
	const Component = href ? "a" : "button";

	return (
		<Component
			href={href}
			onClick={onClick}
			className={`
				inline-flex items-center gap-1 px-3 py-2 text-sm font-normal
				transition-colors whitespace-nowrap
				${active ? "text-primary-600 font-medium" : "text-gray-700 hover:text-gray-900"}
				${className}
			`}
		>
			{icon && <span className="w-5 h-5 shrink-0">{icon}</span>}
			<span>{label}</span>
		</Component>
	);
}
