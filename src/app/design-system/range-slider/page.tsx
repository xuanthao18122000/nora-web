"use client";

import { RangeSlider } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function RangeSliderPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Range Slider
			</h1>
			<p className="text-gray-600 mb-8">
				Double-thumb range slider for price or numeric filters.
			</p>
			<div className="max-w-[560px]">
				<RangeSlider
					min={0}
					max={100}
					step={1}
					defaultValue={[20, 80]}
					onValueChange={() => {}}
				/>
			</div>
			<CodeSnippet
				code={`import { RangeSlider } from "@/components/common";

<RangeSlider
  min={0}
  max={100}
  step={1}
  defaultValue={[20, 80]}
  onValueChange={(v) => console.log(v)}
/>`}
			/>
		</div>
	);
}
