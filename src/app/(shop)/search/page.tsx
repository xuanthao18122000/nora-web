import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import { ProductList } from "@/components/common/product-list";
import { SortByRoot } from "@/components/feature/filter/components/SortBy.client";
import RecentlyViewedSection from "@/components/feature/recently-viewed/views/RecentlyViewedSection";
import { getSearchResults } from "@/components/feature/search/api/get-search-results";
import { SearchProductLoadMore } from "@/components/feature/search/components/search-product-load-more.client";
import { ResultsCategoriesRoot } from "@/components/feature/search/components/sections/results-categories-chips.client";
import { SearchCategoriesCarousel } from "@/components/feature/search/components/sections/search-categories-carousel.client";
import { SearchSortCarousel } from "@/components/feature/search/components/sections/search-sort-carousel.client";
import { mapSearchProductToCard } from "@/components/feature/search/utils/map-search-product";
import { searchQuerySchema } from "@/components/feature/search/utils/search-query.schema";
import { parseQueryParams } from "@/lib/utils/common";

import type { SearchParams } from "@/types/common";

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
	const { q } = parseQueryParams(await searchParams, searchQuerySchema);
	const trimmed = q.trim();
	const title = trimmed ? `Tìm kiếm: ${trimmed}` : "Tìm kiếm";

	return {
		title,
		description: trimmed
			? `Kết quả tìm kiếm cho "${trimmed}".`
			: "Tìm kiếm sản phẩm.",
	};
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const search = parseQueryParams(await searchParams, searchQuerySchema);

	const { products, categories } = await getSearchResults(search.q, search);
	const categoryItems = categories?.items ?? [];
	const hasResults = products.items.length > 0;

	return (
		<ViewTransition default="auto">
			<section className="container-inner my-2 md:my-4 space-y-2 md:space-y-4">
				<Breadcrumb
					items={[
						{ label: "Trang chủ", href: "/" },
						{
							label: `Tìm kiếm với từ khoá: ${search.q}`,
						},
					]}
				/>

				<p className="sr-only" aria-live="polite" role="status">
					{products.total > 0
						? `Tìm thấy ${products.total} sản phẩm`
						: "Không tìm thấy kết quả"}
				</p>

				{hasResults ? (
					<>
						{categoryItems.length > 0 && (
							<ResultsCategoriesRoot
								items={categoryItems}
								query={search.q}
								currentSlug={search.category}
							>
								<SearchCategoriesCarousel />
							</ResultsCategoriesRoot>
						)}
						<div className="rounded-2xl bg-white p-2 md:p-4 space-y-2 md:space-y-4">
							<SortByRoot>
								<SearchSortCarousel />
							</SortByRoot>
							<ProductList.Root>
								<ProductList.Grid>
									{products.items.map((p, i) => (
										<ProductList.Item
											key={p.id}
											product={mapSearchProductToCard(p)}
											priority={i < 5}
										/>
									))}
									<SearchProductLoadMore
										search={search}
										initialPage={products.page}
										totalProducts={products.total}
									/>
								</ProductList.Grid>
							</ProductList.Root>
						</div>

						<RecentlyViewedSection />
					</>
				) : (
					<NotFoundSearchResults />
				)}
			</section>
		</ViewTransition>
	);
}

function NotFoundSearchResults() {
	const imgSearchEmpty = "/not-found.svg";

	return (
		<div className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
			<div className="flex flex-col items-center gap-3 md:gap-4">
				<div className="relative size-[100px] shrink-0 md:size-[140px]">
					<Image
						alt=""
						src={imgSearchEmpty}
						fill
						sizes="(max-width: 768px) 100px, 140px"
						className="object-contain"
						loading="eager"
					/>
				</div>

				<div className="flex flex-col items-center text-center leading-sm not-italic">
					<p className="w-full max-w-[488px] text-sm font-semibold text-text-primary">
						Kết quả tìm kiếm
					</p>
					<p className="w-full max-w-[488px] text-xs md:text-sm font-normal text-text-secondary">
						Rất tiếc, Ắc Quy HN Sài Gòn không tìm thấy kết quả nào
						phù hợp với từ khoá bạn tìm kiếm
					</p>
				</div>

				<p className="w-full max-w-[488px] text-center text-xs md:text-sm font-bold text-text-primary leading-sm not-italic">
					Để tìm được kết quả chính xác hơn, bạn vui lòng:
				</p>

				<ul className="w-full max-w-[292px] list-disc pl-5 text-left text-xs md:text-sm font-normal leading-sm text-text-secondary">
					<li>Kiểm tra lỗi chính tả của từ khóa đã nhập</li>
					<li>Thử lại bằng từ khóa khác</li>
					<li>Thử lại bằng những từ khóa tổng quát hơn</li>
					<li>Thử lại bằng những từ khóa ngắn gọn hơn</li>
				</ul>

				<Link href="/">
					<Button variant="filled" size={"sm"}>
						Quay về trang chủ
					</Button>
				</Link>
			</div>
		</div>
	);
}
