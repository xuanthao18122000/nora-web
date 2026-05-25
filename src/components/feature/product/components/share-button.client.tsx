"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

interface ShareButtonProps {
	className?: string;
}

export default function ShareButton({ className }: ShareButtonProps) {
	const handleClick = async () => {
		if (typeof window === "undefined") return;
		const url = window.location.href;
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Đã sao chép liên kết sản phẩm");
		} catch {
			toast.error("Không thể sao chép liên kết");
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="Chia sẻ sản phẩm"
			title="Chia sẻ sản phẩm"
			className={cn(
				"flex cursor-pointer items-center gap-1 rounded-lg text-sm font-medium leading-5 text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
				className,
			)}
		>
			<Share2 aria-hidden size={20} />
			<span>Chia sẻ</span>
		</button>
	);
}
