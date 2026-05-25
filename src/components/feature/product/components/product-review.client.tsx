"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ReviewSummary } from "@/types/review";
import ReviewFormModal from "./review-form-modal.client";

// ── Sub-components ───────────────────────────────────────────

function StarIcons({ rating, size = 20 }: { rating: number; size?: number }) {
	return (
		<span className="inline-flex items-center gap-0.5">
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					size={size}
					aria-hidden="true"
					className={cn(
						i < rating
							? "fill-yellow-400 text-yellow-400"
							: "fill-gray-200 text-gray-200",
					)}
				/>
			))}
		</span>
	);
}

function RatingBar({
	stars,
	count,
	total,
}: {
	stars: number;
	count: number;
	total: number;
}) {
	const pct = total > 0 ? (count / total) * 100 : 0;
	return (
		<div className="flex min-w-0 items-center gap-2">
			<span className="flex w-8 shrink-0 items-center gap-0.5 text-xs text-gray-700 sm:w-10 sm:text-sm">
				{stars}
				<Star
					size={14}
					aria-hidden="true"
					className="fill-yellow-400 text-yellow-400"
				/>
			</span>
			<div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100">
				<div
					className="h-full rounded-full bg-primary-500 transition-[width] duration-300"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className="w-18 shrink-0 text-right text-xs text-gray-500 sm:w-20 sm:text-sm">
				{count} đánh giá
			</span>
		</div>
	);
}

// ── Main Component ───────────────────────────────────────────

interface ProductReviewProps {
	productId: string;
	productName: string;
	reviewSummary: ReviewSummary;
}

export default function ProductReview({
	productId,
	productName,
	reviewSummary,
}: ProductReviewProps) {
	const [reviewModalOpen, setReviewModalOpen] = useState(false);

	const {
		avgRating,
		reviewCount,
		rating5Count,
		rating4Count,
		rating3Count,
		rating2Count,
		rating1Count,
	} = reviewSummary;

	const ratingDistribution = [
		{ stars: 5, count: rating5Count },
		{ stars: 4, count: rating4Count },
		{ stars: 3, count: rating3Count },
		{ stars: 2, count: rating2Count },
		{ stars: 1, count: rating1Count },
	];

	const avgRatingNum = avgRating ? Number(avgRating) : 0;
	const hasReviews = reviewCount > 0;

	return (
		<section className="rounded-2xl bg-white p-2 md:p-4">
			{/* Header */}
			<h2 className="text-base font-medium leading-snug text-text-primary wrap-break-word">
				Đánh giá {productName}
			</h2>

			{/* Review Summary — only when reviews exist */}
			{hasReviews ? (
				<div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Left: score */}
					<div className="flex flex-col items-center justify-center gap-1">
						<span className="text-[32px] font-semibold leading-9 text-text-primary sm:text-[40px] sm:leading-5xl">
							{avgRatingNum.toFixed(1)}
						</span>
						<span className="text-sm text-gray-500">
							{reviewCount} lượt đánh giá
						</span>
						<StarIcons rating={Math.round(avgRatingNum)} />
						<button
							type="button"
							onClick={() => setReviewModalOpen(true)}
							className="mt-2 w-full max-w-[220px] rounded-lg bg-primary-500 px-3 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:w-auto sm:max-w-none"
						>
							Viết đánh giá
						</button>
					</div>

					{/* Right: distribution bars */}
					<div className="col-span-1 flex flex-col justify-center gap-2 md:col-span-2">
						{ratingDistribution.map((r) => (
							<RatingBar
								key={r.stars}
								stars={r.stars}
								count={r.count}
								total={reviewCount}
							/>
						))}
					</div>
				</div>
			) : (
				<div className="mt-4 flex w-full flex-col items-center gap-4 px-1 py-6 sm:px-0">
					<Image
						src="/review-empty.svg"
						alt=""
						width={140}
						height={140}
						className="h-auto w-[min(140px,40vw)] max-w-full"
					/>
					<p className="max-w-md text-center text-sm leading-relaxed text-gray-500">
						Chưa có đánh giá của khách hàng về sản phẩm này!
					</p>
					<button
						type="button"
						onClick={() => setReviewModalOpen(true)}
						className="w-full max-w-xs rounded-lg bg-primary-500 px-3 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:w-auto sm:max-w-none"
					>
						Viết đánh giá
					</button>
				</div>
			)}

			<ReviewFormModal
				productId={productId}
				open={reviewModalOpen}
				onOpenChange={setReviewModalOpen}
				onSuccess={() => undefined}
			/>
		</section>
	);
}
