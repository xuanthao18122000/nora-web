const DESKTOP_MEDIA = "(min-width: 768px)";

/**
 * Scroll the window to the top instantly. SSR-safe.
 *
 * Use as an `onClick` handler when navigating between pages where the browser's
 * scroll restoration doesn't kick in (e.g. shorter target page than current
 * scroll position).
 */
export function scrollToTop() {
	if (typeof window === "undefined") return;
	window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

/**
 * Smoothly scroll an element into view, accounting for the sticky header height
 * and responsive gap (8px mobile, 16px desktop).
 *
 * @param target - Element, element ID string, or CSS selector
 * @param opts.focus - If true, focus the element after scroll (default: false)
 */
export function scrollToSection(
	target: string | HTMLElement,
	opts?: { focus?: boolean },
) {
	const el =
		typeof target === "string"
			? (document.getElementById(target) ??
				document.querySelector<HTMLElement>(target))
			: target;
	if (!el) return;

	// Measure sticky header height
	const header = document.querySelector<HTMLElement>(
		"[class*='sticky'][class*='top-0']",
	);
	const headerHeight = header?.getBoundingClientRect().height ?? 0;

	// Responsive gap: 8px mobile, 16px desktop
	const isDesktop = window.matchMedia(DESKTOP_MEDIA).matches;
	const gap = isDesktop ? 16 : 8;

	const top =
		el.getBoundingClientRect().top + window.scrollY - headerHeight - gap;

	window.scrollTo({ top, behavior: "smooth" });

	if (opts?.focus) {
		setTimeout(() => el.focus({ preventScroll: true }), 300);
	}
}
