import { proxyFromBackend } from "@/lib/api/sitemap-proxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_ROBOTS = "User-agent: *\nDisallow:\n";

export async function GET() {
	return proxyFromBackend("/fe/robots.txt", "text/plain", FALLBACK_ROBOTS);
}
