import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbSchema from "@/components/common/BreadcrumbSchema";
import ProductHighlightNewsSection from "@/components/feature/category/components/ProductHighlightNewsSection.client";
import { CommentTargetType } from "@/components/feature/comments/types";
import CommentWrapper from "@/components/feature/comments/views/CommentWrapper.client";
import { toHref } from "@/lib/utils/href";
import type { SimpleProductDetail } from "@/types/simple-product";
import { RecordRecentlyViewed } from "../utils/record-recently-viewed.client";
import ProductDetailComponent from "./product-detail.client";

interface ProductPageWrapperProps {
	slug: string;
	product: SimpleProductDetail;
}

export default function ProductPageWrapper({
	product,
}: ProductPageWrapperProps) {
	// Breadcrumbs từ category đầu tiên (nếu có)
	const firstCategory = product.productCategories?.[0]?.category;
	const breadcrumbItems: { label: string; href: string }[] = [
		{ label: "Trang chủ", href: "/" },
		...(firstCategory
			? [
					{
						label: firstCategory.name,
						href: toHref(firstCategory.slug) as string,
					},
				]
			: []),
		{ label: product.name, href: "" },
	];

	return (
		<div className="container-inner flex min-h-screen flex-col gap-2 bg-gray-100 pt-2 pb-20 md:gap-4 md:py-4">
			<RecordRecentlyViewed productId={String(product.id)} />
			<Breadcrumb items={breadcrumbItems} />
			<BreadcrumbSchema items={breadcrumbItems} />

			<ProductDetailComponent product={product} />

			{product.description && (
				<ProductHighlightNewsSection
					name={product.name}
					description={product.description}
				/>
			)}

			<CommentWrapper
				targetType={CommentTargetType.PRODUCT}
				targetId={product.id}
			/>
		</div>
	);
}
