import type { Metadata } from "next";
import PolicyPageLayout, {
	buildCanonical,
} from "@/components/feature/policy/PolicyPageLayout";

const PAGE_TITLE = "Chính sách bảo mật thông tin – Ắc Quy HN";
const canonicalUrl = buildCanonical("/chinh-sach-bao-mat");

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"Chính sách bảo mật thông tin Ắc Quy HN: phạm vi thu thập, sử dụng, lưu trữ, quyền của khách hàng và cam kết bảo mật.",
	keywords: [
		"chính sách bảo mật",
		"bảo mật thông tin",
		"dữ liệu cá nhân",
		"Ắc Quy HN",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Cam kết bảo vệ dữ liệu cá nhân của khách hàng — minh bạch, an toàn.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
	return (
		<PolicyPageLayout
			breadcrumbLabel="Chính sách bảo mật thông tin"
			heading="CHÍNH SÁCH BẢO MẬT THÔNG TIN – ẮC QUY HN"
			subheading="Quy định thu thập, sử dụng và bảo vệ dữ liệu cá nhân của khách hàng."
		>
			<section>
				<h2 className="text-xl font-bold text-gray-900">
					1. Mục đích và phạm vi thu thập
				</h2>
				<p className="mt-3 leading-relaxed">
					Ắc Quy HN thu thập thông tin khách hàng nhằm:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Xử lý đơn hàng và cung cấp dịch vụ</li>
					<li>Liên hệ xác nhận, hỗ trợ và chăm sóc khách hàng</li>
					<li>Cải thiện chất lượng sản phẩm, dịch vụ</li>
				</ul>
				<p className="mt-6 leading-relaxed">Thông tin thu thập bao gồm:</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Họ tên</li>
					<li>Số điện thoại</li>
					<li>Địa chỉ giao hàng</li>
					<li>Email (nếu có)</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					2. Phạm vi sử dụng thông tin
				</h2>
				<p className="mt-3 leading-relaxed">
					Thông tin khách hàng được sử dụng để:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Giao hàng, lắp đặt và bảo hành sản phẩm</li>
					<li>Liên hệ giải quyết khiếu nại, hỗ trợ kỹ thuật</li>
					<li>Gửi thông tin khuyến mãi (nếu khách hàng đồng ý)</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					3. Thời gian lưu trữ thông tin
				</h2>
				<p className="mt-3 leading-relaxed">
					Thông tin khách hàng được lưu trữ trong hệ thống của chúng tôi
					cho đến khi:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Hoàn thành mục đích sử dụng</li>
					<li>Hoặc khách hàng yêu cầu xóa thông tin</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					4. Cam kết bảo mật thông tin
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Không chia sẻ, bán hoặc trao đổi thông tin khách hàng cho
						bên thứ ba
					</li>
					<li>
						Chỉ cung cấp thông tin khi có yêu cầu từ cơ quan pháp luật
					</li>
					<li>
						Áp dụng các biện pháp bảo mật để bảo vệ dữ liệu khách hàng
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					5. Quyền của khách hàng
				</h2>
				<p className="mt-3 leading-relaxed">Khách hàng có quyền:</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân</li>
					<li>Từ chối nhận thông tin quảng cáo bất kỳ lúc nào</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					6. Bảo mật thanh toán
				</h2>
				<p className="mt-3 leading-relaxed">
					Mọi thông tin thanh toán được bảo mật và không lưu trữ thông
					tin nhạy cảm như mật khẩu ngân hàng.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					7. Thay đổi chính sách
				</h2>
				<p className="mt-3 leading-relaxed">
					Ắc Quy HN có quyền thay đổi nội dung chính sách bảo mật bất kỳ
					lúc nào. Nội dung cập nhật sẽ được đăng tải trên website và có
					hiệu lực ngay khi công bố.
				</p>
			</section>
		</PolicyPageLayout>
	);
}
