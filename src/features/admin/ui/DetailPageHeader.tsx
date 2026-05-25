"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";

interface DetailPageHeaderProps {
	title: string;
	subtitle?: string;
	backHref?: string;
	/** Action ở giữa "Quay lại" và nút submit chính. */
	extraActions?: React.ReactNode;
	/** Nút submit/save chính (custom text, type, state). */
	primaryAction?: React.ReactNode;
}

/** Sticky page header dùng chung cho mọi trang detail/edit/create trong CMS. */
export function DetailPageHeader({
	title,
	subtitle,
	backHref,
	extraActions,
	primaryAction,
}: DetailPageHeaderProps) {
	return (
		<div className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur md:-mx-6 md:flex-row md:items-center md:justify-between md:px-6">
			<div className="min-w-0">
				<h1 className="truncate text-xl font-bold text-gray-900 md:text-2xl">
					{title}
				</h1>
				{subtitle && (
					<p className="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>
				)}
			</div>
			<div className="flex shrink-0 items-center gap-2">
				{backHref && (
					<Link href={backHref}>
						<Button type="button" variant="secondary" size="sm">
							<ArrowLeft className="h-4 w-4" />
							Quay lại
						</Button>
					</Link>
				)}
				{extraActions}
				{primaryAction}
			</div>
		</div>
	);
}
