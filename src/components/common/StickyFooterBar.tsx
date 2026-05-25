import { Button } from "@/components/common/Button";
import { formatPrice } from "@/lib/utils";

// ── Gift icon ─────────────────────────────────────────────────────────────
function GiftIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="20 12 20 22 4 22 4 12" />
			<rect x="2" y="7" width="20" height="5" />
			<line x1="12" y1="22" x2="12" y2="7" />
			<path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
			<path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
		</svg>
	);
}

// ── Props ─────────────────────────────────────────────────────────────────
export interface StickyFooterBarProps {
	/** Tổng tiền hiển thị */
	total: number;
	/** Số tiền tiết kiệm (ẩn khi = 0) */
	savedAmount?: number;
	/** Số sản phẩm được chọn */
	selectedCount: number;
	/** Label nút CTA */
	ctaLabel: string;
	/** Kích thước nút CTA */
	ctaSize?: "xs" | "sm" | "md";
	/** Disabled nút CTA */
	disabled?: boolean;
	/** Loading nút CTA */
	loading?: boolean;
	/** Tooltip khi nút bị vô hiệu */
	ctaTitle?: string;
	/** Callback khi click nút CTA */
	onCta: () => void;
	/** Số quà tặng hiển thị bên trái */
	giftCount?: number;
	/** Callback khi click quà tặng (undefined = ẩn onClick, vẫn hiện nút) */
	onGiftClick?: () => void;
	/** Cảnh báo đặc biệt thay thế "Tiết kiệm" */
	warningText?: string;
	/** Label nút phụ (ví dụ: "Trả góp") */
	secondaryCtaLabel?: string;
	/** Callback khi click nút phụ */
	onSecondaryCta?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────
export function StickyFooterBar({
	total,
	savedAmount = 0,
	selectedCount,
	ctaLabel,
	ctaSize = "md",
	disabled = false,
	loading = false,
	ctaTitle,
	onCta,
	giftCount,
	onGiftClick,
	warningText,
	secondaryCtaLabel,
	onSecondaryCta,
}: StickyFooterBarProps) {
	return (
		<div className="sticky bottom-4 left-0 right-0 z-40 mt-8">
			<div className="mx-auto max-w-[800px]">
				{/* ─── Mobile: price row + full-width CTAs row ─── */}
				<div className="flex flex-col gap-1.5 rounded-t-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-[0px_-3px_16px_0px_rgba(0,0,0,0.08)] md:hidden">
					{/* Row 1: price info */}
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-medium leading-5 text-gray-900">
							Tổng tiền
						</span>
						<div className="flex items-baseline gap-2">
							{warningText ? (
								<span className="text-[11px] font-medium text-amber-500 animate-pulse whitespace-nowrap">
									{warningText}
								</span>
							) : savedAmount > 0 ? (
								<span className="text-[11px] text-gray-600 whitespace-nowrap">
									Tiết kiệm{" "}
									<span className="font-medium text-primary-500">
										{formatPrice(savedAmount)}
									</span>
								</span>
							) : null}
							<span className="text-base font-bold leading-6 text-primary-500 whitespace-nowrap">
								{formatPrice(total)}
							</span>
						</div>
					</div>

					{/* Row 2: CTAs — each 1/2 width */}
					<div className="flex items-center gap-2">
						{secondaryCtaLabel && onSecondaryCta && (
							<Button
								variant="bordered"
								color="primary"
								size={ctaSize}
								onClick={onSecondaryCta}
								disabled={disabled}
								className="flex-1 whitespace-nowrap rounded-lg!"
							>
								{secondaryCtaLabel}
							</Button>
						)}
						<Button
							variant="filled"
							color="primary"
							size={ctaSize}
							onClick={onCta}
							disabled={disabled}
							loading={loading}
							title={ctaTitle}
							className="flex-1 whitespace-nowrap rounded-lg! font-medium"
						>
							{ctaLabel}
						</Button>
					</div>
				</div>

				{/* ─── Desktop: original 1-row layout ─── */}
				<div className="hidden items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0px_-3px_16px_0px_rgba(0,0,0,0.08)] md:flex">
					<button
						type="button"
						onClick={onGiftClick}
						className="flex shrink-0 cursor-pointer flex-col items-center gap-1 rounded-full px-3 py-1.5 text-gray-600 transition-colors hover:bg-primary-50 hover:text-blue-500"
						aria-label="Xem quà tặng"
					>
						<GiftIcon />
						<span className="whitespace-nowrap text-xs">
							{giftCount ?? selectedCount} Quà tặng
						</span>
					</button>

					<div className="flex flex-1 items-center justify-end gap-3 min-w-0">
						<div className="flex flex-col items-end shrink-0">
							<span className="text-base font-bold leading-snug text-primary-500 whitespace-nowrap">
								{formatPrice(total)}
							</span>
							{warningText ? (
								<span className="text-[10px] font-medium text-amber-500 animate-pulse whitespace-nowrap">
									{warningText}
								</span>
							) : savedAmount > 0 ? (
								<div className="flex flex-row items-center gap-1 whitespace-nowrap mt-0.5">
									<span className="text-xs text-gray-600">
										Tiết kiệm
									</span>
									<span className="text-xs font-medium text-primary-500">
										{formatPrice(savedAmount)}
									</span>
								</div>
							) : null}
						</div>

						{secondaryCtaLabel && onSecondaryCta && (
							<Button
								variant="bordered"
								color="primary"
								size={ctaSize}
								onClick={onSecondaryCta}
								disabled={disabled}
								className="shrink-0 whitespace-nowrap rounded-xl! px-4"
							>
								{secondaryCtaLabel}
							</Button>
						)}
						<Button
							variant="filled"
							color="primary"
							size={ctaSize}
							onClick={onCta}
							disabled={disabled}
							loading={loading}
							title={ctaTitle}
							className="shrink-0 whitespace-nowrap rounded-xl! px-5"
						>
							{ctaLabel}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
