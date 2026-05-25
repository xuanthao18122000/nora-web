import { cookies } from "next/headers";
import { COOKIE_RECENTLY_VIEWED } from "@/lib/constants/cookies";
import { RecentlyViewedList } from "../components/RecentlyViewedList.client";

/**
 * Server Component: reads the boolean `ddv-rv-has` cookie to decide whether
 * to render the section wrapper at all.
 *
 * - Cookie "1" → render `<RecentlyViewedList>` (client): it reads the ID list
 *   from Zustand (localStorage) and fetches product data via SWR. Reserving
 *   the section on the server prevents CLS on pages where the user *does*
 *   have recently viewed items.
 * - Cookie absent → return null: no layout space reserved, no CLS either.
 *
 * Fetching is deliberately client-side (SWR) so navigating back to a listing
 * page always shows the freshest list without relying on the Next.js Data
 * Cache / full-route cache.
 */
export default async function RecentlyViewedSection() {
	const cookieStore = await cookies();
	const hasItems = cookieStore.get(COOKIE_RECENTLY_VIEWED)?.value === "1";
	if (!hasItems) return null;

	return <RecentlyViewedList />;
}
