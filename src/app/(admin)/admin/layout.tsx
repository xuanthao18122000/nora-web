import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
	title: "Admin — Acquy HN",
	robots: { index: false, follow: false },
};

/**
 * Layout cho cụm admin — KHÔNG kế thừa header/footer của storefront.
 * Mọi route /admin/* dùng layout này.
 */
export default function AdminRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
}
