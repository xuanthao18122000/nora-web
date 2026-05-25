import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Header } from "@/components/layout";
import BottomFloatingStack from "@/components/layout/BottomFloatingStack";

export const metadata: Metadata = {
	title: "Design System",
	description: "DDV design system — components, tokens, and patterns.",
	robots: {
		index: false,
		follow: false,
	},
};

const NAV = {
	overview: { label: "Overview", href: "/design-system" },
	foundations: [
		{ label: "Colors", href: "/design-system/colors" },
		{ label: "Typography", href: "/design-system/typography" },
		{ label: "Radius & Shadows", href: "/design-system/radius-shadows" },
	],
	components: [
		{ label: "Banner", href: "/design-system/banner" },
		{ label: "Badges", href: "/design-system/badges" },
		{ label: "Breadcrumb", href: "/design-system/breadcrumb" },
		{ label: "Button", href: "/design-system/button" },
		{ label: "Carousel", href: "/design-system/carousel" },
		{ label: "Deal Hot Section", href: "/design-system/deal-hot-section" },
		{ label: "Input", href: "/design-system/input" },
		{ label: "Filter", href: "/design-system/filter" },
		{ label: "Flash Sale Card", href: "/design-system/flash-sale-card" },
		{ label: "Menu Item", href: "/design-system/menu-item" },
		{ label: "Pagination", href: "/design-system/pagination" },
		{ label: "Product Card", href: "/design-system/product-card" },
		{ label: "Range Slider", href: "/design-system/range-slider" },
		{ label: "Rating & Price", href: "/design-system/rating-price" },
		{ label: "Search Input", href: "/design-system/search-input" },
		{ label: "Tab", href: "/design-system/tab" },
	],
	other: [
		{ label: "Roadmap", href: "/design-system/road-map" },
		{ label: "Compare Test", href: "/design-system/compare-test" },
	],
} as const;

const linkClass =
	"block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

export default function DesignSystemLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-100">
				<div className="container-inner flex gap-8 py-8">
					<nav
						className="w-52 shrink-0"
						aria-label="Design system navigation"
					>
						<ul className="flex flex-col gap-6">
							<li>
								<Link
									href={NAV.overview.href}
									className={linkClass}
								>
									{NAV.overview.label}
								</Link>
							</li>
							<li>
								<span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
									Foundations
								</span>
								<ul className="mt-1 flex flex-col gap-0.5">
									{NAV.foundations.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												className={linkClass}
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</li>
							<li>
								<span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
									Components
								</span>
								<ul className="mt-1 flex flex-col gap-0.5">
									{NAV.components.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												className={linkClass}
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</li>
							<li>
								<span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
									Other
								</span>
								<ul className="mt-1 flex flex-col gap-0.5">
									{NAV.other.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												className={linkClass}
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</li>
						</ul>
					</nav>
					<main className="min-w-0 flex-1">{children}</main>
				</div>
			</div>
			<BottomFloatingStack />
		</>
	);
}
