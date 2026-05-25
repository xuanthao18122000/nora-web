import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Deal Hot Section",
	description:
		"Deal hot link tiles — title, optional dismiss, square promos in a carousel (Figma: recommeded).",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
