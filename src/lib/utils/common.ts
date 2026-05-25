import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { z } from "zod/v4";
import type { SearchParams } from "@/types/common";

/**
 * Extract search params that are not in the exclude keys list.
 * Useful for preserving non-facet params (q, sort, page, etc.) in filter forms.
 */
export function getPreservedEntries(
	searchParams: SearchParams,
	excludeKeys: string[],
): Array<[string, string]> {
	const entries: Array<[string, string]> = [];

	for (const [key, raw] of Object.entries(searchParams)) {
		if (excludeKeys.includes(key)) continue;
		if (raw === undefined) continue;

		if (Array.isArray(raw)) {
			for (const v of raw) entries.push([key, v]);
		} else {
			entries.push([key, raw]);
		}
	}

	return entries;
}

/**
 * Flatten raw `SearchParams` (values may be `string | string[]`) into a
 * plain `Record<string, string | undefined>` by keeping only the first
 * element of each array, then validate with the supplied Zod schema.
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   q: z.string().catch(""),
 *   page: z.coerce.number().int().min(1).catch(1),
 * });
 * const parsed = parseQueryParams(await searchParams, schema);
 * ```
 */
export function parseQueryParams<T extends z.ZodType>(
	sp: SearchParams,
	schema: T,
): z.output<T> {
	const flat: Record<string, string | undefined> = {};
	for (const [key, value] of Object.entries(sp)) {
		flat[key] = Array.isArray(value) ? value[0] : value;
	}
	return schema.parse(flat);
}

/**
 * Get membership tier reset date (01/01 of next year)
 * @returns formatted date string "01/01/YYYY"
 */
export function getMembershipResetDate(): string {
	const nextYear = new Date().getFullYear() + 1;
	return `01/01/${nextYear}`;
}
