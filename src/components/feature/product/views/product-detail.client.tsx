"use client";

import { formatPrice } from "@/lib/utils/format";
import type { SimpleProductDetail } from "@/types/simple-product";
import ProductBuyBox from "../components/product-buy-box.client";
import ProductGallery from "../components/product-gallery.client";
import ProductSpecsSummary from "../components/product-specs-summary.client";

/** Map BE images (string[]) → ProductImage shape mà ProductGallery cần. */
function toGalleryImages(product: SimpleProductDetail) {
	const urls = (product.images ?? []).filter(Boolean);
	if (urls.length === 0 && product.thumbnailUrl) {
		urls.push(product.thumbnailUrl);
	}
	return urls.map((url, idx) => ({
		id: idx + 1,
		imageUrl: url,
		altText: product.name,
		priority: idx,
		productVariantId: null,
	}));
}

export default function ProductDetail({
	product,
}: {
	product: SimpleProductDetail;
}) {
	const galleryImages = toGalleryImages(product);

	const displayPrice = Number(product.salePrice ?? product.price ?? 0);
	const originalPrice =
		product.salePrice != null ? Number(product.price ?? 0) : 0;

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
			{/* Left column */}
			<div className="space-y-4">
				<div className="rounded-lg bg-white p-4 md:p-6">
					<h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
						{product.name}
					</h1>
					<ProductGallery
						images={galleryImages}
						productName={product.name}
					/>
				</div>

				<ProductSpecsSummary product={product} />
			</div>

			{/* Right column: Buy box */}
			<div className="rounded-lg bg-white p-4 md:p-6">
				<ProductBuyBox
					product={product}
					displayPrice={displayPrice}
					originalPrice={originalPrice}
					formatPrice={formatPrice}
				/>
			</div>
		</div>
	);
}
