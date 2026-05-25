"use client";

import { useEffect, useState } from "react";

/**
 * Returns the height (px) the on-screen keyboard is currently covering,
 * or 0 when it is closed. Uses `visualViewport` to detect the gap between
 * the layout viewport and the visible viewport.
 */
export function useKeyboardInset(enabled: boolean = true): number {
	const [inset, setInset] = useState(0);

	useEffect(() => {
		if (!enabled) {
			setInset(0);
			return;
		}

		const vv = window.visualViewport;
		if (!vv) return;

		function update() {
			if (!vv) return;
			const gap = window.innerHeight - vv.height - vv.offsetTop;
			setInset(gap > 50 ? Math.round(gap) : 0);
		}

		update();
		vv.addEventListener("resize", update);
		vv.addEventListener("scroll", update);
		return () => {
			vv.removeEventListener("resize", update);
			vv.removeEventListener("scroll", update);
		};
	}, [enabled]);

	return inset;
}

/**
 * Returns the largest visible viewport height observed — i.e. the viewport
 * height WITHOUT the on-screen keyboard. Using the max (instead of live
 * `visualViewport.height`) keeps the drawer a stable size while the user
 * jumps between inputs, so it never re-sizes/jitters when the keyboard
 * re-layouts.
 *
 * Only updates on true viewport changes (rotation, browser chrome), not
 * on keyboard show/hide.
 */
export function useKeyboardAwareHeight(enabled: boolean = true): number | null {
	const [maxHeight, setMaxHeight] = useState<number | null>(null);

	useEffect(() => {
		if (!enabled) {
			setMaxHeight(null);
			return;
		}

		const vv = window.visualViewport;

		function readHeight(): number {
			return Math.round(vv?.height ?? window.innerHeight);
		}

		setMaxHeight(readHeight());

		function onOrientation() {
			setMaxHeight(readHeight());
		}

		function onResize() {
			const h = readHeight();
			setMaxHeight((prev) => (prev == null || h > prev ? h : prev));
		}

		window.addEventListener("orientationchange", onOrientation);
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("orientationchange", onOrientation);
			window.removeEventListener("resize", onResize);
		};
	}, [enabled]);

	return maxHeight;
}
