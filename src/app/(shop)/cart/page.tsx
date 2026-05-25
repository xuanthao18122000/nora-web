import type { Metadata } from "next";
import CartShell from "@/components/feature/cart/views/cart-shell.client";

export const metadata: Metadata = {
	title: "Giỏ hàng | Acquy Hà Nội",
	description: "Xem và quản lý giỏ hàng của bạn.",
};

export default function CartPage() {
	return <CartShell />;
}
