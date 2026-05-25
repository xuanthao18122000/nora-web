import type { Metadata } from "next";

import {
	TYPOGRAPHY_SIZE_CLASSES,
	TYPOGRAPHY_SIZE_KEYS,
	TYPOGRAPHY_WEIGHT_KEYS,
	typographyTokens,
} from "@/lib/constants/design-tokens";

export const metadata: Metadata = {
	title: "Typography",
	description:
		"DDV typography tokens — font family, size, line height, weight.",
};

export default function DesignSystemTypographyPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="mb-2 text-2xl font-bold text-gray-900">
				Typography
			</h1>
			<p className="mb-8 text-gray-600">
				Font family, size, line height, and weight from{" "}
				<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
					typographyTokens
				</code>
				.
			</p>

			<div className="space-y-10">
				<section aria-labelledby="font-family-heading">
					<h2
						id="font-family-heading"
						className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500"
					>
						Font family
					</h2>
					<p className="font-primary text-md text-gray-900">
						{typographyTokens.fontFamily}
					</p>
				</section>

				<section aria-labelledby="font-size-heading">
					<h2
						id="font-size-heading"
						className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500"
					>
						Font size
					</h2>
					<ul className="space-y-2">
						{TYPOGRAPHY_SIZE_KEYS.map((key) => {
							const value = typographyTokens.fontSize[key];
							return (
								<li
									key={key}
									className="flex flex-wrap items-baseline gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
								>
									<span className="w-12 shrink-0 font-mono text-xs text-gray-500">
										{key}
									</span>
									<span className="font-mono text-xs text-gray-400">
										{value}
									</span>
									<span
										className={TYPOGRAPHY_SIZE_CLASSES[key]}
										style={{
											fontFamily:
												typographyTokens.fontFamily,
										}}
									>
										The quick brown fox
									</span>
								</li>
							);
						})}
					</ul>
				</section>

				<section aria-labelledby="line-height-heading">
					<h2
						id="line-height-heading"
						className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500"
					>
						Line height
					</h2>
					<ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{TYPOGRAPHY_SIZE_KEYS.map((key) => {
							const value = typographyTokens.lineHeight[key];
							return (
								<li
									key={key}
									className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
								>
									<span className="font-mono text-sm text-gray-700">
										leading-{key}
									</span>
									<span className="font-mono text-xs text-gray-500">
										{value}
									</span>
								</li>
							);
						})}
					</ul>
				</section>

				<section aria-labelledby="font-weight-heading">
					<h2
						id="font-weight-heading"
						className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500"
					>
						Font weight
					</h2>
					<ul className="flex flex-wrap gap-3">
						{TYPOGRAPHY_WEIGHT_KEYS.map((key) => {
							const value = typographyTokens.fontWeight[key];
							const weightClass =
								key === "normal"
									? "font-normal"
									: key === "medium"
										? "font-medium"
										: key === "semibold"
											? "font-semibold"
											: "font-bold";
							return (
								<li
									key={key}
									className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
								>
									<span className="font-mono text-xs text-gray-500">
										{key} ({value})
									</span>
									<p
										className={`mt-1 text-md text-gray-900 ${weightClass}`}
										style={{
											fontFamily:
												typographyTokens.fontFamily,
										}}
									>
										Abc 123
									</p>
								</li>
							);
						})}
					</ul>
				</section>
			</div>
		</div>
	);
}
