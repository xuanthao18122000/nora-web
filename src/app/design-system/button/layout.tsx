import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Button",
	description: "Button component — variants, colors, and sizes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
