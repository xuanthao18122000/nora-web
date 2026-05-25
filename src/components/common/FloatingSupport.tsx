"use client";

import Image from "next/image";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants/site-info";
import { cn } from "@/lib/utils/cn";
import { getImageUrl } from "@/lib/utils/image";
import { useDeviceStore } from "@/store/useDeviceStore";

interface FloatingItemProps {
	label: string;
	imageSrc: string;
	href: string;
	/** Màu accent của đoạn sáng chạy quanh viền */
	accent: string;
	/** Stagger delay cho border-runner (giây) để 3 nút không chạy đồng thời */
	runnerDelay?: number;
}

function FloatingItem({
	label,
	imageSrc,
	href,
	accent,
	runnerDelay = 0,
}: FloatingItemProps) {
	const isExternal = href.startsWith("http");

	return (
		<a
			href={href}
			aria-label={label}
			title={label}
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			className="group relative flex size-12 md:size-12 items-center justify-center rounded-full bg-white transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 active:scale-95"
			style={{
				boxShadow:
					"0 4px 12px -2px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
			}}
		>
			{/* Vòng tròn xanh NGOÀI CÙNG bao quanh button: có đoạn đậm
			    fade dần xuống nhạt khi xoay quanh — giống đuôi sao chổi. */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute -inset-2.5 rounded-full animate-[fs-spin_2.4s_linear_infinite]"
				style={{
					background: `conic-gradient(from 0deg, ${accent}00 0deg, ${accent}22 180deg, ${accent}88 300deg, ${accent} 360deg)`,
					WebkitMask:
						"radial-gradient(circle, transparent calc(50% - 2px), #000 calc(50% - 2px), #000 50%, transparent 50%)",
					mask: "radial-gradient(circle, transparent calc(50% - 2px), #000 calc(50% - 2px), #000 50%, transparent 50%)",
					animationDelay: `${runnerDelay}s`,
				}}
			/>

			<Image
				src={getImageUrl(imageSrc)}
				alt={label}
				width={36}
				height={36}
				className="relative size-8 object-contain transition-transform duration-200 group-hover:scale-110 animate-[fs-wiggle_3s_ease-in-out_infinite]"
				style={{ transformOrigin: "center" }}
			/>
		</a>
	);
}

interface FloatingSupportProps {
	bottomOffset: number;
}

export default function FloatingSupport({
	bottomOffset,
}: FloatingSupportProps) {
	const isMobile = useDeviceStore((s) => s.isMobile);

	return (
		<>
			<style>{`
				@keyframes fs-spin {
					to { transform: rotate(360deg); }
				}
				@keyframes fs-wiggle {
					0%, 100%      { transform: rotate(0deg); }
					15%, 45%, 75% { transform: rotate(-12deg); }
					30%, 60%, 90% { transform: rotate(12deg); }
				}
				@media (prefers-reduced-motion: reduce) {
					.animate-\\[fs-spin_2\\.4s_linear_infinite\\],
					.animate-\\[fs-wiggle_3s_ease-in-out_infinite\\] {
						animation: none !important;
					}
				}
			`}</style>

			<div
				className={cn(
					"fixed z-101 flex flex-col items-end gap-4",
					isMobile ? "right-3" : "right-6",
				)}
				style={{ bottom: `max(${bottomOffset}px, 1rem)` }}
			>
				<FloatingItem
					label="Facebook"
					imageSrc="/facebook.svg"
					href={SOCIAL_LINKS.facebook}
					accent="#1877F2"
					runnerDelay={0}
				/>
				<FloatingItem
					label="Chat Zalo"
					imageSrc="/zalo.svg"
					href={CONTACT.zaloUrl}
					accent="#0068FF"
					runnerDelay={0.4}
				/>
				<FloatingItem
					label={`Gọi ${CONTACT.hotlineDisplay}`}
					imageSrc="/phone-call.png"
					href={`tel:${CONTACT.hotlineTel}`}
					accent="#22C55E"
					runnerDelay={0.8}
				/>
			</div>
		</>
	);
}
