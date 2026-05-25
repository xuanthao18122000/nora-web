"use client";

import { Info, ShoppingCart, Siren } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

type HeaderActionsProps = {
	cartCount?: number;
};

export function HeaderActions({ cartCount = 0 }: HeaderActionsProps) {
	return (
		<div className="flex items-center shrink-0">
			<Link
				href={ROUTES.ABOUT}
				className="flex items-center gap-1.5 px-2 sm:px-3 py-2.5 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
				aria-label="Giới thiệu"
			>
				<Info className="size-5" />
				<span className="hidden sm:inline">Giới thiệu</span>
			</Link>

			<Link
				href="/cart"
				className="flex items-center gap-1.5 px-2 sm:px-3 py-2.5 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
			>
				<span className="relative">
					<ShoppingCart className="size-5" />
					{cartCount > 0 && (
						<span className="absolute -top-1.5 -right-2 size-3.5 bg-orange-500 border border-white rounded-full flex items-center justify-center text-xxs text-white font-medium">
							{cartCount > 9 ? "9+" : cartCount}
						</span>
					)}
				</span>
				<span className="hidden sm:inline">Giỏ hàng</span>
			</Link>
		</div>
	);
}
