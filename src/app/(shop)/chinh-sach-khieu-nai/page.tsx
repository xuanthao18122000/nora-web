import type { Metadata } from "next";
import Link from "next/link";
import PolicyPageLayout, {
	buildCanonical,
} from "@/components/feature/policy/PolicyPageLayout";
import { CONTACT } from "@/lib/constants/site-info";

const PAGE_TITLE = "Chính sách khiếu nại – Ắc Quy HN";
const canonicalUrl = buildCanonical("/chinh-sach-khieu-nai");

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"Chính sách khiếu nại Ắc Quy HN: tiếp nhận, quy trình xử lý, thời gian, phương án giải quyết và cam kết với khách hàng.",
	keywords: [
		"chính sách khiếu nại",
		"khiếu nại Ắc Quy HN",
		"phản hồi khách hàng",
		"hỗ trợ khách hàng",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Quy định tiếp nhận và xử lý phản hồi/khiếu nại của khách hàng tại Ắc Quy HN.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function ComplaintPolicyPage() {
	return (
		<PolicyPageLayout
			breadcrumbLabel="Chính sách khiếu nại"
			heading="CHÍNH SÁCH KHIẾU NẠI – ẮC QUY HN"
			subheading="Quy định tiếp nhận và xử lý phản hồi, khiếu nại của khách hàng."
		>
			<section>
				<h2 className="text-xl font-bold text-gray-900">1. Mục đích</h2>
				<p className="mt-3 leading-relaxed">
					Ắc Quy HN cam kết bảo vệ quyền lợi khách hàng và luôn lắng
					nghe, tiếp nhận mọi phản hồi, khiếu nại liên quan đến sản phẩm
					và dịch vụ nhằm cải thiện chất lượng phục vụ.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					2. Phạm vi tiếp nhận khiếu nại
				</h2>
				<p className="mt-3 leading-relaxed">
					Chúng tôi tiếp nhận các khiếu nại liên quan đến:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Chất lượng sản phẩm ắc quy</li>
					<li>Dịch vụ thay thế, cứu hộ</li>
					<li>Giao hàng, vận chuyển</li>
					<li>Thái độ phục vụ của nhân viên</li>
					<li>Các vấn đề phát sinh khác trong quá trình mua hàng</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					3. Hình thức tiếp nhận khiếu nại
				</h2>
				<p className="mt-3 leading-relaxed">
					Khách hàng có thể gửi khiếu nại qua:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Hotline:{" "}
						<a
							href={`tel:${CONTACT.hotlineTel}`}
							className="font-medium text-blue-600 hover:underline"
						>
							{CONTACT.hotlineDisplay}
						</a>
					</li>
					<li>
						<a
							href={CONTACT.zaloUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-blue-600 hover:underline"
						>
							Zalo
						</a>
						,{" "}
						<a
							href={`mailto:${CONTACT.email}`}
							className="font-medium text-blue-600 hover:underline"
						>
							email
						</a>{" "}
						hoặc{" "}
						<Link
							href="/gioi-thieu"
							className="font-medium text-blue-600 hover:underline"
						>
							trang giới thiệu
						</Link>{" "}
						chính thức của cửa hàng
					</li>
					<li>Trực tiếp tại cửa hàng</li>
				</ul>
				<div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-gray-800">
					<p className="font-semibold text-gray-900">
						📌 Khi gửi khiếu nại, vui lòng cung cấp:
					</p>
					<ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
						<li>Tên khách hàng + số điện thoại</li>
						<li>Thông tin đơn hàng (nếu có)</li>
						<li>Nội dung khiếu nại cụ thể</li>
						<li>Hình ảnh/video liên quan (nếu có)</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					4. Thời gian xử lý
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Xác nhận tiếp nhận khiếu nại: trong vòng 24 giờ</li>
					<li>Thời gian xử lý: từ 1 – 3 ngày làm việc</li>
					<li>
						Trường hợp phức tạp có thể kéo dài hơn, nhưng sẽ thông báo
						rõ cho khách hàng
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					5. Quy trình giải quyết khiếu nại
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Tiếp nhận thông tin từ khách hàng</li>
					<li>Kiểm tra và xác minh nội dung</li>
					<li>Đưa ra phương án xử lý phù hợp</li>
					<li>Thông báo kết quả và thực hiện giải quyết</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					6. Phương án giải quyết
				</h2>
				<p className="mt-3 leading-relaxed">
					Tùy theo từng trường hợp, chúng tôi sẽ:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Đổi mới sản phẩm</li>
					<li>Bảo hành hoặc sửa chữa</li>
					<li>Hoàn tiền (nếu cần thiết)</li>
					<li>Xin lỗi và cải thiện dịch vụ</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					7. Cam kết của chúng tôi
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Xử lý nhanh chóng, minh bạch và công bằng</li>
					<li>Đặt quyền lợi khách hàng lên hàng đầu</li>
					<li>Không né tránh trách nhiệm khi có sai sót</li>
				</ul>
			</section>
		</PolicyPageLayout>
	);
}
