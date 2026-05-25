import type { Metadata } from "next";
import PolicyPageLayout, {
	buildCanonical,
} from "@/components/feature/policy/PolicyPageLayout";

const PAGE_TITLE = "Chính sách bảo hành – Ắc Quy HN";
const canonicalUrl = buildCanonical("/chinh-sach-bao-hanh");

export const metadata: Metadata = {
	title: `${PAGE_TITLE} | Ắc Quy HN`,
	description:
		"Chính sách bảo hành Ắc Quy HN: phạm vi, thời gian, điều kiện, trường hợp loại trừ, quy trình và hình thức bảo hành ắc quy chính hãng.",
	keywords: [
		"chính sách bảo hành",
		"bảo hành ắc quy",
		"bảo hành GS Rocket Yamato",
		"Ắc Quy HN",
		"đổi mới ắc quy",
	],
	alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Bảo hành theo tiêu chuẩn hãng: điều kiện, quy trình xử lý và lưu ý sử dụng tại Ắc Quy HN.",
		url: canonicalUrl,
		siteName: "Ắc Quy HN",
		locale: "vi_VN",
	},
	robots: { index: true, follow: true },
};

export default function WarrantyPolicyPage() {
	return (
		<PolicyPageLayout
			breadcrumbLabel="Chính sách bảo hành"
			heading="CHÍNH SÁCH BẢO HÀNH – ẮC QUY HN"
			subheading="Quy định bảo hành sản phẩm ắc quy do Ắc Quy HN cung cấp."
		>
			<section>
				<h2 className="text-xl font-bold text-gray-900">
					1. Phạm vi áp dụng
				</h2>
				<p className="mt-3 leading-relaxed">
					Chính sách bảo hành áp dụng cho tất cả các sản phẩm ắc quy được
					cung cấp bởi Ắc Quy HN, bao gồm các thương hiệu như GS, Rocket,
					Yamato… theo tiêu chuẩn của nhà sản xuất.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					2. Thời gian bảo hành
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Thời gian bảo hành tùy theo từng loại ắc quy và hãng sản
						xuất
					</li>
					<li>Thông thường từ 6 – 12 tháng đối với xe máy</li>
					<li>Từ 6 – 24 tháng đối với ắc quy ô tô</li>
				</ul>
				<p className="mt-4 text-sm italic text-gray-600">
					(Thời gian cụ thể sẽ được ghi trên phiếu bảo hành hoặc tem sản
					phẩm)
				</p>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					3. Điều kiện bảo hành
				</h2>
				<p className="mt-3 leading-relaxed">Sản phẩm được bảo hành khi:</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Còn trong thời gian bảo hành</li>
					<li>Có tem bảo hành hoặc hóa đơn mua hàng</li>
					<li>
						Lỗi kỹ thuật do nhà sản xuất (không tích điện, không sạc
						được…)
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					4. Trường hợp không được bảo hành
				</h2>
				<p className="mt-3 leading-relaxed">
					Ắc Quy HN từ chối bảo hành trong các trường hợp:
				</p>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Ắc quy bị chai do sử dụng lâu hoặc hao mòn tự nhiên</li>
					<li>Sử dụng sai cách, lắp sai kỹ thuật</li>
					<li>Tự ý tháo lắp, sửa chữa trước đó</li>
					<li>
						Bình bị phồng, nứt, vỡ do va đập hoặc tác động bên ngoài
					</li>
					<li>Ngập nước, cháy nổ, hư hỏng do môi trường</li>
					<li>Xe bị lỗi hệ thống sạc làm hỏng ắc quy</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					5. Quy trình bảo hành
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>
						Khách hàng liên hệ hotline hoặc mang sản phẩm đến cửa hàng
					</li>
					<li>Kỹ thuật viên kiểm tra tình trạng ắc quy</li>
					<li>
						Nếu đủ điều kiện, tiến hành bảo hành hoặc đổi mới theo quy
						định
					</li>
					<li>Thời gian xử lý: từ 1 – 3 ngày tùy trường hợp</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					6. Hình thức bảo hành
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Đổi mới nếu lỗi do nhà sản xuất trong thời gian quy định</li>
					<li>
						Hoặc hỗ trợ sửa chữa/đổi tương đương theo chính sách hãng
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-bold text-gray-900">
					7. Lưu ý khi sử dụng để được bảo hành tốt nhất
				</h2>
				<ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
					<li>Khởi động xe thường xuyên, tránh để lâu không sử dụng</li>
					<li>Kiểm tra hệ thống điện định kỳ</li>
					<li>Không lắp thêm thiết bị tiêu thụ điện vượt mức</li>
					<li>Sạc đúng cách đối với ắc quy cần bảo dưỡng</li>
				</ul>
			</section>
		</PolicyPageLayout>
	);
}
