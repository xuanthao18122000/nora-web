"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ProcessingModalProps {
	open: boolean;
	isSuccess?: boolean;
	/** Text hiển thị khi đang xử lý */
	processingTitle?: string;
	processingSubtitle?: string;
	/** Text hiển thị khi thành công */
	successTitle?: string;
	successSubtitle?: string;
}

export default function ProcessingModal({
	open,
	isSuccess,
	processingTitle = "Đang xử lý",
	processingSubtitle = "Vui lòng không tắt trang...",
	successTitle = "Thành công!",
	successSubtitle = "Đang chuyển hướng...",
}: ProcessingModalProps) {
	const [mounted, setMounted] = useState(false);
	const [renderSuccess, setRenderSuccess] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isSuccess && !renderSuccess) {
			setRenderSuccess(true);
		}
	}, [isSuccess, renderSuccess]);

	if (!mounted || !open) return null;

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-label={renderSuccess ? successTitle : processingTitle}
			className="fixed inset-0 z-[4000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
		>
			<div className="flex w-full max-w-80 flex-col items-center justify-center gap-5 rounded-xl md:rounded-2xl bg-white px-10 py-10 shadow-2xl text-center mx-4">
				{renderSuccess ? (
					<div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
						<CheckCircle2 className="w-16 h-16 text-green-500" />
						<div className="flex flex-col gap-1">
							<p className="text-base font-bold text-gray-900">
								{successTitle}
							</p>
							<p className="text-sm text-gray-500">
								{successSubtitle}
							</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center gap-5 animate-in fade-in duration-300">
						<div className="relative flex items-center justify-center w-16 h-16">
							<svg
								className="animate-spin"
								width="64"
								height="64"
								viewBox="0 0 64 64"
								fill="none"
								aria-hidden="true"
							>
								<circle
									cx="32"
									cy="32"
									r="28"
									stroke="#F3F4F6"
									strokeWidth="6"
								/>
								<path
									d="M32 4a28 28 0 0 1 28 28"
									stroke="currentColor"
									strokeWidth="6"
									strokeLinecap="round"
									className="text-primary-500"
								/>
							</svg>
							<span className="absolute text-primary-500 font-bold text-xs tracking-wide">
								AQHN
							</span>
						</div>

						<div className="flex flex-col gap-1">
							<p className="text-sm font-semibold text-gray-900">
								{processingTitle}
							</p>
							<p className="text-sm text-gray-500">
								{processingSubtitle}
							</p>
						</div>

						<div className="flex items-center gap-1.5">
							{[0, 1, 2].map((i) => (
								<span
									key={i}
									className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce"
									style={{ animationDelay: `${i * 0.15}s` }}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
