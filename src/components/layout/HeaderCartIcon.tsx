"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useIsMounted } from "usehooks-ts";
import { useCartStore } from "@/store/useCartStore";

export function HeaderCartIcon() {
	const items = useCartStore((s) => s.items);
	const _hasHydrated = useCartStore((s) => s._hasHydrated);

	const cartCount = items.length;
	const isMounted = useIsMounted();

	return (
		<Link
			href="/cart"
			className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
			aria-label="Giỏ hàng"
		>
			<span className="relative">
				<ShoppingCart className="size-5" />
				{isMounted() && _hasHydrated && cartCount > 0 && (
					<span className="absolute -top-1.5 -right-2 size-3.5 bg-orange-500 border border-white rounded-full flex items-center justify-center text-xxs text-white font-medium">
						{cartCount > 9 ? "9+" : cartCount}
					</span>
				)}
			</span>
			<span className="hidden md:inline">Giỏ hàng</span>
		</Link>
	);
}
