import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Filter",
	description:
		"Filter buttons and FilterResultChip for product listing filters.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
