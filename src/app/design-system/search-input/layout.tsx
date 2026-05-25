import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Search Input",
	description: "Search input component — placeholder, onSearch.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
