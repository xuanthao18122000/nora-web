import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Banner",
	description: "Hero banner with main slides and optional side banners.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
