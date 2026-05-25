import {
	Award,
	BadgeCheck,
	BadgePercent,
	Building2,
	Crown,
	FileBadge,
	FileSignature,
	Gem,
	Handshake,
	Headset,
	LineChart,
	Mail,
	MapPin,
	Megaphone,
	MessageCircle,
	Phone,
	ShieldCheck,
	Sparkles,
	Target,
	TrendingUp,
	Users,
	Wrench,
} from "lucide-react";
import type { Metadata } from "next";

import { CONTACT } from "@/lib/constants/site-info";

export const metadata: Metadata = {
	title: "Báo giá đại lý | NORA",
	description:
		"Hợp tác đại lý phân phối thiết bị cơ điện, hồ bơi, cửa xây dựng của NORA. Chính sách giá tốt, hỗ trợ kỹ thuật và bảo hành chính hãng.",
};

const HOTLINE_DISPLAY = CONTACT.hotlineDisplay;
const HOTLINE_TEL = CONTACT.hotlineTel;
const ZALO_URL = CONTACT.zaloUrl;
const EMAIL = CONTACT.email;

// ─── Data ────────────────────────────────────────────────────────────

const STATS = [
	{ icon: Users, number: "10.000+", label: "Khách hàng tin tưởng" },
	{ icon: Building2, number: "63", label: "Tỉnh thành phủ sóng" },
	{ icon: Award, number: "10+", label: "Thương hiệu chính hãng" },
	{ icon: ShieldCheck, number: "9", label: "Tháng bảo hành" },
];

const TIERS = [
	{
		level: "Cấp 1",
		icon: Crown,
		accent: "from-amber-400 to-amber-600",
		ring: "ring-amber-200",
		title: "Đại lý độc quyền tỉnh/thành",
		desc: "Phân phối chính thức tại các tỉnh thành trên toàn quốc.",
		highlights: [
			"Chiết khấu cao nhất",
			"Bảo vệ thị trường khu vực",
			"Ưu tiên hàng mới — nguồn hàng ổn định",
		],
	},
	{
		level: "Cấp 2",
		icon: Gem,
		accent: "from-primary-500 to-primary-700",
		ring: "ring-primary-200",
		title: "Đại lý phân phối khu vực",
		desc: "Phân phối cho các cửa hàng tại mỗi địa phương.",
		highlights: [
			"Chiết khấu hấp dẫn theo doanh số",
			"Hỗ trợ trưng bày, đào tạo kỹ thuật",
			"Chính sách bảo vệ giá ổn định",
		],
	},
	{
		level: "Cấp 3",
		icon: Building2,
		accent: "from-emerald-500 to-emerald-700",
		ring: "ring-emerald-200",
		title: "Đại lý bán lẻ",
		desc: "Bán lẻ trực tiếp cho người tiêu dùng tại địa phương.",
		highlights: [
			"Mức nhập hợp lý cho cửa hàng nhỏ",
			"Đặt hàng nhanh, giao hàng tận nơi",
			"Hỗ trợ kỹ thuật & bảo hành tận nơi",
		],
	},
];

const REQUIREMENTS = [
	{
		icon: FileBadge,
		title: "Giấy phép kinh doanh",
		desc: "Có giấy phép đăng ký kinh doanh hợp pháp ngành phụ tùng/xe máy/ô tô.",
	},
	{
		icon: Wrench,
		title: "Kiến thức chuyên môn",
		desc: "Có kiến thức trong lĩnh vực kinh doanh phù hợp với sản phẩm để tư vấn khách hàng.",
	},
	{
		icon: Building2,
		title: "Địa điểm & kho bãi",
		desc: "Có địa điểm kinh doanh, kho bãi ổn định, dễ tiếp cận.",
	},
	{
		icon: Target,
		title: "Kế hoạch kinh doanh",
		desc: "Có kế hoạch kinh doanh và mạng lưới khách hàng phân phối rõ ràng.",
	},
	{
		icon: TrendingUp,
		title: "Đam mê & tham vọng",
		desc: "Tham vọng và đam mê trong lĩnh vực dầu nhớt, vỏ xe, ắc quy, phụ tùng.",
	},
];

const BENEFITS = [
	{
		num: "01",
		icon: BadgePercent,
		title: "Chiết khấu mua hàng định kỳ",
		bullets: [
			"Chiết khấu trên doanh số mua hàng theo cam kết.",
			"Tỷ lệ chiết khấu thoả thuận từ đầu khi đạt doanh số.",
			"Chính sách độc lập, song song với các chương trình khuyến mãi.",
			"Thưởng quý, năm khi đạt doanh số quy định.",
		],
	},
	{
		num: "02",
		icon: ShieldCheck,
		title: "Chính sách giá & bảo vệ giá",
		bullets: [
			"Giá mua dành riêng theo kết quả nhập hàng của đại lý.",
			"Chính sách giá đảm bảo tính cạnh tranh tại thị trường.",
			"Bảo vệ giá cho hàng cùng loại còn tồn kho.",
			"Áp dụng cho hoá đơn nhập hàng trong vòng 30 ngày.",
		],
	},
	{
		num: "03",
		icon: FileSignature,
		title: "Hợp đồng & công nợ ưu đãi",
		bullets: [
			"Đưa vào danh sách đối tác ưu đãi của hãng.",
			"Hưởng mức ưu đãi tốt nhất về chính sách công nợ.",
			"Hợp đồng nguyên tắc rõ ràng, minh bạch.",
			"Quy trình làm việc nhanh gọn, chuyên nghiệp.",
		],
	},
];

const SUPPORTS = [
	{
		num: "4.1",
		icon: LineChart,
		title: "Phát triển thị trường",
		bullets: [
			"Hỗ trợ chiến lược kinh doanh, đào tạo bán hàng và sản phẩm.",
			"Hỗ trợ giải pháp bán hàng, xâm nhập thị trường mới.",
			"Hỗ trợ giá hàng hoá cạnh tranh tại địa phương.",
		],
	},
	{
		num: "4.2",
		icon: Megaphone,
		title: "PR & Marketing",
		bullets: [
			"Cung cấp catalogue, tờ rơi, banner, vật phẩm quảng cáo.",
			"Tham gia các chương trình khuyến mãi của hãng.",
			"Cấp giấy chứng nhận đại lý/nhà phân phối chính thức.",
			"Hỗ trợ hình ảnh, marketing online và offline.",
		],
	},
	{
		num: "4.3",
		icon: Headset,
		title: "Hỗ trợ kỹ thuật",
		bullets: [
			"Hỗ trợ kỹ thuật qua điện thoại và các kênh trực tuyến.",
			"Tham gia khóa đào tạo về sản phẩm, công nghệ mới.",
			"Tư vấn xử lý bảo hành nhanh chóng cho khách hàng.",
		],
	},
];

// ─── UI primitives ───────────────────────────────────────────────────

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

function SectionHeader({
	pillIcon,
	pill,
	title,
	subtitle,
}: {
	pillIcon: React.ElementType;
	pill: string;
	title: string;
	subtitle?: string;
}) {
	return (
		<header className="flex flex-col items-center gap-3 text-center">
			<SectionPill icon={pillIcon} label={pill} />
			<h2 className="text-xl font-bold text-gray-900 md:text-3xl">{title}</h2>
			{subtitle && (
				<p className="max-w-2xl text-sm text-gray-600 md:text-base leading-relaxed">
					{subtitle}
				</p>
			)}
		</header>
	);
}

// ─── Page ────────────────────────────────────────────────────────────

export default function DealerPricePage() {
	return (
		<div className="bg-gray-100">
			<div className="container-inner flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<Hero />
				<StatsBar />
				<Intro />
				<TiersSection />
				<RequirementsSection />
				<BenefitsSection />
				<SupportSection />
				<FinalCTA />
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

			<div className="relative flex flex-col items-start gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between md:gap-8 md:px-12 md:py-16">
				<div className="flex max-w-2xl flex-col gap-3 text-white">
					<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
						<Handshake className="size-3" aria-hidden="true" />
						Tuyển đại lý toàn quốc
					</span>
					<h1 className="text-2xl font-bold leading-tight md:text-4xl lg:text-5xl">
						Trở thành{" "}
						<span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
							đại lý phân phối
						</span>{" "}
						Ắc Quy HN
					</h1>
					<p className="text-sm text-primary-100/90 md:text-base lg:text-lg">
						Hợp tác cùng phát triển thị trường — chiết khấu hấp dẫn, bảo vệ
						giá, marketing trọn gói và bảo hành chính hãng.
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

				<div aria-hidden="true" className="relative hidden shrink-0 md:block">
					<div className="absolute inset-0 -z-10 rounded-full bg-amber-400/20 blur-2xl" />
					<svg
						viewBox="0 0 220 220"
						className="size-48 text-white/90 lg:size-56"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.5}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="110" cy="110" r="92" strokeOpacity={0.2} />
						<circle cx="110" cy="110" r="76" strokeOpacity={0.35} />
						<circle cx="110" cy="110" r="60" className="fill-white/5" />
						<path
							d="M70 110 L92 130 L150 84"
							className="stroke-amber-400"
							strokeWidth={5}
						/>
						<circle cx="40" cy="110" r="4" className="fill-amber-400" />
						<circle cx="180" cy="110" r="4" className="fill-amber-400" />
						<circle cx="110" cy="40" r="4" className="fill-amber-400" />
						<circle cx="110" cy="180" r="4" className="fill-amber-400" />
					</svg>
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
				{STATS.map((s) => {
					const Icon = s.icon;
					return (
						<li
							key={s.label}
							className="flex flex-col items-center gap-2 px-2 py-3 text-center md:px-4"
						>
							<span
								aria-hidden="true"
								className="flex size-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
							>
								<Icon className="size-5" />
							</span>
							<div className="text-xl font-bold text-gray-900 md:text-2xl">
								{s.number}
							</div>
							<div className="text-xs text-gray-500 md:text-sm">
								{s.label}
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Intro ───────────────────────────────────────────────────────────

function Intro() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-12">
			<div className="mx-auto max-w-3xl text-center">
				<SectionPill icon={Sparkles} label="Cơ hội kinh doanh" />
				<h2 className="mt-3 text-xl font-bold text-gray-900 md:text-3xl">
					Ắc quy — mặt hàng tiềm năng trên thị trường
				</h2>
				<div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 md:text-base">
					<p>
						Ắc quy là một trong những mặt hàng tiềm năng trên thị trường,
						nhu cầu sử dụng các sản phẩm dầu nhớt ngày một tăng. Việc tìm
						được một nhà phân phối uy tín là điều hết sức quan trọng đối
						với các nhà đầu tư.
					</p>
					<p>
						Hiện tại, <b>Ắc Quy HN Sài Gòn</b> đang tuyển dụng đại lý khắp
						các tỉnh thành trên toàn quốc cho các thương hiệu Ắc quy nhập
						khẩu và phân phối chính thức. Chúng tôi mong muốn hợp tác mở
						rộng thị trường, tạo thu nhập ổn định lâu dài cho đối tác.
					</p>
				</div>
			</div>
		</section>
	);
}

// ─── Tiers ───────────────────────────────────────────────────────────

function TiersSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-12">
			<SectionHeader
				pillIcon={Crown}
				pill="Cấp độ đại lý"
				title="3 cấp đại lý — Phù hợp mọi quy mô"
				subtitle="Lựa chọn cấp đại lý phù hợp với khả năng đầu tư và kế hoạch kinh doanh của bạn."
			/>

			<ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
				{TIERS.map((t) => {
					const Icon = t.icon;
					return (
						<li
							key={t.level}
							className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl md:p-8"
						>
							<div
								aria-hidden="true"
								className={`absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br ${t.accent} opacity-10 blur-3xl transition-opacity group-hover:opacity-25`}
							/>
							<div className="flex items-center gap-3">
								<span
									className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${t.accent} text-white shadow-lg ring-4 ${t.ring}`}
								>
									<Icon className="size-7" aria-hidden="true" />
								</span>
								<span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-700">
									{t.level}
								</span>
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-bold text-gray-900 md:text-xl">
									{t.title}
								</h3>
								<p className="text-sm leading-relaxed text-gray-600">
									{t.desc}
								</p>
							</div>
							<ul className="mt-2 space-y-2 border-t border-gray-100 pt-4">
								{t.highlights.map((h) => (
									<li
										key={h}
										className="flex items-start gap-2 text-sm text-gray-700"
									>
										<BadgeCheck className="size-4 shrink-0 text-emerald-500 mt-0.5" />
										<span>{h}</span>
									</li>
								))}
							</ul>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Requirements ────────────────────────────────────────────────────

function RequirementsSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-12">
			<SectionHeader
				pillIcon={ShieldCheck}
				pill="Điều kiện hợp tác"
				title="5 điều kiện trở thành đại lý"
				subtitle="Đảm bảo đối tác có đủ năng lực vận hành để cùng phát triển bền vững."
			/>

			<ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
				{REQUIREMENTS.map((r, idx) => {
					const Icon = r.icon;
					return (
						<li
							key={r.title}
							className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5 transition-all hover:border-primary-200 hover:shadow-md md:p-6"
						>
							<span
								aria-hidden="true"
								className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
							>
								<Icon className="size-5" />
							</span>
							<div className="min-w-0 flex-1">
								<div className="flex items-baseline gap-2">
									<span className="text-sm font-bold text-primary-500">
										0{idx + 1}.
									</span>
									<h3 className="text-base font-semibold text-gray-900">
										{r.title}
									</h3>
								</div>
								<p className="mt-1.5 text-sm leading-relaxed text-gray-600">
									{r.desc}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Benefits ────────────────────────────────────────────────────────

function BenefitsSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-12">
			<SectionHeader
				pillIcon={Gem}
				pill="Quyền lợi đại lý"
				title="3 nhóm quyền lợi nổi bật"
				subtitle="Cam kết mang lại giá trị thực tế — từ chiết khấu, bảo vệ giá đến chính sách công nợ."
			/>

			<ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
				{BENEFITS.map((b) => {
					const Icon = b.icon;
					return (
						<li
							key={b.title}
							className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-primary-50/40 p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl md:p-8"
						>
							<div className="absolute right-4 top-4 text-5xl font-bold text-primary-100 leading-none">
								{b.num}
							</div>
							<span
								aria-hidden="true"
								className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-110"
							>
								<Icon className="size-7" />
							</span>
							<h3 className="text-lg font-bold text-gray-900 md:text-xl">
								{b.title}
							</h3>
							<ul className="space-y-2.5 border-t border-gray-100 pt-4">
								{b.bullets.map((bullet) => (
									<li
										key={bullet}
										className="flex items-start gap-2 text-sm leading-relaxed text-gray-700"
									>
										<BadgeCheck className="size-4 shrink-0 text-primary-500 mt-0.5" />
										<span>{bullet}</span>
									</li>
								))}
							</ul>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Supports ────────────────────────────────────────────────────────

function SupportSection() {
	return (
		<section className="rounded-2xl bg-white p-6 md:p-12">
			<SectionHeader
				pillIcon={Handshake}
				pill="Chính sách hỗ trợ"
				title="Đồng hành cùng đại lý từ A → Z"
				subtitle="Không chỉ bán hàng — chúng tôi đầu tư hỗ trợ đại lý phát triển bền vững dài hạn."
			/>

			<ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
				{SUPPORTS.map((s) => {
					const Icon = s.icon;
					return (
						<li
							key={s.title}
							className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md md:p-8"
						>
							<div className="flex items-center gap-3">
								<span
									aria-hidden="true"
									className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
								>
									<Icon className="size-6" />
								</span>
								<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
									{s.num}
								</span>
							</div>
							<h3 className="text-base font-bold text-gray-900 md:text-lg">
								{s.title}
							</h3>
							<ul className="space-y-2.5 border-t border-gray-100 pt-4">
								{s.bullets.map((bullet) => (
									<li
										key={bullet}
										className="flex items-start gap-2 text-sm leading-relaxed text-gray-700"
									>
										<BadgeCheck className="size-4 shrink-0 text-emerald-500 mt-0.5" />
										<span>{bullet}</span>
									</li>
								))}
							</ul>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

// ─── Final CTA ───────────────────────────────────────────────────────

function FinalCTA() {
	return (
		<section className="relative isolate overflow-hidden rounded-2xl bg-primary-900 p-6 md:p-14">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-800 via-primary-900 to-primary-950"
			/>
			<div
				aria-hidden="true"
				className="absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-amber-500/15 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-32 -left-32 -z-10 size-96 rounded-full bg-primary-400/20 blur-3xl"
			/>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
				<div className="space-y-4 text-white">
					<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
						<Sparkles className="size-3" aria-hidden="true" />
						Liên hệ ngay
					</span>
					<h2 className="text-xl font-bold leading-tight md:text-3xl lg:text-4xl">
						Hân hạnh đồng hành cùng các{" "}
						<span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
							doanh nghiệp đối tác
						</span>
					</h2>
					<p className="text-sm text-primary-100/90 md:text-base">
						Ắc Quy HN Sài Gòn rất hân hạnh khi được trở thành nhà phân phối
						chính thức cho các doanh nghiệp. Liên hệ ngay với chúng tôi qua
						hotline để được tư vấn, giải đáp thắc mắc trực tiếp.
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
								<div className="text-xs text-gray-500">Hotline 24/7</div>
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
									Chat ngay với tư vấn viên
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
						<span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
							<MapPin className="size-5" />
						</span>
						<div className="text-sm font-medium">
							Ắc Quy HN Thủ Đức — TP. Hồ Chí Minh
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
