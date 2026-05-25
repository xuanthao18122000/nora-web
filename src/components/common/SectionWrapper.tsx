import type React from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionWrapperProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
	/** Section title */
	title?: React.ReactNode;
	/** Icon hiển thị trong title pill (vd `<Package />`). */
	titleIcon?: React.ReactNode;
	/** Section subtitle */
	subtitle?: React.ReactNode;
	/** Content to right of title (e.g. countdown, close button) */
	headerTrailing?: React.ReactNode;
	/** Tab bar below header */
	tabs?: React.ReactNode;
	/** Footer content (e.g. 'View all' button) */
	footer?: React.ReactNode;
	/** Main content */
	children: React.ReactNode;
	/** Wrapper class names */
	className?: string;
	/** Class names for the content container */
	contentClassName?: string;
}

/**
 * Common Section Wrapper
 * Standardizes the UI layout for sections (especially on Homepage)
 * Includes structured areas for header, tabs, main content, and footer.
 */
export function SectionWrapper({
	title,
	titleIcon,
	subtitle,
	headerTrailing,
	tabs,
	footer,
	children,
	className,
	contentClassName,
	...props
}: SectionWrapperProps) {
	const hasHeader = title || subtitle || headerTrailing;

	return (
		<section
			className={cn(
				"flex w-full flex-col rounded-2xl bg-white p-2 md:p-4 gap-2 md:gap-4",
				className,
			)}
			{...props}
		>
			{/* Header */}
			{hasHeader && (
				<div className="relative flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1 flex-col gap-0.5">
						{title && (
							<h2 className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600 md:text-sm">
								{titleIcon}
								{title}
							</h2>
						)}
						{subtitle && (
							<p className="mt-2 text-xs md:text-sm text-gray-600">
								{subtitle}
							</p>
						)}
					</div>
					{headerTrailing && (
						<div className="shrink-0">{headerTrailing}</div>
					)}
				</div>
			)}

			{/* Tabs */}
			{tabs && <>{tabs}</>}

			{/* Content */}
			<div className={cn("flex-1 min-h-0", contentClassName)}>
				{children}
			</div>

			{/* Footer */}
			{footer && (
				<div className="mt-auto flex justify-center">{footer}</div>
			)}
		</section>
	);
}

export default SectionWrapper;
