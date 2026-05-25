"use client";

import { Check, Gift, Minus, Phone, Plus, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { setCheckoutIntent } from "@/lib/checkout-intent";
import { CONTACT } from "@/lib/constants/site-info";
import { useCartStore } from "@/store/useCartStore";
import type { SimpleProductDetail } from "@/types/simple-product";
import ContactFormModal from "./contact-form-modal.client";

interface ProductBuyBoxProps {
	product: SimpleProductDetail;
	displayPrice: number;
	originalPrice: number;
	formatPrice: (n: number) => string;
}

const HOTLINE_DISPLAY = CONTACT.hotlineDisplay;
const HOTLINE_TEL = CONTACT.hotlineTel;

const COMMITMENTS = [
	{
		title: "Cam kết chính hãng",
		icon: ShieldCheck,
		items: [
			"Sản phẩm chính hãng – đầy đủ CO/CQ theo yêu cầu",
			"Đầy đủ phụ kiện theo nhà sản xuất, hướng dẫn kỹ thuật",
			"Xuất hoá đơn VAT, hỗ trợ đổi trả theo quy định",
		],
	},
	{
		title: "Bảo hành & Hỗ trợ",
		icon: Gift,
		items: [
			"Bảo hành chính hãng theo tiêu chuẩn nhà sản xuất",
			"Hỗ trợ tư vấn lắp đặt và vận hành miễn phí",
			"Kỹ thuật phản hồi nhanh trong thời hạn bảo hành",
		],
	},
];

export default function ProductBuyBox({
	product,
	displayPrice,
	originalPrice,
	formatPrice,
}: ProductBuyBoxProps) {
	const [quantity, setQuantity] = useState(1);
	const [bumpKey, setBumpKey] = useState(0);
	const [contactOpen, setContactOpen] = useState(false);
	const addItem = useCartStore((s) => s.addItem);

	const showPrice = product.showPrice !== false && displayPrice > 0;
	const hasDiscount = originalPrice > 0 && originalPrice > displayPrice;

	function changeQuantity(delta: number) {
		setQuantity((q) => Math.max(1, q + delta));
	}

	function buildCartItem() {
		return {
			productId: String(product.id),
			variantId: product.sku,
			sku: product.sku,
			name: product.name,
			price: displayPrice,
			originalPrice: hasDiscount ? originalPrice : undefined,
			quantity,
			thumbnailUrl: product.thumbnailUrl ?? undefined,
			image: product.thumbnailUrl ?? undefined,
			slug: product.slug,
			selected: true,
		};
	}

	function handleBuyNow() {
		setCheckoutIntent({
			source: "buy-now",
			items: [{ productId: Number(product.id), quantity }],
		});
		window.location.href = "/checkout";
	}

	function handleAddToCart() {
		addItem(buildCartItem());
		setBumpKey((k) => k + 1);
		toast.success("Đã thêm vào giỏ hàng");
	}

	return (
		<div className="space-y-5">
			{/* Price */}
			<div className="mb-3">
				{showPrice ? (
					<>
						<div className="text-sm text-gray-600">Giá bán từ</div>
						<div className="flex items-baseline gap-3 mt-0.5">
							<span className="text-3xl font-bold text-[var(--color-text-price)]">
								{formatPrice(displayPrice)}
							</span>
							{hasDiscount && (
								<span className="text-sm text-gray-400 line-through">
									{formatPrice(originalPrice)}
								</span>
							)}
						</div>
					</>
				) : (
					<span className="text-2xl font-semibold text-yellow-500">
						Liên hệ
					</span>
				)}
				<div className="mt-3 text-sm">
					<span className="text-gray-600">Tình trạng: </span>
					<span className="font-medium text-green-600">Còn hàng</span>
				</div>
			</div>

			{/* Commitment cards */}
			<div className="space-y-3">
				{COMMITMENTS.map(({ title, icon: Icon, items }) => (
					<div
						key={title}
						className="rounded-lg border border-gray-200 p-3 md:p-4"
					>
						<div className="flex items-center gap-2 mb-2">
							<span className="flex size-7 items-center justify-center rounded-full bg-primary-600 text-white">
								<Icon className="size-4" />
							</span>
							<h3 className="font-semibold text-gray-900">
								{title}
							</h3>
						</div>
						<ul className="space-y-1.5">
							{items.map((line) => (
								<li
									key={line}
									className="flex items-start gap-2 text-sm text-gray-700"
								>
									<Check className="size-4 shrink-0 mt-0.5 text-gray-500" />
									<span>{line}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			{/* Quantity + CTA */}
			<div className="flex items-stretch gap-2">
				<div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
					<button
						type="button"
						onClick={() => changeQuantity(-1)}
						disabled={quantity <= 1}
						className="flex h-12 w-9 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
						aria-label="Giảm số lượng"
					>
						<Minus className="size-4" />
					</button>
					<span className="min-w-10 text-center text-base font-semibold">
						{quantity}
					</span>
					<button
						type="button"
						onClick={() => changeQuantity(1)}
						className="flex h-12 w-9 items-center justify-center text-gray-600 hover:bg-gray-50"
						aria-label="Tăng số lượng"
					>
						<Plus className="size-4" />
					</button>
				</div>

				<button
					type="button"
					onClick={handleBuyNow}
					className="flex-1 rounded-lg bg-red-500 px-6 text-base font-bold uppercase tracking-wide text-white hover:bg-red-600 transition-colors"
				>
					Mua ngay
				</button>

				<div className="relative">
					<button
						type="button"
						onClick={handleAddToCart}
						aria-label="Thêm vào giỏ hàng"
						className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
					>
						<ShoppingCart
							key={`cart-icon-${bumpKey}`}
							className={`size-5 ${bumpKey > 0 ? "animate-cart-bump" : ""}`}
						/>
					</button>
					{bumpKey > 0 && (
						<span
							key={`plus-one-${bumpKey}`}
							className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2 text-xs font-bold text-red-500 animate-cart-plus-one"
							aria-hidden
						>
							+1
						</span>
					)}
				</div>
			</div>

			{/* Leave info button */}
			<button
				type="button"
				onClick={() => setContactOpen(true)}
				className="w-full rounded-lg border border-primary-500 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-500 hover:text-white transition-colors"
			>
				Để lại thông tin đặt hàng
			</button>

			<ContactFormModal
				open={contactOpen}
				onClose={() => setContactOpen(false)}
				productId={Number(product.id)}
				productName={product.name}
			/>

			{/* Hotline */}
			<div className="text-sm text-gray-700">
				Gọi{" "}
				<a
					href={`tel:${HOTLINE_TEL}`}
					className="font-bold text-red-500 hover:underline inline-flex items-center gap-1"
				>
					<Phone className="size-3.5" />
					{HOTLINE_DISPLAY}
				</a>{" "}
				để được tư vấn (Miễn phí)
			</div>
		</div>
	);
}
