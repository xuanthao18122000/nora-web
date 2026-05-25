import type { Metadata } from "next";
import PolicyPageLayout, {
	buildCanonical,
} from "@/components/feature/policy/PolicyPageLayout";
import { CONTACT } from "@/lib/constants/site-info";

const PAGE_TITLE = "Chính sách đổi trả – Ắc Quy HN";
const canonicalUrl = buildCanonical("/chinh-sach-doi-tra");

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"Chính sách đổi trả Ắc Quy HN: điều kiện, trường hợp loại trừ, thời gian xử lý, hình thức và quy trình đổi/trả.",
	keywords: [
		"chính sách đổi trả",
		"đổi ắc quy",
		"trả hàng",
		"Ắc Quy HN",
		"hoàn tiền ắc quy",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Quy định đổi & trả sản phẩm ắc quy mua tại Ắc Quy HN — minh bạch, nhanh chóng.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function ReturnPolicyPage() {
	return (
		<PolicyPageLayout
			breadcrumbLabel="Chính sách đổi trả"
			heading="CHÍNH SÁCH ĐỔI TRẢ – ẮC QUY HN"
			subheading="Quy định đổi và trả sản phẩm ắc quy mua tại cửa hàng."
		>
			<section>
				<h2 className="text-xl font-bold text-gray-900">
					1. Phạm vi áp dụng
				</h2>
				<p className="mt-3 leading-relaxed">
					Chính sách đổi trả áp dụng cho tất cả sản phẩm ắc quy được mua
					tại Ắc Quy HN.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					2. Điều kiện đổi trả
				</h2>
				<p className="mt-3 leading-relaxed">
					Khách hàng được hỗ trợ đổi/trả sản phẩm khi:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất</li>
					<li>Giao sai sản phẩm so với đơn đặt hàng</li>
					<li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
				</ul>
				<div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-gray-800">
					<p className="font-semibold text-gray-900">
						📌 Điều kiện kèm theo:
					</p>
					<ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
						<li>Còn hóa đơn hoặc thông tin mua hàng</li>
						<li>Sản phẩm còn nguyên tem, chưa bị can thiệp sửa chữa</li>
						<li>
							Thời gian yêu cầu đổi trả trong vòng 3 – 7 ngày kể từ
							khi nhận hàng
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					3. Trường hợp không áp dụng đổi trả
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Sản phẩm đã qua sử dụng không đúng cách</li>
					<li>Ắc quy bị chai do hao mòn tự nhiên</li>
					<li>Hư hỏng do va đập, rơi vỡ, ngập nước</li>
					<li>Khách hàng tự ý tháo lắp hoặc sửa chữa</li>
					<li>Lỗi do hệ thống điện của xe gây ra</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					4. Thời gian xử lý đổi trả
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Kiểm tra và xác nhận: trong vòng 24 giờ</li>
					<li>Hoàn tất đổi/trả: từ 1 – 3 ngày làm việc</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					5. Hình thức đổi trả
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Đổi mới sản phẩm tương đương nếu lỗi do nhà sản xuất</li>
					<li>Hoàn tiền nếu không có sản phẩm thay thế phù hợp</li>
					<li>Hoặc thỏa thuận phương án xử lý tốt nhất cho khách hàng</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					6. Chi phí đổi trả
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Miễn phí nếu lỗi từ phía nhà sản xuất hoặc cửa hàng</li>
					<li>
						Khách hàng chịu phí vận chuyển nếu đổi trả do nhu cầu cá
						nhân
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					7. Quy trình đổi trả
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Liên hệ hotline hoặc{" "}
						<a
							href={CONTACT.zaloUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-blue-600 hover:underline"
						>
							Zalo
						</a>{" "}
						của cửa hàng
					</li>
					<li>Cung cấp thông tin đơn hàng và tình trạng sản phẩm</li>
					<li>Nhân viên xác nhận và hướng dẫn đổi trả</li>
					<li>Tiến hành đổi mới hoặc hoàn tiền theo quy định</li>
				</ul>
			</section>
		</PolicyPageLayout>
	);
}
