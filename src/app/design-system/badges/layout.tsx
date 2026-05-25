import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Badges",
	description: "Badge components — Offer, New, Online, HotSale, OfferLink.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
