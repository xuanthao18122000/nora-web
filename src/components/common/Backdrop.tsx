"use client";

import { createPortal } from "react-dom";
import { useIsMounted, useScrollLock } from "usehooks-ts";

import { cn } from "@/lib/utils/cn";

interface BackdropProps {
	open: boolean;
	/** Lock body scroll while open. */
	lockScroll?: boolean;
	className?: string;
}

/**
 * Full-viewport dim layer rendered via portal to <body>.
 * Sits at z-40 so a sticky Header (z-50) stays visually above.
 *
 * Click-to-close is intentionally not handled here — outer overlay primitives
 * (Radix Popover, Dialog, vaul Drawer) already detect outside-click and
 * dispatch onOpenChange. Wiring it twice causes double state updates.
 */
export function Backdrop({
	open,
	lockScroll = false,
	className,
}: BackdropProps) {
	const isMounted = useIsMounted();

	useScrollLock({
		autoLock: lockScroll && open,
		lockTarget: typeof document !== "undefined" ? document.body : undefined,
		// scrollbar-gutter: stable on <html> permanently reserves scrollbar
		// space, so no width reflow is needed when the scrollbar disappears.
		widthReflow: false,
	});

	if (!isMounted()) return null;

	return createPortal(
		<div
			aria-hidden="true"
			data-state={open ? "open" : "closed"}
			className={cn(
				"fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200",
				"data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0",
				"data-[state=open]:opacity-100",
				className,
			)}
		/>,
		document.body,
	);
}
