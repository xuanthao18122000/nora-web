import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Rating & Price",
	description: "Star rating and price display components.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
