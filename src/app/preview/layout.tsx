import type { Metadata } from "next";
import { Header } from "@/components/layout";

export const metadata: Metadata = {
	title: "Component Preview — DDV",
	robots: {
		index: false,
		follow: false,
	},
};

export default function PreviewLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
