"use client";

import { ChevronDown, List } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { scrollToSection } from "@/lib/utils/scroll";

// ── Types ───────────────────────────────────────────────────
interface TocItem {
	id: string;
	text: string;
	level: number; // 2 = h2, 3 = h3
}

export interface ParseHtmlContentProps {
	html: string;
	/** Max collapsed height in px (default: 497) */
	collapsedHeight?: number;
	/** Number of TOC entries visible before toggle (default: 5) */
	tocVisibleCount?: number;
	/**
	 * Override outer wrapper className. Default: "rounded-2xl bg-white".
	 * Pass empty string when the parent already provides background/border/radius
	 * to avoid duplicate visuals.
	 */
	containerClassName?: string;
	/**
	 * Override inner content padding/gap. Default: "flex flex-col gap-2 md:gap-4 p-2 md:p-4".
	 * Pass a smaller padding when the parent already pads the area.
	 */
	contentClassName?: string;
	/**
	 * Hiển thị full content, không clamp & ẩn nút "Xem thêm".
	 * Dùng cho post detail / page builder content cần show toàn bộ.
	 */
	alwaysExpanded?: boolean;
}

// ── Heading parser ──────────────────────────────────────────

function stripTags(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Extract a readable label from a URL path.
 * e.g. "https://didongviet.vn/dien-thoai/iphone-16-pro-max.html"
 *   → "iphone 16 pro max"
 */
function labelFromHref(href: string): string {
	try {
		const pathname = new URL(href).pathname;
		// Get last meaningful segment, strip extension
		const segment = pathname
			.replace(/\.\w+$/, "")
			.split("/")
			.filter(Boolean)
			.pop();
		if (!segment) return "";
		return segment.replace(/[-_]/g, " ").trim();
	} catch {
		return "";
	}
}

/** Extract alt text from <img> inside link content */
function extractImgAlt(html: string): string {
	const match = html.match(/alt=["']([^"']*)["']/i);
	return match?.[1]?.trim() ?? "";
}

const GENERIC_LINK_TEXTS = new Set([
	"click here",
	"xem thêm",
	"xem ngay",
	"tại đây",
	"here",
	"read more",
	"xem chi tiết",
	"chi tiết",
	"tìm hiểu thêm",
	"learn more",
	"more",
	"link",
]);

/**
 * Post-process CMS HTML links for SEO:
 * - Remove links with empty/invalid href
 * - Add rel + target for external links
 * - Add aria-label for generic text / icon-only / image-only links
 */
function fixHtmlLinks(html: string): string {
	return html.replace(
		/<a\s([^>]*)>([\s\S]*?)<\/a>/gi,
		(_match, attrs: string, content: string) => {
			const hrefMatch = attrs.match(/href=["']([^"']*)["']/);
			const href = hrefMatch?.[1] ?? "";

			// Remove links with empty or hash-only href
			if (!href || href === "#" || href.startsWith("javascript:")) {
				return content;
			}

			const isExternal =
				href.startsWith("http://") || href.startsWith("https://");

			let newAttrs = attrs;

			// Add rel for external links
			if (isExternal && !attrs.includes("rel=")) {
				newAttrs += ' rel="noopener noreferrer"';
			}

			// Add target for external links
			if (isExternal && !attrs.includes("target=")) {
				newAttrs += ' target="_blank"';
			}

			// Fix descriptive text for SEO
			if (!attrs.includes("aria-label")) {
				const textContent = stripTags(content).trim();
				const textLower = textContent.toLowerCase();
				const isGeneric = GENERIC_LINK_TEXTS.has(textLower);
				const isEmpty = textContent.length === 0;

				if (isGeneric || isEmpty) {
					// Try: img alt → URL path → fallback
					const label =
						extractImgAlt(content) ||
						labelFromHref(href) ||
						textContent;
					if (label) {
						const escaped = label
							.replace(/&/g, "&amp;")
							.replace(/"/g, "&quot;");
						newAttrs += ` aria-label="${escaped}"`;
					}
				}
			}

			return `<a ${newAttrs}>${content}</a>`;
		},
	);
}

/**
 * Post-process CMS HTML images:
 * - Add native loading="lazy" for performance
 * - Add fallback alt text for SEO
 * - Strip images with broken or empty src
 * - Upgrade http:// → https:// (tránh mixed content khi storefront chạy HTTPS)
 * - Strip width/height attrs (giữ aspect ratio thật, tránh Lighthouse warn)
 */
function fixHtmlImages(html: string): string {
	// 1. Add loading="lazy" to all <img> tags that don't have it
	let updated = html.replace(
		/<img\b(?![^>]*loading=)/gi,
		'<img loading="lazy"',
	);

	// 2. Add fallback alt="Hình ảnh" if missing
	updated = updated.replace(
		/<img\b(?![^>]*alt=)([^>]*)>/gi,
		'<img alt="Hình ảnh"$1>',
	);

	// 3. Upgrade src về HTTPS:
	//    - `http://...` → `https://...`
	//    - `//host/...` (protocol-relative) → `https://host/...`
	updated = updated.replace(
		/(<img\b[^>]*\bsrc\s*=\s*["'])http:\/\//gi,
		"$1https://",
	);
	updated = updated.replace(
		/(<img\b[^>]*\bsrc\s*=\s*["'])\/\/(?!\/)/gi,
		"$1https://",
	);

	// 4. Strip cứng width/height attribute + width/height bên trong inline style.
	//    Lý do: CMS bizweb thường nhúng size không khớp natural ratio →
	//    Lighthouse báo "incorrect aspect ratio". Để browser tự render theo
	//    natural size + max-width:100% để không tràn container.
	updated = updated.replace(
		/(<img\b[^>]*?)\s(?:width|height)\s*=\s*["']?[^"'\s>]*["']?/gi,
		"$1",
	);
	// Trường hợp width/height nằm trong inline style="..." → strip riêng.
	updated = updated.replace(
		/(<img\b[^>]*\bstyle\s*=\s*["'])([^"']*)(["'])/gi,
		(_match, before: string, css: string, after: string) => {
			const cleaned = css
				.split(";")
				.map((s) => s.trim())
				.filter((s) => s && !/^(width|height)\s*:/i.test(s))
				.join(";");
			return `${before}${cleaned}${after}`;
		},
	);
	// Sau khi strip, đảm bảo có `style="height:auto;max-width:100%"` để giữ ratio.
	updated = updated.replace(
		/<img\b(?![^>]*\bstyle=)([^>]*)>/gi,
		'<img style="height:auto;max-width:100%"$1>',
	);
	updated = updated.replace(
		/<img\b([^>]*)\bstyle\s*=\s*(["'])([^"']*)\2([^>]*)>/gi,
		(_match, before: string, q: string, css: string, after: string) => {
			let next = css.trim().replace(/;\s*$/, "");
			if (!/height\s*:/i.test(next)) {
				next = `${next}${next ? ";" : ""}height:auto`;
			}
			if (!/max-width\s*:/i.test(next)) {
				next = `${next}${next ? ";" : ""}max-width:100%`;
			}
			return `<img${before}style=${q}${next}${q}${after}>`;
		},
	);

	// 5. Remove <img> tags without valid src
	updated = updated.replace(/<img\b[^>]*>/gi, (match) => {
		const srcMatch = match.match(/src\s*=\s*["']([^"']*)["']/i);
		if (!srcMatch || !srcMatch[1]) return "";

		const src = srcMatch[1].trim();
		const isValidSrc =
			src.startsWith("http://") ||
			src.startsWith("https://") ||
			src.startsWith("data:") ||
			src.startsWith("/") ||
			src.startsWith("./") ||
			src.match(/^[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/);

		return isValidSrc ? match : "";
	});

	return updated;
}

function parseDescriptionHeadings(html: string): {
	toc: TocItem[];
	htmlWithIds: string;
} {
	const toc: TocItem[] = [];
	const usedIds = new Set<string>();

	const htmlWithIds = html.replace(
		/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
		(_match, tag: string, attrs: string, content: string) => {
			const text = stripTags(content);
			let id = slugify(text);

			if (usedIds.has(id)) {
				let i = 2;
				while (usedIds.has(`${id}-${i}`)) i++;
				id = `${id}-${i}`;
			}
			usedIds.add(id);

			const level = tag.toLowerCase() === "h2" ? 2 : 3;
			toc.push({ id, text, level });

			return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
		},
	);

	return { toc, htmlWithIds };
}

// ── TOC numbering ───────────────────────────────────────────

function numberToc(items: TocItem[]): { item: TocItem; label: string }[] {
	let h2Index = 0;
	let h3Index = 0;

	return items.map((item) => {
		if (item.level === 2) {
			h2Index++;
			h3Index = 0;
			return { item, label: `${h2Index}` };
		}
		h3Index++;
		return { item, label: `${h2Index}.${h3Index}` };
	});
}

// ── Component ───────────────────────────────────────────────

export default function ParseHtmlContent({
	html,
	collapsedHeight = 497,
	tocVisibleCount = 5,
	containerClassName = "rounded-2xl bg-white",
	contentClassName = "flex flex-col gap-2 md:gap-4 p-2 md:p-4",
	alwaysExpanded = false,
}: ParseHtmlContentProps) {
	const [expanded, setExpanded] = useState(alwaysExpanded);
	const [tocOpen, setTocOpen] = useState(true);
	const [tocExpanded, setTocExpanded] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	const handleToggleExpanded = useCallback(() => {
		setExpanded((prev) => {
			const next = !prev;
			// Collapsing: bring the user back to the top of the content block
			// so they don't end up far below it after the height shrinks.
			if (!next && rootRef.current) {
				scrollToSection(rootRef.current);
			}
			return next;
		});
	}, []);

	const { toc, htmlWithIds } = useMemo(() => {
		let fixed = fixHtmlLinks(html);
		fixed = fixHtmlImages(fixed);
		return parseDescriptionHeadings(fixed);
	}, [html]);

	const numberedToc = useMemo(() => numberToc(toc), [toc]);

	const visibleToc = useMemo(() => {
		if (tocExpanded || numberedToc.length <= tocVisibleCount) {
			return numberedToc;
		}
		return numberedToc.slice(0, tocVisibleCount);
	}, [numberedToc, tocExpanded, tocVisibleCount]);

	const hasTocOverflow = numberedToc.length > tocVisibleCount;

	const handleTocClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
			e.preventDefault();
			const wasCollapsed = !expanded;
			if (wasCollapsed) setExpanded(true);

			// When expanding from collapsed, the max-height transition (300ms)
			// must finish before the target heading has its real position.
			const delay = wasCollapsed ? 300 : 0;
			window.setTimeout(() => scrollToSection(id), delay);
		},
		[expanded],
	);

	const htmlWithIdsConvert = htmlWithIds?.replace(/_quot/g, '"');

	return (
		<div
			ref={rootRef}
			className={`relative overflow-hidden ${containerClassName}`}
		>
			<div
				className={`pdp-collapsible relative ${expanded ? "is-expanded" : ""}`}
				style={
					{
						"--pdp-collapsed-height": `${collapsedHeight}px`,
					} as React.CSSProperties
				}
			>
				<div className={contentClassName}>
					{/* TOC */}
					{toc.length > 0 && (
						<div className="accordion-custom rounded-lg bg-bg-page">
							<button
								type="button"
								className="flex w-full items-center justify-between gap-2 px-3 py-2"
								onClick={() => setTocOpen((v) => !v)}
								aria-expanded={tocOpen}
								aria-controls="toc-panel"
								aria-label="Mở rộng hoặc thu gọn mục lục"
							>
								<div className="flex items-center gap-2">
									<List
										className="h-4 w-4 text-text-secondary"
										aria-hidden="true"
									/>
									<span className="text-sm leading-5 font-medium text-text-secondary">
										Nội dung chính
									</span>
								</div>
								<ChevronDown
									className={`h-4 w-4 shrink-0 text-text-secondary transition-transform duration-300 ease-out ${
										tocOpen ? "rotate-180" : ""
									}`}
									aria-hidden="true"
								/>
							</button>

							<div
								id="toc-panel"
								role="region"
								className={`accordion-custom-content ${tocOpen ? "is-open" : ""}`}
							>
								<div className="accordion-custom-inner">
									<nav
										className="flex flex-col px-3 pb-3"
										aria-label="Mục lục nội dung"
									>
										{visibleToc.map(({ item, label }) => (
											<a
												key={item.id}
												href={`#${item.id}`}
												className={`py-0.5 text-left text-sm leading-5 text-text-secondary no-underline transition-colors hover:text-text-link ${
													item.level === 3
														? "pl-2.5"
														: ""
												}`}
												onClick={(e) =>
													handleTocClick(e, item.id)
												}
											>
												{label}. {item.text}
											</a>
										))}

										{hasTocOverflow && (
											<button
												type="button"
												className="mt-1 text-left text-sm leading-5 font-medium text-text-link transition-colors hover:underline"
												onClick={() =>
													setTocExpanded((v) => !v)
												}
											>
												{tocExpanded
													? "Thu gọn mục lục"
													: "Xem tất cả mục lục"}
											</button>
										)}
									</nav>
								</div>
							</div>
						</div>
					)}

					{/* Description HTML content — CMS from API */}
					<div
						className="category-description pdp-prose"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: CMS HTML content, sanitized server-side
						dangerouslySetInnerHTML={{ __html: htmlWithIdsConvert }}
					/>
				</div>

				{!alwaysExpanded && (
					<div className="pdp-collapsible-fade pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white to-transparent" />
				)}
			</div>

			{!alwaysExpanded && (
				<div className="pb-4 pt-2 text-center">
					<button
						type="button"
						className="inline-flex items-center gap-1 text-sm font-medium text-text-link hover:underline"
						aria-expanded={expanded}
						onClick={handleToggleExpanded}
					>
						{expanded ? "Thu gọn" : "Xem thêm"}
						<ChevronDown
							className={`h-5 w-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
							aria-hidden="true"
						/>
					</button>
				</div>
			)}
		</div>
	);
}
