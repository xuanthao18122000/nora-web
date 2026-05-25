"use client";

import {
	BadgeHotSale,
	BadgeOffer,
	BadgeOfferLink,
} from "@/components/common/Badge";
import { ProductCard } from "@/components/common/ProductCard";
import StarRating from "@/components/common/StarRating";
import CodeSnippet from "../CodeSnippet";

const IMG =
	"https://cdn-v2.didongviet.vn/files/products/2025/10/6/1/iphone-17-pro-pro-max-cam-didongviet-8.jpg";

export default function ProductCardPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Product Card
			</h1>
			<p className="text-gray-600 mb-8">
				Compound component for product listing — compose Labels, Image,
				Content, Name, Price, and Footer freely.
			</p>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{/* Full-featured card */}
				<ProductCard href="#">
					<ProductCard.Labels>
						<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
					</ProductCard.Labels>

					<ProductCard.Image src={IMG} alt="Samsung Galaxy A56 5G" />

					<ProductCard.Content>
						<BadgeHotSale>Còn 04 ngày 04:25:54</BadgeHotSale>
						<ProductCard.Name>
							Samsung Galaxy A56 5G 8GB/128GB
						</ProductCard.Name>
						<ProductCard.Price
							originalPrice={12200000}
							discount={30}
							price={9200000}
						/>
						<BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>
					</ProductCard.Content>

					<ProductCard.Footer>
						<StarRating rating={4.9} reviewCount={100} />
					</ProductCard.Footer>
				</ProductCard>

				{/* Card without hot sale */}
				<ProductCard href="#">
					<ProductCard.Labels>
						<BadgeOffer>Trả góp 0% trả trước 0đ</BadgeOffer>
					</ProductCard.Labels>

					<ProductCard.Image src={IMG} alt="Samsung Galaxy A56 5G" />

					<ProductCard.Content>
						<ProductCard.Name>
							Samsung Galaxy A56 5G 8GB/256GB
						</ProductCard.Name>
						<ProductCard.Price
							originalPrice={12990000}
							discount={30}
							price={10290000}
						/>
						<BadgeOfferLink>+2 ưu đãi cho bạn</BadgeOfferLink>
					</ProductCard.Content>

					<ProductCard.Footer>
						<StarRating rating={4.9} reviewCount={100} />
					</ProductCard.Footer>
				</ProductCard>

				{/* Minimal card */}
				<ProductCard href="#">
					<ProductCard.Image src={IMG} alt="Samsung Galaxy S24 FE" />

					<ProductCard.Content>
						<ProductCard.Name>
							Samsung Galaxy S24 FE 5G 8GB/256GB
						</ProductCard.Name>
						<ProductCard.Price price={14990000} />
					</ProductCard.Content>

					<ProductCard.Footer>
						<StarRating rating={4.9} reviewCount={100} />
					</ProductCard.Footer>
				</ProductCard>
			</div>
			{/* ── Horizontal variant ─────────────────────────────────── */}
			<h2 className="text-xl font-semibold text-gray-900 mt-12 mb-2">
				Horizontal variant
			</h2>
			<p className="text-gray-600 mb-4">
				Compact horizontal layout used for recently viewed products,
				search suggestions, etc.
			</p>
			<div className="flex flex-wrap gap-4">
				<ProductCard.HorizontalPreset
					product={{
						id: "h1",
						name: "MacBook Pro 2024 16-inch M4 Pro 14‑Core CPU | 20‑Core GPU 24GB/512GB Chính Hãng",
						price: 63990000,
						image: IMG,
						href: "#",
					}}
					onRemove={() => {}}
				/>
				<ProductCard.HorizontalPreset
					product={{
						id: "h2",
						name: "Samsung Galaxy A56 5G 8GB/128GB",
						price: 9200000,
						originalPrice: 12200000,
						discount: 30,
						image: IMG,
						href: "#",
					}}
				/>
				<ProductCard.HorizontalPreset
					product={{
						id: "h3",
						name: "iPhone 16 Pro Max 256GB",
						price: 34990000,
						href: "#",
					}}
				/>
			</div>

			<CodeSnippet
				code={`import { ProductCard } from "@/components/common";

<ProductCard href={\`/product/\${item.id}\`}>
  <ProductCard.Labels>
    <BadgeOffer>Trả góp 0%</BadgeOffer>
  </ProductCard.Labels>

  <ProductCard.Image src={item.image} alt={item.name} />

  <ProductCard.Content>
    <BadgeHotSale>Còn 04 ngày</BadgeHotSale>
    <ProductCard.Name>{item.name}</ProductCard.Name>
    <ProductCard.Price
      originalPrice={item.originalPrice}
      discount={item.discount}
      price={item.price}
    />
  </ProductCard.Content>

  <ProductCard.Footer>
    <StarRating value={4.9} count={100} />
    <Button size="xs">So sánh</Button>
  </ProductCard.Footer>
</ProductCard>`}
			/>
		</div>
	);
}
