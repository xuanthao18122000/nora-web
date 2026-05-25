"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";
import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useId,
	useState,
} from "react";

import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
 * Shared Radix Tooltip wrapper with two opinionated behaviours:
 *
 * 1. Touch-only devices ignore Radix's close events (pointerleave
 *    right after a tap would otherwise flash the tooltip closed).
 *    Dismissal on touch is driven by a document pointerdown listener.
 *    Desktop (hover-capable) keeps Radix's normal behaviour.
 *
 * 2. Default dark (shadcn-style) bubble, built-in arrow, custom
 *    keyframes from globals.css (no tailwindcss-animate dependency),
 *    and z-300 so the bubble always sits above `ResponsiveDrawer`.
 *
 * Controlled callers (e.g. `<Tooltip open={isCopied}>`) fully own
 * the state — the wrapper passes every Radix event through untouched.
 * ────────────────────────────────────────────────────────────── */

const TooltipProvider = TooltipPrimitive.Provider;

// Instance id — lets the document outside-click listener scope a click
// to THIS tooltip pair (trigger + portaled content) via data attributes.
const TooltipIdContext = createContext<string>("");

// ── Root ──
type TooltipRootProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

function TooltipRoot({
	children,
	open: controlledOpen,
	defaultOpen,
	onOpenChange,
	...props
}: TooltipRootProps) {
	const id = useId();
	const isControlled = controlledOpen !== undefined;
	const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
	const open = isControlled ? controlledOpen : internalOpen;

	// Detect pure-touch devices once on mount. Pointer-hover is `none`
	// on phones and tablets without an attached mouse.
	const [isTouchOnly, setIsTouchOnly] = useState(false);
	useEffect(() => {
		setIsTouchOnly(window.matchMedia("(hover: none)").matches);
	}, []);

	const handleOpenChange = (next: boolean) => {
		if (isControlled) {
			onOpenChange?.(next);
			return;
		}
		// Touch-only: swallow Radix's close events. They fire via the
		// synthesized pointerleave immediately after tap and would flash
		// the tooltip shut. The document listener below handles close.
		if (!next && isTouchOnly) return;
		setInternalOpen(next);
		onOpenChange?.(next);
	};

	// Outside-tap to close — only needed on touch-only devices.
	useEffect(() => {
		if (isControlled || !isTouchOnly || !open) return;
		const handle = (e: PointerEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;
			if (target.closest(`[data-tooltip-id="${id}"]`)) return;
			setInternalOpen(false);
			onOpenChange?.(false);
		};
		document.addEventListener("pointerdown", handle);
		return () => document.removeEventListener("pointerdown", handle);
	}, [id, isControlled, isTouchOnly, open, onOpenChange]);

	return (
		<TooltipIdContext.Provider value={id}>
			<TooltipPrimitive.Root
				{...props}
				open={open}
				onOpenChange={handleOpenChange}
			>
				{children}
			</TooltipPrimitive.Root>
		</TooltipIdContext.Provider>
	);
}

// ── Trigger ──
const TooltipTrigger = forwardRef<
	React.ComponentRef<typeof TooltipPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
	const id = useContext(TooltipIdContext);
	return (
		<TooltipPrimitive.Trigger
			ref={ref}
			data-slot="tooltip-trigger"
			data-tooltip-id={id}
			{...props}
		/>
	);
});
TooltipTrigger.displayName = "TooltipTrigger";

// ── Content ──
const TooltipContent = forwardRef<
	React.ComponentRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
		/** Show the pointing arrow. Default: true */
		showArrow?: boolean;
	}
>(
	(
		{
			className,
			side = "top",
			align = "center",
			sideOffset = 6,
			collisionPadding = 12,
			showArrow = true,
			children,
			...props
		},
		ref,
	) => {
		const id = useContext(TooltipIdContext);
		return (
			<TooltipPrimitive.Portal>
				<TooltipPrimitive.Content
					ref={ref}
					data-slot="tooltip-content"
					data-tooltip-id={id}
					side={side}
					align={align}
					sideOffset={sideOffset}
					collisionPadding={collisionPadding}
					className={cn(
						// Layer above ResponsiveDrawer (z-201) and app popovers (z-300)
						"tooltip-anim z-300 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-lg bg-gray-800 px-3 py-1.5 text-xs leading-snug text-white shadow-lg",
						className,
					)}
					{...props}
				>
					{children}
					{showArrow && (
						<TooltipPrimitive.Arrow
							width={10}
							height={5}
							className="fill-gray-900"
						/>
					)}
				</TooltipPrimitive.Content>
			</TooltipPrimitive.Portal>
		);
	},
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export const Tooltip = {
	Provider: TooltipProvider,
	Root: TooltipRoot,
	Trigger: TooltipTrigger,
	Content: TooltipContent,
};

export { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger };
