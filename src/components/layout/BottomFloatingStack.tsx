"use client";

import { useEffect, useRef, useState } from "react";
import FloatingSupport from "@/components/common/FloatingSupport";
import CompareBar from "@/components/feature/compare/CompareBar.client";
import {
	useElementHeight,
	useStackedOffset,
} from "@/lib/hooks/useStickyOffset";
import { useBottomSlot } from "@/providers/BottomSlotProvider";
import { useDeviceStore } from "@/store/useDeviceStore";

/** Shared max-width + padding for bottom floating bar content (compare bar, product affix) */
export const BOTTOM_BAR_CONTAINER =
	"mx-auto max-w-[600px] lg:max-w-[700px] xl:max-w-[900px] px-2 md:px-4" as const;

export default function BottomFloatingStack() {
	// Defer mount tới khi page idle để DOM measurement (ResizeObserver,
	// querySelector ở useElementHeight/useStackedOffset) không block hero LCP.
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		const win = window as Window & {
			requestIdleCallback?: (cb: () => void) => number;
		};
		if (typeof win.requestIdleCallback === "function") {
			const id = win.requestIdleCallback(() => setMounted(true));
			return () => {
				const cancel = (win as unknown as {
					cancelIdleCallback?: (id: number) => void;
				}).cancelIdleCallback;
				cancel?.(id);
			};
		}
		const t = setTimeout(() => setMounted(true), 200);
		return () => clearTimeout(t);
	}, []);

	if (!mounted) return null;
	return <BottomFloatingStackInner />;
}

function BottomFloatingStackInner() {
	const isMobile = useDeviceStore((s) => s.isMobile);
	const stackRef = useRef<HTMLDivElement>(null);

	const bottomOffset = useStackedOffset(
		isMobile
			? ["[data-sticky='mobile-nav']", "[data-sticky='product-affix']"]
			: [],
		{ fallback: isMobile ? 0 : 24 },
	);

	const stackHeight = useElementHeight("[data-sticky='bottom-stack']");

	const bottomSlot = useBottomSlot();

	return (
		<>
			<FloatingSupport bottomOffset={bottomOffset + stackHeight + 16} />

			{/* Compare bar + page slot — animate bằng transform để composited (GPU). */}
			<div
				ref={stackRef}
				data-sticky="bottom-stack"
				className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-stretch gap-2 pointer-events-none transition-transform duration-300 ease-out will-change-transform"
				style={{ transform: `translateY(-${bottomOffset}px)` }}
			>
				<CompareBar />
				{bottomSlot}
			</div>
		</>
	);
}
