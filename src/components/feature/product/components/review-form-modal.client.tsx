"use client";

import { Star, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/common/Dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/common/Drawer";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";

interface ReviewFormModalProps {
	productId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

function StarRatingInput({
	value,
	onChange,
	ariaLabelledby,
}: {
	value: number;
	onChange: (rating: number) => void;
	ariaLabelledby?: string;
}) {
	const [hovered, setHovered] = useState(0);

	return (
		<div
			role="group"
			aria-labelledby={ariaLabelledby}
			className="flex items-center gap-1"
		>
			{Array.from({ length: 5 }, (_, i) => {
				const starValue = i + 1;
				const filled = starValue <= (hovered || value);
				return (
					<button
						key={starValue}
						type="button"
						aria-label={`${starValue} sao`}
						className="flex size-11 items-center justify-center rounded-lg outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
						onClick={() => onChange(starValue)}
						onMouseEnter={() => setHovered(starValue)}
						onMouseLeave={() => setHovered(0)}
					>
						<Star
							size={28}
							aria-hidden="true"
							className={cn(
								"transition-colors duration-150",
								filled
									? "fill-yellow-400 text-yellow-400"
									: "fill-gray-200 text-gray-200",
							)}
						/>
					</button>
				);
			})}
		</div>
	);
}

function ReviewForm({
	productId,
	onOpenChange,
	onSuccess,
}: Omit<ReviewFormModalProps, "open">) {
	const [rating, setRating] = useState(0);
	const [customerName, setCustomerName] = useState("");
	const [content, setContent] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [ratingError, setRatingError] = useState(false);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (rating === 0) {
				setRatingError(true);
				return;
			}

			// Acquyhn chưa có API tạo review — chỉ thông báo thành công local.
			// Khi BE có endpoint thật sẽ gắn lại fetch tại đây.
			setSubmitting(true);
			try {
				toast.success("Cảm ơn bạn — chúng tôi đã ghi nhận đánh giá");
				onSuccess();
				onOpenChange(false);
			} finally {
				setSubmitting(false);
			}
		},
		[rating, onSuccess, onOpenChange],
	);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{/* Star rating */}
			<div>
				<p
					id="review-rating-label"
					className="mb-1 block text-sm font-medium text-gray-700"
				>
					Đánh giá của bạn <span className="text-red-500">*</span>
				</p>
				<StarRatingInput
					value={rating}
					ariaLabelledby="review-rating-label"
					onChange={(v) => {
						setRating(v);
						setRatingError(false);
					}}
				/>
				{ratingError && (
					<p className="mt-1 text-sm text-red-500">
						Vui lòng chọn số sao đánh giá
					</p>
				)}
			</div>

			{/* Name */}
			<div>
				<label
					htmlFor="review-name"
					className="mb-1 block text-sm font-medium text-gray-700"
				>
					Tên của bạn
				</label>
				<input
					id="review-name"
					type="text"
					value={customerName}
					onChange={(e) => setCustomerName(e.target.value)}
					placeholder="Tên của bạn"
					className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors duration-150 placeholder:text-gray-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
				/>
			</div>

			{/* Content */}
			<div>
				<label
					htmlFor="review-content"
					className="mb-1 block text-sm font-medium text-gray-700"
				>
					Nội dung đánh giá
				</label>
				<textarea
					id="review-content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
					rows={4}
					className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors duration-150 placeholder:text-gray-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
				/>
			</div>

			{/* Submit */}
			<Button
				type="submit"
				variant="filled"
				color="primary"
				size="md"
				loading={submitting}
				className="w-full sm:w-auto sm:self-end"
			>
				Gửi đánh giá
			</Button>
		</form>
	);
}

export default function ReviewFormModal({
	productId,
	open,
	onOpenChange,
	onSuccess,
}: ReviewFormModalProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				<DrawerContent className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white">
					<DrawerHeader className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
						<DrawerTitle className="text-base font-medium text-gray-900">
							Viết đánh giá
						</DrawerTitle>
						<DrawerClose asChild>
							<button
								type="button"
								aria-label="Đóng"
								className="flex size-8 items-center justify-center rounded-lg text-gray-500 outline-none transition-colors duration-150 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
							>
								<X size={20} aria-hidden="true" />
							</button>
						</DrawerClose>
					</DrawerHeader>
					<div className="overflow-y-auto overscroll-contain px-4 py-4">
						<ReviewForm
							productId={productId}
							onOpenChange={onOpenChange}
							onSuccess={onSuccess}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md" showCloseButton={false}>
				<DialogHeader className="flex flex-row items-center justify-between">
					<DialogTitle>Viết đánh giá</DialogTitle>
					<button
						type="button"
						aria-label="Đóng"
						onClick={() => onOpenChange(false)}
						className="flex size-8 items-center justify-center rounded-lg text-gray-500 outline-none transition-colors duration-150 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
					>
						<X size={20} aria-hidden="true" />
					</button>
				</DialogHeader>
				<ReviewForm
					productId={productId}
					onOpenChange={onOpenChange}
					onSuccess={onSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
