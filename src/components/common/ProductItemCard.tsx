import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Popover } from "@/components/common/Popover";
import { formatPrice } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/utils/image";

export interface ProductItemCardProps {
	image?: string;
	name: string;
	href?: string;
	variantName?: string;
	promoText?: string;
	promoBadge?: React.ReactNode;
	price: number;
	originalPrice?: number;
	discount?: string;

	// Slots
	headerAction?: React.ReactNode;
	variantControl?: React.ReactNode;
	quantityControl?: React.ReactNode;
	leftControl?: React.ReactNode; // Checkbox etc
	footerContent?: React.ReactNode; // Addons, Warranty, etc
}

export function ProductItemCard({
	image,
	name,
	href,
	variantName,
	promoText,
	promoBadge,
	price,
	originalPrice,
	discount,
	headerAction,
	variantControl,
	quantityControl,
	leftControl,
	footerContent,
}: ProductItemCardProps) {
	return (
		<div className="flex flex-col bg-white rounded-xl md:rounded-2xl gap-2 md:gap-4 px-2.5 md:px-4 py-2.5 md:py-4">
			{/* Main row: leftControl + image + info */}
			<div className="flex items-start gap-3 md:gap-4">
				{leftControl && <div className="pt-1">{leftControl}</div>}

				{href ? (
					<Link
						href={href}
						className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 block"
					>
						<Image
							src={image || FALLBACK_IMAGE}
							alt={name}
							width={80}
							height={80}
							className="w-full h-full object-cover"
							loading="lazy"
						/>
					</Link>
				) : (
					<div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
						<Image
							src={image || FALLBACK_IMAGE}
							alt={name}
							width={80}
							height={80}
							className="w-full h-full object-cover"
							loading="lazy"
						/>
					</div>
				)}

				<div className="flex-1 flex flex-col min-w-0 gap-1">
					<div className="flex items-start justify-between gap-2 md:gap-4">
						<div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
							{href ? (
								<Link
									href={href}
									className="block min-w-0 text-text-primary font-medium line-clamp-2 md:line-clamp-1 leading-snug text-sm hover:text-blue-500 transition-colors"
								>
									{name}
								</Link>
							) : (
								<h3 className="text-text-primary font-medium line-clamp-2 md:line-clamp-1 leading-snug text-sm">
									{name}
								</h3>
							)}

							{/* Variant Control & Promo Row */}
							{(variantControl ||
								variantName ||
								promoBadge ||
								promoText) && (
								<div className="flex flex-wrap items-center gap-2 min-h-[28px]">
									{variantControl ? (
										<div>{variantControl}</div>
									) : variantName ? (
										<div className="text-gray-500 text-xs">
											{variantName}
										</div>
									) : null}

									{(promoBadge || promoText) && (
										<div className="flex items-center">
											{promoText ? (
												<Popover.Root>
													<Popover.Trigger asChild>
														<div
															className="inline-flex cursor-pointer select-none outline-none"
															role="button"
															tabIndex={0}
														>
															{promoBadge ? (
																promoBadge
															) : (
																<div
																	className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
																	title="Chương trình khuyến mãi"
																>
																	<Gift className="w-3.5 h-3.5" />
																</div>
															)}
														</div>
													</Popover.Trigger>
													<Popover.Portal>
														<Popover.Content
															align="start"
															side="bottom"
															sideOffset={6}
															className="w-max max-w-[240px] md:max-w-[280px] p-2 text-xs text-yellow-900 bg-yellow-50 rounded-lg border border-yellow-200/60 leading-normal shadow-[0_4px_24px_-4px_rgba(234,179,8,0.2)]"
														>
															{promoText}
														</Popover.Content>
													</Popover.Portal>
												</Popover.Root>
											) : (
												promoBadge
											)}
										</div>
									)}
								</div>
							)}
						</div>
						{headerAction && (
							<div className="shrink-0">{headerAction}</div>
						)}
					</div>

					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 flex-wrap min-w-0">
							<span className="font-semibold text-primary-500 text-sm md:text-base leading-tight">
								{formatPrice(price)}
							</span>
							{originalPrice && originalPrice > price ? (
								<>
									<span className="line-through text-gray-400 font-medium text-xs md:text-sm leading-tight">
										{formatPrice(originalPrice)}
									</span>
									{discount && (
										<span className="font-medium text-red-400 text-xs leading-tight">
											{discount}
										</span>
									)}
								</>
							) : null}
						</div>
						{quantityControl && (
							<div className="shrink-0">{quantityControl}</div>
						)}
					</div>
				</div>
			</div>

			{footerContent && footerContent}
		</div>
	);
}
