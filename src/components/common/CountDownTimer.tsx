"use client";

import { AnimatedCountdown } from "@/components/common/AnimatedCountdown";
import { BadgeHotSale } from "@/components/common/Badge";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { cn } from "@/lib/utils/cn";

interface CountDownTimerProps {
	/** ISO datetime string (e.g. "2026-03-30T11:00:00+07:00") */
	endAt?: string | null;
	/** "HH:mm" time-of-day string (e.g. "11:00") — takes priority over endAt */
	endTime?: string | null;
	className?: string;
}

export default function CountDownTimer({
	endAt,
	endTime,
	className,
}: CountDownTimerProps) {
	const { prefix, time, endAtMs } = useCountdown(endAt, endTime);

	if (endAtMs === 0) return null;

	return (
		<BadgeHotSale className={className}>
			{prefix && <span>{prefix}</span>}
			{time ? (
				<AnimatedCountdown
					timeString={time}
					className={cn(
						"text-xxs tracking-normal font-sans font-medium text-red-500! transition-[filter] duration-300",
						time === "00:00:00" && "blur-[3px]",
					)}
				/>
			) : null}
		</BadgeHotSale>
	);
}
