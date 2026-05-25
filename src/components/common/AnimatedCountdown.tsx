import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/* ── Static styles (hoisted to avoid re-creation per render) ── */

const GRID_AREA = { gridArea: "1 / 1" } as const;
const TICK_OUT = {
	animation: "tickOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
	gridArea: "1 / 1",
} as const;
const TICK_IN = {
	animation: "tickIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
	gridArea: "1 / 1",
} as const;
const NO_ANIM = { animation: "none", gridArea: "1 / 1" } as const;

/* ── AnimatedDigit ── */

const AnimatedDigit = memo(function AnimatedDigit({
	digit,
}: {
	digit: string;
}) {
	const prevRef = useRef(digit);
	const [previous, setPrevious] = useState<string | null>(null);

	useEffect(() => {
		if (digit !== prevRef.current) {
			setPrevious(prevRef.current);
			prevRef.current = digit;
		}
	}, [digit]);

	const clearPrevious = useCallback(() => setPrevious(null), []);

	if (digit === ":" || digit === " ") {
		return <span className="inline-block px-0.5">{digit}</span>;
	}

	return (
		<span className="inline-grid overflow-hidden w-[1ch] text-center">
			<span className="invisible opacity-0" style={GRID_AREA}>
				0
			</span>
			{previous !== null && (
				<span
					key={`${previous}-out`}
					style={TICK_OUT}
					onAnimationEnd={clearPrevious}
				>
					{previous}
				</span>
			)}
			<span
				key={`${digit}-${previous !== null ? "in" : "idle"}`}
				style={previous !== null ? TICK_IN : NO_ANIM}
			>
				{digit}
			</span>
		</span>
	);
});

/* ── AnimatedCountdown ── */

interface AnimatedCountdownProps {
	timeString: string;
	className?: string;
}

export const AnimatedCountdown = memo(function AnimatedCountdown({
	timeString,
	className,
}: AnimatedCountdownProps) {
	const chars = timeString.split("");
	return (
		<span
			className={cn(
				"inline-flex items-baseline text-2xl font-bold text-red-600 leading-none tracking-wider font-mono",
				className,
			)}
		>
			{chars.map((char, index) => (
				<AnimatedDigit key={index} digit={char} />
			))}
		</span>
	);
});
