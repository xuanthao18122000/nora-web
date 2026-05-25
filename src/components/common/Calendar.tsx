"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({
	className,
	classNames,
	...props
}: ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			className={cn("p-3", className)}
			classNames={{
				root: "relative",
				months: "flex flex-col sm:flex-row gap-2",
				month: "flex flex-col gap-4",
				month_caption: "flex justify-center items-center h-7",
				caption_label: "text-sm font-medium text-text-primary",
				nav: "absolute top-3 flex w-[calc(100%-1.5rem)] justify-between left-3 z-10",
				button_previous:
					"size-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-lg border border-gray-200 transition-opacity duration-150 cursor-pointer",
				button_next:
					"size-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-lg border border-gray-200 transition-opacity duration-150 cursor-pointer",
				month_grid: "w-full border-collapse",
				weekdays: "flex",
				weekday: "text-text-muted rounded-lg w-9 font-normal text-xs",
				week: "flex w-full mt-2",
				day: "size-9 text-center text-sm relative p-0 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day_button: cn(
					"inline-flex size-9 items-center justify-center rounded-lg p-0 font-normal text-text-primary transition-colors duration-150 cursor-pointer",
					"focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
					"aria-selected:opacity-100",
				),
				today: "bg-gray-100 rounded-lg",
				outside: "text-text-muted opacity-50",
				disabled: "text-text-muted opacity-50",
				range_middle:
					"bg-primary-50 [&_button]:bg-transparent [&_button]:text-primary-500 [&_button]:hover:bg-transparent rounded-none",
				range_start:
					"[&_button]:bg-primary-500 [&_button]:text-white [&_button]:hover:bg-primary-500 [&_button]:hover:text-white rounded-l-md rounded-r-none",
				range_end:
					"[&_button]:bg-primary-500 [&_button]:text-white [&_button]:hover:bg-primary-500 [&_button]:hover:text-white rounded-r-md rounded-l-none",
				selected: "rounded-lg",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) => {
					const Icon =
						orientation === "left" ? ChevronLeft : ChevronRight;
					return <Icon className="size-4" aria-hidden="true" />;
				},
			}}
			{...props}
		/>
	);
}

export { Calendar };
