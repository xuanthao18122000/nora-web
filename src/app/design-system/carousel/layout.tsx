import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Carousel",
	description: "Carousel, CarouselNav, and Recently Viewed Card components.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
