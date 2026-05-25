"use client";

import Tab from "@/components/common/Tab";

import CodeSnippet from "../CodeSnippet";

export default function DesignSystemTabPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">Tab</h1>
			<p className="text-gray-600 mb-8">
				Tabbed content. Supports label, subLabel, and optional badge.
			</p>

			<div className="flex flex-col gap-6">
				<div>
					<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
						Underline (Flash Sale)
					</h3>
					<Tab
						variant="underline"
						items={[
							{
								key: "ongoing",
								label: "29/1",
								subLabel: "Chỉ còn 04:12:26",
							},
							{
								key: "next",
								label: "Sắp diễn ra",
								subLabel: "21:30",
							},
							{
								key: "tomorrow",
								label: "Ngày mai",
								subLabel: "00:00",
							},
							{
								key: "tomorrow2",
								label: "Ngày mai",
								subLabel: "09:00",
							},
						]}
					/>
				</div>
				<div>
					<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
						Default (rounded)
					</h3>
					<Tab
						variant="default"
						items={[
							{ key: "all", label: "Tất cả" },
							{ key: "phone", label: "Điện thoại" },
							{ key: "laptop", label: "Laptop" },
							{ key: "tablet", label: "Tablet" },
						]}
					/>
				</div>
			</div>
			<CodeSnippet
				code={`import { Tab } from "@/components/common";

<Tab
  variant="underline"
  items={[
    { key: "tab1", label: "29/1", subLabel: "Đang diễn ra" },
    { key: "tab2", label: "Ngày mai", subLabel: "09:00" },
  ]}
  onChange={(key) => console.log(key)}
/>

<Tab
  variant="default"
  items={[
    { key: "all", label: "Tất cả" },
    { key: "phone", label: "Điện thoại" },
  ]}
/>`}
			/>
		</div>
	);
}
