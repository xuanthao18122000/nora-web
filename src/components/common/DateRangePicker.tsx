"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/common/Calendar";
import { Popover } from "@/components/common/Popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
	from?: Date;
	to?: Date;
	onChange?: (range: { from?: Date; to?: Date }) => void;
	placeholder?: string;
	className?: string;
	numberOfMonths?: number;
}

function DateRangePicker({
	from,
	to,
	onChange,
	placeholder = "Chọn khoảng ngày",
	className,
	numberOfMonths = 2,
}: DateRangePickerProps) {
	const [date, setDate] = useState<DateRange | undefined>(
		from || to ? { from, to } : undefined,
	);

	const handleSelect = (range: DateRange | undefined) => {
		setDate(range);
		onChange?.({ from: range?.from, to: range?.to });
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		setDate(undefined);
		onChange?.({ from: undefined, to: undefined });
	};

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 h-10 text-sm text-gray-900 min-w-[230px] w-fit whitespace-nowrap",
						"transition-colors duration-150 hover:border-gray-300",
						"focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none cursor-pointer",
						!date?.from && "text-text-muted",
						className,
					)}
					aria-label="Chọn khoảng ngày"
				>
					<CalendarIcon
						size={16}
						className="text-gray-500"
						aria-hidden="true"
					/>
					{date?.from ? (
						date.to ? (
							<span>
								{format(date.from, "dd/MM/yyyy")} -{" "}
								{format(date.to, "dd/MM/yyyy")}
							</span>
						) : (
							<span>{format(date.from, "dd/MM/yyyy")}</span>
						)
					) : (
						<span>{placeholder}</span>
					)}
					{date?.from && (
						<span
							role="button"
							tabIndex={0}
							onClick={handleClear}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleClear(
										e as unknown as React.MouseEvent,
									);
								}
							}}
							className="inline-flex items-center justify-center size-4 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
							aria-label="Xoá khoảng ngày đã chọn"
						>
							<X size={14} aria-hidden="true" />
						</span>
					)}
				</button>
			</Popover.Trigger>
			<Popover.Content
				className="w-auto rounded-xl border border-gray-200 bg-white p-0 shadow-lg"
				align="start"
				collisionPadding={16}
			>
				<Calendar
					mode="range"
					defaultMonth={date?.from}
					selected={date}
					onSelect={handleSelect}
					numberOfMonths={numberOfMonths}
					locale={vi}
				/>
			</Popover.Content>
		</Popover.Root>
	);
}

export type { DateRangePickerProps };
export { DateRangePicker };
