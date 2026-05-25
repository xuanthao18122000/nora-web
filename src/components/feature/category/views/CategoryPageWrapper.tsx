import { Breadcrumb } from "@/components/common";
import { CategoryChipList } from "@/components/common/CategoryChipList";
import ParseHtmlContent from "@/components/common/ParseHtmlContent";
import SatisfactionCard from "@/components/common/SatisfactionCard.client";
import { FilterInline } from "@/components/feature/filter/views/FilterInline";
import FlashSale from "@/components/feature/home/FlashSale";
import type {
	CategoryPageBreadcrumb,
	CategoryPageChild,
	CategoryPageProductItem,
} from "@/types/category-page";
import type { ResolvedCategory } from "@/types/slug";
import { CommentTargetType } from "../../comments/types";
import CommentWrapper from "../../comments/views/CommentWrapper.client";
import RecentlyViewedSection from "../../recently-viewed/views/RecentlyViewedSection";
import { getCategoryFeatured } from "../api/get-category-featured";
import { getCategoryProducts } from "../api/get-category-products";
import { FaqTargetType, getFaqs } from "../api/get-faqs";
import { CategoryProductGrid } from "../components/CategoryProductGrid";
import FeaturedProductsSection from "../components/FeaturedProductsSection.client";
import ProductHighlightNewsSection from "../components/ProductHighlightNewsSection.client";
import { buildBreadcrumbItems } from "../utils/build-breadcrumb-items";

interface CategoryPageWrapperProps {
	slug: string;
	category: ResolvedCategory;
	searchParams?: Record<string, string | string[] | undefined>;
}

interface ResolvedCategoryExtras {
	breadcrumbs?: CategoryPageBreadcrumb[];
	children?: CategoryPageChild[];
	siblings?: CategoryPageChild[];
}

export default async function CategoryPageWrapper({
	slug,
	category,
	searchParams,
}: CategoryPageWrapperProps) {
	const categoryId = category.id;
	const categoryName = category.name || category.metaTitle || "";
	const description = category.description ?? "";

	const extras = category as ResolvedCategory & ResolvedCategoryExtras;
	const breadcrumbs = extras.breadcrumbs ?? [];
	const children = extras.children ?? [];
	const siblings = extras.siblings ?? [];
	// Có con → show con. Không có con → show siblings (cùng cấp).
	const relatedCategories = children.length > 0 ? children : siblings;

	// Products bắt buộc; featured + FAQ optional (endpoint chưa có vẫn không crash)
	const productsPromise = getCategoryProducts(categoryId, searchParams);
	const [featuredRes, faqRes] = await Promise.allSettled([
		getCategoryFeatured(slug, { limit: 10 }),
		getFaqs(FaqTargetType.CATEGORY, String(categoryId)),
	]);
	const products = await productsPromise;
	const featuredItems: CategoryPageProductItem[] =
		featuredRes.status === "fulfilled" ? featuredRes.value.items : [];
	const faqItems = faqRes.status === "fulfilled" ? faqRes.value : [];

	const breadcrumbItems = buildBreadcrumbItems(breadcrumbs);

	return (
		<section className="container-inner mt-4 space-y-4 pb-8">
			{breadcrumbItems.length > 1 && (
				<Breadcrumb items={breadcrumbItems} />
			)}

			<header className="space-y-2">
				<h1 className="text-2xl font-semibold text-gray-900">
					{categoryName}
				</h1>
			</header>

			<RecentlyViewedSection />

			{relatedCategories.length > 0 && (
				<CategoryChipList items={relatedCategories} showAll={false} />
			)}

			<FlashSale categoryId={categoryId} />

			<FeaturedProductsSection products={featuredItems} />

			<FilterInline
				searchParams={searchParams ?? {}}
				pathname={`/${slug}`}
				categoryId={categoryId}
			/>

			<CategoryProductGrid
				slug={slug}
				categoryId={categoryId}
				products={products}
				searchParams={searchParams}
			/>

			{description && (
				<div className="rounded-2xl bg-white p-5 md:p-6">
					<div className="text-sm text-gray-600 leading-relaxed">
						<ParseHtmlContent html={description} />
					</div>
				</div>
			)}

			{faqItems && faqItems.length > 0 && (
				<ProductHighlightNewsSection
					name={categoryName}
					description=""
					faqItems={faqItems}
				/>
			)}

			<CommentWrapper
				targetType={CommentTargetType.CATEGORY}
				targetId={categoryId}
			/>

			<SatisfactionCard />
		</section>
	);
}
