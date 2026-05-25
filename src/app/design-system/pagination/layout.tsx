import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pagination",
	description: "Pagination component for listing pages.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
