"use client";

import { FlashSaleCard, Tab } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

const IMG =
	"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg";

export default function FlashSaleCardPage() {
	return (
		<div className="space-y-8">
			<div className="rounded-lg border border-gray-200 bg-white p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Flash Sale Card
				</h1>
				<p className="text-gray-600 mb-8">
					Product card for flash sale with sold/total progress.
				</p>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					<FlashSaleCard
						name="Samsung Galaxy A56 5G 8GB/128GB"
						price="9.200.000 đ"
						originalPrice="12.200.000 đ"
						discount="-30%"
						image={IMG}
						soldCount={3}
						totalCount={10}
					/>
					<FlashSaleCard
						name="iPhone 17 Pro Max 512GB"
						price="28.990.000 đ"
						originalPrice="34.990.000 đ"
						discount="-17%"
						image={IMG}
						soldCount={7}
						totalCount={10}
					/>
					<FlashSaleCard
						name="Tai nghe Bluetooth HAVIT H612BT Pro (ANC)"
						price="450.000 đ"
						originalPrice="690.000 đ"
						discount="-35%"
						image={IMG}
						soldCount={1}
						totalCount={10}
					/>
				</div>
				<CodeSnippet
					code={`import { FlashSaleCard } from "@/components/common";

<FlashSaleCard
  name="Samsung Galaxy A56 5G 8GB/128GB"
  price="9.200.000 đ"
  originalPrice="12.200.000 đ"
  discount="-30%"
  image="/products/galaxy-a56.jpg"
  soldCount={3}
  totalCount={10}
/>`}
				/>
			</div>
			<div
				className="rounded-lg border border-gray-200 p-8"
				style={{ background: "var(--color-primary-600)" }}
			>
				<h2 className="text-xl font-bold text-white mb-4">
					With Tab (Flash Sale block)
				</h2>
				<div className="bg-white rounded-lg p-4">
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
						]}
						className="border-b border-gray-200 mb-4"
					/>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<FlashSaleCard
							name="Samsung Galaxy A56 5G"
							price="9.200.000 đ"
							originalPrice="12.200.000 đ"
							discount="-30%"
							image={IMG}
							soldCount={3}
							totalCount={10}
						/>
						<FlashSaleCard
							name="iPhone 17 Pro Max"
							price="28.990.000 đ"
							originalPrice="34.990.000 đ"
							discount="-17%"
							image={IMG}
							soldCount={7}
							totalCount={10}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
