import type { Metadata } from "next";

type ChangelogType = "added" | "changed" | "fixed" | "deprecated";

type ChangelogItem = {
	type: ChangelogType;
	title: string;
	description?: string;
};

type ChangelogRelease = {
	id: string;
	version: string;
	date: string;
	items: ChangelogItem[];
};

type WhatNextItem = {
	id: string;
	title: string;
	description: string;
	priority?: "high" | "medium" | "low";
};

const CHANGELOG_ENTRIES: ChangelogRelease[] = [
	{
		id: "rel-0.1.0",
		version: "0.1.0",
		date: "2025-03-14",
		items: [
			{
				type: "added",
				title: "Design system section",
				description:
					"Added /design-system with Overview, Button, Tab, and Roadmap pages.",
			},
			{
				type: "added",
				title: "Tab documentation",
				description:
					"Documented Tab component (underline and default variants) with examples.",
			},
			{
				type: "added",
				title: "Button documentation",
				description:
					"Button showcase with filled, bordered, soft, and link variants.",
			},
		],
	},
];

const WHAT_NEXT_ITEMS: WhatNextItem[] = [
	{
		id: "wn-1",
		title: "Color & semantic tokens",
		description:
			"Document color palette and semantic tokens (brand, states, status) in design-system.",
		priority: "high",
	},
	{
		id: "wn-2",
		title: "Typography scale",
		description:
			"Define heading/body styles and spacing scale aligned with Figma.",
		priority: "medium",
	},
	{
		id: "wn-3",
		title: "Accessibility baseline",
		description:
			"Contrast, focus-visible styles, and keyboard behavior guidelines.",
		priority: "high",
	},
	{
		id: "wn-4",
		title: "Form controls",
		description:
			"Add input, select, checkbox, radio, and textarea components and docs.",
		priority: "medium",
	},
	{
		id: "wn-5",
		title: "Contribution guidelines",
		description:
			"Describe how to propose, review, and ship new design-system components.",
		priority: "low",
	},
];

export const metadata: Metadata = {
	title: "Roadmap",
	description: "Changelog and what's next for the DDV design system.",
};

const TYPE_LABELS: Record<ChangelogType, string> = {
	added: "Added",
	changed: "Changed",
	fixed: "Fixed",
	deprecated: "Deprecated",
};

const TYPE_STYLES: Record<ChangelogType, string> = {
	added: "bg-green-100 text-green-800",
	changed: "bg-blue-100 text-blue-800",
	fixed: "bg-amber-100 text-amber-800",
	deprecated: "bg-gray-200 text-gray-700",
};

export default function DesignSystemRoadmapPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="mb-2 text-2xl font-bold text-gray-900">
				Roadmap & Changelog
			</h1>
			<p className="mb-8 text-gray-600">
				What shipped and what we plan next. Edit CHANGELOG_ENTRIES and
				WHAT_NEXT_ITEMS to update this page.
			</p>

			{/* Changelog */}
			<section aria-labelledby="changelog-heading" className="mb-10">
				<h2
					id="changelog-heading"
					className="mb-4 text-lg font-semibold text-gray-900"
				>
					Changelog
				</h2>
				<ul className="list-none space-y-6">
					{CHANGELOG_ENTRIES.length === 0 ? (
						<li className="text-sm text-gray-500">
							No entries yet.
						</li>
					) : (
						CHANGELOG_ENTRIES.map((release) => (
							<li
								key={release.id}
								className="rounded-lg border border-gray-200 bg-gray-50 p-4"
							>
								<div className="mb-3 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
									<span className="text-sm font-medium text-gray-900">
										{release.version}
									</span>
									<span className="text-xs text-gray-500">
										{release.date}
									</span>
								</div>
								<ul className="list-none space-y-3">
									{release.items.map((item, index) => (
										<li key={`${release.id}-${index}`}>
											<span
												className={`mr-2 rounded px-1.5 py-0.5 text-xs font-medium ${TYPE_STYLES[item.type]}`}
											>
												{TYPE_LABELS[item.type]}
											</span>
											<span className="text-sm font-semibold text-gray-900">
												{item.title}
											</span>
											{item.description && (
												<p className="mt-1 text-sm text-gray-600">
													{item.description}
												</p>
											)}
										</li>
									))}
								</ul>
							</li>
						))
					)}
				</ul>
			</section>

			{/* What next */}
			<section aria-labelledby="what-next-heading" className="mb-4">
				<h2
					id="what-next-heading"
					className="mb-4 text-lg font-semibold text-gray-900"
				>
					What next
				</h2>
				<ul className="list-none space-y-3">
					{WHAT_NEXT_ITEMS.length === 0 ? (
						<li className="text-sm text-gray-500">
							Nothing planned yet.
						</li>
					) : (
						WHAT_NEXT_ITEMS.map((item) => (
							<li
								key={item.id}
								className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-3"
							>
								<div className="flex items-center gap-2">
									<h3 className="text-sm font-semibold text-gray-900">
										{item.title}
									</h3>
									{item.priority && (
										<span
											className={`text-xs font-medium ${
												item.priority === "high"
													? "text-red-600"
													: item.priority === "medium"
														? "text-amber-600"
														: "text-gray-500"
											}`}
										>
											{item.priority}
										</span>
									)}
								</div>
								<p className="text-sm text-gray-600">
									{item.description}
								</p>
							</li>
						))
					)}
				</ul>
			</section>
		</div>
	);
}
