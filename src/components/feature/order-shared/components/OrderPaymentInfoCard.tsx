import { OrderDiscountDetails } from "@/components/common/OrderDiscountDetails";
import {
	OrderPaymentStatusEnum,
	PAYMENT_STATUS_MAP,
	PaymentTypeNameEnum,
} from "@/constants/order.constant";
import { formatPrice } from "@/lib/utils/format";
import type { SharedPaymentInfo } from "../types";
import { OrderDetailRow } from "./OrderDetailRow";

interface OrderPaymentInfoCardProps {
	payment: SharedPaymentInfo;
}

/**
 * Shared payment info card — payment type/method/status + a price breakdown
 * (goods, shipping, discount, total, paid, remaining).
 */
export function OrderPaymentInfoCard({ payment }: OrderPaymentInfoCardProps) {
	const statusEntry = payment.paymentStatus
		? (PAYMENT_STATUS_MAP[payment.paymentStatus] ??
			PAYMENT_STATUS_MAP[OrderPaymentStatusEnum.PENDING])
		: null;

	return (
		<div className="rounded-2xl bg-white p-4 md:p-5 shadow-sm">
			<h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">
				Thông tin thanh toán
			</h3>
			<div className="flex flex-col gap-3 pb-4 border-b border-dashed border-gray-200 text-sm text-gray-600">
				<OrderDetailRow
					label="Hình thức thanh toán:"
					value={payment.paymentType || PaymentTypeNameEnum.STANDARD}
					valueClass="text-gray-900"
				/>
				<OrderDetailRow
					label="Phương thức thanh toán:"
					value={payment.paymentMethod}
					valueClass="text-gray-900"
				/>
				{statusEntry && (
					<OrderDetailRow
						label="Trạng thái thanh toán:"
						value={statusEntry.label}
						valueClass={`text-xs font-bold px-2 py-0.5 rounded border ${statusEntry.className}`}
					/>
				)}
				<OrderDetailRow
					label="Tiền hàng:"
					value={formatPrice(payment.goodsAmount)}
				/>
				<OrderDetailRow
					label="Phí vận chuyển:"
					value={formatPrice(payment.shippingFee)}
				/>
				<OrderDiscountDetails
					totalDiscount={payment.discountAmount}
					discountDetails={payment.discountDetails}
				/>
			</div>
			<OrderDetailRow
				label={
					<span className="text-sm font-medium text-gray-600">
						Tổng cộng:
					</span>
				}
				value={formatPrice(payment.totalAmount)}
				valueClass="text-base font-bold text-gray-900"
			/>
			<div className="flex flex-col gap-3 pt-4 text-sm text-gray-600">
				<OrderDetailRow
					label="Số tiền đã thanh toán:"
					value={formatPrice(payment.paidAmount)}
					valueClass="text-green-600 font-medium"
				/>
				<OrderDetailRow
					label={
						<span className="font-bold text-gray-900">
							Số tiền còn phải thanh toán:
						</span>
					}
					value={formatPrice(payment.remainingAmount)}
					valueClass="text-lg font-bold text-primary-500"
				/>
			</div>
		</div>
	);
}
