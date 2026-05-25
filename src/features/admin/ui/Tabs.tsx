"use client";

import { useState } from "react";

export interface TabItem {
	key: string;
	label: string;
	children: React.ReactNode;
}

interface TabsProps {
	items: TabItem[];
	defaultActiveKey?: string;
	className?: string;
}

export function Tabs({ items, defaultActiveKey, className = "" }: TabsProps) {
	const [active, setActive] = useState(defaultActiveKey ?? items[0]?.key);

	return (
		<div className={className}>
			<div className="flex gap-1 overflow-x-auto border-b border-gray-200">
				{items.map((item) => (
					<button
						key={item.key}
						type="button"
						onClick={() => setActive(item.key)}
						className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
							active === item.key
								? "text-red-600"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						{item.label}
						{active === item.key && (
							<span className="absolute inset-x-4 bottom-0 h-0.5 rounded-t-full bg-red-600" />
						)}
					</button>
				))}
			</div>
			<div className="mt-4">
				{items.map((item) => (
					<div key={item.key} hidden={active !== item.key}>
						{item.children}
					</div>
				))}
			</div>
		</div>
	);
}
