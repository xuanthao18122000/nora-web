"use client";

import { Button } from "@/components/common/Button";

interface CartHeaderProps {
	title?: string;
	onBack?: () => void;
}

export default function CartHeader({
	title = "Giỏ hàng của bạn",
	onBack,
}: CartHeaderProps) {
	return (
		<div className="relative flex items-center gap-2 md:gap-4 rounded-xl md:rounded-2xl bg-white px-2 md:px-4 py-2.5 md:py-4">
			<Button
				variant="filled"
				color="gray"
				size="xs"
				iconOnly
				onClick={onBack}
				aria-label="Quay lại"
				className="relative z-10 rounded-full!"
				leadingIcon={
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M15 5L8 12L15 19"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				}
			/>
			<h1 className="absolute inset-0 flex items-center justify-center text-sm md:text-base text-gray-900 leading-normal pointer-events-none">
				{title}
			</h1>
		</div>
	);
}
