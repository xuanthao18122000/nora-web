import type { Metadata } from "next";
import PolicyPageLayout, {
	buildCanonical,
} from "@/components/feature/policy/PolicyPageLayout";

const PAGE_TITLE = "Chính sách vận chuyển – Ắc Quy HN";
const canonicalUrl = buildCanonical("/chinh-sach-van-chuyen");

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"Chính sách vận chuyển Ắc Quy HN: phạm vi giao, thời gian, phí, kiểm tra hàng và quy định khi giao nhận.",
	keywords: [
		"chính sách vận chuyển",
		"giao hàng tận nơi",
		"thay ắc quy 24/7",
		"Ắc Quy HN",
		"giao ắc quy nhanh",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Giao hàng & lắp đặt tận nơi 24/7 tại TP.HCM và lân cận — quy định, phí và trách nhiệm.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function ShippingPolicyPage() {
	return (
		<PolicyPageLayout
			breadcrumbLabel="Chính sách vận chuyển"
			heading="CHÍNH SÁCH VẬN CHUYỂN – ẮC QUY HN"
			subheading="Quy định giao nhận khi mua sản phẩm hoặc sử dụng dịch vụ."
		>
			<section>
				<h2 className="text-xl font-bold text-gray-900">
					1. Phạm vi áp dụng
				</h2>
				<p className="mt-3 leading-relaxed">
					Chính sách vận chuyển áp dụng cho tất cả khách hàng mua sản
					phẩm hoặc sử dụng dịch vụ tại Ắc Quy HN trong khu vực TP. Hồ
					Chí Minh và các khu vực lân cận.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					2. Hình thức giao hàng
				</h2>
				<div className="mt-4 space-y-4">
					<div>
						<p className="font-semibold text-gray-900">
							Giao hàng tận nơi
						</p>
						<p className="mt-2 leading-relaxed">
							Nhân viên giao và lắp đặt trực tiếp tại địa chỉ khách
							hàng.
						</p>
					</div>
					<div>
						<p className="font-semibold text-gray-900">
							Nhận hàng tại cửa hàng
						</p>
						<p className="mt-2 leading-relaxed">
							Khách hàng có thể đến trực tiếp để mua và lắp đặt.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					3. Thời gian giao hàng
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Nội thành: từ 15 – 30 phút kể từ khi xác nhận đơn</li>
					<li>Khu vực xa hơn: từ 30 – 60 phút hoặc theo thỏa thuận</li>
					<li>Hoạt động 24/7, kể cả ngày lễ, Tết</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">4. Phí vận chuyển</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Miễn phí giao hàng trong khu vực gần cửa hàng</li>
					<li>Khu vực xa có thể phát sinh phí (sẽ được báo trước)</li>
					<li>Cam kết không phát sinh chi phí ngoài thỏa thuận</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					5. Kiểm tra khi nhận hàng
				</h2>
				<p className="mt-3 leading-relaxed">Khách hàng vui lòng:</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Kiểm tra đúng loại ắc quy đã đặt</li>
					<li>
						Kiểm tra tình trạng sản phẩm (mới, không trầy xước, không
						hư hỏng)
					</li>
					<li>Xác nhận trước khi thanh toán</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					6. Trách nhiệm giao hàng
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Đảm bảo giao đúng sản phẩm, đúng thời gian đã cam kết</li>
					<li>Hỗ trợ lắp đặt và kiểm tra điện miễn phí</li>
					<li>Hướng dẫn sử dụng sau khi lắp đặt</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					7. Trường hợp chậm trễ
				</h2>
				<p className="mt-3 leading-relaxed">
					Trong một số trường hợp khách quan như:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Thời tiết xấu</li>
					<li>Kẹt xe, sự cố giao thông</li>
					<li>Quá tải đơn hàng</li>
				</ul>
				<p className="mt-4 leading-relaxed">
					Chúng tôi sẽ chủ động liên hệ thông báo và hỗ trợ sớm nhất cho
					khách hàng.
				</p>
			</section>
		</PolicyPageLayout>
	);
}
