/**
 * Centralized Next.js cache tag builders.
 *
 * Group tags (e.g. `policy`) let an admin clear ALL items of a kind via the
 * CMS Cache Management page; specific tags (e.g. `policy-chinh-sach-bao-mat`)
 * target one entity. Convention: kebab-case, lowercase. Group tag MUST equal
 * the prefix used by specific tags (`policy` → `policy-${slug}`).
 *
 * Only fetches that already opt into Next.js caching (`next.revalidate` or
 * implicit `force-cache`) should attach tags — adding a tag to a default-no-
 * cache fetch silently turns it into an indefinite cache.
 */
export const CACHE_TAGS = {
	LAYOUT: "layout",

	PAGE: "page",
	pageBySlug: (slug: string) => `page-${slug}`,

	POLICY: "policy",
	POLICIES_TREE: "policies-tree",
	policyBySlug: (slug: string) => `policy-${slug}`,

	FACETS: "facets",
	TRADE_IN: "trade-in",
} as const;
