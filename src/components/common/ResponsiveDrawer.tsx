"use client";

import { X } from "lucide-react";
import type * as React from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/common/Dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/common/Drawer";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";

export interface ResponsiveDrawerProps {
	/** Drawer open state */
	open: boolean;
	/** Callback when drawer closes */
	onClose: () => void;
	/** Title of the drawer */
	title: React.ReactNode;
	/** Main content */
	children: React.ReactNode;
	/** Optional bottom footer, typically for action buttons */
	footer?: React.ReactNode;
	/** Custom class names for the body container */
	className?: string;
	/** Custom class names for the header container */
	headerClassName?: string;
	/** Custom class names for the footer container */
	footerClassName?: string;
	/** Optional specific width override, default 480 */
	maxWidth?: number;
	/** Display mode on desktop. "drawer" = right side (default), "modal" = centered overlay */
	variant?: "drawer" | "modal";
	/** Description of the drawer */
	description?: string;
	/** Whether clicking outside / dragging closes the drawer. Default: true */
	closeOnOutsideClick?: boolean;
}

export function ResponsiveDrawer({
	open,
	onClose,
	title,
	children,
	footer,
	className,
	headerClassName,
	footerClassName,
	maxWidth = 480,
	variant = "drawer",
	description,
	closeOnOutsideClick = true,
}: ResponsiveDrawerProps) {
	const isMobile = useIsMobile();

	// Desktop modal mode: use Radix Dialog centered overlay
	if (variant === "modal" && !isMobile) {
		return (
			<Dialog
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) onClose();
				}}
			>
				<DialogContent
					showCloseButton={false}
					className={cn(
						"fixed top-1/2 left-1/2 z-201 flex max-h-[85vh] w-full -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-0 ring-0",
					)}
					style={{ maxWidth }}
					{...(!closeOnOutsideClick && {
						onInteractOutside: (e: Event) => e.preventDefault(),
						onPointerDownOutside: (e: Event) => e.preventDefault(),
					})}
				>
					{/* Header */}
					<div
						className={cn(
							"flex shrink-0 items-center justify-between border-b border-gray-100 px-4 md:px-5 py-4",
							headerClassName,
						)}
					>
						<DialogTitle className="font-semibold text-base md:text-lg text-gray-900">
							{title}
						</DialogTitle>
						<button
							type="button"
							onClick={onClose}
							className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
							aria-label="Đóng"
						>
							<X
								className="w-4 h-4"
								aria-hidden="true"
								strokeWidth={2}
							/>
						</button>
					</div>

					{/* Body */}
					<div
						className={cn(
							"flex-1 overflow-y-auto overscroll-contain bg-gray-100/50",
							!footer && "rounded-b-2xl",
							className,
						)}
					>
						{children}
					</div>

					{/* Footer */}
					{footer && (
						<div
							className={cn(
								"shrink-0 border-t border-gray-100 bg-white px-4 md:px-5 py-3 md:py-4 rounded-b-2xl",
								footerClassName,
							)}
						>
							{footer}
						</div>
					)}
				</DialogContent>
			</Dialog>
		);
	}

	// Default drawer mode (or mobile always uses bottom sheet)
	return (
		<Drawer
			open={open}
			direction={isMobile ? "bottom" : "right"}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DrawerContent
				className={cn(
					"z-201",
					isMobile
						? "fixed inset-x-0 bottom-0 flex flex-col rounded-t-2xl bg-white"
						: "fixed inset-y-0 right-0 flex h-full w-full items-center md:pr-2.5 md:py-2.5 px-0 py-0",
				)}
				style={
					isMobile ? { height: "calc(100dvh - 52px)" } : { maxWidth }
				}
				aria-label={typeof title === "string" ? title : "Drawer"}
				aria-describedby={description}
			>
				<div
					className={cn(
						"flex h-full w-full flex-col",
						!isMobile &&
							"relative md:rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.18)]",
					)}
				>
					{/* Header */}
					<DrawerHeader
						className={cn(
							"flex shrink-0 items-center justify-between border-b border-gray-100",
							isMobile ? "px-4 py-3" : "px-4 md:px-5 py-4",
							headerClassName,
						)}
					>
						<DrawerTitle
							className={cn(
								"font-semibold text-gray-900",
								isMobile
									? "text-base"
									: "text-base md:text-lg text-text-primary",
							)}
						>
							{title}
						</DrawerTitle>
						<DrawerClose
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200",
								isMobile
									? "bg-gray-100 text-gray-500"
									: "bg-gray-100 text-gray-700",
							)}
							aria-label="Đóng"
						>
							<X
								className="w-4 h-4"
								aria-hidden="true"
								strokeWidth={2}
							/>
						</DrawerClose>
					</DrawerHeader>

					{/* Body */}
					<div
						className={cn(
							"flex-1 overflow-y-auto",
							isMobile
								? "overscroll-contain bg-gray-50"
								: "bg-gray-100/50",
							!isMobile && !footer && "md:rounded-b-2xl",
							className,
						)}
					>
						{children}
					</div>

					{/* Footer */}
					{footer && (
						<DrawerFooter
							className={cn(
								"shrink-0 border-t border-gray-100 bg-white",
								isMobile
									? "px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]"
									: "px-4 md:px-5 py-3 md:py-4 md:rounded-b-2xl",
								footerClassName,
							)}
						>
							{footer}
						</DrawerFooter>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
