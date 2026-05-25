import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { type ProductCardProduct, ProductListItem } from "./item";
import { LoadMore } from "./load-more.client";

export type { ProductCardProduct };

// --- Root (wrapper) ---

export interface ProductListRootProps {
	children: ReactNode;
	className?: string;
	"aria-label"?: string;
}

export function ProductListRoot({
	children,
	className,
	"aria-label": ariaLabel = "Danh sách sản phẩm",
}: ProductListRootProps) {
	return (
		<section className={cn(className)} aria-label={ariaLabel}>
			{children}
		</section>
	);
}

// --- Grid (layout) ---

export interface ProductListGridProps {
	children: ReactNode;
	className?: string;
}

export function ProductListGrid({ children, className }: ProductListGridProps) {
	return (
		<ul
			className={cn(
				"grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5",
				className,
			)}
		>
			{children}
		</ul>
	);
}

// --- Composite export ---

export const ProductList = {
	Root: ProductListRoot,
	Grid: ProductListGrid,
	Item: ProductListItem,
	LoadMore,
} as const;
