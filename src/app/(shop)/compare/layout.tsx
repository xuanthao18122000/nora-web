import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "So sánh sản phẩm | Ắc Quy HN Sài Gòn",
	description:
		"So sánh thông số kỹ thuật các sản phẩm để chọn sản phẩm phù hợp nhất",
	robots: { index: false },
};

export default function CompareLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
