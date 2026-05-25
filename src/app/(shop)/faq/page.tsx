import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import FaqAccordion, {
	type FaqAccordionEntry,
} from "@/components/common/FaqAccordion";
import { buildCanonical } from "@/components/feature/policy/PolicyPageLayout";
import { CONTACT, STORE_INFO } from "@/lib/constants/site-info";

const PAGE_TITLE = "Câu hỏi thường gặp về ắc quy";
const canonicalUrl = buildCanonical("/faq");

const FAQ_BLOCKS: FaqAccordionEntry[] = [
	{
		question: "Ắc quy dùng được bao lâu thì cần thay?",
		body: (
			<p className="mt-3 leading-relaxed">
				Thông thường ắc quy có tuổi thọ từ 1.5 – 3 năm tùy loại và cách sử
				dụng. Nếu xe thường xuyên để lâu không chạy hoặc sử dụng nhiều
				thiết bị điện thì tuổi thọ sẽ giảm.
			</p>
		),
	},
	{
		question: "Dấu hiệu nào cho thấy ắc quy sắp hỏng?",
		body: (
			<>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Xe đề yếu, khó nổ máy</li>
					<li>Đèn xe mờ, còi nhỏ</li>
					<li>Để qua đêm là hết điện</li>
					<li>Phải kích đề nhiều lần</li>
				</ul>
				<p className="mt-4 leading-relaxed text-gray-800">
					👉 Khi có các dấu hiệu này, bạn nên kiểm tra hoặc thay sớm để
					tránh chết máy giữa đường.
				</p>
			</>
		),
	},
	{
		question: "Khi nào cần thay ắc quy mới?",
		body: (
			<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
				<li>Ắc quy đã dùng trên 2 năm</li>
				<li>Sạc không vào điện</li>
				<li>Phồng bình, rò rỉ dung dịch</li>
				<li>Đã kích nhiều lần nhưng vẫn yếu</li>
			</ul>
		),
	},
	{
		question: "Có nên sạc lại ắc quy không?",
		body: (
			<p className="mt-3 leading-relaxed">
				Có thể sạc nếu ắc quy còn tốt nhưng bị hết điện tạm thời. Tuy
				nhiên nếu ắc quy đã chai thì sạc cũng không hiệu quả, nên thay mới
				để đảm bảo ổn định.
			</p>
		),
	},
	{
		question: "Bao lâu nên kiểm tra ắc quy 1 lần?",
		body: (
			<p className="mt-3 leading-relaxed">
				Nên kiểm tra định kỳ 3–6 tháng/lần để đảm bảo hệ thống điện hoạt
				động tốt, tránh hư hỏng bất ngờ.
			</p>
		),
	},
	{
		question: "Thay ắc quy mất bao lâu?",
		body: (
			<p className="mt-3 leading-relaxed">
				Thường chỉ mất 15–30 phút, kể cả dịch vụ thay tận nơi.
			</p>
		),
	},
	{
		question: "Có dịch vụ thay ắc quy tận nơi không?",
		body: (
			<p className="mt-3 leading-relaxed">
				Có. Nhiều đơn vị hỗ trợ thay tận nơi và cứu hộ 24/7, rất tiện khi
				xe bị hết bình giữa đường.{" "}
				<span className="text-gray-900 font-medium">
					Ắc Quy HN cung cấp thay tận nơi và cứu hộ 24/7 tại TP.HCM.
				</span>
			</p>
		),
	},
	{
		question: "Ắc quy xe máy và ô tô có khác nhau không?",
		body: (
			<p className="mt-3 leading-relaxed">
				Có. Ắc quy ô tô có dung lượng lớn hơn, cấu tạo khác và không thể
				dùng chung với xe máy.
			</p>
		),
	},
	{
		question: "Có nên dùng ắc quy giá rẻ không?",
		body: (
			<p className="mt-3 leading-relaxed">
				Không nên. Ắc quy kém chất lượng dễ nhanh hỏng, yếu điện và có thể
				gây hư hại hệ thống điện của xe.
			</p>
		),
	},
	{
		question: "Ắc quy cũ có bán lại được không?",
		body: (
			<p className="mt-3 leading-relaxed">
				Có. Ắc quy cũ thường được thu mua lại với giá tùy theo loại và
				tình trạng.
			</p>
		),
	},
	{
		question: "Vì sao xe để lâu không chạy lại hết bình?",
		body: (
			<p className="mt-3 leading-relaxed">
				Do vẫn có dòng điện tiêu thụ ngầm (đồng hồ, khóa thông minh…). Để
				lâu sẽ làm ắc quy bị xả hết điện.
			</p>
		),
	},
	{
		question: "Làm sao để ắc quy bền hơn?",
		body: (
			<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
				<li>Khởi động xe thường xuyên</li>
				<li>Không để xe quá lâu không sử dụng</li>
				<li>Kiểm tra hệ thống sạc định kỳ</li>
				<li>Tránh lắp thêm thiết bị điện quá tải</li>
			</ul>
		),
	},
];

const FAQ_ANSWERS_PLAIN: string[] = [
	"Thông thường ắc quy có tuổi thọ từ 1.5 – 3 năm tùy loại và cách sử dụng. Nếu xe thường xuyên để lâu không chạy hoặc sử dụng nhiều thiết bị điện thì tuổi thọ sẽ giảm.",
	"Xe đề yếu, khó nổ máy; đèn xe mờ, còi nhỏ; để qua đêm là hết điện; phải kích đề nhiều lần. Khi có các dấu hiệu này, bạn nên kiểm tra hoặc thay sớm để tránh chết máy giữa đường.",
	"Ắc quy đã dùng trên 2 năm; sạc không vào điện; phồng bình, rò rỉ dung dịch; đã kích nhiều lần nhưng vẫn yếu.",
	"Có thể sạc nếu ắc quy còn tốt nhưng bị hết điện tạm thời. Tuy nhiên nếu ắc quy đã chai thì sạc cũng không hiệu quả, nên thay mới để đảm bảo ổn định.",
	"Nên kiểm tra định kỳ 3–6 tháng/lần để đảm bảo hệ thống điện hoạt động tốt, tránh hư hỏng bất ngờ.",
	"Thường chỉ mất 15–30 phút, kể cả dịch vụ thay tận nơi.",
	"Có. Nhiều đơn vị hỗ trợ thay tận nơi và cứu hộ 24/7, rất tiện khi xe bị hết bình giữa đường. Ắc Quy HN cung cấp thay tận nơi và cứu hộ 24/7 tại TP.HCM.",
	"Có. Ắc quy ô tô có dung lượng lớn hơn, cấu tạo khác và không thể dùng chung với xe máy.",
	"Không nên. Ắc quy kém chất lượng dễ nhanh hỏng, yếu điện và có thể gây hư hại hệ thống điện của xe.",
	"Có. Ắc quy cũ thường được thu mua lại với giá tùy theo loại và tình trạng.",
	"Do vẫn có dòng điện tiêu thụ ngầm (đồng hồ, khóa thông minh…). Để lâu sẽ làm ắc quy bị xả hết điện.",
	"Khởi động xe thường xuyên; không để xe quá lâu không sử dụng; kiểm tra hệ thống sạc định kỳ; tránh lắp thêm thiết bị điện quá tải.",
];

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: FAQ_BLOCKS.map((b, i) => ({
		"@type": "Question",
		name: b.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: FAQ_ANSWERS_PLAIN[i] ?? "",
		},
	})),
};

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"12 câu hỏi thường gặp về ắc quy: tuổi thọ, dấu hiệu hỏng, thay mới, sạc, kiểm tra định kỳ, thay tận nơi, xe máy/ô tô — Ắc Quy HN.",
	keywords: [
		"câu hỏi thường gặp ắc quy",
		"FAQ ắc quy",
		"dấu hiệu ắc quy hỏng",
		"thay ắc quy bao lâu",
		"thay ắc quy tận nơi",
		"Ắc Quy HN",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: `${PAGE_TITLE} | Ắc Quy HN`,
		description:
			"Giải đáp nhanh về tuổi thọ, bảo dưỡng và thay ắc quy — thay tận nơi 15–30 phút, cứu hộ 24/7.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function FaqPage() {
	return (
		<div className="min-h-screen bg-gray-100">
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires this
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>

			<div className="container-inner py-4">
				<Breadcrumb
					items={[
						{ label: "Trang chủ", href: "/" },
						{ label: "Câu hỏi thường gặp" },
					]}
				/>
			</div>

			<article className="pb-10 md:pb-14">
				<div className="container-inner">
					<div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-6">
						<header className="mb-10 md:mb-12">
							<h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
								CÂU HỎI THƯỜNG GẶP VỀ ẮC QUY
							</h1>
							<p className="mt-3 text-sm text-gray-500">
								Tổng hợp ngắn gọn — nếu cần tư vấn thêm, liên hệ
								hotline bên dưới.
							</p>
						</header>

						<FaqAccordion entries={FAQ_BLOCKS} defaultOpenFirst />

						<div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-800">
							<p className="font-semibold text-gray-900">Ắc Quy HN</p>
							<p className="mt-2">
								Hotline:{" "}
								<a
									href={`tel:${CONTACT.hotlineTel}`}
									className="font-medium text-blue-600 hover:underline"
								>
									{CONTACT.hotlineDisplay}
								</a>
							</p>
							<p className="mt-2">
								Email:{" "}
								<a
									href={`mailto:${CONTACT.email}`}
									className="font-medium text-blue-600 hover:underline"
								>
									{CONTACT.email}
								</a>
							</p>
							<p className="mt-2">Địa chỉ: {STORE_INFO.address}</p>
							<p className="mt-4 text-sm">
								<Link
									href="/gioi-thieu"
									className="text-blue-600 hover:underline"
								>
									→ Trang giới thiệu
								</Link>
							</p>
						</div>
					</div>
				</div>
			</article>
		</div>
	);
}
