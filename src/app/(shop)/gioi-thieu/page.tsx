import {
	BadgeCheck,
	Building2,
	Compass,
	DoorOpen,
	Eye,
	Headset,
	Heart,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	ShieldCheck,
	Sparkles,
	Tag,
	Waves,
	Wrench,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";

import { CONTACT, STORE_INFO } from "@/lib/constants/site-info";

export const metadata: Metadata = {
	title: "Giới thiệu | Công ty TNHH Kỹ thuật - Dịch vụ NORA",
	description:
		"CÔNG TY TNHH KỸ THUẬT – DỊCH VỤ NORA chuyên cung cấp thiết bị cơ điện, hồ bơi và cửa xây dựng. Cam kết về chất lượng – an toàn – giá trị sử dụng cho mọi công trình.",
};

const HOTLINE_DISPLAY = CONTACT.hotlineDisplay;
const HOTLINE_TEL = CONTACT.hotlineTel;
const HOTLINE2_DISPLAY = CONTACT.hotline2Display;
const HOTLINE2_TEL = CONTACT.hotline2Tel;
const HOTLINE3_DISPLAY = CONTACT.hotline3Display;
const HOTLINE3_TEL = CONTACT.hotline3Tel;
const ZALO_URL = CONTACT.zaloUrl;
const EMAIL = CONTACT.email;
const ADDRESS = STORE_INFO.address;

// ─── Data ────────────────────────────────────────────────────────────

const SERVICES = [
	{
		icon: Zap,
		title: "Thiết bị cơ điện",
		desc: "Cung cấp giải pháp và thiết bị cơ điện (MEP) cho công trình dân dụng & công nghiệp, đảm bảo vận hành ổn định, an toàn.",
	},
	{
		icon: Waves,
		title: "Thiết bị hồ bơi",
		desc: "Phân phối thiết bị lọc, bơm, hoá chất và phụ kiện hồ bơi đạt chuẩn, phù hợp cho hồ bơi gia đình, resort, khách sạn.",
	},
	{
		icon: DoorOpen,
		title: "Cửa xây dựng",
		desc: "Cung cấp các loại cửa công trình – cửa xây dựng chất lượng cao, đa dạng mẫu mã, đáp ứng yêu cầu kỹ thuật & thẩm mỹ.",
	},
	{
		icon: Wrench,
		title: "Tư vấn kỹ thuật",
		desc: "Đội ngũ kỹ sư tư vấn giải pháp tối ưu theo từng công trình – phù hợp ngân sách, đảm bảo hiệu quả đầu tư.",
	},
	{
		icon: Headset,
		title: "Hỗ trợ sau bán hàng",
		desc: "Đồng hành cùng khách hàng trong suốt quá trình sử dụng — bảo hành, bảo trì, hỗ trợ kỹ thuật nhanh chóng.",
	},
	{
		icon: Building2,
		title: "Giải pháp tổng thể MEP",
		desc: "Triển khai trọn gói hệ thống cơ điện cho các dự án xây dựng – từ thiết kế, cung cấp vật tư đến thi công lắp đặt.",
	},
];

const COMMITMENTS = [
	{
		icon: BadgeCheck,
		title: "Chất lượng – Chính hãng",
		desc: "Cam kết sản phẩm chính hãng, đầy đủ chứng từ CO/CQ, đạt tiêu chuẩn kỹ thuật cho mọi công trình.",
	},
	{
		icon: Tag,
		title: "Giá trị sử dụng tối ưu",
		desc: "Báo giá minh bạch, giải pháp tối ưu kinh phí đầu tư mà vẫn đảm bảo chất lượng và độ bền.",
	},
	{
		icon: ShieldCheck,
		title: "An toàn – Bền vững",
		desc: "An toàn vận hành là ưu tiên hàng đầu — sản phẩm và giải pháp đều tuân thủ tiêu chuẩn kỹ thuật nghiêm ngặt.",
	},
	{
		icon: Heart,
		title: "Phục vụ tận tâm",
		desc: "Phong cách phục vụ chuyên nghiệp, lắng nghe và đồng hành cùng khách hàng từ tư vấn đến hậu mãi.",
	},
];

const STATS = [
	{ number: "3", label: "Mảng dịch vụ chuyên sâu" },
	{ number: "100%", label: "Sản phẩm chính hãng" },
	{ number: "24/7", label: "Hỗ trợ kỹ thuật" },
	{ number: "TP.HCM", label: "Trụ sở chính" },
];

// ─── Common ──────────────────────────────────────────────────────────

function SectionPill({
	icon: Icon,
	label,
}: {
	icon: React.ElementType;
	label: string;
}) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600 md:text-sm">
			<Icon className="size-3.5" aria-hidden="true" />
			{label}
		</span>
	);
}

// ─── Page ────────────────────────────────────────────────────────────

export default function AboutPage() {
	return (
		<div className="bg-gray-100">
			<div className="container-inner flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<Hero />
				<StatsBar />
				<IntroSection />
				<VisionMission />
				<ServicesSection />
				<CommitmentsSection />
				<ContactSection />
			</div>
		</div>
	);
}

// ─── Hero ────────────────────────────────────────────────────────────

function Hero() {
	return (
		<section className="relative isolate overflow-hidden rounded-2xl bg-primary-900 shadow-lg shadow-primary-900/10">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950"
			/>
			<div
				aria-hidden="true"
				className="absolute -top-24 -left-24 -z-10 size-80 rounded-full bg-amber-500/20 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-32 -right-16 -z-10 size-96 rounded-full bg-primary-400/30 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"
			/>

			<div className="relative flex flex-col items-start gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between md:gap-8 md:px-12 md:py-14">
				<div className="flex max-w-2xl flex-col gap-3 text-white">
					<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
						<Sparkles className="size-3" aria-hidden="true" />
						Về chúng tôi
					</span>
					<h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
						Công ty TNHH Kỹ thuật – Dịch vụ{" "}
						<span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
							NORA
						</span>
					</h1>
					<p className="text-sm text-primary-100/90 md:text-base">
						Thiết bị cơ điện · Thiết bị hồ bơi · Cửa xây dựng — Giải pháp kỹ
						thuật cho mọi công trình
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-3">
						<a
							href={`tel:${HOTLINE_TEL}`}
							className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-900 shadow-md shadow-primary-950/30 transition-all hover:-translate-y-0.5 hover:shadow-lg md:text-base"
						>
							<Phone className="size-4" aria-hidden="true" />
							{HOTLINE_DISPLAY}
						</a>
						<a
							href={ZALO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 md:text-base"
						>
							<MessageCircle className="size-4" aria-hidden="true" />
							Nhắn Zalo
						</a>
					</div>
				</div>

				{/* Decorative icon stack */}
				<div aria-hidden="true" className="relative hidden shrink-0 md:block">
					<div className="absolute inset-0 -z-10 rounded-full bg-amber-400/20 blur-2xl" />
					<div className="grid grid-cols-2 gap-3">
						<span className="flex size-20 items-center justify-center rounded-2xl bg-white/10 text-amber-300 backdrop-blur">
							<Zap className="size-10" />
						</span>
						<span className="flex size-20 items-center justify-center rounded-2xl bg-white/10 text-amber-300 backdrop-blur">
							<Waves className="size-10" />
						</span>
						<span className="flex size-20 items-center justify-center rounded-2xl bg-white/10 text-amber-300 backdrop-blur">
							<DoorOpen className="size-10" />
						</span>
						<span className="flex size-20 items-center justify-center rounded-2xl bg-white/10 text-amber-300 backdrop-blur">
							<Wrench className="size-10" />
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}

// ─── Stats ───────────────────────────────────────────────────────────

function StatsBar() {
	return (
		<section className="rounded-2xl bg-white p-4 md:p-6">
			<ul className="grid grid-cols-2 divide-gray-100 md:grid-cols-4 md:divide-x">
				{STATS.map((s) => (
					<li
						key={s.label}
						className="flex flex-col items-center gap-1 px-2 py-3 text-center md:px-4"
					>
						<div className="text-xl font-bold text-primary-600 md:text-2xl">
							{s.number}
						</div>
						<div className="text-xs text-gray-500 md:text-sm">{s.label}</div>
					</li>
				))}
			</ul>
		</section>
	);
}

// ─── Intro (Long-form) ───────────────────────────────────────────────

function IntroSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-10">
			<header className="flex flex-col items-center gap-3 text-center">
				<SectionPill icon={Sparkles} label="Lời chào" />
				<h2 className="text-xl font-bold text-gray-900 md:text-2xl">
					Thư ngỏ từ NORA
				</h2>
			</header>

			<div className="prose prose-gray mt-6 max-w-none space-y-4 text-sm leading-relaxed text-gray-700 md:text-base">
				<p>
					<strong>CÔNG TY TNHH KỸ THUẬT DỊCH VỤ NORA.</strong> Xin được gửi tới
					Quý khách hàng lời chúc sức khỏe và lời chào trân trọng nhất. Chúng
					tôi xin gửi lời cảm ơn chân thành nhất tới Quý khách hàng đã và đang
					sử dụng sản phẩm và dịch vụ của chúng tôi.
				</p>
				<p>
					<strong>CÔNG TY TNHH KỸ THUẬT DỊCH VỤ NORA</strong> là một doanh
					nghiệp trẻ và năng động, đã và đang cung cấp các dịch vụ kỹ thuật
					trong lĩnh vực <em>xây dựng &amp; MEP</em>. Chúng tôi nhận thức rằng
					chất lượng sản phẩm là ưu tiên hàng đầu để đáp ứng các yêu cầu của
					khách hàng. Để đạt được mục đích này, chúng tôi đã và đang từng bước
					nâng cao chất lượng sản phẩm cũng như phong cách phục vụ — mang đến
					sự hài lòng cho Quý khách hàng.
				</p>
				<p>
					Đến với chúng tôi, Quý khách sẽ được tư vấn những giải pháp kỹ thuật
					tốt nhất để có lựa chọn phương án phù hợp với kinh phí đầu tư. Với
					chất lượng tốt nhất và phong cách phục vụ chuyên nghiệp,{" "}
					<strong>CÔNG TY TNHH KỸ THUẬT DỊCH VỤ NORA</strong> tự tin và tiếp tục
					đáp ứng các yêu cầu của Quý khách.
				</p>
				<p>
					Chúng tôi mong rằng sẽ luôn nhận được sự hợp tác của Quý Khách Hàng
					trong thời gian tới.
				</p>
				<p className="text-right italic text-gray-600">Trân trọng kính chào,</p>
			</div>
		</section>
	);
}

// ─── Vision / Mission ────────────────────────────────────────────────

function VisionMission() {
	return (
		<section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
			<div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg md:p-8">
				<div
					aria-hidden="true"
					className="absolute -right-10 -top-10 size-32 rounded-full bg-primary-500/10 blur-2xl"
				/>
				<span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/30">
					<Eye className="size-6" aria-hidden="true" />
				</span>
				<h2 className="mt-4 text-lg font-bold text-gray-900 md:text-xl">
					Tầm nhìn
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
					Trở thành đối tác kỹ thuật tin cậy hàng đầu trong lĩnh vực xây dựng
					&amp; MEP — được khách hàng lựa chọn nhờ giải pháp tối ưu, sản phẩm
					chất lượng và phong cách phục vụ chuyên nghiệp.
				</p>
			</div>

			<div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg md:p-8">
				<div
					aria-hidden="true"
					className="absolute -right-10 -top-10 size-32 rounded-full bg-amber-500/10 blur-2xl"
				/>
				<span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30">
					<Compass className="size-6" aria-hidden="true" />
				</span>
				<h2 className="mt-4 text-lg font-bold text-gray-900 md:text-xl">
					Sứ mệnh
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
					Cung cấp thiết bị cơ điện, hồ bơi và cửa xây dựng với chất lượng cao
					nhất — mang đến giải pháp an toàn, bền vững và tối ưu chi phí cho mọi
					công trình của khách hàng.
				</p>
			</div>
		</section>
	);
}

// ─── Services ────────────────────────────────────────────────────────

function ServicesSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-10">
			<header className="flex flex-col items-center gap-3 text-center">
				<SectionPill icon={Wrench} label="Lĩnh vực" />
				<h2 className="text-xl font-bold text-gray-900 md:text-2xl">
					Lĩnh vực kỹ thuật &amp; dịch vụ
				</h2>
				<p className="max-w-2xl text-sm text-gray-600 md:text-base">
					NORA chuyên cung cấp 3 mảng chính: thiết bị cơ điện, thiết bị hồ bơi
					và cửa xây dựng — kèm các dịch vụ tư vấn, lắp đặt, bảo trì trọn gói.
				</p>
			</header>

			<ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
				{SERVICES.map((s) => {
					const Icon = s.icon;
					return (
						<li
							key={s.title}
							className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
						>
							<span
								aria-hidden="true"
								className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/30 transition-transform group-hover:scale-110"
							>
								<Icon className="size-6" />
							</span>
							<h3 className="text-base font-bold text-gray-900 md:text-lg">
								{s.title}
							</h3>
							<p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Commitments ─────────────────────────────────────────────────────

function CommitmentsSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-10">
			<header className="flex flex-col items-center gap-3 text-center">
				<SectionPill icon={ShieldCheck} label="Cam kết" />
				<h2 className="text-xl font-bold text-gray-900 md:text-2xl">
					Cam kết của NORA
				</h2>
				<p className="max-w-2xl text-sm text-gray-600 md:text-base">
					Chất lượng – An toàn – Giá trị sử dụng. Đây là 3 nguyên tắc cốt lõi
					mà NORA luôn theo đuổi.
				</p>
			</header>

			<ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
				{COMMITMENTS.map((c) => {
					const Icon = c.icon;
					return (
						<li
							key={c.title}
							className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-md"
						>
							<span
								aria-hidden="true"
								className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
							>
								<Icon className="size-6" />
							</span>
							<div className="min-w-0 flex-1">
								<h3 className="text-base font-bold text-gray-900 md:text-lg">
									{c.title}
								</h3>
								<p className="mt-1 text-sm leading-relaxed text-gray-600">
									{c.desc}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Contact ─────────────────────────────────────────────────────────

function ContactSection() {
	return (
		<section className="relative isolate overflow-hidden rounded-2xl bg-primary-900 p-6 md:p-12">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-800 via-primary-900 to-primary-950"
			/>
			<div
				aria-hidden="true"
				className="absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-amber-500/15 blur-3xl"
			/>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
				<div className="space-y-4 text-white">
					<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
						<Sparkles className="size-3" aria-hidden="true" />
						Liên hệ với chúng tôi
					</span>
					<h2 className="text-xl font-bold leading-tight md:text-2xl lg:text-3xl">
						Sẵn sàng tư vấn{" "}
						<span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
							giải pháp kỹ thuật
						</span>
					</h2>
					<p className="text-sm text-primary-100/90 md:text-base">
						Mọi yêu cầu về thiết bị cơ điện, hồ bơi hay cửa xây dựng — đội ngũ
						kỹ thuật NORA luôn sẵn sàng tư vấn và hỗ trợ Quý khách.
					</p>
				</div>

				<div className="space-y-3">
					<a
						href={`tel:${HOTLINE_TEL}`}
						className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
					>
						<div className="flex items-center gap-3">
							<span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
								<Phone className="size-5" />
							</span>
							<div>
								<div className="text-xs text-gray-500">Điện thoại</div>
								<div className="text-base font-bold text-gray-900">
									{HOTLINE_DISPLAY}
								</div>
							</div>
						</div>
						<span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
							Gọi ngay →
						</span>
					</a>

					<a
						href={`tel:${HOTLINE2_TEL}`}
						className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
					>
						<div className="flex items-center gap-3">
							<span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
								<Phone className="size-5" />
							</span>
							<div>
								<div className="text-xs text-gray-500">Hotline 1</div>
								<div className="text-base font-bold text-gray-900">
									{HOTLINE2_DISPLAY}
								</div>
							</div>
						</div>
						<span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
							Gọi ngay →
						</span>
					</a>

					<a
						href={`tel:${HOTLINE3_TEL}`}
						className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
					>
						<div className="flex items-center gap-3">
							<span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
								<Phone className="size-5" />
							</span>
							<div>
								<div className="text-xs text-gray-500">Hotline 2</div>
								<div className="text-base font-bold text-gray-900">
									{HOTLINE3_DISPLAY}
								</div>
							</div>
						</div>
						<span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
							Gọi ngay →
						</span>
					</a>

					<a
						href={ZALO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
					>
						<div className="flex items-center gap-3">
							<span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
								<MessageCircle className="size-5" />
							</span>
							<div>
								<div className="text-xs text-gray-500">Zalo</div>
								<div className="text-base font-bold text-gray-900">
									Chat ngay
								</div>
							</div>
						</div>
						<span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
							Nhắn tin →
						</span>
					</a>

					<a
						href={`mailto:${EMAIL}`}
						className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
					>
						<div className="flex items-center gap-3">
							<span className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
								<Mail className="size-5" />
							</span>
							<div>
								<div className="text-xs text-gray-500">Email</div>
								<div className="text-base font-bold text-gray-900">
									{EMAIL}
								</div>
							</div>
						</div>
						<span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
							Gửi mail →
						</span>
					</a>

					<div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
							<MapPin className="size-5" />
						</span>
						<div className="text-sm font-medium">{ADDRESS}</div>
					</div>
				</div>
			</div>
		</section>
	);
}
