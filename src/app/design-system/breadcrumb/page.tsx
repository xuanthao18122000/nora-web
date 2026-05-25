"use client";

import { Breadcrumb } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function BreadcrumbPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Breadcrumb
			</h1>
			<p className="text-gray-600 mb-8">
				Breadcrumb trail for navigation context.
			</p>
			<Breadcrumb
				items={[
					{ label: "Trang chủ", href: "/" },
					{ label: "Điện thoại", href: "/dien-thoai" },
					{ label: "Samsung", href: "/dien-thoai/samsung" },
					{ label: "Samsung Galaxy A56 5G" },
				]}
			/>
			<CodeSnippet
				code={`import { Breadcrumb } from "@/components/common";

<Breadcrumb items={[
  { label: "Trang chủ", href: "/" },
  { label: "Điện thoại", href: "/dien-thoai" },
  { label: "Samsung Galaxy A56" },
]} />`}
			/>
		</div>
	);
}
