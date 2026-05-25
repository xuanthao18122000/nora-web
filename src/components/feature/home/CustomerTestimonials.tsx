import { Star } from "lucide-react";

interface Testimonial {
	name: string;
	location: string;
	rating: number;
	content: string;
}

const TESTIMONIALS: Testimonial[] = [
	{
		name: "Anh Minh",
		location: "Quận 7, TP.HCM",
		rating: 5,
		content:
			"Đội NORA tư vấn giải pháp cơ điện cho dự án nhà phố của tôi rất chi tiết. Thi công đúng tiến độ, hệ thống vận hành ổn định từ khi bàn giao.",
	},
	{
		name: "Chị Lan",
		location: "Bình Tân, TP.HCM",
		rating: 5,
		content:
			"Lắp thiết bị hồ bơi gia đình bên NORA, máy bơm và hệ lọc đều chính hãng. Nhân viên kỹ thuật hướng dẫn vận hành kỹ càng, rất hài lòng.",
	},
	{
		name: "Anh Tuấn",
		location: "Thủ Đức, TP.HCM",
		rating: 5,
		content:
			"Đặt cửa xây dựng cho công trình văn phòng, NORA giao đúng hẹn, chất lượng đúng mẫu duyệt. Làm việc chuyên nghiệp, có hợp đồng rõ ràng.",
	},
	{
		name: "Anh Hưng",
		location: "Quận 12, TP.HCM",
		rating: 5,
		content:
			"Tư vấn báo giá minh bạch, không phát sinh ngoài hợp đồng. Sau lắp đặt vẫn có đội kỹ thuật hỗ trợ bảo trì khi cần — rất đáng tin cậy.",
	},
	{
		name: "Chị Thảo",
		location: "Bình Thạnh, TP.HCM",
		rating: 5,
		content:
			"Gọi hotline tư vấn buổi sáng, chiều có người tới khảo sát. Tốc độ phản hồi nhanh, giải pháp hợp với ngân sách của gia đình.",
	},
	{
		name: "Anh Phúc",
		location: "Quận 2, TP.HCM",
		rating: 5,
		content:
			"Thiết bị MEP cho xưởng sản xuất bên NORA cung cấp đầy đủ CO/CQ. Đội kỹ thuật làm cẩn thận, sẽ tiếp tục hợp tác lâu dài.",
	},
];

const TOTAL_REVIEWS = 1247;

export default function CustomerTestimonials() {
	return (
		<section className="rounded-2xl bg-white p-4 md:p-8">
			<header className="text-center">
				<h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 md:text-xl">
					Khách hàng nói gì về chúng tôi
				</h2>
				<p className="mt-1 text-sm text-gray-500">
					Đối tác và khách hàng tin tưởng NORA cho các giải pháp thiết bị cơ
					điện, hồ bơi và cửa xây dựng
				</p>
			</header>

			<div className="my-6 border-t border-gray-100" />

			{/* Overall rating */}
			<div className="flex flex-col items-center gap-1 mb-6">
				<div className="text-3xl font-bold text-gray-900">5.0</div>
				<StarRow rating={5} />
				<div className="text-xs text-gray-500">
					Từ {TOTAL_REVIEWS.toLocaleString("vi-VN")} đánh giá
				</div>
			</div>

			{/* Cards */}
			<ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
				{TESTIMONIALS.map((t) => (
					<li
						key={t.name + t.location}
						className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
					>
						<div className="flex items-center justify-between gap-2">
							<div className="text-sm font-semibold text-gray-900">
								{t.name}{" "}
								<span className="font-normal text-gray-500">
									- {t.location}
								</span>
							</div>
							<StarRow rating={t.rating} />
						</div>
						<p className="text-xs leading-relaxed text-gray-600 line-clamp-4">
							{t.content}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}

function StarRow({ rating }: { rating: number }) {
	const stars = Math.max(0, Math.min(5, Math.round(rating)));
	return (
		<div className="flex items-center gap-0.5" aria-label={`${stars}/5 sao`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					aria-hidden="true"
					className={
						i < stars
							? "size-4 fill-yellow-400 text-yellow-400"
							: "size-4 text-gray-200"
					}
				/>
			))}
		</div>
	);
}
