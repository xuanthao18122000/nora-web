"use client";

import { useState } from "react";

import Timeline from "@/components/common/Timeline";

import CodeSnippet from "../CodeSnippet";

const SAMPLE_ITEMS = [
	{
		label: "Chỉ còn:",
		countdown: { hours: "04", minutes: "04", seconds: "04" },
	},
	{ label: "Sắp diễn ra", time: "21:30" },
	{ label: "Ngày mai", time: "00:00" },
	{ label: "Ngày mai", time: "09:00" },
	{ label: "Ngày mai", time: "12:00" },
];

export default function TimelinePage() {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<div className="space-y-8">
			<div className="rounded-lg border border-gray-200 bg-white p-8">
				<h1 className="mb-2 text-2xl font-bold text-gray-900">
					Timeline
				</h1>
				<p className="mb-8 text-gray-600">
					Horizontal event timeline: countdown or time slots with one
					active slot (primary background). Responsive, no black
					background. Pass{" "}
					<code className="rounded bg-gray-100 px-1 py-0.5 text-sm">
						onSlotClick
					</code>{" "}
					to handle slot clicks.
				</p>

				<section
					aria-labelledby="timeline-interactive"
					className="mb-8"
				>
					<h2
						id="timeline-interactive"
						className="mb-4 text-lg font-semibold text-gray-900"
					>
						Interactive (click to change active slot)
					</h2>
					<Timeline
						items={SAMPLE_ITEMS}
						activeIndex={activeIndex}
						onSlotClick={(index) => setActiveIndex(index)}
					/>
				</section>

				<section
					aria-labelledby="timeline-active-first"
					className="mb-8"
				>
					<h2
						id="timeline-active-first"
						className="mb-4 text-lg font-semibold text-gray-900"
					>
						Active: first slot (countdown)
					</h2>
					<Timeline items={SAMPLE_ITEMS} activeIndex={0} />
				</section>

				<section
					aria-labelledby="timeline-active-second"
					className="mb-8"
				>
					<h2
						id="timeline-active-second"
						className="mb-4 text-lg font-semibold text-gray-900"
					>
						Active: second slot (Sắp diễn ra)
					</h2>
					<Timeline items={SAMPLE_ITEMS} activeIndex={1} />
				</section>

				<CodeSnippet
					code={`import { useState } from "react";
import { Timeline } from "@/components/common";

const [activeIndex, setActiveIndex] = useState(0);
const items = [
  { label: "Chỉ còn:", countdown: { hours: "04", minutes: "04", seconds: "04" } },
  { label: "Sắp diễn ra", time: "21:30" },
  { label: "Ngày mai", time: "00:00" },
  { label: "Ngày mai", time: "09:00" },
  { label: "Ngày mai", time: "12:00" },
];

<Timeline
  items={items}
  activeIndex={activeIndex}
  onSlotClick={(index) => setActiveIndex(index)}
/>`}
				/>
			</div>
		</div>
	);
}
