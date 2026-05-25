import { z } from "zod/v4";

export const searchSortSchema = z.enum([
	"relevance",
	"promotion",
	"price_asc",
	"price_desc",
]);

export const searchQuerySchema = z.object({
	q: z.string().trim().max(200).catch(""),
	category: z.string().optional(),
	sort: searchSortSchema.optional().default("relevance"),
	productPage: z.coerce.number().int().min(1).catch(1),
	categoryPage: z.coerce.number().int().min(1).catch(1),
	productLimit: z.coerce.number().int().min(1).max(50).catch(20),
	categoryLimit: z.coerce.number().int().min(1).max(20).catch(5),
});

export type SearchQuery = z.output<typeof searchQuerySchema>;
export type SearchSort = z.output<typeof searchSortSchema>;
