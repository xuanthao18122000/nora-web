import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils/image";
import Button from "./Button";

interface FlashSaleCardProps {
	name: string;
	price: string;
	originalPrice?: string;
	discount?: string;
	image?: string;
	soldCount?: number;
	totalCount?: number;
	isUpcoming?: boolean;
	onBuyClick?: () => void;
	isBuying?: boolean;
	href?: string;
}

/** Default props for FlashSaleCard when no quota data is available */
const FLASH_CARD_DEFAULTS = {
	/** soldCount=0: no slots consumed by default */
	soldCount: 0,
	/** totalCount=-1: treat as unlimited when no quota configured */
	totalCount: -1,
} as const;

export default function FlashSaleCard({
	name,
	price,
	originalPrice,
	discount,
	image,
	soldCount = FLASH_CARD_DEFAULTS.soldCount,
	totalCount = FLASH_CARD_DEFAULTS.totalCount,
	isUpcoming = false,
	onBuyClick,
	isBuying = false,
	href,
}: FlashSaleCardProps) {
	const isUnlimited = totalCount < 0;
	// Use Math.max to prevent negative remaining slots
	const remaining = Math.max(0, totalCount - soldCount);
	const progress = isUnlimited
		? 100
		: totalCount > 0
			? (remaining / totalCount) * 100
			: 0;
	const isSoldOut = !isUnlimited && totalCount > 0 && remaining <= 0;

	// Is this a buyable product right now?
	const canBuy = onBuyClick && !isSoldOut && !isUpcoming;

	return (
		<div className="relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-[var(--shadow-card)] transition-shadow duration-200 w-full h-full gap-1.5 md:gap-2 p-1.5 md:p-2 group/flash-card">
			{href && (
				<Link
					href={href}
					className="absolute inset-0 z-0"
					aria-label={name}
				/>
			)}
			{/* Image */}
			<div className="relative flex items-center justify-center px-1.5 md:px-2 aspect-square pointer-events-none">
				{image ? (
					<Image
						src={getImageUrl(image)}
						alt={name}
						width={200}
						height={200}
						className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover/flash-card:-translate-y-2"
					/>
				) : (
					<div className="w-full h-full bg-gray-100 rounded-xs flex items-center justify-center">
						<svg
							aria-hidden="true"
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
							className="text-gray-300"
						>
							<rect
								width="48"
								height="48"
								rx="8"
								fill="currentColor"
								fillOpacity="0.3"
							/>
							<path
								d="M18 30L22 26L25 29L30 24L34 30H18Z"
								fill="currentColor"
							/>
							<circle cx="21" cy="21" r="3" fill="currentColor" />
						</svg>
					</div>
				)}

				{/* Sold out overlay */}
				{isSoldOut && (
					<div className="absolute inset-x-2 bottom-2 z-10 flex h-6 md:h-8 items-center justify-center bg-gray-900/60 text-white rounded-xs">
						<span className="text-xs md:text-sm font-semibold tracking-wider uppercase">
							HẾT SUẤT
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex flex-col gap-1.5 md:gap-2 flex-1 pointer-events-none">
				{/* Product name */}
				<p className="text-xs md:text-sm font-normal text-gray-900 line-clamp-2 min-h-[32px] md:min-h-[40px]">
					{name}
				</p>

				{/* Price — fixed height so cards align even without originalPrice */}
				<div className="flex flex-col gap-0.5">
					<span className="text-sm md:text-md font-semibold text-primary-600">
						{price}
					</span>
					<div className="flex items-center gap-2 min-h-5 md:min-h-[22px]">
						{originalPrice && (
							<>
								<span className="text-xs md:text-sm font-medium text-gray-400 line-through">
									{originalPrice}
								</span>
								{discount && (
									<span className="text-xs md:text-sm font-medium text-red-400">
										{discount}
									</span>
								)}
							</>
						)}
					</div>
				</div>

				{/* Progress bar — only shown when not upcoming */}
				{!isUpcoming && !isSoldOut && (
					<div className="flex flex-col gap-1 mt-auto">
						<div className="relative w-full h-[18px] md:h-5">
							{/* Background Container */}
							<div className="absolute inset-x-0 bottom-0 top-0 left-[3px] md:left-[5px] bg-gray-200 rounded-full overflow-hidden flex items-center pl-4">
								{/* Progress Gradient */}
								<div
									className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 z-0"
									style={{
										width: isSoldOut
											? "100%"
											: `${Math.max(10, progress)}%`,
										background: isSoldOut
											? "var(--color-gray-200, #9CA3AF)"
											: "linear-gradient(90deg, #FFB86A 0%, #FF8904 100%)",
									}}
								/>
								{/* Inner Text */}
								<span
									className={`relative z-10 text-[10px] md:text-xs font-medium whitespace-nowrap leading-none flex-1 text-center ${isSoldOut ? "text-gray-900" : "text-gray-900 drop-shadow-sm"}`}
								>
									{isUnlimited
										? "Săn deal ngay!"
										: `Còn ${remaining}/${totalCount} suất`}
								</span>
							</div>
							{/* Flash Icon */}
							{!isSoldOut && (
								<div className="absolute left-0 bottom-0 z-20 pointer-events-none drop-shadow-md">
									<Image
										src="/flash.svg"
										alt="Flash"
										width={21}
										height={24}
										className="w-4 h-auto md:w-[21px] shrink-0"
									/>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			{/* Buy button */}
			{canBuy ? (
				<Button
					variant="soft"
					color="primary"
					size="xs"
					className="w-full relative z-10 pointer-events-auto"
					onClick={(e: React.MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						onBuyClick();
					}}
				>
					{isBuying ? "Đang xử lý..." : "Mua ngay"}
				</Button>
			) : (
				<Button
					asChild
					variant="soft"
					color="gray"
					size="xs"
					className="w-full relative z-10 pointer-events-auto flex items-center justify-center"
				>
					<Link href={href || "#"}>Xem chi tiết</Link>
				</Button>
			)}
		</div>
	);
}
