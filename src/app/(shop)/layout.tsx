import type { Metadata } from "next";
import { cookies } from "next/headers";

import BottomFloatingStack from "@/components/layout/BottomFloatingStack";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HeaderMobileGate } from "@/components/layout/HeaderMobileGate.client";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { extractMenuItems, getPageLayout } from "@/lib/api/layout";
import { COOKIE_ACCESS_TOKEN } from "@/lib/constants/cookies";
import { isMobileUA } from "@/lib/utils/device";
import { AuthProvider } from "@/providers/AuthProvider";
import { BottomSlotProvider } from "@/providers/BottomSlotProvider";
import { DeviceStoreInit } from "@/store/DeviceStoreInit";
import type { GroupedSection } from "@/types/page";
import { TooltipProvider } from "../../components/common/tooltip";
import { envConfig } from "@/lib/configs";

export const metadata: Metadata = {
	title: {
		default:
			"Công ty TNHH Kỹ thuật - Dịch vụ NORA | Thiết bị cơ điện, hồ bơi, cửa xây dựng",
		template: "%s | NORA",
	},
	description:
		"CÔNG TY TNHH KỸ THUẬT – DỊCH VỤ NORA chuyên cung cấp thiết bị cơ điện, hồ bơi và cửa xây dựng. Cam kết chất lượng – an toàn – giá trị sử dụng cho mọi công trình.",
	keywords: [
		"NORA",
		"NORA VN",
		"Kỹ thuật NORA",
		"Dịch vụ NORA",
		"thiết bị cơ điện",
		"thiết bị MEP",
		"thiết bị hồ bơi",
		"cửa xây dựng",
		"cửa công trình",
		"thi công cơ điện",
		"giải pháp cơ điện",
		"hồ bơi gia đình",
		"thiết bị lọc hồ bơi",
		"TP.HCM",
		"Sài Gòn",
		"Bình Tân",
	],
	authors: [{ name: "Công ty TNHH Kỹ thuật - Dịch vụ NORA" }],
	creator: "Công ty TNHH Kỹ thuật - Dịch vụ NORA",
	publisher: "Công ty TNHH Kỹ thuật - Dịch vụ NORA",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "vi_VN",
		url: envConfig.NEXT_PUBLIC_APP_URL ?? "https://noravn.com",
		siteName: "Công ty TNHH Kỹ thuật - Dịch vụ NORA",
		title:
			"Công ty TNHH Kỹ thuật - Dịch vụ NORA | Thiết bị cơ điện, hồ bơi, cửa xây dựng",
		description:
			"NORA - Giải pháp kỹ thuật cho thiết bị cơ điện, hồ bơi và cửa xây dựng. Chất lượng - an toàn - giá trị sử dụng.",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Công ty TNHH Kỹ thuật - Dịch vụ NORA",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title:
			"Công ty TNHH Kỹ thuật - Dịch vụ NORA | Thiết bị cơ điện, hồ bơi, cửa xây dựng",
		description:
			"NORA - Giải pháp kỹ thuật cho thiết bị cơ điện, hồ bơi và cửa xây dựng.",
		images: ["/og-image.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default async function ShopLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const hasToken = cookieStore.has(COOKIE_ACCESS_TOKEN);

	let menuItems: Awaited<ReturnType<typeof extractMenuItems>> = [];
	let layoutSections: GroupedSection[] = [];
	const isMobile = await isMobileUA();
	try {
		const layout = await getPageLayout();

		menuItems = extractMenuItems(layout);
		layoutSections = (layout.sections ?? []).map((section) => ({
			section: section as unknown as GroupedSection["section"],
			items: (section.items ?? []) as GroupedSection["items"],
		}));
	} catch (error) {
		console.error("[ShopLayout] Failed to fetch layout:", error);
	}

	return (
		<AuthProvider hasToken={hasToken}>
			<BottomSlotProvider>
				<DeviceStoreInit isMobile={isMobile} />
				<div className="flex min-h-screen flex-col relative pb-[env(safe-area-inset-bottom)] md:pb-0">
					<HeaderMobileGate>
						<Header menuItems={menuItems} />
					</HeaderMobileGate>
					<main className="flex-1">
						<TooltipProvider>{children}</TooltipProvider>
					</main>
					<Footer layoutSections={layoutSections} />
					{isMobile && <MobileBottomNav menuItems={menuItems} />}
					<BottomFloatingStack />
				</div>
			</BottomSlotProvider>
		</AuthProvider>
	);
}
