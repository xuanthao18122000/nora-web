import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Breadcrumb",
	description: "Breadcrumb navigation for category and product pages.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
