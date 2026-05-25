"use client";

import { SearchInput } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function SearchInputPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Search Input
			</h1>
			<p className="text-gray-600 mb-8">
				Search field with placeholder. Use for header or search pages.
			</p>
			<SearchInput placeholder="Bạn muốn mua gì hôm nay" />
			<CodeSnippet
				code={`import { SearchInput } from "@/components/common";

<SearchInput
  placeholder="Bạn muốn mua gì hôm nay"
  onSearch={(value) => console.log(value)}
/>`}
			/>
		</div>
	);
}
