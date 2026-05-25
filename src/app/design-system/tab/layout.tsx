import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tab",
	description: "Tab component — default and underline variants.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
