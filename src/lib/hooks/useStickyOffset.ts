"use client";

import { useEffect, useState } from "react";

/**
 * Measure the height (in px) of the first element matching the selector.
 * Re-measures on resize and when the element itself changes size.
 */
export function useElementHeight(selector: string, fallback = 0): number {
	const [height, setHeight] = useState(fallback);
	useEffect(() => {
		const measure = () => {
			const el = document.querySelector<HTMLElement>(selector);
			setHeight(el?.getBoundingClientRect().height ?? fallback);
		};
		measure();
		const el = document.querySelector<HTMLElement>(selector);
		const ro = el ? new ResizeObserver(measure) : null;
		if (el && ro) ro.observe(el);
		window.addEventListener("resize", measure);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, [selector, fallback]);
	return height;
}

/**
 * Default breathing room between stacked floating layers (px).
 * Mobile: 8 (≈ Tailwind gap-2). Desktop (>= md): 16 (≈ Tailwind gap-4).
 */
export const STICKY_STACK_GAP_MOBILE = 8;
export const STICKY_STACK_GAP_DESKTOP = 16;

/**
 * Observe the height of a sticky element (e.g. the app header) and return it
 * so another sticky sibling can offset itself from the viewport top.
 *
 * @example
 * const headerH = useStickyOffset("header");
 * <div className="sticky z-20" style={{ top: headerH }}>…</div>
 */
export function useStickyOffset(selector = "header", fallback = 0): number {
	return useStackedOffset([selector], { fallback });
}

interface StackedOffsetOptions {
	/**
	 * Gap (px) added between the caller's element and the nearest tracked
	 * sticky below. Accepts either a single value or a responsive object.
	 * Defaults to 8px mobile / 16px desktop (md breakpoint ≥ 768px).
	 */
	gap?: number | { mobile: number; desktop: number };
	/** Value returned while the hook hasn't measured yet. Default 0. */
	fallback?: number;
}

const DESKTOP_MEDIA = "(min-width: 768px)";

/**
 * Observe the bottom-anchored space occupied by a stack of sticky elements
 * and return the `bottom` value a new floating layer should use to sit
 * directly above them with a consistent `gap` of breathing room.
 *
 * Rules of the stack (mobile use case):
 * - Each tracked sticky contributes its own height.
 * - An 8px gap (configurable) is inserted between the caller and whatever is
 *   directly below.
 * - Elements with `aria-hidden="true"` or zero size are skipped so the stack
 *   collapses automatically when an affix slides out. The tracked element
 *   itself is expected to embed its own breathing gap inside its bottom
 *   offset too (e.g. affix = navBottom + gap), so stacks compose linearly:
 *   `layerN.bottom = layerN-1.bottom + layerN-1.height + gap`.
 *
 * @example
 * // Affix above nav: nav(80) + gap(8) = bottom 88
 * const navOffset = useStackedOffset(["[data-sticky='mobile-nav']"]);
 * <div style={{ bottom: navOffset }}>affix</div>
 *
 * // Pill above affix: nav(80) + gap(8) + affix(80) + gap(8) = bottom 176
 * const pillOffset = useStackedOffset([
 *   "[data-sticky='mobile-nav']",
 *   "[data-sticky='product-affix']",
 * ]);
 * <div style={{ bottom: pillOffset }}>pill</div>
 */
export function useStackedOffset(
	selectors: string[],
	options: StackedOffsetOptions = {},
): number {
	const { gap, fallback = 0 } = options;
	const [offset, setOffset] = useState(fallback);
	const key = selectors.join("|");
	const gapKey =
		typeof gap === "number"
			? String(gap)
			: gap
				? `${gap.mobile}:${gap.desktop}`
				: "default";

	useEffect(() => {
		const list = key ? key.split("|").filter(Boolean) : [];

		const resolveGap = () => {
			if (typeof gap === "number") return gap;
			const isDesktop =
				typeof window !== "undefined" &&
				window.matchMedia(DESKTOP_MEDIA).matches;
			if (gap && typeof gap === "object") {
				return isDesktop ? gap.desktop : gap.mobile;
			}
			return isDesktop
				? STICKY_STACK_GAP_DESKTOP
				: STICKY_STACK_GAP_MOBILE;
		};

		const measure = () => {
			const g = resolveGap();
			let highestTop = Number.POSITIVE_INFINITY;
			let matched = false;
			for (const sel of list) {
				const el = document.querySelector<HTMLElement>(sel);
				if (!el) continue;
				if (el.getAttribute("aria-hidden") === "true") continue;
				const rect = el.getBoundingClientRect();
				if (rect.height <= 0) continue;
				if (rect.top < highestTop) highestTop = rect.top;
				matched = true;
			}
			setOffset(
				matched ? Math.max(0, window.innerHeight - highestTop + g) : g,
			);
		};

		// Debounce with rAF to avoid layout thrashing from cascading
		// MutationObserver callbacks (e.g. element A changes style →
		// measure fires → element B updates → measure fires again).
		let rafId = 0;
		const scheduleMeasure = () => {
			if (rafId) return;
			rafId = requestAnimationFrame(() => {
				rafId = 0;
				measure();
			});
		};

		measure();

		// Observe elements that exist right now
		const observers: ResizeObserver[] = [];
		for (const sel of list) {
			const el = document.querySelector<HTMLElement>(sel);
			if (!el) continue;
			const ro = new ResizeObserver(scheduleMeasure);
			ro.observe(el);
			observers.push(ro);
		}

		// Observe DOM mutations (mount/unmount) and attribute changes
		// (e.g. aria-hidden toggle on the affix when it slides in/out).
		// Note: "style" is excluded to prevent feedback loops where one
		// element's style change triggers a re-measure that changes
		// another element's style, which triggers yet another measure.
		const mo = new MutationObserver(scheduleMeasure);
		mo.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["aria-hidden", "class"],
		});

		window.addEventListener("resize", scheduleMeasure);
		const mql = window.matchMedia(DESKTOP_MEDIA);
		mql.addEventListener("change", scheduleMeasure);
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			for (const ro of observers) ro.disconnect();
			mo.disconnect();
			window.removeEventListener("resize", scheduleMeasure);
			mql.removeEventListener("change", scheduleMeasure);
		};
	}, [key, gapKey, gap]);

	return offset;
}
