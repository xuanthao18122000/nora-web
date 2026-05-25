"use client";

import { ChevronDown, Filter, Star } from "lucide-react";

import {
	BadgeHotSale,
	BadgeNew,
	BadgeOffer,
	BadgeOfferLink,
	BadgeOnline,
	Breadcrumb,
	Button,
	Carousel,
	CarouselNav,
	FlashSaleCard,
	MenuItem,
	Pagination,
	PriceDisplay,
	RangeSlider,
	RecentlyViewedCard,
	SearchInput,
	StarRating,
	Tab,
} from "@/components/common";
import FilterResultChip from "@/components/common/FilterResultChip";
import { ProductCard } from "@/components/common/ProductCard";
import CodeSnippet from "./CodeSnippet";

export default function PreviewPage() {
	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="container-inner flex flex-col gap-10">
				{/* ── Page Header ── */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						DDV Design System — Component Preview
					</h1>
					<p className="text-md text-gray-500">
						Tất cả components được build dựa trên Figma Design
						Tokens
					</p>
				</div>

				{/* ══════════════════════════════════════════════ */}
				{/* 1. COLOR PALETTE                               */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🎨 Color Palette
					</h2>

					{/* Primary */}
					<h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
						Primary (Brand)
					</h3>
					<div className="flex gap-2 mb-6 flex-wrap">
						{[
							{ name: "50", cls: "bg-primary-50" },
							{ name: "100", cls: "bg-primary-100" },
							{ name: "200", cls: "bg-primary-200" },
							{ name: "500", cls: "bg-primary-500" },
							{ name: "600", cls: "bg-primary-600" },
							{ name: "700", cls: "bg-primary-700" },
						].map((c) => (
							<div
								key={c.name}
								className="flex flex-col items-center gap-1"
							>
								<div
									className={`w-14 h-14 rounded-lg border border-gray-200 ${c.cls}`}
								/>
								<span className="text-xxs text-gray-500">
									{c.name}
								</span>
							</div>
						))}
					</div>

					{/* Gray */}
					<h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
						Gray Scale
					</h3>
					<div className="flex gap-2 mb-6 flex-wrap">
						{[
							{ name: "50", cls: "bg-gray-50" },
							{ name: "100", cls: "bg-gray-100" },
							{ name: "200", cls: "bg-gray-200" },
							{ name: "300", cls: "bg-gray-300" },
							{ name: "400", cls: "bg-gray-400" },
							{ name: "500", cls: "bg-gray-500" },
							{ name: "600", cls: "bg-gray-600" },
							{ name: "700", cls: "bg-gray-700" },
							{ name: "800", cls: "bg-gray-800" },
							{ name: "900", cls: "bg-gray-900" },
						].map((c) => (
							<div
								key={c.name}
								className="flex flex-col items-center gap-1"
							>
								<div
									className={`w-14 h-14 rounded-lg border border-gray-200 ${c.cls}`}
								/>
								<span className="text-xxs text-gray-500">
									{c.name}
								</span>
							</div>
						))}
					</div>

					{/* Accents */}
					<h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
						Accent Colors
					</h3>
					<div className="flex gap-2 flex-wrap">
						{[
							{ name: "Blue 50", cls: "bg-blue-50" },
							{ name: "Blue 500", cls: "bg-blue-500" },
							{ name: "Blue 600", cls: "bg-blue-600" },
							{ name: "Yellow 100", cls: "bg-yellow-100" },
							{ name: "Yellow 500", cls: "bg-yellow-500" },
							{ name: "Orange 500", cls: "bg-orange-500" },
							{ name: "Red 400", cls: "bg-red-400" },
							{ name: "Red 500", cls: "bg-red-500" },
						].map((c) => (
							<div
								key={c.name}
								className="flex flex-col items-center gap-1"
							>
								<div
									className={`w-14 h-14 rounded-lg border border-gray-200 ${c.cls}`}
								/>
								<span className="text-xxs text-gray-500 text-center leading-tight">
									{c.name}
								</span>
							</div>
						))}
					</div>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 2. TYPOGRAPHY                                  */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						✏️ Typography
					</h2>
					<div className="flex flex-col gap-3">
						<p className="text-6xl font-bold text-gray-900">
							text-6xl / bold (48px)
						</p>
						<p className="text-3xl font-bold text-gray-900">
							text-3xl / bold (30px) — Flash Sale
						</p>
						<p className="text-2xl font-semibold text-gray-900">
							text-2xl / semibold (24px)
						</p>
						<p className="text-xl font-medium text-gray-900">
							text-xl / medium (20px) — Section Title
						</p>
						<p className="text-lg font-normal text-gray-900">
							text-lg / normal (18px)
						</p>
						<p className="text-md font-semibold text-primary-600">
							text-md / semibold (16px) — Price
						</p>
						<p className="text-md font-normal text-gray-900">
							text-md / normal (16px) — Body text
						</p>
						<p className="text-sm font-normal text-gray-900">
							text-sm / normal (14px) — Product name
						</p>
						<p className="text-xs font-medium text-gray-600">
							text-xs / medium (12px) — Rating
						</p>
						<p className="text-xxs font-normal text-gray-400">
							text-xxs / normal (10px) — Badge
						</p>
					</div>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 3. SEARCH INPUT                                */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🔍 Search Input
					</h2>
					<SearchInput placeholder="Bạn muốn mua gì hôm nay" />
					<CodeSnippet
						code={`import { SearchInput } from "@/components/common";

<SearchInput
  placeholder="Bạn muốn mua gì hôm nay"
  onSearch={(value) => console.log(value)}
/>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 4.1 FILTER BUTTONS & FILTER RESULT CHIP        */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🧩 Filter Buttons
					</h2>

					<div className="flex flex-col gap-4">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Button variant="filter" (matches Figma inline
								list)
							</h3>
							<div className="flex flex-wrap gap-2">
								<Button
									variant="filter"
									size="sm"
									pressed
									leadingIcon={<Filter className="h-5 w-5" />}
								>
									Lọc
								</Button>
								<Button variant="filter" size="sm">
									Hàng mới về
								</Button>
								<Button
									variant="filter"
									size="sm"
									trailingIcon={
										<ChevronDown className="h-4 w-4" />
									}
								>
									Khoảng giá
								</Button>
								<Button
									variant="filter"
									size="sm"
									trailingIcon={
										<ChevronDown className="h-4 w-4" />
									}
								>
									Loại điện thoại
								</Button>
							</div>
						</div>

						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								FilterResultChip (matches Figma
								button-filter-result)
							</h3>
							<div className="flex flex-wrap gap-2">
								<FilterResultChip
									label="Giá: 5-10tr"
									onClear={() => {}}
								/>
								<FilterResultChip
									variant="muted"
									label="RAM: 8GB"
									onClear={() => {}}
								/>
							</div>
						</div>
					</div>

					<CodeSnippet
						code={`import { Button, FilterResultChip } from "@/components/common";
import { ChevronDown, Filter } from "lucide-react";

// Button variant="filter"
<Button variant="filter" size="sm" pressed leadingIcon={<Filter className="h-5 w-5" />}>Lọc</Button>
<Button variant="filter" size="sm">Hàng mới về</Button>
<Button variant="filter" size="sm" trailingIcon={<ChevronDown className="h-4 w-4" />}>Khoảng giá</Button>

// FilterResultChip
<FilterResultChip label="Giá: 5-10tr" onClear={() => {}} />
<FilterResultChip variant="muted" label="RAM: 8GB" onClear={() => {}} />`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 4.2 RANGE SLIDER                               */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🎚️ Range Slider
					</h2>

					<div className="flex flex-col gap-4">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								range-slider (Figma `170:66796`)
							</h3>
							<div className="max-w-[560px]">
								<RangeSlider
									min={0}
									max={100}
									step={1}
									defaultValue={[20, 80]}
									onValueChange={() => {}}
								/>
							</div>
						</div>
					</div>

					<CodeSnippet
						code={`import { RangeSlider } from "@/components/common";

<RangeSlider
  min={0}
  max={100}
  step={1}
  defaultValue={[20, 80]}
  onValueChange={(v) => console.log(v)}
/>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 4. BUTTONS                                     */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🔘 Buttons
					</h2>

					{/* Filled */}
					<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
						Filled
					</h3>
					<div className="flex items-center gap-3 mb-6 flex-wrap">
						<Button variant="filled" color="primary" size="md">
							Đăng nhập
						</Button>
						<Button variant="filled" color="primary" size="sm">
							Mua ngay
						</Button>
						<Button variant="filled" color="primary" size="xs">
							Mua ngay
						</Button>
						<Button
							variant="filled"
							color="primary"
							size="md"
							loading
						>
							Loading
						</Button>
						<Button
							variant="filled"
							color="primary"
							size="md"
							disabled
						>
							Disabled
						</Button>
					</div>

					{/* Bordered */}
					<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
						Bordered
					</h3>
					<div className="flex items-center gap-3 mb-6 flex-wrap">
						<Button variant="bordered" color="gray" size="md">
							Tạo tài khoản
						</Button>
						<Button variant="bordered" color="gray" size="sm">
							Xem thêm sản phẩm
						</Button>
						<Button variant="bordered" color="primary" size="md">
							Primary Bordered
						</Button>
					</div>

					{/* Soft */}
					<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
						Soft
					</h3>
					<div className="flex items-center gap-3 flex-wrap">
						<Button variant="soft" color="primary" size="xs">
							Mua ngay
						</Button>
						<Button variant="soft" color="primary" size="sm">
							Soft Primary SM
						</Button>
						<Button variant="soft" color="gray" size="sm">
							Soft Gray
						</Button>
					</div>
					<CodeSnippet
						code={`import { Button } from "@/components/common";

<Button variant="primary">Mua ngay</Button>
<Button variant="secondary">Xem thêm</Button>
<Button variant="outline">Hủy</Button>
<Button variant="ghost">Tìm hiểu</Button>
<Button size="sm">Nhỏ</Button>
<Button size="lg" fullWidth>Toàn chiều rộng</Button>
<Button disabled>Vô hiệu hóa</Button>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 5. BADGES                                      */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🏷️ Badges
					</h2>
					<div className="flex items-center gap-3 flex-wrap">
						<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
						<BadgeNew>Mới về</BadgeNew>
						<BadgeOnline>Online giá sốc</BadgeOnline>
						<BadgeHotSale>Còn 04 ngày 04:25:54</BadgeHotSale>
						<BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>
					</div>
					<CodeSnippet
						code={`import { BadgeNew, BadgeOffer, BadgeOnline, BadgeHotSale, BadgeOfferLink } from "@/components/common";

<BadgeNew>Mới về</BadgeNew>
<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
<BadgeOnline>Online giá sốc</BadgeOnline>
<BadgeHotSale>Còn 04 ngày 04:25:54</BadgeHotSale>
<BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 6. PRODUCT CARDS                               */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🛍️ Product Cards
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{/* Card with all features */}
						<ProductCard href="#">
							<ProductCard.Labels>
								<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
							</ProductCard.Labels>
							<ProductCard.Image
								src="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								alt="Samsung Galaxy A56 5G"
							/>
							<ProductCard.Content>
								<BadgeHotSale>
									Còn 04 ngày 04:25:54
								</BadgeHotSale>
								<ProductCard.Name>
									Samsung Galaxy A56 5G 8GB/128GB
								</ProductCard.Name>
								<ProductCard.Price
									originalPrice={12200000}
									discount={30}
									price={9200000}
								/>
								<BadgeOfferLink>
									+2 ưu đãi cho bạn
								</BadgeOfferLink>
							</ProductCard.Content>
							<ProductCard.Footer>
								<div className="flex flex-1 items-center gap-1">
									<Star
										aria-hidden
										className="size-3 text-yellow-400 fill-yellow-400"
									/>
									<span className="text-xs leading-(--leading-xs) font-medium text-gray-600">
										4.9
									</span>
									<span className="text-xs leading-(--leading-xs) font-normal text-gray-400">
										(100)
									</span>
								</div>
							</ProductCard.Footer>
						</ProductCard>

						{/* Card with online offer */}
						<ProductCard href="#">
							<ProductCard.Labels>
								<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
							</ProductCard.Labels>
							<ProductCard.Image
								src="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								alt="Samsung Galaxy A56 5G"
							/>
							<ProductCard.Content>
								<BadgeOnline>Online giá sốc</BadgeOnline>
								<ProductCard.Name>
									Samsung Galaxy A56 5G 8GB/256GB
								</ProductCard.Name>
								<ProductCard.Price
									originalPrice={12990000}
									discount={30}
									price={10290000}
								/>
								<BadgeOfferLink>
									+2 ưu đãi cho bạn
								</BadgeOfferLink>
							</ProductCard.Content>
							<ProductCard.Footer>
								<div className="flex flex-1 items-center gap-1">
									<Star
										aria-hidden
										className="size-3 text-yellow-400 fill-yellow-400"
									/>
									<span className="text-xs leading-(--leading-xs) font-medium text-gray-600">
										4.9
									</span>
									<span className="text-xs leading-(--leading-xs) font-normal text-gray-400">
										(100)
									</span>
								</div>
							</ProductCard.Footer>
						</ProductCard>

						{/* Card with new badge */}
						<ProductCard href="#">
							<ProductCard.Labels>
								<BadgeNew>Mới về</BadgeNew>
								<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
							</ProductCard.Labels>
							<ProductCard.Image
								src="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								alt="Samsung Galaxy A36 5G"
							/>
							<ProductCard.Content>
								<ProductCard.Name>
									Samsung Galaxy A36 5G 12GB/256GB
								</ProductCard.Name>
								<ProductCard.Price
									originalPrice={11990000}
									discount={30}
									price={9990000}
								/>
								<BadgeOfferLink>
									+2 ưu đãi cho bạn
								</BadgeOfferLink>
							</ProductCard.Content>
							<ProductCard.Footer>
								<div className="flex flex-1 items-center gap-1">
									<Star
										aria-hidden
										className="size-3 text-yellow-400 fill-yellow-400"
									/>
									<span className="text-xs leading-(--leading-xs) font-medium text-gray-600">
										4.9
									</span>
									<span className="text-xs leading-(--leading-xs) font-normal text-gray-400">
										(100)
									</span>
								</div>
							</ProductCard.Footer>
						</ProductCard>

						{/* Minimal card */}
						<ProductCard href="#">
							<ProductCard.Image
								src="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								alt="Samsung Galaxy S24 FE"
							/>
							<ProductCard.Content>
								<ProductCard.Name>
									Samsung Galaxy S24 FE 5G 8GB/256GB
								</ProductCard.Name>
								<ProductCard.Price price={14990000} />
							</ProductCard.Content>
							<ProductCard.Footer>
								<div className="flex flex-1 items-center gap-1">
									<Star
										aria-hidden
										className="size-3 text-yellow-400 fill-yellow-400"
									/>
									<span className="text-xs leading-(--leading-xs) font-medium text-gray-600">
										4.9
									</span>
									<span className="text-xs leading-(--leading-xs) font-normal text-gray-400">
										(100)
									</span>
								</div>
							</ProductCard.Footer>
						</ProductCard>

						{/* Card — MacBook */}
						<ProductCard href="#">
							<ProductCard.Labels>
								<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
							</ProductCard.Labels>
							<ProductCard.Image
								src="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								alt="MacBook Pro 2024"
							/>
							<ProductCard.Content>
								<ProductCard.Name>
									MacBook Pro 2024 16-inch M4 Pro 14‑Core CPU
									| 20‑Core GPU 24GB/512GB
								</ProductCard.Name>
								<ProductCard.Price
									originalPrice={65990000}
									discount={30}
									price={63990000}
								/>
								<BadgeOfferLink>
									+2 ưu đãi cho bạn
								</BadgeOfferLink>
							</ProductCard.Content>
							<ProductCard.Footer>
								<div className="flex flex-1 items-center gap-1">
									<Star
										aria-hidden
										className="size-3 text-yellow-400 fill-yellow-400"
									/>
									<span className="text-xs leading-(--leading-xs) font-medium text-gray-600">
										4.9
									</span>
									<span className="text-xs leading-(--leading-xs) font-normal text-gray-400">
										(100)
									</span>
								</div>
							</ProductCard.Footer>
						</ProductCard>
					</div>
					<CodeSnippet
						code={`import { ProductCard } from "@/components/common";

<ProductCard href={\`/product/\${item.id}\`}>
  <ProductCard.Labels>
    <BadgeNew>Mới về</BadgeNew>
    <BadgeOffer>Trả góp 0%</BadgeOffer>
  </ProductCard.Labels>

  <ProductCard.Image src={item.image} alt={item.name} />

  <ProductCard.Content>
    <BadgeHotSale>Còn 04 ngày 04:25:54</BadgeHotSale>
    <ProductCard.Name>{item.name}</ProductCard.Name>
    <ProductCard.Price
      originalPrice={item.originalPrice}
      discount={item.discount}
      price={item.price}
    />
    <BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>
  </ProductCard.Content>

  <ProductCard.Footer>
    <StarRating value={4.9} count={100} />
    <Button size="xs">So sánh</Button>
  </ProductCard.Footer>
</ProductCard>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 7. FLASH SALE CARDS                            */}
				{/* ══════════════════════════════════════════════ */}
				<section
					className="rounded-lg p-6 border border-gray-200"
					style={{ background: "var(--color-primary-600)" }}
				>
					<div className="flex items-center gap-2 mb-4">
						<span className="text-3xl">⚡</span>
						<h2 className="text-3xl font-bold text-white">
							Flash sale
						</h2>
					</div>
					<div className="bg-white rounded-lg p-4">
						{/* Timeline tabs */}
						<Tab
							variant="underline"
							items={[
								{
									key: "ongoing",
									label: "29/1",
									badge: (
										<div className="flex items-center gap-1">
											<span className="text-xxs text-gray-900">
												Chỉ còn
											</span>
											<span className="text-xxs font-medium text-white bg-primary-600 rounded-xs px-1">
												04
											</span>
											<span className="text-xxs font-medium text-gray-900">
												:
											</span>
											<span className="text-xxs font-medium text-white bg-primary-600 rounded-xs px-1">
												12
											</span>
											<span className="text-xxs font-medium text-gray-900">
												:
											</span>
											<span className="text-xxs font-medium text-white bg-primary-600 rounded-xs px-1">
												26
											</span>
										</div>
									),
								},
								{
									key: "next",
									label: "Sắp diễn ra",
									subLabel: "21:30",
								},
								{
									key: "tomorrow-1",
									label: "Ngày mai",
									subLabel: "00:00",
								},
								{
									key: "tomorrow-2",
									label: "Ngày mai",
									subLabel: "09:00",
								},
							]}
							className="border-b border-gray-200 mb-4"
						/>

						{/* Flash sale cards */}
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
							<FlashSaleCard
								name="Samsung Galaxy A56 5G 8GB/128GB"
								price="9.200.000 đ"
								originalPrice="12.200.000 đ"
								discount="-30%"
								image="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								soldCount={3}
								totalCount={10}
							/>
							<FlashSaleCard
								name="iPhone 17 Pro Max 512GB | Chính hãng VN/A-Titan Sa Mạc"
								price="28.990.000 đ"
								originalPrice="34.990.000 đ"
								discount="-17%"
								image="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								soldCount={7}
								totalCount={10}
							/>
							<FlashSaleCard
								name="Tai nghe Bluetooth HAVIT H612BT Pro (ANC)"
								price="450.000 đ"
								originalPrice="690.000 đ"
								discount="-35%"
								image="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								soldCount={1}
								totalCount={10}
							/>
							<FlashSaleCard
								name="MacBook Air M3 13-inch 8GB/256GB"
								price="22.490.000 đ"
								originalPrice="27.990.000 đ"
								discount="-20%"
								image="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								soldCount={5}
								totalCount={10}
							/>
							<FlashSaleCard
								name="iPad Air M2 11-inch Wi-Fi 128GB"
								price="14.990.000 đ"
								originalPrice="16.990.000 đ"
								discount="-12%"
								image="https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg"
								soldCount={9}
								totalCount={10}
							/>
						</div>
					</div>
					<CodeSnippet
						code={`import { FlashSaleCard } from "@/components/common";

<FlashSaleCard
  name="Samsung Galaxy A56 5G 8GB/128GB"
  price="9.200.000 đ"
  originalPrice="12.200.000 đ"
  discount="-30%"
  image="/products/galaxy-a56.jpg"
  soldCount={3}
  totalCount={10}
/>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 8. BORDER RADIUS & SHADOWS                     */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						📐 Border Radius & Shadows
					</h2>
					<div className="flex items-center gap-6 flex-wrap">
						<div className="flex flex-col items-center gap-2">
							<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-xs" />
							<span className="text-xs text-gray-500">
								radius-xs (4px)
							</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg" />
							<span className="text-xs text-gray-500">
								radius-sm (8px)
							</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg" />
							<span className="text-xs text-gray-500">
								radius-md (16px)
							</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-full" />
							<span className="text-xs text-gray-500">
								radius-full (99px)
							</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-20 h-20 bg-white rounded-lg shadow-(--shadow-sm)" />
							<span className="text-xs text-gray-500">
								shadow-sm
							</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-20 h-20 bg-white rounded-lg shadow-(--shadow-card)" />
							<span className="text-xs text-gray-500">
								shadow-card
							</span>
						</div>
					</div>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 9. STAR RATING & PRICE DISPLAY                 */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						⭐ Star Rating & Price Display
					</h2>
					<div className="flex flex-col gap-6">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Star Rating
							</h3>
							<div className="flex items-center gap-6">
								<StarRating
									rating={4.9}
									reviewCount={100}
									size="sm"
								/>
								<StarRating
									rating={4.5}
									reviewCount={2340}
									size="md"
								/>
								<StarRating rating={5} />
								<StarRating
									rating={3.2}
									reviewCount={8}
									size="sm"
								/>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Price Display
							</h3>
							<div className="flex items-center gap-8">
								<PriceDisplay
									price={9_200_000}
									originalPrice={12_200_000}
									discount="-30%"
									size="sm"
								/>
								<PriceDisplay
									price={28_990_000}
									originalPrice={34_990_000}
									discount="-17%"
									size="md"
								/>
								<PriceDisplay price={63_990_000} size="lg" />
							</div>
						</div>
					</div>
					<CodeSnippet
						code={`import { StarRating, PriceDisplay } from "@/components/common";

// Star Rating
<StarRating rating={4.5} count={120} />
<StarRating rating={3} size="lg" />

// Price Display (formatPrice applied inside)
<PriceDisplay price={9200000} />
<PriceDisplay
  price={9200000}
  originalPrice={12200000}
  discount="-30%"
/>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 10. MENU ITEM                                  */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						📱 Menu Item (Nav)
					</h2>
					<div className="flex items-center gap-0 border-b border-gray-200">
						<MenuItem label="Điện thoại" active />
						<MenuItem label="Laptop" />
						<MenuItem label="Tablet" />
						<MenuItem label="Đồng hồ" />
						<MenuItem label="Âm thanh" />
						<MenuItem label="Phụ kiện" />
					</div>
					<CodeSnippet
						code={`import { MenuItem } from "@/components/common";

<MenuItem icon="📱" label="Điện thoại" href="/dien-thoai" />
<MenuItem icon="💻" label="Laptop" href="/laptop" active />`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 11. TAB                                        */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🗂️ Tab (Timeline)
					</h2>
					<div className="flex flex-col gap-6">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Underline (Flash Sale)
							</h3>
							<Tab
								variant="underline"
								items={[
									{
										key: "ongoing",
										label: "29/1",
										subLabel: "Chỉ còn 04:12:26",
									},
									{
										key: "next",
										label: "Sắp diễn ra",
										subLabel: "21:30",
									},
									{
										key: "tomorrow",
										label: "Ngày mai",
										subLabel: "00:00",
									},
									{
										key: "tomorrow2",
										label: "Ngày mai",
										subLabel: "09:00",
									},
								]}
							/>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Default (rounded)
							</h3>
							<Tab
								variant="default"
								items={[
									{ key: "all", label: "Tất cả" },
									{ key: "phone", label: "Điện thoại" },
									{ key: "laptop", label: "Laptop" },
									{ key: "tablet", label: "Tablet" },
								]}
							/>
						</div>
					</div>
					<CodeSnippet
						code={`import { Tab } from "@/components/common";

<Tab
  variant="underline"
  items={[
    { key: "tab1", label: "29/1", subLabel: "Đang diễn ra" },
    { key: "tab2", label: "Ngày mai", subLabel: "09:00" },
  ]}
  onChange={(key) => console.log(key)}
/>

<Tab
  variant="default"
  items={[
    { key: "all", label: "Tất cả" },
    { key: "phone", label: "Điện thoại" },
  ]}
/>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 12. CAROUSEL & RECENTLY VIEWED                 */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🔄 Carousel & Recently Viewed
					</h2>
					<div className="flex flex-col gap-6">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Carousel Nav Buttons
							</h3>
							<div className="flex items-center gap-3">
								<CarouselNav direction="prev" size="sm" />
								<CarouselNav direction="next" size="sm" />
								<CarouselNav direction="prev" size="md" />
								<CarouselNav direction="next" size="md" />
								<CarouselNav direction="prev" disabled />
								<CarouselNav direction="next" disabled />
							</div>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Carousel (Flash Sale Cards)
							</h3>
							<div className="px-6">
								<Carousel gap={12} navSize="sm">
									{[
										{
											name: "Samsung Galaxy A56 5G 8GB/128GB",
											price: "9.200.000 đ",
											originalPrice: "12.200.000 đ",
											discount: "-30%",
											image: "https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "iPhone 16 Pro Max 256GB",
											price: "28.990.000 đ",
											originalPrice: "34.990.000 đ",
											discount: "-17%",
											image: "https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "Tai nghe Bluetooth HAVIT H612BT Pro",
											price: "450.000 đ",
											originalPrice: "690.000 đ",
											discount: "-35%",
											image: "https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "MacBook Air M3 13-inch 8GB/256GB",
											price: "22.490.000 đ",
											originalPrice: "27.990.000 đ",
											discount: "-20%",
											image: "https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "iPad Air M2 11-inch Wi-Fi 128GB",
											price: "14.990.000 đ",
											originalPrice: "16.990.000 đ",
											discount: "-12%",
											image: "https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
									].map((card) => (
										<div
											key={card.name}
											className="w-[180px]"
										>
											<FlashSaleCard {...card} />
										</div>
									))}
								</Carousel>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Recently Viewed (Horizontal Cards — Figma Match)
							</h3>
							<div className="px-6">
								<Carousel gap={8} navSize="sm">
									{[
										{
											name: "MacBook Pro 2024 16-inch M4 Pro 14-Core CPU | 20-C...",
											price: "63.990.000 đ",
											imageUrl:
												"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "iPhone 17 256GB | Chính hãng",
											price: "63.990.000 đ",
											imageUrl:
												"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "Samsung Galaxy S25 Ultra 12GB 256GB",
											price: "63.990.000 đ",
											imageUrl:
												"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
										{
											name: "iPad Pro M4 11-inch 256GB WiFi",
											price: "25.990.000 đ",
											imageUrl:
												"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg",
										},
									].map((card) => (
										<RecentlyViewedCard
											key={card.name}
											{...card}
											onRemove={() => {}}
										/>
									))}
								</Carousel>
							</div>
						</div>
					</div>
					<CodeSnippet
						code={`import { Carousel, CarouselNav, RecentlyViewedCard } from "@/components/common";

// Carousel
<Carousel gap={16} showNav autoPlay={3000}>
  <FlashSaleCard name="..." price="..." />
  <FlashSaleCard name="..." price="..." />
</Carousel>

// CarouselNav (standalone)
<CarouselNav direction="prev" size="md" onClick={handlePrev} />
<CarouselNav direction="next" size="md" onClick={handleNext} />

// RecentlyViewedCard
<RecentlyViewedCard
  name="MacBook Pro 2024 16-inch"
  price="63.990.000 đ"
  imageUrl="/products/macbook.jpg"
  onRemove={() => console.log("removed")}
/>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 14. HERO BANNER                                */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🖼️ Banner Carousel
					</h2>
					<div className="flex flex-col gap-6">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Banner Slider (loop + dots + hover nav)
							</h3>
							<Carousel
								loop
								showDots
								showNav
								navVisibility="hover"
								gap={0}
								slidesPerView={1}
								autoPlay={5000}
								className="relative h-[200px] md:h-[380px] rounded-lg overflow-hidden bg-gray-100"
							>
								{[
									{ id: "1", alt: "Banner 1" },
									{ id: "2", alt: "Banner 2" },
									{ id: "3", alt: "Banner 3" },
								].map((s) => (
									<div
										key={s.id}
										className="relative h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm select-none"
									>
										{s.alt}
									</div>
								))}
							</Carousel>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								No nav (promo style)
							</h3>
							<Carousel
								loop
								showDots
								showNav={false}
								gap={0}
								slidesPerView={1}
								className="relative h-[200px] md:h-[380px] rounded-lg overflow-hidden bg-gray-100"
							>
								{[
									{ id: "a1", alt: "Full width banner" },
									{ id: "a2", alt: "Second slide" },
								].map((s) => (
									<div
										key={s.id}
										className="relative h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm select-none"
									>
										{s.alt}
									</div>
								))}
							</Carousel>
						</div>
					</div>
					<CodeSnippet
						code={`import { Carousel } from "@/components/common";

<Carousel loop showDots showNav navVisibility="hover" gap={0} slidesPerView={1} autoPlay={5000}
  className="relative h-[380px] rounded-lg overflow-hidden bg-gray-100">
  {slides.map(s => <div key={s.id} className="relative h-full">...</div>)}
</Carousel>`}
					/>
				</section>

				{/* ══════════════════════════════════════════════ */}
				{/* 15. BREADCRUMB & PAGINATION                    */}
				{/* ══════════════════════════════════════════════ */}
				<section className="bg-white rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-medium text-gray-900 mb-4">
						🧭 Breadcrumb & Pagination
					</h2>
					<div className="flex flex-col gap-6">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Breadcrumb
							</h3>
							<Breadcrumb
								items={[
									{ label: "Trang chủ", href: "/" },
									{
										label: "Điện thoại",
										href: "/dien-thoai",
									},
									{
										label: "Samsung",
										href: "/dien-thoai/samsung",
									},
									{ label: "Samsung Galaxy A56 5G" },
								]}
							/>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
								Pagination
							</h3>
							<div className="flex flex-col gap-3">
								<Pagination
									currentPage={1}
									totalPages={10}
									onPageChange={() => {}}
								/>
								<Pagination
									currentPage={5}
									totalPages={10}
									onPageChange={() => {}}
								/>
								<Pagination
									currentPage={10}
									totalPages={10}
									onPageChange={() => {}}
								/>
								<Pagination
									currentPage={3}
									totalPages={3}
									onPageChange={() => {}}
								/>
							</div>
						</div>
					</div>
					<CodeSnippet
						code={`import { Breadcrumb, Pagination } from "@/components/common";

// Breadcrumb
<Breadcrumb items={[
  { label: "Trang chủ", href: "/" },
  { label: "Điện thoại", href: "/dien-thoai" },
  { label: "Samsung Galaxy A56" },
]} />

// Pagination
<Pagination
  current={1}
  total={50}
  pageSize={10}
  onChange={(page) => console.log(page)}
/>`}
					/>
				</section>

				{/* Footer */}
				<p className="text-center text-xs text-gray-400 pb-4">
					DDV Design System v2.0 — 13 Components | Extracted from
					Figma DDV
				</p>
			</div>
		</div>
	);
}
