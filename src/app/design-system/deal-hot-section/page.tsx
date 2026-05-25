"use client";

import DealHotSection from "@/components/feature/home/DealHotSection";
import type { GroupedSection } from "@/types/page";

import CodeSnippet from "../CodeSnippet";

const SAMPLE =
	"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg";

const DEMO_GROUP: GroupedSection = {
	section: {
		id: 999001,
		name: "Deal hot - Giá tốt",
		type: "link_item",
		position: 1,
	},
	items: [
		{
			id: 1,
			name: "Sắm tết sớm",
			position: 0,
			deviceType: "all",
			data: JSON.stringify({ icon: SAMPLE, url: "/" }),
		},
		{
			id: 2,
			name: "Trả góp 0%",
			position: 1,
			deviceType: "all",
			data: JSON.stringify({ icon: SAMPLE, url: "/" }),
		},
		{
			id: 3,
			name: "Thu cũ đổi mới",
			position: 2,
			deviceType: "all",
			data: JSON.stringify({ icon: SAMPLE, url: "/" }),
		},
		{
			id: 4,
			name: "Mã giảm giá",
			position: 3,
			deviceType: "all",
			data: JSON.stringify({ icon: SAMPLE, url: "/" }),
		},
		{
			id: 5,
			name: "Freeship toàn quốc",
			position: 4,
			deviceType: "all",
			data: JSON.stringify({ icon: SAMPLE, url: "/" }),
		},
	],
};

export default function DealHotSectionPage() {
	return (
		<div className="space-y-8">
			<div className="rounded-lg border border-gray-200 bg-white p-8">
				<h1 className="mb-2 text-2xl font-bold text-gray-900">
					Deal Hot Section
				</h1>
				<p className="mb-8 text-gray-600">
					Promotional tile row: section title, optional session
					dismiss control, square images with labels. Used on the home
					page for CMS sections without a{" "}
					<code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">
						key
					</code>{" "}
					(link items). Aligned with Figma node{" "}
					<span className="whitespace-nowrap">2160:121585</span>{" "}
					(recommeded).
				</p>
				<DealHotSection group={DEMO_GROUP} />
				<CodeSnippet
					code={`import DealHotSection from "@/components/feature/home/DealHotSection";

<DealHotSection group={group} dismissible />`}
				/>
			</div>
		</div>
	);
}
