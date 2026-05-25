import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Flash Sale Card",
	description: "Flash sale product card with progress and countdown.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
