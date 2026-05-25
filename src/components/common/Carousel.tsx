"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

import { cn } from "@/lib/utils/cn";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselCompoundProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugin;
	orientation?: "horizontal" | "vertical";
	setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: ReturnType<typeof useEmblaCarousel>[1];
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
} & CarouselCompoundProps;

/* ═══════════════════════════════════════════════════════════════
   Context + hook
   ═══════════════════════════════════════════════════════════════ */

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);
	if (!context) {
		throw new Error("useCarousel must be used within a <CarouselRoot />");
	}
	return context;
}

/* ═══════════════════════════════════════════════════════════════
   Compound components (shadcn / Embla)
   ═══════════════════════════════════════════════════════════════ */

function CarouselRoot({
	orientation = "horizontal",
	opts,
	setApi,
	plugins,
	className,
	children,
	...props
}: React.ComponentProps<"div"> & CarouselCompoundProps) {
	const [carouselRef, api] = useEmblaCarousel(
		{
			...opts,
			axis: orientation === "horizontal" ? "x" : "y",
		},
		plugins,
	);
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);

	const onSelect = React.useCallback((emblaApi: CarouselApi) => {
		if (!emblaApi) return;
		setCanScrollPrev(emblaApi.canScrollPrev());
		setCanScrollNext(emblaApi.canScrollNext());
	}, []);

	const scrollPrev = React.useCallback(() => {
		api?.scrollPrev();
	}, [api]);

	const scrollNext = React.useCallback(() => {
		api?.scrollNext();
	}, [api]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				scrollPrev();
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				scrollNext();
			}
		},
		[scrollPrev, scrollNext],
	);

	React.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);

	React.useEffect(() => {
		if (!api) return;
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);
		return () => {
			api?.off("select", onSelect);
		};
	}, [api, onSelect]);

	return (
		<CarouselContext.Provider
			value={{
				carouselRef,
				api,
				opts,
				orientation:
					orientation ||
					(opts?.axis === "y" ? "vertical" : "horizontal"),
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
			}}
		>
			<div
				onKeyDownCapture={handleKeyDown}
				className={cn("relative", className)}
				role="region"
				aria-roledescription="carousel"
				{...props}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	);
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
	const { carouselRef, orientation } = useCarousel();

	return (
		<div ref={carouselRef} className="overflow-hidden h-full">
			<div
				className={cn(
					"flex h-full",
					orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
	const { orientation } = useCarousel();

	return (
		<div
			role="group"
			aria-roledescription="slide"
			className={cn(
				"min-w-0 shrink-0 grow-0 basis-full",
				orientation === "horizontal" ? "pl-4" : "pt-4",
				className,
			)}
			{...props}
		/>
	);
}

function CarouselPrevious({
	className,
	size = "md",
	...props
}: React.ComponentProps<"button"> & { size?: "sm" | "md" }) {
	const { scrollPrev, canScrollPrev } = useCarousel();

	const sizeClasses = size === "sm" ? "size-8" : "size-10";
	const iconSize = size === "sm" ? 14 : 18;

	if (!canScrollPrev) return null;

	return (
		<button
			type="button"
			className={cn(
				sizeClasses,
				"inline-flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-[box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
				className,
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			aria-label="Xem ảnh trước"
			{...props}
		>
			<ChevronLeft className="text-gray-700" size={iconSize} />
		</button>
	);
}

function CarouselNext({
	className,
	size = "md",
	...props
}: React.ComponentProps<"button"> & { size?: "sm" | "md" }) {
	const { scrollNext, canScrollNext } = useCarousel();

	const sizeClasses = size === "sm" ? "size-8" : "size-10";
	const iconSize = size === "sm" ? 14 : 18;

	if (!canScrollNext) return null;

	return (
		<button
			type="button"
			className={cn(
				sizeClasses,
				"inline-flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-[box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
				className,
			)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			aria-label="Xem ảnh tiếp"
			{...props}
		>
			<ChevronRight className="text-gray-700" size={iconSize} />
		</button>
	);
}

function CarouselDots({ className }: { className?: string }) {
	const { api } = useCarousel();
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

	React.useEffect(() => {
		if (!api) return;

		setScrollSnaps(api.scrollSnapList());

		const onSelect = () => {
			setSelectedIndex(api.selectedScrollSnap());
		};

		onSelect();
		api.on("select", onSelect);
		api.on("reInit", onSelect);

		return () => {
			api.off("select", onSelect);
		};
	}, [api]);

	if (scrollSnaps.length <= 1) return null;

	return (
		<div className={cn("flex items-center justify-center", className)}>
			{scrollSnaps.map((_, i) => (
				<button
					key={`dot-${i}`}
					type="button"
					onClick={() => api?.scrollTo(i)}
					className="relative flex items-center justify-center min-w-12 min-h-12 -mx-3"
					aria-label={`Go to slide ${i + 1}`}
				>
					<span
						className={cn(
							"block rounded-full transition-[width,background-color] duration-300",
							i === selectedIndex
								? "w-6 h-2 bg-gray-800"
								: "w-2 h-2 bg-gray-300",
						)}
					/>
				</button>
			))}
		</div>
	);
}

/* ═══════════════════════════════════════════════════════════════
   Simple wrapper (backward-compat default export)
   ═══════════════════════════════════════════════════════════════ */

interface CarouselProps {
	children: React.ReactNode[];
	/** Auto-scroll interval in ms (0 = disabled) */
	autoPlay?: number;
	/** Gap between items in px */
	gap?: number;
	/** Number of items visible at once (0 = auto, items use intrinsic width) */
	slidesPerView?: number;
	/** Show prev/next arrow buttons */
	showNav?: boolean;
	/** Nav button size */
	navSize?: "sm" | "md";
	/** Nav button position */
	navPosition?: "inside" | "outside";
	/** Nav visibility: "always" or show on "hover" only */
	navVisibility?: "always" | "hover";
	/** Show pagination dots */
	showDots?: boolean;
	/** Enable infinite loop */
	loop?: boolean;
	/** How many pixels to scroll per click (0 = auto-detect item width) */
	scrollAmount?: number;
	className?: string;
	/** Optional custom classes container for left/right nav wrapper to override default positions */
	navWrapperClasses?: { left?: string; right?: string };
}

/**
 * Carousel — generic horizontal scrollable container with nav arrows.
 *
 * Powered by Embla Carousel. Preserves the same external API
 * used across the storefront (children, gap, showNav, navSize, etc.).
 *
 * @example
 * <Carousel showNav gap={12}>
 *   {products.map(p => <ProductCard key={p.id} {...p} />)}
 * </Carousel>
 */
function Carousel({
	children,
	autoPlay = 0,
	gap = 12,
	slidesPerView = 0,
	showNav = true,
	navSize = "md",
	navPosition = "outside",
	navVisibility = "always",
	showDots = false,
	loop = false,
	scrollAmount = 0,
	className = "",
	navWrapperClasses,
}: CarouselProps) {
	const isOutside = navPosition === "outside";
	const hasFixedSlides = slidesPerView > 0;
	const isHoverNav = navVisibility === "hover";
	const total = children.length;

	const plugins: CarouselPlugin = useMemo(() => {
		if (autoPlay <= 0 || total <= 1) return [];
		return [
			Autoplay({
				delay: autoPlay,
				stopOnInteraction: false,
				stopOnMouseEnter: true,
			}),
		];
	}, [autoPlay, total]);

	return (
		<CarouselRoot
			opts={{
				align: "start",
				loop: loop && total > 1,
				dragFree: !hasFixedSlides && !loop,
				slidesToScroll: hasFixedSlides
					? slidesPerView
					: scrollAmount > 0
						? "auto"
						: 1,
			}}
			plugins={plugins}
			className={cn("group", className)}
		>
			<CarouselContent className="ml-0">
				{children.map((child, index) => (
					<CarouselItem
						key={index}
						className={cn(
							"min-w-0 shrink-0 grow-0 pl-0",
							!hasFixedSlides && "basis-auto",
						)}
						style={{
							marginLeft: index === 0 ? 0 : gap,
							...(hasFixedSlides
								? {
										flexBasis: `calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})`,
									}
								: undefined),
						}}
					>
						{child}
					</CarouselItem>
				))}
			</CarouselContent>

			{showNav &&
				total > 1 &&
				(isHoverNav ? (
					<div className="absolute inset-0 z-20 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
						<div className="pointer-events-auto">
							<CarouselPrevious size={navSize} />
						</div>
						<div className="pointer-events-auto">
							<CarouselNext size={navSize} />
						</div>
					</div>
				) : (
					<>
						<div
							className={cn(
								"absolute top-1/2 -translate-y-1/2 z-10 hidden md:block",
								navWrapperClasses?.left ||
									(isOutside
										? navSize === "sm"
											? "-left-8"
											: "-left-10"
										: "-left-1"),
							)}
						>
							<CarouselPrevious size={navSize} />
						</div>
						<div
							className={cn(
								"absolute top-1/2 -translate-y-1/2 z-10 hidden md:block",
								navWrapperClasses?.right ||
									(isOutside
										? navSize === "sm"
											? "-right-8"
											: "-right-10"
										: "-right-1"),
							)}
						>
							<CarouselNext size={navSize} />
						</div>
					</>
				))}

			{showDots && total > 1 && (
				<CarouselDots className="absolute bottom-0 md:bottom-3 left-1/2 -translate-x-1/2 z-20" />
			)}
		</CarouselRoot>
	);
}

export default Carousel;

export {
	type CarouselApi,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	type CarouselOptions,
	type CarouselPlugin,
	CarouselPrevious,
	CarouselRoot,
	useCarousel,
};
