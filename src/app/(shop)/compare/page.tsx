"use client";

import { GitCompare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import CompareTable, {
	type CompareProductDetail,
} from "@/components/feature/compare/CompareTable";
import { API, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/useCompareStore";

interface RawCompareProduct {
	id?: string;
	productId?: string;
	name: string;
	slug: string;
	urlPath: string;
	thumbnailUrl?: string;
	minPrice?: number | string;
	originalPrice?: number | null;
	discountPercent?: number | null;
	avgRating?: number | null;
	reviewCount?: number;
	specifications?: CompareProductDetail["specifications"];
}

export default function ComparePage() {
	const { items } = useCompareStore();

	const [mounted, setMounted] = useState(false);
	const [products, setProducts] = useState<CompareProductDetail[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const validItems = items.filter((i) => i !== null);
		if (validItems.length === 0) {
			setProducts([]);
			setLoading(false);
			setError(null);
			return;
		}

		const fetchProducts = async () => {
			setLoading(true);
			setError(null);
			try {
				const raw = await api.post<unknown[]>(API.PRODUCTS.COMPARE, {
					ids: validItems.map((i) => i.productId),
				});

				const rawProducts = (
					Array.isArray(raw) ? raw : []
				) as RawCompareProduct[];

				const mapped: CompareProductDetail[] = rawProducts.map((p) => {
					const product = p;
					const sellingPrice = Number(product.minPrice) || 0;
					const originalPrice = product.originalPrice ?? null;
					const discountPercent =
						product.discountPercent ??
						(originalPrice && originalPrice > sellingPrice
							? Math.round(
									(1 - sellingPrice / originalPrice) * 100,
								)
							: 0);

					return {
						productId: product.productId ?? product.id ?? "",
						name: product.name,
						slug: product.slug,
						urlPath: product.urlPath,
						image: product.thumbnailUrl ?? "",
						price: sellingPrice,
						originalPrice,
						discountPercent,
						avgRating: product.avgRating
							? String(product.avgRating)
							: null,
						reviewCount: product.reviewCount ?? 0,
						specifications: product.specifications ?? [],
					};
				});

				setProducts(mapped);
			} catch (_err) {
				setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [mounted, items]);

	// Skeleton while hydrating
	if (!mounted) {
		return (
			<div className="container-inner py-6">
				<div className="h-6 w-44 bg-gray-200 rounded animate-pulse mb-5" />
				<div className="bg-white rounded-2xl h-48 animate-pulse" />
			</div>
		);
	}

	// Empty state
	const validItemsCount = items.filter((i) => i !== null).length;
	if (validItemsCount === 0) {
		return (
			<div className="container-inner py-16 flex flex-col items-center justify-center gap-5 text-center min-h-[50vh]">
				<div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
					<GitCompare size={28} className="text-primary-500" />
				</div>
				<div className="max-w-sm">
					<h1 className="text-lg font-semibold text-gray-900 mb-1.5">
						Chưa có sản phẩm để so sánh
					</h1>
					<p className="text-sm text-gray-500 leading-relaxed">
						Thêm sản phẩm vào danh sách so sánh từ trang danh mục
						hoặc trang chi tiết để xem bảng so sánh thông số.
					</p>
				</div>
				<Link href="/">
					<Button
						variant="filled"
						color="primary"
						size="sm"
						className="rounded-lg!"
					>
						Về trang chủ
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-white min-h-screen">
			<div className="container-inner py-2 md:py-4 flex flex-col gap-2 md:gap-4">
				<div className="flex items-baseline gap-2">
					<h1 className="text-sm md:text-base font-semibold text-gray-900">
						So sánh sản phẩm
					</h1>
					<span className="text-sm text-gray-500">
						({validItemsCount})
					</span>
				</div>

				{loading && products.length === 0 && (
					<div className="bg-white rounded-2xl h-48 animate-pulse" />
				)}

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				{!error && products.length > 0 && (
					<div
						className={cn(
							"w-full transition-opacity duration-300",
							loading
								? "opacity-50 pointer-events-none"
								: "opacity-100",
						)}
					>
						<CompareTable products={products} />
					</div>
				)}

				{!loading &&
					!error &&
					products.length === 0 &&
					items.length > 0 && (
						<div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm">
							Không tìm thấy thông tin sản phẩm.
						</div>
					)}
			</div>
		</div>
	);
}
