import type { Metadata } from "next";
import PolicyPageLayout, {
	buildCanonical,
} from "@/components/feature/policy/PolicyPageLayout";

const PAGE_TITLE = "Điều khoản dịch vụ – Ắc Quy HN";
const canonicalUrl = buildCanonical("/dieu-khoan-dich-vu");

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"Điều khoản dịch vụ Ắc Quy HN: phạm vi dịch vụ, quyền & trách nhiệm khách hàng, thanh toán, bảo hành, đổi trả và bảo mật.",
	keywords: [
		"điều khoản dịch vụ",
		"điều kiện sử dụng",
		"Ắc Quy HN",
		"terms of service",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Vui lòng đọc kỹ điều khoản trước khi sử dụng dịch vụ tại Ắc Quy HN.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
	return (
		<PolicyPageLayout
			breadcrumbLabel="Điều khoản dịch vụ"
			heading="ĐIỀU KHOẢN DỊCH VỤ – ẮC QUY HN"
			subheading="Vui lòng đọc kỹ trước khi sử dụng dịch vụ."
		>
			<section>
				<h2 className="text-xl font-bold text-gray-900">
					1. Giới thiệu chung
				</h2>
				<p className="mt-3 leading-relaxed">
					Chào mừng quý khách đến với website của Ắc Quy HN. Khi truy
					cập và sử dụng dịch vụ của chúng tôi, quý khách đồng ý tuân
					thủ các điều khoản và điều kiện được quy định dưới đây.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					2. Phạm vi dịch vụ
				</h2>
				<p className="mt-3 leading-relaxed">Ắc Quy HN cung cấp các dịch vụ:</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Bán lẻ và phân phối ắc quy chính hãng</li>
					<li>Thay ắc quy tận nơi</li>
					<li>Cứu hộ ắc quy 24/7</li>
					<li>Kiểm tra, tư vấn hệ thống điện xe</li>
				</ul>
				<p className="mt-4 leading-relaxed">
					Chúng tôi có quyền thay đổi, cập nhật hoặc ngừng cung cấp dịch
					vụ mà không cần thông báo trước.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					3. Quyền và trách nhiệm của khách hàng
				</h2>
				<p className="mt-3 leading-relaxed">Khách hàng có trách nhiệm:</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Cung cấp thông tin chính xác khi đặt hàng (tên, số điện
						thoại, địa chỉ)
					</li>
					<li>Kiểm tra sản phẩm khi nhận hàng</li>
					<li>Thanh toán đầy đủ theo thỏa thuận</li>
				</ul>
				<p className="mt-4 leading-relaxed">
					Khách hàng không được sử dụng dịch vụ vào mục đích gian lận
					hoặc vi phạm pháp luật.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					4. Giá cả và thanh toán
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Giá sản phẩm và dịch vụ được niêm yết hoặc báo trực tiếp
						tại thời điểm đặt hàng
					</li>
					<li>Thanh toán có thể bằng tiền mặt hoặc chuyển khoản</li>
					<li>
						Trong một số trường hợp, giá có thể thay đổi tùy theo vị
						trí và thời điểm phục vụ
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					5. Chính sách bảo hành
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Tất cả sản phẩm đều có bảo hành theo tiêu chuẩn của nhà
						sản xuất
					</li>
					<li>Thời gian bảo hành tùy theo từng loại ắc quy</li>
				</ul>
				<p className="mt-4 font-medium text-gray-900">
					Không áp dụng bảo hành trong các trường hợp:
				</p>
				<ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Sử dụng sai cách</li>
					<li>Tự ý tháo lắp, sửa chữa</li>
					<li>Hư hỏng do tác động bên ngoài (va đập, ngập nước…)</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					6. Chính sách đổi trả
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Hỗ trợ đổi mới nếu sản phẩm lỗi do nhà sản xuất</li>
					<li>
						Không áp dụng đổi trả với sản phẩm đã qua sử dụng không
						đúng quy định
					</li>
					<li>
						Thời gian đổi trả theo chính sách cụ thể của từng sản phẩm
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					7. Giới hạn trách nhiệm
				</h2>
				<p className="mt-3 leading-relaxed">
					Ắc Quy HN không chịu trách nhiệm đối với các thiệt hại gián
					tiếp phát sinh từ việc sử dụng sản phẩm sai mục đích hoặc do
					lỗi từ phía khách hàng.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					8. Bảo mật thông tin
				</h2>
				<p className="mt-3 leading-relaxed">
					Chúng tôi cam kết bảo mật thông tin cá nhân của khách hàng và
					không chia sẻ cho bên thứ ba nếu không có sự đồng ý, trừ khi
					có yêu cầu từ cơ quan pháp luật.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					9. Thay đổi điều khoản
				</h2>
				<p className="mt-3 leading-relaxed">
					Ắc Quy HN có quyền thay đổi nội dung điều khoản bất kỳ lúc
					nào. Các thay đổi sẽ được cập nhật trên website và có hiệu lực
					ngay khi đăng tải.
				</p>
			</section>
		</PolicyPageLayout>
	);
}
