"use client";

import type { ReactNode } from "react";
import { toHref } from "@/lib/utils/href";
import type {
	SharedOrderDetail,
	SharedOrderDetailItem,
	SharedOrderProduct,
} from "../types";
import { OrderDeliveryInfoCard } from "./OrderDeliveryInfoCard";
import { OrderHeaderCard } from "./OrderHeaderCard";
import { OrderInstallmentCard } from "./OrderInstallmentCard";
import { OrderPaymentInfoCard } from "./OrderPaymentInfoCard";
import { OrderProductListCard } from "./OrderProductListCard";
import { OrderStepProgress } from "./OrderStepProgress";
import "@/app/animations.css";

interface OrderDetailViewProps {
	data: SharedOrderDetail;
	/** Badge trạng thái tuỳ biến (OrderStatusBadge hoặc span generic). */
	statusBadge: ReactNode;
	/** Render optional per-product action (e.g. "Mua lại"). */
	renderItemAction?: (item: SharedOrderDetailItem) => ReactNode;
	/** Optional leading content (e.g. CartHeader with back button). */
	leadingContent?: ReactNode;
	/** Show stepper ở trên cùng (always true per user request). */
	showStepper?: boolean;
	/** Animate sections on mount (tracking view uses this). */
	animateSections?: boolean;
}

function wrapAnimate(
	animate: boolean,
	stagger: number,
	children: ReactNode,
): ReactNode {
	if (!animate) return children;
	return (
		<div className={`animate-section-enter stagger-${stagger}`}>
			{children}
		</div>
	);
}

/**
 * Unified order-detail view — renders stepper + header + product list +
 * delivery + payment + installment from a single `SharedOrderDetail` payload.
 *
 * Used by both:
 *  - `/account/orders/:id` (authenticated)
 *  - `/order-tracking` (public, phone-verified)
 */
export function OrderDetailView({
	data,
	statusBadge,
	renderItemAction,
	leadingContent,
	showStepper = true,
	animateSections = false,
}: OrderDetailViewProps) {
	const items: SharedOrderProduct[] = data.items.map((item, idx) => {
		const key = item.id ?? idx;
		const href = item.productSlug
			? (toHref(item.productSlug, item.productSku) as string)
			: undefined;
		return {
			key,
			productName: item.productName,
			productImage: item.productImage,
			price: item.price,
			listedPrice: item.listedPrice,
			quantity: item.quantity,
			variantName: item.variantName,
			variantAttributes: item.variantAttributes,
			href,
			action: renderItemAction?.(item),
		};
	});

	// feStatus is required for stepper. If absent (legacy tracking payload),
	// fall back to inferring from text status — but prefer the explicit field.
	const feStatus = data.feStatus;

	return (
		<>
			{leadingContent
				? wrapAnimate(animateSections, 1, leadingContent)
				: null}

			{showStepper && typeof feStatus === "number"
				? wrapAnimate(
						animateSections,
						1,
						<div className="rounded-2xl bg-white p-4 shadow-sm">
							<OrderStepProgress status={feStatus} />
						</div>,
					)
				: null}

			{wrapAnimate(
				animateSections,
				2,
				<OrderHeaderCard
					header={{
						orderCode: data.orderCode || String(data.orderId),
						createdAt: data.createdAt,
						statusBadge,
					}}
					summary={{
						totalItems: data.totalItems,
						totalAmount: data.totalAmount,
					}}
				/>,
			)}

			{wrapAnimate(
				animateSections,
				3,
				<OrderProductListCard items={items} />,
			)}

			{wrapAnimate(
				animateSections,
				4,
				<OrderDeliveryInfoCard
					delivery={{
						receiverName: data.receiverName,
						receiverPhone: data.receiverPhone,
						shippingAddress: data.shippingAddress,
						storeName: data.storeName,
						storeAddress: data.storeAddress,
					}}
				/>,
			)}

			{wrapAnimate(
				animateSections,
				5,
				<OrderPaymentInfoCard
					payment={{
						paymentType: data.paymentType,
						paymentMethod: data.paymentMethod,
						paymentStatus: data.paymentStatus,
						goodsAmount: data.totalAmount + data.discountAmount,
						shippingFee: data.shippingFee,
						discountAmount: data.discountAmount,
						discountDetails: data.discountDetails,
						totalAmount: data.totalAmount,
						paidAmount: data.paidAmount,
						remainingAmount: data.remainingAmount,
					}}
				/>,
			)}

			{data.installmentTenor
				? wrapAnimate(
						animateSections,
						5,
						<OrderInstallmentCard
							installment={{
								tenor: data.installmentTenor,
								monthlyPayment: data.installmentMonthlyPayment,
								totalAmount: data.installmentAmount,
								bankCode: data.installmentBankCode,
								cardType: data.installmentCardType,
								feeDetails: data.installmentFeeDetails,
								orderTotal: data.totalAmount,
							}}
						/>,
					)
				: null}
		</>
	);
}
