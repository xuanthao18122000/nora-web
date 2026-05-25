import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Timeline",
	description:
		"Horizontal event timeline with countdown and time slots; one active slot highlighted.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
