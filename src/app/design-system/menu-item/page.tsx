"use client";

import { MenuItem } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function MenuItemPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Item</h1>
			<p className="text-gray-600 mb-8">
				Nav item for category or horizontal menu. Supports active state.
			</p>
			<div className="flex items-center gap-0 border-b border-gray-200">
				<MenuItem label="Điện thoại" active />
				<MenuItem label="Laptop" />
				<MenuItem label="Tablet" />
				<MenuItem label="Đồng hồ" />
				<MenuItem label="Âm thanh" />
				<MenuItem label="Phụ kiện" />
			</div>
			<CodeSnippet
				code={`import { MenuItem } from "@/components/common";

<MenuItem label="Điện thoại" active />
<MenuItem label="Laptop" />`}
			/>
		</div>
	);
}
