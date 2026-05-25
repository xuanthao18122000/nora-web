"use client";

import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConfirmDrawer } from "@/components/common/ConfirmDrawer";
import { setCheckoutIntent } from "@/lib/checkout-intent";
import { formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import { useCartStore } from "@/store/useCartStore";

export default function CartShell() {
	const router = useRouter();
	const items = useCartStore((s) => s.items);
	const _hasHydrated = useCartStore((s) => s._hasHydrated);
	const updateQuantity = useCartStore((s) => s.updateQuantity);
	const removeItem = useCartStore((s) => s.removeItem);
	const clearCart = useCartStore((s) => s.clearCart);
	const toggleSelect = useCartStore((s) => s.toggleSelect);
	const selectAll = useCartStore((s) => s.selectAll);

	// Confirm dialog state
	const [confirmRemove, setConfirmRemove] = useState<{
		variantId: string;
		name: string;
	} | null>(null);
	const [confirmClear, setConfirmClear] = useState(false);

	const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
	const selectedItems = items.filter((i) => i.selected);
	const selectedCount = selectedItems.length;
	const allSelected = items.length > 0 && selectedCount === items.length;

	// Default: select tất cả khi vừa hydrate xong (mỗi lần mount lại trang giỏ hàng)
	const didAutoSelectRef = useRef(false);
	useEffect(() => {
		if (!_hasHydrated || didAutoSelectRef.current) return;
		didAutoSelectRef.current = true;
		selectAll(true);
	}, [_hasHydrated, selectAll]);

	// Total chỉ tính items đã chọn
	const totalPrice = selectedItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	if (!_hasHydrated) {
		return (
			<div className="container-inner py-8">
				<div className="text-center text-sm text-gray-500">
					Đang tải...
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="container-inner py-12 max-w-[600px] mx-auto">
				<div className="rounded-2xl bg-white p-8 text-center space-y-4">
					<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100">
						<ShoppingCart className="size-8 text-gray-400" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-gray-900">
							Giỏ hàng trống
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Thêm sản phẩm để tiếp tục mua sắm
						</p>
					</div>
					<Link
						href="/"
						className="inline-block rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
					>
						Tiếp tục mua sắm
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container-inner py-4 md:py-6 space-y-4">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
				{/* Left column: items */}
				<div className="space-y-4">
					{/* Card 1: header */}
					<div className="rounded-lg bg-white px-4 py-2 flex items-center">
						<button
							type="button"
							onClick={() => router.back()}
							aria-label="Quay lại"
							className="flex size-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-50"
						>
							<ArrowLeft className="size-5" />
						</button>
						<h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
							Giỏ hàng của bạn
						</h1>
						<div className="size-10" />
					</div>

					{/* Card 2: items list */}
					<div className="rounded-lg bg-white">
						<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={allSelected}
									onChange={(e) =>
										selectAll(e.target.checked)
									}
									className="size-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
								/>
								<span className="text-sm font-medium text-gray-900">
									Chọn tất cả ({selectedCount}/{items.length})
								</span>
							</label>
							<button
								type="button"
								onClick={() => setConfirmClear(true)}
								className="text-sm text-gray-500 hover:text-red-500 transition-colors"
							>
								Xoá tất cả
							</button>
						</div>

						<div className="divide-y divide-gray-100">
							{items.map((item) => (
								<article
									key={item.variantId}
									className="flex items-center gap-3 p-4"
								>
									<input
										type="checkbox"
										checked={Boolean(item.selected)}
										onChange={() =>
											toggleSelect(item.variantId)
										}
										aria-label={`Chọn ${item.name}`}
										className="size-4 shrink-0 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
									/>

									<Link
										href={
											item.slug ? `/${item.slug.replace(/\.html$/, "")}` : "#"
										}
										className="relative size-16 md:size-20 shrink-0 overflow-hidden rounded-lg p-2 bg-gray-50"
									>
										{item.thumbnailUrl || item.image ? (
											<Image
												src={getImageUrl(
													item.thumbnailUrl || item.image,
												)}
												alt={item.name}
												fill
												sizes="80px"
												className="object-contain"
											/>
										) : null}
									</Link>

									<div className="min-w-0 flex-1">
										<Link
											href={
												item.slug
													? `/${item.slug.replace(/\.html$/, "")}`
													: "#"
											}
											className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-500"
										>
											{item.name}
										</Link>
										<div className="mt-1 text-base font-bold text-(--color-text-price)">
											{formatPrice(item.price)}
										</div>
									</div>

									<div className="flex flex-col items-end gap-2 shrink-0">
										<button
											type="button"
											onClick={() =>
												setConfirmRemove({
													variantId: item.variantId,
													name: item.name,
												})
											}
											aria-label="Xoá khỏi giỏ"
											className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
										>
											<Trash2 className="size-4" />
										</button>
										<div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
											<button
												type="button"
												onClick={() =>
													updateQuantity(
														item.variantId,
														item.quantity - 1,
													)
												}
												disabled={item.quantity <= 1}
												aria-label="Giảm"
												className="flex size-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
											>
												<Minus className="size-3.5" />
											</button>
											<input
												type="number"
												inputMode="numeric"
												min={1}
												value={item.quantity}
												onChange={(e) => {
													const v = Number(
														e.target.value,
													);
													if (!Number.isFinite(v))
														return;
													updateQuantity(
														item.variantId,
														Math.max(1, v),
													);
												}}
												onBlur={(e) => {
													if (!e.target.value) {
														updateQuantity(
															item.variantId,
															1,
														);
													}
												}}
												aria-label="Số lượng"
												className="w-10 h-8 text-center text-sm font-medium text-gray-900 outline-none focus:bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
											/>
											<button
												type="button"
												onClick={() =>
													updateQuantity(
														item.variantId,
														item.quantity + 1,
													)
												}
												aria-label="Tăng"
												className="flex size-8 items-center justify-center text-gray-600 hover:bg-gray-50"
											>
												<Plus className="size-3.5" />
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					</div>
				</div>

				{/* Right column: order summary (sticky) */}
				<aside className="lg:sticky lg:top-4 h-fit rounded-lg bg-white p-5 space-y-4">
					<h2 className="text-base font-semibold text-gray-900">
						Tóm tắt đơn hàng
					</h2>

					<dl className="space-y-2 text-sm">
						<div className="flex justify-between">
							<dt className="text-gray-600">Đã chọn:</dt>
							<dd className="font-medium text-gray-900">
								{selectedCount}/{totalQty} sản phẩm
							</dd>
						</div>
						<div className="flex justify-between">
							<dt className="text-gray-600">Tạm tính:</dt>
							<dd className="font-medium text-gray-900">
								{formatPrice(totalPrice)}
							</dd>
						</div>
						<div className="flex justify-between">
							<dt className="text-gray-600">Phí vận chuyển:</dt>
							<dd className="font-medium text-gray-900">
								Miễn phí
							</dd>
						</div>
					</dl>

					<div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
						<span className="text-base font-semibold text-gray-900">
							Tổng cộng:
						</span>
						<span className="text-xl font-bold text-(--color-text-price)">
							{formatPrice(totalPrice)}
						</span>
					</div>

					<button
						type="button"
						onClick={() => {
							if (selectedCount === 0) return;
							setCheckoutIntent({
								source: "cart",
								items: selectedItems.map((i) => ({
									productId: Number(i.productId),
									quantity: i.quantity,
								})),
								variantIdsToClear: selectedItems.map(
									(i) => i.variantId,
								),
							});
							router.push("/checkout");
						}}
						disabled={selectedCount === 0}
						className="w-full rounded-lg bg-primary-500 px-4 py-3 text-base font-semibold text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Tiến hành đặt hàng ({selectedCount})
					</button>

					<p className="text-xs text-gray-500 text-center leading-relaxed">
						Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
						<Link
							href="/chinh-sach-su-dung"
							className="text-primary-500 hover:underline"
						>
							Điều khoản sử dụng
						</Link>{" "}
						và{" "}
						<Link
							href="/chinh-sach-bao-mat"
							className="text-primary-500 hover:underline"
						>
							Chính sách bảo mật
						</Link>
					</p>
				</aside>
			</div>

			<ConfirmDrawer
				open={Boolean(confirmRemove)}
				onClose={() => setConfirmRemove(null)}
				title="Xoá sản phẩm khỏi giỏ?"
				description={confirmRemove?.name}
				confirmText="Xoá"
				cancelText="Huỷ"
				onConfirm={() => {
					if (confirmRemove) removeItem(confirmRemove.variantId);
				}}
			/>

			<ConfirmDrawer
				open={confirmClear}
				onClose={() => setConfirmClear(false)}
				title="Xoá toàn bộ giỏ hàng?"
				description="Tất cả sản phẩm trong giỏ sẽ bị xoá."
				confirmText="Xoá tất cả"
				cancelText="Huỷ"
				onConfirm={clearCart}
			/>
		</div>
	);
}
