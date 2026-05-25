import Link from "next/link";

export const metadata = {
	title: "Overview",
	description: "DDV design system — components, tokens, and patterns.",
};

const FOUNDATIONS = [
	{
		title: "Colors",
		href: "/design-system/colors",
		description:
			"Palettes and utility classes. Copy class names from the grid.",
	},
	{
		title: "Typography",
		href: "/design-system/typography",
		description: "Font family, size, line height, and weight tokens.",
	},
	{
		title: "Radius & Shadows",
		href: "/design-system/radius-shadows",
		description:
			"Border radius and shadow tokens. Use Tailwind classes from globals.css.",
	},
] as const;

const COMPONENTS = [
	{
		title: "Banner",
		href: "/design-system/banner",
		description: "Hero banner with main slides and optional side banners.",
	},
	{
		title: "Badges",
		href: "/design-system/badges",
		description: "Offer, New, Online, HotSale, OfferLink badges.",
	},
	{
		title: "Breadcrumb",
		href: "/design-system/breadcrumb",
		description: "Breadcrumb trail for category and product pages.",
	},
	{
		title: "Button",
		href: "/design-system/button",
		description: "Filled, bordered, soft, link, pill, filter variants.",
	},
	{
		title: "Carousel",
		href: "/design-system/carousel",
		description: "Carousel, CarouselNav, Recently Viewed Card.",
	},
	{
		title: "Deal Hot Section",
		href: "/design-system/deal-hot-section",
		description:
			"Deal hot title, dismiss, square promo tiles (no CMS section key).",
	},
	{
		title: "Input",
		href: "/design-system/input",
		description:
			"Compound input: Label, Slot, LeadingIcon, Field, Message.",
	},
	{
		title: "Filter",
		href: "/design-system/filter",
		description: "Filter buttons and FilterResultChip.",
	},
	{
		title: "Flash Sale Card",
		href: "/design-system/flash-sale-card",
		description: "Flash sale product card with progress.",
	},
	{
		title: "Menu Item",
		href: "/design-system/menu-item",
		description: "Nav menu item for category tabs.",
	},
	{
		title: "Pagination",
		href: "/design-system/pagination",
		description: "Page navigation for listing pages.",
	},
	{
		title: "Product Card",
		href: "/design-system/product-card",
		description: "Product card with image, price, badges.",
	},
	{
		title: "Range Slider",
		href: "/design-system/range-slider",
		description: "Range slider for price or numeric filters.",
	},
	{
		title: "Rating & Price",
		href: "/design-system/rating-price",
		description: "Star rating and price display.",
	},
	{
		title: "Search Input",
		href: "/design-system/search-input",
		description: "Search field for header or search pages.",
	},
	{
		title: "Tab",
		href: "/design-system/tab",
		description: "Default and underline variants.",
	},
	{
		title: "Timeline",
		href: "/design-system/timeline",
		description:
			"Event timeline with countdown and time slots; one active slot.",
	},
] as const;

const OTHER = [
	{
		title: "Roadmap",
		href: "/design-system/road-map",
		description: "Changelog and what’s next.",
	},
] as const;

const linkClass =
	"group block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

export default function DesignSystemPage() {
	return (
		<div className="space-y-10">
			<header>
				<h1 className="mb-2 text-2xl font-bold text-gray-900">
					Design System
				</h1>
				<p className="text-gray-600">
					Components and tokens used across DDV store, aligned with
					Figma.
				</p>
			</header>

			<section aria-labelledby="foundations-heading">
				<h2
					id="foundations-heading"
					className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
				>
					Foundations
				</h2>
				<ul className="grid gap-4 sm:grid-cols-2">
					{FOUNDATIONS.map((item) => (
						<li key={item.href}>
							<Link href={item.href} className={linkClass}>
								<span className="font-semibold text-gray-900 group-hover:text-blue-500">
									{item.title}
								</span>
								<p className="mt-1 text-sm text-gray-600">
									{item.description}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="components-heading">
				<h2
					id="components-heading"
					className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
				>
					Components
				</h2>
				<ul className="grid gap-4 sm:grid-cols-2">
					{COMPONENTS.map((item) => (
						<li key={item.href}>
							<Link href={item.href} className={linkClass}>
								<span className="font-semibold text-gray-900 group-hover:text-blue-500">
									{item.title}
								</span>
								<p className="mt-1 text-sm text-gray-600">
									{item.description}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="other-heading">
				<h2
					id="other-heading"
					className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
				>
					Other
				</h2>
				<ul className="grid gap-4 sm:grid-cols-2">
					{OTHER.map((item) => (
						<li key={item.href}>
							<Link href={item.href} className={linkClass}>
								<span className="font-semibold text-gray-900 group-hover:text-blue-500">
									{item.title}
								</span>
								<p className="mt-1 text-sm text-gray-600">
									{item.description}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
