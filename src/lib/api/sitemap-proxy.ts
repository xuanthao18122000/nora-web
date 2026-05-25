import { envConfig } from "@/lib/configs/env";

const NOCACHE_HEADERS = {
	"Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate",
};

export async function proxyFromBackend(
	backendPath: string,
	contentType: "application/xml" | "text/plain",
	emptyFallback: string,
): Promise<Response> {
	// BE mount routes ở root. Path truyền vào dạng `/fe/sitemap.xml`
	// → URL final là `<BACKEND_URL>/fe/sitemap.xml`.
	const base = (envConfig.BACKEND_URL ?? "").replace(/\/$/, "");
	const normalizedPath = backendPath.startsWith("/")
		? backendPath
		: `/${backendPath}`;
	const url = `${base}${normalizedPath}`;
	try {
		const res = await fetch(url, {
			cache: "no-store",
			headers: { Accept: contentType },
		});

		if (!res.ok) {
			console.error(
				`[sitemap-proxy] BE returned ${res.status} for ${url}`,
			);
			return new Response(emptyFallback, {
				status: 200,
				headers: {
					"Content-Type": `${contentType}; charset=utf-8`,
					...NOCACHE_HEADERS,
				},
			});
		}

		const text = await res.text();
		return new Response(text, {
			status: 200,
			headers: {
				"Content-Type": `${contentType}; charset=utf-8`,
				...NOCACHE_HEADERS,
			},
		});
	} catch (err) {
		console.error(`[sitemap-proxy] Failed to fetch ${url}:`, err);
		return new Response(emptyFallback, {
			status: 200,
			headers: {
				"Content-Type": `${contentType}; charset=utf-8`,
				...NOCACHE_HEADERS,
			},
		});
	}
}
