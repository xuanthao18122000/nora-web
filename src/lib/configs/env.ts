import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const booleanSchema = z
	.string()
	.optional()
	.transform((val) => {
		if (!val || val === "") return false;
		return (
			val.toLowerCase() === "true" ||
			val === "1" ||
			val.toLowerCase() === "yes"
		);
	})
	.pipe(z.boolean());

export const envConfig = createEnv({
	server: {
		BUILD_STANDALONE: booleanSchema.default(false),
		BACKEND_URL: z.url().default("http://localhost:4001"),
	},
	client: {
		// Can be absolute (e.g. "https://api.example.com") or relative (e.g. "/api")
		NEXT_PUBLIC_API_URL: z.string().min(1).default("/api"),
		NEXT_PUBLIC_CDN_URL: z.url().default("https://cdn-web-stg.ddverp.com"),
		/** Production site URL for metadataBase (OG, canonical). Optional in dev. */
		NEXT_PUBLIC_APP_URL: z.string().url().optional(),
	},
	runtimeEnv: {
		BUILD_STANDALONE: process.env.BUILD_STANDALONE,
		NODE_ENV: process.env.NODE_ENV,
		BACKEND_URL: process.env.BACKEND_URL,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
	shared: {
		NODE_ENV: z.enum(["development", "test", "staging", "production"]),
	},
});
