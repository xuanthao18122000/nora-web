"use client";

import {
	BadgeHotSale,
	BadgeNew,
	BadgeOffer,
	BadgeOfferLink,
	BadgeOnline,
} from "@/components/common/Badge";

import CodeSnippet from "../CodeSnippet";

export default function BadgesPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">Badges</h1>
			<p className="text-gray-600 mb-8">
				Product and offer badges for cards and listings.
			</p>
			<div className="flex items-center gap-3 flex-wrap">
				<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
				<BadgeNew>Mới về</BadgeNew>
				<BadgeOnline>Online giá sốc</BadgeOnline>
				<BadgeHotSale>Còn 04 ngày 04:25:54</BadgeHotSale>
				<BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>
			</div>
			<CodeSnippet
				code={`import { BadgeNew, BadgeOffer, BadgeOnline, BadgeHotSale, BadgeOfferLink } from "@/components/common";

<BadgeNew>Mới về</BadgeNew>
<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
<BadgeOnline>Online giá sốc</BadgeOnline>
<BadgeHotSale>Còn 04 ngày 04:25:54</BadgeHotSale>
<BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>`}
			/>
		</div>
	);
}
