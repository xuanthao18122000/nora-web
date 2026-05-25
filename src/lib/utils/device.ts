import { headers } from "next/headers";
import { cache } from "react";

const MOBILE_UA_RE =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;

/**
 * Server-side mobile detection via User-Agent header.
 * Use in Server Components to conditionally render device-specific content,
 * avoiding unnecessary image/component downloads.
 *
 * Defaults to `false` (desktop) when UA is missing or ambiguous.
 */

export const isMobileUA = cache(async () => {
	const ua = (await headers()).get("user-agent") ?? "";
	return MOBILE_UA_RE.test(ua);
});
