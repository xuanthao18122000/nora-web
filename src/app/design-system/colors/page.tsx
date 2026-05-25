import type { Metadata } from "next";

import ColorGrid from "@/app/design-system/colors/ColorGrid";
import { getColorGridRows } from "@/lib/constants/design-tokens";

export const metadata: Metadata = {
	title: "Colors",
	description: "DDV color tokens — palettes and utility classes.",
};

export default function DesignSystemColorsPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="mb-2 text-2xl font-bold text-gray-900">Colors</h1>
			<p className="mb-6 text-gray-600">
				Click a card to copy its class name. Tokens from{" "}
				<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
					design-tokens
				</code>
				.
			</p>
			<ColorGrid rows={getColorGridRows()} />
		</div>
	);
}
