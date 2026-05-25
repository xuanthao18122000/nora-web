"use client";

import type React from "react";
import { useCallback, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RangeValue = readonly [number, number];

function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

function sortRange([a, b]: RangeValue): RangeValue {
	return a <= b ? [a, b] : [b, a];
}

function roundToStep(value: number, step: number, min: number) {
	const snapped = Math.round((value - min) / step) * step + min;
	// avoid floating precision drift
	return Number(snapped.toFixed(10));
}

export interface RangeSliderProps
	extends Omit<
		React.HTMLAttributes<HTMLDivElement>,
		"onChange" | "defaultValue"
	> {
	min?: number;
	max?: number;
	step?: number;
	value?: RangeValue;
	defaultValue?: RangeValue;
	onValueChange?: (value: RangeValue) => void;
	disabled?: boolean;
}

export default function RangeSlider({
	min = 0,
	max = 100,
	step = 1,
	value,
	defaultValue = [min, max],
	onValueChange,
	disabled = false,
	className,
	...props
}: RangeSliderProps) {
	const id = useId();
	const trackRef = useRef<HTMLDivElement | null>(null);
	const [uncontrolled, setUncontrolled] = useState<RangeValue>(() =>
		sortRange([
			clamp(defaultValue[0], min, max),
			clamp(defaultValue[1], min, max),
		]),
	);
	const activeThumbRef = useRef<0 | 1 | null>(null);

	const current = value
		? sortRange([clamp(value[0], min, max), clamp(value[1], min, max)])
		: uncontrolled;

	const [a, b] = current;

	const pctA = ((a - min) / (max - min)) * 100;
	const pctB = ((b - min) / (max - min)) * 100;

	const ariaA = `${id}-thumb-a`;
	const ariaB = `${id}-thumb-b`;

	const commit = useCallback(
		(next: RangeValue) => {
			const sorted = sortRange(next);
			if (!value) setUncontrolled(sorted);
			onValueChange?.(sorted);
		},
		[value, onValueChange],
	);

	const valueFromClientX = useCallback(
		(clientX: number) => {
			const el = trackRef.current;
			if (!el) return min;
			const rect = el.getBoundingClientRect();
			const x = clamp(clientX - rect.left, 0, rect.width);
			const raw = min + (x / rect.width) * (max - min);
			return clamp(roundToStep(raw, step, min), min, max);
		},
		[min, max, step],
	);

	const pickClosestThumb = useCallback(
		(nextValue: number): 0 | 1 => {
			const distA = Math.abs(nextValue - a);
			const distB = Math.abs(nextValue - b);
			return distA <= distB ? 0 : 1;
		},
		[a, b],
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (disabled) return;
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
			const nextValue = valueFromClientX(e.clientX);
			const thumb = pickClosestThumb(nextValue);
			activeThumbRef.current = thumb;
			commit(thumb === 0 ? [nextValue, b] : [a, nextValue]);
		},
		[disabled, valueFromClientX, pickClosestThumb, commit, a, b],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			const activeThumb = activeThumbRef.current;
			if (disabled || activeThumb === null) return;
			const nextValue = valueFromClientX(e.clientX);
			commit(activeThumb === 0 ? [nextValue, b] : [a, nextValue]);
		},
		[disabled, valueFromClientX, commit, a, b],
	);

	const onPointerUp = useCallback(() => {
		activeThumbRef.current = null;
	}, []);

	function onKeyDown(e: React.KeyboardEvent, thumb: 0 | 1) {
		if (disabled) return;
		const delta =
			e.key === "ArrowRight" || e.key === "ArrowUp"
				? step
				: e.key === "ArrowLeft" || e.key === "ArrowDown"
					? -step
					: 0;
		if (!delta) return;
		e.preventDefault();
		const next = clamp(
			roundToStep((thumb === 0 ? a : b) + delta, step, min),
			min,
			max,
		);
		commit(thumb === 0 ? [next, b] : [a, next]);
	}

	return (
		<div
			className={cn(
				"select-none",
				disabled && "opacity-50 pointer-events-none",
				className,
			)}
			role="group"
			aria-label="Range slider"
			{...props}
		>
			{/* Figma padding: 0px 12px */}
			<div className="px-2 md:px-3">
				{/* Inner track area: all positioning is relative to this box */}
				<div
					className="relative h-3.5"
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
				>
					{/* Range area (matches exported SVG: track inset 7px for 14px thumbs) */}
					<div
						ref={trackRef}
						className="absolute inset-y-0"
						style={{ left: 7, right: 7 }}
					>
						{/* Track (Figma: 4px height, gray-200) */}
						<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gray-200" />

						{/* Selected range (Figma: #101828) */}
						<div
							className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-gray-900"
							style={{
								left: `${pctA}%`,
								width: `${Math.max(0, pctB - pctA)}%`,
							}}
						/>

						{/* Thumb A (Figma: 14px, fill #101828, inner dot white 6px) */}
						<div
							role="slider"
							tabIndex={disabled ? -1 : 0}
							aria-label="Min"
							aria-valuemin={min}
							aria-valuemax={max}
							aria-valuenow={a}
							aria-describedby={ariaA}
							onKeyDown={(e) => onKeyDown(e, 0)}
							className={cn(
								"absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-gray-900",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
							)}
							style={{ left: `${pctA}%` }}
						>
							<div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
						</div>

						{/* Thumb B */}
						<div
							role="slider"
							tabIndex={disabled ? -1 : 0}
							aria-label="Max"
							aria-valuemin={min}
							aria-valuemax={max}
							aria-valuenow={b}
							aria-describedby={ariaB}
							onKeyDown={(e) => onKeyDown(e, 1)}
							className={cn(
								"absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-gray-900",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
							)}
							style={{ left: `${pctB}%` }}
						>
							<div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
						</div>

						{/* screen-reader only helpers */}
						<span id={ariaA} className="sr-only">
							Min value
						</span>
						<span id={ariaB} className="sr-only">
							Max value
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
