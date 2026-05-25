/**
 * Basic HTML sanitizer for PDP HTML fields coming from backend/CMS.
 *
 * - Prefer DOMParser-based sanitization when running in the browser.
 * - Fallback to a conservative regex-based cleanup for environments without DOMParser.
 *
 * Note: This is not as feature-complete as DOMPurify, but it blocks the common
 * vectors we expect from CMS HTML (script/style tags, event handlers, javascript: URLs).
 */
export function sanitizeHtml(html: string): string {
	if (!html) return "";

	// IMPORTANT: Keep this deterministic across SSR and CSR.
	// Using DOMParser would produce different HTML serialization on server vs client,
	// which triggers hydration mismatches in Next.js client components.
	return String(html)
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
		.replace(/\s(?:href|src)\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, "")
		.trim();
}
