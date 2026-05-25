import type { NextConfig } from "next";

const shouldBuildStandalone = process.env.BUILD_STANDALONE === "true";
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		viewTransition: true,
	},
	reactCompiler: true,
	output: shouldBuildStandalone ? "standalone" : undefined,
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
	images: {
		// Cho phép mọi HTTPS host — data sản phẩm migrate từ Bizweb dùng nhiều CDN khác nhau
		// (giaphatbattery.com, bizweb.dktcdn.net, ...). Production có thể siết lại whitelist.
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		// Next.js 16 yêu cầu allowlist quality values explicit. Mặc định chỉ allow [75].
		// Thêm 70 để banner dùng được + giữ 75/85/100 cho các use case khác.
		qualities: [70, 75, 85, 100],
		// Modern formats — tự fallback PNG/JPEG cho browser cũ. Giảm 30–50% size.
		// Dev mode: bỏ AVIF (encode chậm 5-10s/ảnh, blocking compile). Prod giữ nguyên.
		formats: isDev ? ["image/webp"] : ["image/avif", "image/webp"],
		// Cache 7 ngày tại CDN/Next image optimizer
		minimumCacheTTL: 60 * 60 * 24 * 7,
		// Bỏ size không dùng trong responsive — giảm số lần optimize.
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [64, 96, 128, 256, 384],
	},

	// Strip console.log/info/debug ở production — giữ console.error/warn cho debug.
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? { exclude: ["error", "warn"] }
				: false,
	},

	// Permanent redirects for legacy URLs.
	// Convention: flat slug, KHÔNG `.html`. Redirect mọi `*.html` về flat
	// để giữ ranking từ data cũ và bookmark cũ. Các trang sitemap dạng XML
	// được loại trừ ở regex `\\.xml`.
	async redirects() {
		return [
			{
				// Bắt mọi path kết thúc bằng `.html` (1+ segment), redirect 301
				// về cùng path không có `.html`. Loại trừ root + sitemap.xml.
				source: "/:slug*\\.html",
				destination: "/:slug*",
				permanent: true,
			},
		];
	},

};

export default nextConfig;
