"use client";

import { ImageOff } from "lucide-react";
import { StatusCommonEnum } from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

interface StatusBadgeProps {
	status: StatusCommonEnum;
	activeLabel?: string;
	inactiveLabel?: string;
}

/** Badge trạng thái hoạt động/lưu trữ dùng chung. */
export function StatusBadge({
	status,
	activeLabel = "Hoạt động",
	inactiveLabel = "Lưu trữ",
}: StatusBadgeProps) {
	if (status === StatusCommonEnum.ACTIVE) {
		return (
			<span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20">
				{activeLabel}
			</span>
		);
	}
	return (
		<span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-600/20">
			{inactiveLabel}
		</span>
	);
}

interface ListThumbProps {
	url?: string | null;
	alt: string;
	/** "cover" (default) cho ảnh sản phẩm, "contain" cho logo. */
	fit?: "cover" | "contain";
}

/** Thumbnail 40×40 dùng chung trong các bảng list. */
export function ListThumb({ url, alt, fit = "cover" }: ListThumbProps) {
	if (!url) {
		return (
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-300">
				<ImageOff className="h-4 w-4" aria-hidden="true" />
			</div>
		);
	}
	const objectClass = fit === "contain" ? "object-contain p-1" : "object-cover";
	const resolved = getImageUrl(url);
	// biome-ignore lint/performance/noImgElement: external URL
	return (
		<img
			src={resolved}
			alt={alt}
			className={`h-10 w-10 shrink-0 rounded-md border border-gray-200 bg-white ${objectClass}`}
		/>
	);
}
