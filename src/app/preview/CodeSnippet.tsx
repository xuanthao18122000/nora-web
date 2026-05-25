"use client";

import { useState } from "react";

interface CodeSnippetProps {
	code: string;
	title?: string;
}

/**
 * CodeSnippet — premium collapsible code block for preview page
 */
export default function CodeSnippet({
	code,
	title = "Cách sử dụng",
}: CodeSnippetProps) {
	const [open, setOpen] = useState(false);

	return (
		<details
			className="mt-6 group"
			open={open}
			onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
		>
			<summary className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-500 hover:text-gray-700 transition-colors list-none [&::-webkit-details-marker]:hidden">
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
					role="img"
					aria-label="Toggle code"
				>
					<path
						d="M4 2l4 4-4 4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					role="img"
					aria-label="Code icon"
				>
					<polyline points="16 18 22 12 16 6" />
					<polyline points="8 6 2 12 8 18" />
				</svg>
				<span>{title}</span>
			</summary>
			<div className="mt-3 rounded-lg overflow-hidden border border-gray-800">
				<div className="flex items-center justify-between px-4 py-2 bg-gray-800">
					<span className="text-xs text-gray-400 font-mono">TSX</span>
					<button
						type="button"
						onClick={() => {
							navigator.clipboard.writeText(code.trim());
						}}
						className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							role="img"
							aria-label="Copy"
						>
							<rect
								x="9"
								y="9"
								width="13"
								height="13"
								rx="2"
								ry="2"
							/>
							<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
						</svg>
						Copy
					</button>
				</div>
				<pre className="p-4 bg-gray-900 text-gray-100 text-[13px] leading-relaxed overflow-x-auto">
					<code>{code.trim()}</code>
				</pre>
			</div>
		</details>
	);
}
