import { proxyFromBackend } from "@/lib/api/sitemap-proxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EMPTY_URLSET =
	'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>';

export async function GET() {
	return proxyFromBackend("/fe/sitemap.xml", "application/xml", EMPTY_URLSET);
}
