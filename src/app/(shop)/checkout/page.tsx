import type { Metadata } from "next";
import CheckoutShell from "@/components/feature/checkout/CheckoutShell";

export const metadata: Metadata = {
	title: "Thanh toán | Ắc Quy HN Sài Gòn",
	description:
		"Hoàn tất đơn hàng và chọn phương thức thanh toán tại Ắc Quy HN Sài Gòn.",
};

export default function CheckoutPage() {
	return <CheckoutShell />;
}
