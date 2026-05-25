"use client";

import { cn } from "@/lib/utils";

/** Countdown value: hours, minutes, seconds (e.g. "04", "04", "04") */
export interface CountdownValue {
	hours: string;
	minutes: string;
	seconds: string;
}

/** Single timeline slot: either countdown or time. */
export interface TimelineSlot {
	/** Slot label, e.g. "Chỉ còn:", "Sắp diễn ra", "Ngày mai" */
	label: string;
	/** Countdown display; when set, slot shows HH : MM : SS */
	countdown?: CountdownValue;
	/** Time string when not countdown, e.g. "21:30", "00:00" */
	time?: string;
}

export interface TimelineProps {
	/** List of slots in order */
	items: TimelineSlot[];
	/** Index of the active (highlighted) slot, 0-based */
	activeIndex?: number;
	/** Called when a slot is clicked; (index, slot). When set, slots are interactive. */
	onSlotClick?: (index: number, slot: TimelineSlot) => void;
	/** Optional class for the outer container */
	className?: string;
}

function CountdownPills({
	value,
	active,
}: {
	value: CountdownValue;
	active: boolean;
}) {
	const parts = [value.hours, value.minutes, value.seconds];
	const boxClass = active
		? "bg-white text-primary-500"
		: "bg-primary-500 text-white";

	return (
		<div className="inline-flex items-center gap-1">
			{parts.map((part, i) => (
				<span key={i} className="inline-flex items-center gap-1">
					<span
						className={cn(
							"inline-flex h-[18px] min-w-[19px] items-center justify-center rounded-[var(--radius-xs)] px-0.5 text-xs font-medium",
							boxClass,
						)}
					>
						{part}
					</span>
					{i < parts.length - 1 && (
						<span
							className={cn(
								"text-xs font-medium",
								active
									? "text-white"
									: "text-[var(--color-text-primary)]",
							)}
							aria-hidden
						>
							:
						</span>
					)}
				</span>
			))}
		</div>
	);
}

function TimelineSlotCard({
	slot,
	active,
	onClick,
}: {
	slot: TimelineSlot;
	active: boolean;
	onClick?: () => void;
}) {
	const isActive = active;
	const bgClass = isActive ? "bg-primary-500" : "";
	const labelClass = isActive
		? "text-white"
		: "text-[var(--color-text-primary)]";
	const textSize = "text-base font-normal leading-6";

	const baseClass = cn(
		"flex min-w-[120px] max-w-[180px] shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] p-2 sm:min-w-[140px] sm:w-[150px]",
		bgClass,
		onClick &&
			"cursor-pointer transition-colors duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
	);

	const content = (
		<>
			<div className={cn("text-center", textSize, labelClass)}>
				{slot.label}
			</div>
			{slot.countdown ? (
				<CountdownPills value={slot.countdown} active={isActive} />
			) : (
				slot.time && (
					<div className={cn("text-center", textSize, labelClass)}>
						{slot.time}
					</div>
				)
			)}
		</>
	);

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className={baseClass}
				aria-pressed={isActive}
				aria-label={`${slot.label}${slot.time ? ` ${slot.time}` : slot.countdown ? ` ${slot.countdown.hours}:${slot.countdown.minutes}:${slot.countdown.seconds}` : ""}`}
			>
				{content}
			</button>
		);
	}

	return <div className={baseClass}>{content}</div>;
}

/**
 * Horizontal timeline of event slots (countdown or time). One slot can be active (primary background).
 * Responsive: flex with gap and horizontal scroll on small screens; no black background.
 */
export default function Timeline({
	items,
	activeIndex = 0,
	onSlotClick,
	className,
}: TimelineProps) {
	const safeIndex = Math.max(0, Math.min(activeIndex, items.length - 1));

	return (
		<div
			className={cn(
				"w-full overflow-hidden rounded-[5px] bg-card-gray p-0.5",
				className,
			)}
		>
			<div className="flex flex-wrap justify-center gap-1 overflow-x-auto py-1 sm:flex-nowrap sm:justify-start">
				{items.map((slot, i) => (
					<TimelineSlotCard
						key={i}
						slot={slot}
						active={i === safeIndex}
						onClick={
							onSlotClick ? () => onSlotClick(i, slot) : undefined
						}
					/>
				))}
			</div>
		</div>
	);
}
