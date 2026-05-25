"use client";

import { useCallback, useState } from "react";

import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/common/tooltip";
import {
	COLOR_SCALE,
	colorClassesBg,
	colorClassesText,
	type TokenKey,
} from "@/lib/constants/design-tokens";
import { cn } from "@/lib/utils";

type CopyMode = "background" | "text";

type ColorRow = {
	name: string;
	tokenPrefix: TokenKey;
	colors: readonly string[];
};

type ColorGridProps = {
	rows: readonly ColorRow[];
};

function getClassName(
	prefix: TokenKey,
	scale: (typeof COLOR_SCALE)[number],
	mode: CopyMode,
): string {
	return mode === "background"
		? colorClassesBg[prefix][scale]
		: colorClassesText[prefix][scale];
}

export default function ColorGrid({ rows }: ColorGridProps) {
	const [copyMode, setCopyMode] = useState<CopyMode>("background");
	const [copiedSwatchId, setCopiedSwatchId] = useState<string | null>(null);

	const copyClass = useCallback(
		async (className: string, swatchId: string) => {
			await navigator.clipboard.writeText(className);
			setCopiedSwatchId(swatchId);
			setTimeout(() => setCopiedSwatchId(null), 1500);
		},
		[],
	);

	return (
		<TooltipProvider delayDuration={0}>
			<div className="relative overflow-hidden">
				{/* Copy mode switch */}
				<div
					className="mb-4 flex w-fit p-0.5 border border-white/10 rounded-lg bg-slate-100"
					role="group"
					aria-label="Copy as background or foreground"
				>
					<button
						type="button"
						onClick={() => setCopyMode("background")}
						className={`rounded px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black border border-white/10 ${
							copyMode === "background"
								? "bg-white text-black"
								: "text-gray-400 hover:text-black"
						}`}
						aria-pressed={copyMode === "background"}
					>
						Background
					</button>
					<button
						type="button"
						onClick={() => setCopyMode("text")}
						className={`rounded px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black border border-white/10 ${
							copyMode === "text"
								? "bg-white text-black"
								: "text-gray-400 hover:text-black"
						}`}
						aria-pressed={copyMode === "text"}
					>
						Text
					</button>
				</div>

				<div className="flex flex-col gap-3">
					{rows.map((row, rowIndex) => (
						<div
							key={row.name}
							className="grid grid-cols-11 gap-2"
							role="row"
							aria-label={row.name}
						>
							{row.colors.map((hex, colIndex) => {
								const scale = COLOR_SCALE[colIndex];
								const tokenLabel = `${row.tokenPrefix}-${scale}`;
								const className = getClassName(
									row.tokenPrefix,
									scale,
									copyMode,
								);
								const swatchId = `${rowIndex}-${colIndex}`;
								const isCopied = copiedSwatchId === swatchId;

								return (
									<TooltipRoot
										key={swatchId}
										open={isCopied}
										onOpenChange={(open) => {
											if (!open) setCopiedSwatchId(null);
										}}
									>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={() =>
													copyClass(
														className,
														swatchId,
													)
												}
												className="group flex flex-col overflow-hidden rounded-lg text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black "
												aria-label={`Copy ${className}`}
											>
												<div className="flex items-center justify-center flex-col">
													<div
														className={cn(
															"aspect-[4/3] size-12  shrink-0 rounded-full  border border-white/10 flex items-center justify-center",
															className,
														)}
														aria-hidden
													>
														<div
															className={cn(
																"text-xxl font-bold",
																scale > 500 &&
																	copyMode ===
																		"background" &&
																	"text-white",
															)}
														>
															D
														</div>
													</div>
													<div className="min-w-0 px-1.5 py-1.5">
														<p className="truncate text-xxs font-medium text-gray-700">
															{tokenLabel}
														</p>
														<p className="truncate font-mono text-xxs text-gray-400">
															{hex}
														</p>
													</div>
												</div>
											</button>
										</TooltipTrigger>
										<TooltipContent>
											<div className="flex flex-col gap-0.5">
												<p className="font-medium">
													Copied!
												</p>
											</div>
										</TooltipContent>
									</TooltipRoot>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</TooltipProvider>
	);
}
