import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Product Card",
	description: "Product card with image, price, badges, and labels.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
