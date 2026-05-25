import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Radius & Shadows",
	description: "Border radius and shadow tokens from the design system.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
