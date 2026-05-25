import Image from "next/image";
import Link from "next/link";
import { ProductList } from "@/components/common/product-list";
import { SortByHead } from "@/components/feature/filter";
import type { CategoryPageProductItem } from "@/types/category-page";
import { mapCategoryProductToCard } from "../utils/map-category-product";
import { CategoryProductLoadMore } from "./CategoryProductLoadMore.client";

interface CategoryProductGridProps {
	slug: string;
	categoryId: number;
	products: {
		items: CategoryPageProductItem[];
		total: number;
		page: number;
		limit: number;
	};
	searchParams?: Record<string, string | string[] | undefined>;
}

export function CategoryProductGrid({
	slug,
	categoryId,
	products,
	searchParams,
}: CategoryProductGridProps) {
	const isEmpty = products.items.length === 0;

	return (
		<div className="rounded-2xl bg-white">
			<div className="p-2 md:p-4 space-y-2 md:space-y-4">
				<SortByHead showSearch />
				{isEmpty ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<Image
							src="/not-found.svg"
							alt=""
							width={140}
							height={140}
							className="mb-4"
							aria-hidden="true"
						/>
						<p className="text-sm font-bold text-text-primary">
							Không tìm thấy sản phẩm phù hợp
						</p>
						<p className="mt-1 text-sm text-text-secondary">
							Hãy thử bỏ bớt bộ lọc hoặc tìm với từ khoá khác.
						</p>
						<Link
							href={`/${slug}`}
							className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
						>
							Xoá bộ lọc
						</Link>
					</div>
				) : (
					<ProductList.Root>
						<ProductList.Grid>
							{products.items.map((p, index) => (
								<ProductList.Item
									key={p.id}
									product={mapCategoryProductToCard(p)}
									priority={index < 4}
								/>
							))}
							<CategoryProductLoadMore
								categoryId={categoryId}
								sort={searchParams?.sort as string | undefined}
								initialPage={products.page}
								limit={products.limit}
								totalProducts={products.total}
								searchParams={searchParams}
							/>
						</ProductList.Grid>
					</ProductList.Root>
				)}
			</div>
		</div>
	);
}
