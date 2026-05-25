import { Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDiscount, formatPrice } from "@/lib/utils/format";
import type { HrefType } from "@/types/common";
import { getImageUrl } from "../../lib/utils/image";
import { BadgeOnline } from "./Badge";

export interface ProductCardType {
	id: string | number;
	name: string;
	price: number;
	originalPrice?: number;
	discount?: number;
	image?: string;
	imageAlt?: string;
	rating?: number;
	reviewCount?: number;
	href?: HrefType;
	promotionName?: string;
	promotionEndAt?: string;
	promotionQuotaRemaining?: number;
	slug?: string;
	categoryKey?: string;
	listedPrice?: number;
	isInstallmentZero?: boolean;
	createdAt?: string;
}

// Threshold dưới ngưỡng này (VND) coi như price không hợp lệ → ẩn giá niêm yết gạch ngang.
const MIN_STRIKETHROUGH_PRICE = 1000;

const getDisplayPricing = (product: ProductCardType) => {
	const listed = product.listedPrice;
	const hasListed = !!listed && listed > 0 && listed > product.price;
	const originalPrice = hasListed ? listed : undefined;
	const discount = originalPrice
		? Math.round((1 - product.price / originalPrice) * 100)
		: undefined;
	return { originalPrice, discount };
};

const isVisibleDiscount = (discount?: number): discount is number =>
	discount != null && discount > 0 && discount < 100;

// ── Root ────────────────────────────────────────────────────────────────
export type ProductCardVariant = "vertical" | "horizontal";

interface ProductCardRootProps {
	href?: HrefType;
	className?: string;
	children: React.ReactNode;
	variant?: ProductCardVariant;
	/**
	 * Rendered OUTSIDE the `<Link>` inside a positioned wrapper.
	 *
	 * Use for destructive / secondary buttons that must NOT:
	 *   • nest inside the `<a>` (HTML validity — interactive content may not
	 *     be nested),
	 *   • trigger the card's navigation,
	 *   • trip document-level click listeners such as NextTopLoader's
	 *     progress bar (those fire on capture phase before React's
	 *     `stopPropagation` can intervene).
	 */
	overlay?: React.ReactNode;
}

const ProductCardRoot = ({
	href,
	className,
	children,
	variant = "vertical",
	overlay,
}: ProductCardRootProps) => {
	const isHorizontal = variant === "horizontal";
	const sizingClass = isHorizontal ? "w-[266px] shrink-0" : `w-full h-full`;

	const card = (
		<div
			className={cn(
				"bg-white border border-gray-200 shadow-none hover:shadow-(--shadow-card-hover) transition-shadow duration-200 h-full",
				"rounded-lg p-2 size-full",
				isHorizontal
					? "flex flex-row gap-1 items-center"
					: "flex flex-col gap-2",
				className,
			)}
		>
			{children}
		</div>
	);

	// Overlay path — link wrapped in a positioned sibling container so the
	// overlay (e.g. a remove button) sits OUTSIDE the `<a>` element.
	if (overlay) {
		return (
			<div
				className={cn("relative block group/product-card", sizingClass)}
			>
				{href ? (
					<Link href={href} className="block size-full">
						{card}
					</Link>
				) : (
					<div className="block size-full">{card}</div>
				)}
				{overlay}
			</div>
		);
	}

	// Default path — backward compatible (Link/div is the root element).
	const wrapperClassName = cn("block group/product-card", sizingClass);
	return href ? (
		<Link href={href} className={wrapperClassName}>
			{card}
		</Link>
	) : (
		<div className={wrapperClassName}>{card}</div>
	);
};

// ── Labels (badges row at top) ──────────────────────────────────────────
const ProductCardLabels = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={cn("flex items-center gap-0.5 min-h-4.5", className)}>
		{children}
	</div>
);

// ── Image ───────────────────────────────────────────────────────────────
interface ProductCardImageProps {
	src?: string;
	alt?: string;
	sizes?: string;
	priority?: boolean;
	className?: string;
	/** Classes for the inner `next/image` (e.g. object-cover for horizontal). */
	imageClassName?: string;
}

const ProductCardImage = ({
	src,
	alt = "Product image",
	sizes = "(max-width: 640px) 44vw, (max-width: 1024px) 22vw, 224px",
	priority,
	className,
	imageClassName,
}: ProductCardImageProps) => (
	<div
		className={cn(
			"aspect-square w-full flex items-center justify-center",
			className,
		)}
	>
		<Image
			src={getImageUrl(src)}
			width={200}
			height={200}
			sizes={sizes}
			priority={priority}
			fetchPriority={priority ? "high" : "auto"}
			alt={alt}
			className={cn(
				"size-full object-contain transition-transform duration-300 ease-out group-hover/product-card:-translate-y-0.5",
				imageClassName,
			)}
		/>
	</div>
);

// ── Content (flex column wrapper for body) ──────────────────────────────
const ProductCardContent = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={cn("flex flex-col gap-2 w-full", className)}>
		{children}
	</div>
);

// ── Name ────────────────────────────────────────────────────────────────
const ProductCardName = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<p
		className={cn(
			"text-sm leading-sm font-normal text-(--color-text-primary) line-clamp-2 min-h-10",
			className,
		)}
	>
		{children}
	</p>
);

// ── Price ───────────────────────────────────────────────────────────────
interface ProductCardPriceProps {
	price: number;
	originalPrice?: number;
	discount?: number;
	className?: string;
	/** Smaller type for horizontal / compact rows (Figma: text-sm, leading-20). */
	compact?: boolean;
}

const ProductCardPrice = ({
	price,
	originalPrice,
	discount,
	className,
	compact,
}: ProductCardPriceProps) => {
	const hasPrice = price > 0;
	const showOriginalPrice =
		hasPrice &&
		originalPrice != null &&
		originalPrice > price &&
		price >= MIN_STRIKETHROUGH_PRICE;
	const showDiscount = isVisibleDiscount(discount);
	return (
		<div className={cn("flex flex-col w-full", className)}>
			<p
				className={cn(
					"font-bold",
					hasPrice ? "text-[var(--color-text-price)]" : "text-yellow-500",
					compact ? "text-sm leading-sm" : "text-md leading-md",
				)}
			>
				{hasPrice ? formatPrice(price) : "Liên hệ"}
			</p>
			<div className="flex items-center gap-2 text-sm leading-sm font-medium min-h-5">
				{showOriginalPrice && (
					<span className="line-through text-gray-400">
						{formatPrice(originalPrice)}
					</span>
				)}
				{showDiscount && (
					<span className="text-red-400">
						{formatDiscount(discount)}
					</span>
				)}
			</div>
		</div>
	);
};

// ── Footer ──────────────────────────────────────────────────────────────
const ProductCardFooter = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div
		className={cn("flex items-center gap-2 h-8 w-full", className)}
	>
		{children}
	</div>
);

// ── Preset (batteries-included shorthand) ───────────────────────────────
export interface ProductCardPresetProps {
	product: ProductCardType;
	className?: string;
	badges?: React.ReactNode;
	promotions?: React.ReactNode;
	offerLink?: React.ReactNode;
	actionButton?: React.ReactNode;
	/** Mark as LCP candidate for above-the-fold images. */
	priority?: boolean;
}

const ProductCardPreset = ({
	product,
	className,
	badges,
	promotions,
	offerLink,
	actionButton,
	priority,
}: ProductCardPresetProps) => {
	const isNew = product.createdAt
		? (Date.now() - new Date(product.createdAt).getTime()) /
				(1000 * 3600 * 24) <=
			45
		: false;

	// Ưu tiên originalPrice/discount đã được mapper truyền vào (acquyhn convention).
	// Fallback sang getDisplayPricing(listedPrice) cho data legacy DDV.
	const fallback = getDisplayPricing(product);
	const originalPrice = product.originalPrice ?? fallback.originalPrice;
	const discount = product.discount ?? fallback.discount;

	return (
		<ProductCardRoot href={product.href} className={className}>
			<ProductCardLabels>
				{badges}
				{product.isInstallmentZero && (
					<span className="text-[10px] leading-xxs uppercase px-1 py-px rounded-[2px] bg-gray-100 text-gray-800 border border-gray-200">
						Trả góp 0%
					</span>
				)}
				{isNew && (
					<span className="text-[10px] leading-xxs uppercase px-1 py-px rounded-[2px] bg-red-500 text-white border border-red-500">
						Mới về
					</span>
				)}
			</ProductCardLabels>
			<ProductCardImage
				src={product.image}
				alt={product.imageAlt ?? product.name}
				priority={priority}
			/>
			<ProductCardContent>
				<div className="min-h-5">
					<div className="w-fit">
						<BadgeOnline>
							{product.price > 0 ? "Online giá sốc" : "Liên hệ giá sốc"}
						</BadgeOnline>
					</div>
				</div>
				<ProductCardName>{product.name}</ProductCardName>
				<ProductCardPrice
					price={product.price}
					originalPrice={originalPrice}
					discount={discount}
				/>
				{offerLink}
			</ProductCardContent>
			{((product.rating ?? 0) > 0 || actionButton) && (
				<ProductCardFooter>
					<div className="flex flex-1 items-center gap-1">
						{(product.rating ?? 0) > 0 && (
							<>
								<Star
									aria-hidden
									className="size-3 text-yellow-400 fill-yellow-400"
								/>
								<span className="text-xs leading-xs font-medium text-gray-600">
									{product.rating}
								</span>
							</>
						)}
					</div>
					{actionButton}
				</ProductCardFooter>
			)}
		</ProductCardRoot>
	);
};

// ── Horizontal Preset ───────────────────────────────────────────────────
export interface ProductCardHorizontalPresetProps {
	product: ProductCardType;
	className?: string;
	onRemove?: () => void;
	actionButton?: React.ReactNode;
}

const ProductCardHorizontalPreset = ({
	product,
	className,
	onRemove,
	actionButton,
}: ProductCardHorizontalPresetProps) => {
	const fallback = getDisplayPricing(product);
	const originalPrice = product.originalPrice ?? fallback.originalPrice;
	const discount = product.discount ?? fallback.discount;

	const removeButton = onRemove ? (
		<button
			type="button"
			aria-label="Xóa khỏi danh sách"
			onClick={onRemove}
			className="absolute top-[9px] right-[7px] z-10 flex size-5 items-center justify-center rounded-full bg-gray-300 p-1 text-gray-700 transition-colors hover:bg-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
		>
			<X aria-hidden className="size-3 text-white" />
		</button>
	) : null;

	return (
		<ProductCardRoot
			href={product.href}
			variant="horizontal"
			className={className}
			overlay={removeButton}
		>
			<ProductCardImage
				src={product.image}
				alt={product.imageAlt ?? product.name}
				sizes="70px"
				className="size-[70px] shrink-0 aspect-auto overflow-hidden p-0"
				imageClassName="object-cover"
			/>
			<ProductCardContent className="gap-0.5 min-w-0 pr-6">
				<ProductCardName className="leading-5">
					{product.name}
				</ProductCardName>
				<ProductCardPrice
					price={product.price}
					originalPrice={originalPrice}
					discount={discount}
					compact
				/>
			</ProductCardContent>
			{actionButton}
		</ProductCardRoot>
	);
};

// ── Compound export ─────────────────────────────────────────────────────
export const ProductCard = Object.assign(ProductCardRoot, {
	Labels: ProductCardLabels,
	Image: ProductCardImage,
	Content: ProductCardContent,
	Name: ProductCardName,
	Price: ProductCardPrice,
	Footer: ProductCardFooter,
	Preset: ProductCardPreset,
	HorizontalPreset: ProductCardHorizontalPreset,
});
