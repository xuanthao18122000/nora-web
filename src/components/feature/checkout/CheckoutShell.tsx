"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
	type CheckoutSummaryResult,
	getCheckoutSummary,
} from "@/lib/api/checkout";
import {
	type CheckoutIntent,
	clearCheckoutIntent,
	getCheckoutIntent,
} from "@/lib/checkout-intent";
import { formatPrice } from "@/lib/utils/format";
import { getImageUrl } from "@/lib/utils/image";
import { useCartStore } from "@/store/useCartStore";
import {
	type CheckoutFormValues,
	checkoutFormSchema,
} from "./schemas/checkout-form.schema";

export default function CheckoutShell() {
	const router = useRouter();
	const removeItems = useCartStore((s) => s.removeItems);

	const [intent, setIntent] = useState<CheckoutIntent | null>(null);
	const [summary, setSummary] = useState<CheckoutSummaryResult | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			customerName: "",
			phone: "",
			email: "",
			shippingAddress: "",
			note: "",
		},
	});

	useEffect(() => {
		const i = getCheckoutIntent();
		setIntent(i);
		if (!i) {
			setLoading(false);
			return;
		}
		let cancelled = false;
		getCheckoutSummary(i.items)
			.then((res) => {
				if (cancelled) return;
				setSummary(res);
			})
			.catch((err) => {
				if (cancelled) return;
				setLoadError(
					err instanceof Error ? err.message : "Không tải được đơn hàng",
				);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		if (!intent || !summary) return;

		try {
			const payload = {
				customerName: values.customerName,
				phone: values.phone,
				email: values.email,
				shippingAddress: values.shippingAddress,
				note: values.note?.trim() || undefined,
				paymentMethod: 1,
				items: intent.items,
			};

			const order = await api.post<{ id: number }>("/fe/orders", payload);

			if (intent.source === "cart" && intent.variantIdsToClear?.length) {
				removeItems(intent.variantIdsToClear);
			}
			clearCheckoutIntent();

			toast.success("Đặt hàng thành công");
			router.push(`/order-tracking?orderId=${order.id}`);
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: "Có lỗi xảy ra, vui lòng thử lại",
			);
		}
	});

	if (loading) {
		return (
			<div className="container-inner py-8">
				<div className="text-center text-sm text-gray-500">Đang tải...</div>
			</div>
		);
	}

	if (!intent || !summary || summary.items.length === 0) {
		return (
			<div className="container-inner py-12 max-w-[600px] mx-auto">
				<div className="rounded-2xl bg-white p-8 text-center space-y-4">
					<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100">
						<ShoppingCart className="size-8 text-gray-400" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-gray-900">
							{loadError ?? "Chưa có sản phẩm để đặt"}
						</h1>
					</div>
					<Link
						href="/"
						className="inline-block rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
					>
						Tiếp tục mua sắm
					</Link>
				</div>
			</div>
		);
	}

	const totalQty = summary.items.reduce((sum, i) => sum + i.quantity, 0);

	return (
		<form
			onSubmit={onSubmit}
			noValidate
			className="container-inner py-4 md:py-6 max-w-[1100px] mx-auto"
		>
			<h1 className="text-xl font-bold text-gray-900 mb-4">Thanh toán</h1>

			<div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
				<section className="rounded-lg bg-white p-4 md:p-6 space-y-4">
					<h2 className="text-base font-semibold text-gray-900">
						Thông tin người nhận
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Field
							label="Họ và tên"
							required
							error={errors.customerName?.message}
						>
							<input
								type="text"
								placeholder="Nguyễn Văn A"
								className={inputCls(Boolean(errors.customerName))}
								{...register("customerName")}
							/>
						</Field>
						<Field
							label="Số điện thoại"
							required
							error={errors.phone?.message}
						>
							<input
								type="tel"
								placeholder="0901234567"
								className={inputCls(Boolean(errors.phone))}
								{...register("phone")}
							/>
						</Field>
					</div>
					<Field label="Email" required error={errors.email?.message}>
						<input
							type="email"
							placeholder="email@example.com"
							className={inputCls(Boolean(errors.email))}
							{...register("email")}
						/>
					</Field>
					<Field
						label="Địa chỉ giao hàng"
						required
						error={errors.shippingAddress?.message}
					>
						<textarea
							rows={2}
							placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
							className={inputCls(Boolean(errors.shippingAddress))}
							{...register("shippingAddress")}
						/>
					</Field>
					<Field label="Ghi chú" error={errors.note?.message}>
						<textarea
							rows={2}
							placeholder="Ghi chú thêm cho đơn hàng (tuỳ chọn)"
							className={inputCls(Boolean(errors.note))}
							{...register("note")}
						/>
					</Field>

					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
						<div className="font-medium">
							Phương thức thanh toán: Thanh toán khi nhận hàng (COD)
						</div>
						<div className="text-gray-500 mt-1">
							Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.
						</div>
					</div>
				</section>

				<aside className="rounded-lg bg-white p-4 md:p-6 space-y-4 h-fit lg:sticky lg:top-4">
					<h2 className="text-base font-semibold text-gray-900">
						Đơn hàng ({totalQty})
					</h2>

					<div className="space-y-3 max-h-[400px] overflow-y-auto">
						{summary.items.map((item) => (
							<div key={item.productId} className="flex gap-3">
								<div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
									{item.thumbnailUrl ? (
										<Image
											src={getImageUrl(item.thumbnailUrl)}
											alt={item.name}
											fill
											sizes="56px"
											className="object-contain p-1"
										/>
									) : null}
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm text-gray-900 line-clamp-2">
										{item.name}
									</div>
									<div className="text-xs text-gray-500 mt-0.5">
										Số lượng: {item.quantity}
									</div>
								</div>
								<div className="text-sm font-semibold text-(--color-text-price)">
									{formatPrice(item.lineTotal)}
								</div>
							</div>
						))}
					</div>

					<div className="border-t border-gray-200 pt-3 space-y-2">
						<div className="flex items-center justify-between text-base">
							<span className="text-gray-700">Tổng tiền</span>
							<span className="text-xl font-bold text-(--color-text-price)">
								{formatPrice(summary.total)}
							</span>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full rounded-lg bg-primary-500 px-4 py-3 text-base font-bold uppercase tracking-wide text-white hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
					>
						{isSubmitting && <Loader2 className="size-4 animate-spin" />}
						{isSubmitting ? "Đang đặt hàng..." : "Đặt hàng"}
					</button>
				</aside>
			</div>
		</form>
	);
}

function inputCls(hasError: boolean) {
	return [
		"w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2",
		hasError
			? "border-red-400 focus:border-red-500 focus:ring-red-100"
			: "border-gray-300 focus:border-primary-500 focus:ring-primary-100",
	].join(" ");
}

function Field({
	label,
	required,
	error,
	children,
}: {
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<label className="block">
			<span className="text-sm font-medium text-gray-700 mb-1 block">
				{label}
				{required && <span className="text-red-500 ml-0.5">*</span>}
			</span>
			{children}
			{error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
		</label>
	);
}
