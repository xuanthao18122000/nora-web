import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { ToastProvider } from "@/components/ui/Toast";
import { envConfig } from "@/lib/configs/env";
import SWRProvider from "@/providers/SwrProvider";
import "./globals.css";

const inter = Inter({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-inter",
	weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

/**
 * Root layout — tối thiểu, dùng chung cho cả `(shop)` và `(admin)`.
 * Metadata SEO + providers riêng của storefront được khai báo trong `(shop)/layout.tsx`.
 */
export const metadata: Metadata = {
	metadataBase: envConfig.NEXT_PUBLIC_APP_URL
		? new URL(envConfig.NEXT_PUBLIC_APP_URL)
		: undefined,
	icons: {
		icon: [{ url: "/logo.jpg", type: "image/jpg" }],
		shortcut: "/logo.jpg",
		apple: "/logo.jpg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi" className={inter.variable}>
			<body className="antialiased">
				<NextTopLoader
					color="#ffffff"
					height={2}
					shadow="0 0 10px #fff, 0 0 20px rgba(255,255,255,0.5)"
					showSpinner={false}
					zIndex={9999}
				/>
				<SWRProvider>
					<ToastProvider>
						<NuqsAdapter>{children}</NuqsAdapter>
						<Toaster position="top-center" richColors />
					</ToastProvider>
				</SWRProvider>
			</body>
		</html>
	);
}
