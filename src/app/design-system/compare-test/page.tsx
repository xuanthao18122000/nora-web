"use client";

import CompareButton from "@/components/feature/compare/CompareButton";

// categoryKey = D-Core productCateId (stable, opaque — does NOT depend on URL/hierarchy)
const MOCK_PRODUCTS = [
	{
		productId: "50028147", // TECNO Camon 40 128GB
		slug: "tecno-camon-40-8gb-128gb-cty-a6d3ea",
		categoryKey: "3", // same category (dien-thoai)
		name: "TECNO Camon 40 128GB Chính Hãng",
		image: "files/products/2025/3/10/1/1744272952367_tecno_camon_40_128gb_den_didongviet.png",
		price: 4290000,
	},
	{
		productId: "50027457", // TECNO Spark 30 5G 128GB
		slug: "tecno-spark-30-5g-6gb-128gb-cty-57ac31",
		categoryKey: "3", // same category (dien-thoai)
		name: "TECNO Spark 30 5G 128GB Chính Hãng",
		image: "files/products/2025/2/13/1/1741852356649_tecno_spark_30_5g_128gb_den.png",
		price: 2890000,
	},
	{
		productId: "test-wrong-cat",
		slug: "test-wrong-cat",
		categoryKey: "4", // khác category → test WRONG_CATEGORY
		name: "SP khác danh mục (test lỗi)",
		image: "",
		price: 0,
	},
];

export default function CompareTestPage() {
	return (
		<div className="container-inner py-8 pb-32">
			<h1 className="text-2xl font-bold mb-2">🧪 Compare Feature Test</h1>
			<p className="text-gray-500 text-sm mb-6">
				Test tính năng so sánh sản phẩm. Floating bar xuất hiện phía
				dưới khi chọn ≥ 1 sản phẩm.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{MOCK_PRODUCTS.map((product) => (
					<div
						key={product.productId}
						className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3"
					>
						<div>
							<p className="text-sm font-semibold text-gray-800">
								{product.name}
							</p>
							<p className="text-xs text-gray-500 mt-0.5">
								categoryKey:{" "}
								<span
									className={
										product.categoryKey === "laptop"
											? "text-red-500"
											: "text-green-600"
									}
								>
									{product.categoryKey}
									{product.categoryKey === "laptop"
										? " (khác category)"
										: ""}
								</span>
							</p>
							<p className="text-sm text-primary-600 font-bold mt-1">
								{product.price.toLocaleString("vi-VN")}đ
							</p>
						</div>

						<CompareButton product={product} />
					</div>
				))}
			</div>

			<div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
				<p className="font-semibold mb-2">📋 Test cases:</p>
				<ul className="list-disc list-inside space-y-1 text-xs">
					<li>Click vào 2+ sản phẩm → Floating bar xuất hiện</li>
					<li>Click lại → toggle off (xóa khỏi danh sách)</li>
					<li>
						Thêm 5 sản phẩm cùng category → toast "Tối đa 4 sản
						phẩm"
					</li>
					<li>
						Click SP khác danh mục → toast "Chỉ so sánh cùng danh
						mục"
					</li>
					<li>Click "So sánh ngay" (≥ 2 SP) → navigate /compare</li>
					<li>F5 → floating bar vẫn persist (localStorage)</li>
				</ul>
			</div>
		</div>
	);
}
