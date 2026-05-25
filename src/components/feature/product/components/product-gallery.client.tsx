"use client";

import HeroBanner, {
	type HeroBannerImage,
} from "@/components/feature/home/HeroBanner";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
	images: ProductImage[];
	productName: string;
}

export default function ProductGallery({
	images,
	productName,
}: ProductGalleryProps) {
	const resetKey = (images ?? []).map((img) => String(img.id)).join("|");

	const heroImages: HeroBannerImage[] = (images ?? []).map((img) => ({
		id: img.id,
		src: img.imageUrl,
		alt: img.altText,
		isVideo: (img.altText ?? "").toLowerCase().includes("video"),
	}));

	return (
		<HeroBanner
			images={heroImages}
			productName={productName}
			resetKey={resetKey}
			mainAspect="1 / 1"
			thumbSize={56}
		/>
	);
}
