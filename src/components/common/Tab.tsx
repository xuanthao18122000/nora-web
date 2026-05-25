"use client";

import type React from "react";
import { useState } from "react";

interface TabItem {
	key: string;
	label: string;
	/** Optional secondary text below the label */
	subLabel?: string;
	/** Optional badge/status indicator */
	badge?: React.ReactNode;
}

interface TabProps {
	items: TabItem[];
	defaultActiveKey?: string;
	activeKey?: string;
	onChange?: (key: string) => void;
	variant?: "default" | "underline";
	className?: string;
}

/**
 * Tab — matches Figma Flash Sale timeline (255:92740)
 *
 * Variants:
 * - `default`: rounded background tabs
 * - `underline`: bottom border indicator
 *
 * @example
 * <Tab
 *   items={[
 *     { key: "ongoing", label: "29/1", subLabel: "Chỉ còn 04:12:26" },
 *     { key: "next", label: "Sắp diễn ra", subLabel: "21:30" },
 *   ]}
 *   onChange={(key) => console.log(key)}
 * />
 */
export default function Tab({
	items,
	defaultActiveKey,
	activeKey: controlledActiveKey,
	onChange,
	variant = "underline",
	className = "",
}: TabProps) {
	const [internalActive, setInternalActive] = useState(
		defaultActiveKey || items[0]?.key || "",
	);

	const activeKey = controlledActiveKey ?? internalActive;

	const handleClick = (key: string) => {
		if (!controlledActiveKey) {
			setInternalActive(key);
		}
		onChange?.(key);
	};

	return (
		<div
			className={`flex items-stretch overflow-x-auto scrollbar-hide ${className}`}
		>
			{items.map((item) => {
				const isActive = activeKey === item.key;

				return (
					<button
						key={item.key}
						type="button"
						onClick={() => handleClick(item.key)}
						className={`
							relative flex flex-col items-center gap-1 px-4 py-2 min-w-[90px]
							text-center transition-colors shrink-0 cursor-pointer
							${
								variant === "underline"
									? isActive
										? "border-b-2 border-primary-600"
										: "border-b-2 border-transparent hover:border-gray-200"
									: isActive
										? "bg-primary-50 rounded-lg"
										: "hover:bg-gray-50 rounded-lg"
							}
						`}
					>
						<span
							className={`text-sm font-normal ${isActive ? "text-gray-900" : "text-gray-500"}`}
						>
							{item.label}
						</span>

						{item.subLabel && (
							<span
								className={`text-xs ${isActive ? "text-gray-900" : "text-gray-400"}`}
							>
								{item.subLabel}
							</span>
						)}

						{item.badge && (
							<div className="flex items-center gap-1">
								{item.badge}
							</div>
						)}
					</button>
				);
			})}
		</div>
	);
}
