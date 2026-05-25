import Image from "next/image";
import { getImageUrl } from "@/lib/utils/image";

interface RecentlyViewedCardProps {
	name: string;
	price: string;
	imageUrl?: string;
	onRemove?: () => void;
	onClick?: () => void;
	className?: string;
}

/**
 * Recently Viewed Card — matches Figma `home-item-recently-viewed`
 *
 * HORIZONTAL layout: image left (70×70) + text right (fill) + close button (absolute top-right)
 * Padding: 8px | Gap: 4px | Radius: 8px | Border: 1px #E5E7EB
 * Price color: #BE1E2D | Close button bg: #D1D5DC (filled grey)
 */
export default function RecentlyViewedCard({
	name,
	price,
	imageUrl,
	onRemove,
	onClick,
	className = "",
}: RecentlyViewedCardProps) {
	return (
		<article
			className={`relative flex items-center gap-1 p-2 bg-white rounded-lg border border-[#E5E7EB] cursor-pointer hover:shadow-sm transition-shadow shrink-0 ${className}`}
			onClick={onClick}
			style={{ minWidth: 240, maxWidth: 288 }}
		>
			{/* Image — 70×70 fixed */}
			<div className="w-[70px] h-[70px] bg-gray-50 rounded overflow-hidden shrink-0">
				{imageUrl ? (
					<Image
						src={getImageUrl(imageUrl)}
						alt={name}
						width={70}
						height={70}
						className="w-full h-full object-contain"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-300">
						<svg
							aria-hidden="true"
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="M21 15l-5-5L5 21" />
						</svg>
					</div>
				)}
			</div>

			{/* Product info — pr-6 to avoid overlap with absolute close button */}
			<div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-6">
				<p className="text-sm font-normal text-[#101828] line-clamp-2 leading-[1.43]">
					{name}
				</p>
				<span className="text-sm font-semibold text-[#BE1E2D]">
					{price}
				</span>
			</div>

			{/* Remove button — absolute top-right, grey filled circle */}
			{onRemove && (
				<button
					type="button"
					aria-label={`Xoá ${name} khỏi lịch sử`}
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					className="absolute top-2.5 right-2 flex items-center justify-center rounded-full bg-[#D1D5DC] hover:bg-[#9DA3AE] transition-colors p-1"
				>
					{/* 12×12 X icon */}
					<svg
						aria-hidden="true"
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="#364153"
						strokeWidth="1.5"
						strokeLinecap="round"
					>
						<path d="M9 3L3 9M3 3l6 6" />
					</svg>
				</button>
			)}
		</article>
	);
}
