"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

const Drawer: React.FC<DrawerProps> = ({
	open,
	repositionInputs = false,
	...props
}) => {
	return (
		<DrawerPrimitive.Root
			open={open}
			repositionInputs={repositionInputs}
			{...props}
		/>
	);
};

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerTitle = DrawerPrimitive.Title;

type DrawerOverlayProps = React.ComponentPropsWithoutRef<
	typeof DrawerPrimitive.Overlay
>;

const DrawerOverlay = React.forwardRef<
	React.ComponentRef<typeof DrawerPrimitive.Overlay>,
	DrawerOverlayProps
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] backdrop-blur-xs",
			className,
		)}
		{...props}
	/>
));
DrawerOverlay.displayName = "DrawerOverlay";

type DrawerContentProps = React.ComponentPropsWithoutRef<
	typeof DrawerPrimitive.Content
>;

const DrawerContent = React.forwardRef<
	React.ComponentRef<typeof DrawerPrimitive.Content>,
	DrawerContentProps
>(({ className, children, ...props }, ref) => (
	<DrawerPortal>
		<DrawerOverlay />
		<DrawerPrimitive.Content
			ref={ref}
			className={cn("overscroll-contain", className)}
			{...props}
		>
			{children}
		</DrawerPrimitive.Content>
	</DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={className} {...props} />
);

const DrawerFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={className} {...props} />
);

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
};
