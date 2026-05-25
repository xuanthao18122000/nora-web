import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Range Slider",
	description: "Range slider for price or numeric filters.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
