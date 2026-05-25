"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";

export type HeroBannerImage = {
	id: string | number;
	src: string;
	alt?: string | null;
	isVideo?: boolean;
};

interface HeroBannerProps {
	images: HeroBannerImage[];
	productName: string;
	resetKey?: string;
	/** CSS aspect-ratio, e.g. "16 / 9" or "1 / 1" */
	mainAspect?: string;
	/** Thumb display size in px */
	thumbSize?: number;
}

export default function HeroBanner({
	images,
	productName,
	resetKey,
	mainAspect = "1 / 1",
	thumbSize = 64,
}: HeroBannerProps) {
	const [mainRef, mainApi] = useEmblaCarousel({ loop: false });
	const [thumbRef, thumbApi] = useEmblaCarousel({
		containScroll: "keepSnaps",
		dragFree: true,
	});

	const [activeIndex, setActiveIndex] = useState(0);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	// Update state when carousel scrolls
	const onSelect = useCallback(() => {
		if (!mainApi) return;
		const idx = mainApi.selectedScrollSnap();
		setActiveIndex(idx);
		setCanPrev(mainApi.canScrollPrev());
		setCanNext(mainApi.canScrollNext());

		// Scroll thumb into view
		if (thumbApi) {
			thumbApi.scrollTo(idx);
		}
	}, [mainApi, thumbApi]);

	useEffect(() => {
		if (!mainApi) return;
		mainApi.on("select", onSelect);
		onSelect();
		return () => {
			mainApi.off("select", onSelect);
		};
	}, [mainApi, onSelect]);

	// Reset on variant/image change
	useEffect(() => {
		if (!mainApi) return;
		mainApi.scrollTo(0, true);
		setActiveIndex(0);
	}, [resetKey, mainApi]);

	const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi]);
	const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi]);

	const selectThumb = useCallback(
		(idx: number) => {
			mainApi?.scrollTo(idx);
		},
		[mainApi],
	);

	if (!images || images.length === 0) return null;

	const showNav = images.length > 1;

	return (
		<div className="flex flex-col gap-2">
			{/* Main image carousel */}
			<div className="relative overflow-hidden md:overflow-visible">
				{/* Viewport */}
				<div
					ref={mainRef}
					className="overflow-hidden rounded-lg bg-white mx-auto w-full"
					style={{ aspectRatio: mainAspect, maxHeight: "60vh" }}
				>
					<div className="flex h-full touch-pan-y">
						{images.map((img, idx) => (
							<div
								key={img.id}
								className="relative h-full min-w-0 shrink-0 grow-0 basis-full p-2"
							>
								{img.src ? (
									<Image
										src={getImageUrl(img.src)}
										alt={
											img.alt ||
											`${productName} - ảnh ${idx + 1}`
										}
										fill
										className="object-contain object-center"
										sizes="(max-width: 768px) 50vw, (max-width: 1024px) 60vw, 668px"
										priority={idx === 0}
										loading={idx === 0 ? "eager" : "lazy"}
										fetchPriority={
											idx === 0 ? "high" : "auto"
										}
									/>
								) : (
									<div className="h-full w-full bg-gray-100" />
								)}

								{img.isVideo && (
									<div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
										<Play
											className="size-3.5 text-white"
											aria-hidden
										/>
										<span className="text-xs text-white">
											Video
										</span>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Prev / Next arrows */}
				{showNav && (
					<>
						<button
							type="button"
							aria-label="Ảnh trước"
							onClick={scrollPrev}
							disabled={!canPrev}
							className={cn(
								"absolute left-1 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white/90 shadow transition-opacity",
								"md:-left-4",
								canPrev
									? "opacity-100 hover:bg-white"
									: "pointer-events-none opacity-30",
							)}
						>
							<ChevronLeft className="size-4 text-gray-700" />
						</button>
						<button
							type="button"
							aria-label="Ảnh tiếp"
							onClick={scrollNext}
							disabled={!canNext}
							className={cn(
								"absolute right-1 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white/90 shadow transition-opacity",
								"md:-right-4",
								canNext
									? "opacity-100 hover:bg-white"
									: "pointer-events-none opacity-30",
							)}
						>
							<ChevronRight className="size-4 text-gray-700" />
						</button>
					</>
				)}
			</div>

			{/* Thumbnail strip — all screen sizes */}
			{showNav && (
				<div ref={thumbRef} className="overflow-hidden mt-1 px-1">
					<div className="flex gap-2 pb-2">
						{images.map((img, idx) => {
							const isActive = idx === activeIndex;
							return (
								<button
									key={img.id}
									type="button"
									onClick={() => selectThumb(idx)}
									aria-label={`Xem ảnh ${idx + 1}`}
									className={cn(
										"relative shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all duration-300",
										isActive
											? "border-primary-500 shadow-sm opacity-100"
											: "border-transparent opacity-60 hover:border-gray-200 hover:opacity-100",
									)}
									style={{
										width: thumbSize,
										height: thumbSize,
									}}
								>
									<Image
										src={getImageUrl(img.src)}
										alt=""
										fill
										sizes={`${thumbSize}px`}
										className="object-contain p-1.5"
									/>
									{img.isVideo && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/20">
											<Play
												className="size-3 text-white"
												aria-hidden
											/>
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
