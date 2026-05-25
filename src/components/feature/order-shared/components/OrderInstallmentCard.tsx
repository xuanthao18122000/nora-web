import { OrderInstallmentFeeDetails } from "@/components/common/OrderInstallmentFeeDetails";
import { formatPrice } from "@/lib/utils/format";
import type { SharedInstallmentInfo } from "../types";
import { OrderDetailRow } from "./OrderDetailRow";

interface OrderInstallmentCardProps {
	installment: SharedInstallmentInfo;
}

/**
 * Shared installment (trả góp) info card.
 */
export function OrderInstallmentCard({
	installment,
}: OrderInstallmentCardProps) {
	const feeTotal =
		installment.totalAmount != null
			? installment.totalAmount - installment.orderTotal
			: 0;

	return (
		<div className="rounded-2xl bg-white p-4 md:p-5 shadow-sm">
			<h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">
				Thông tin trả góp
			</h3>
			<div className="flex flex-col gap-3 text-sm text-gray-600">
				<OrderDetailRow
					label="Kỳ hạn:"
					value={`${installment.tenor} tháng`}
				/>
				{installment.monthlyPayment != null && (
					<OrderDetailRow
						label="Trả mỗi tháng:"
						value={formatPrice(installment.monthlyPayment)}
						valueClass="text-gray-900 font-bold"
					/>
				)}
				{installment.totalAmount != null && (
					<OrderDetailRow
						label="Tổng tiền trả góp:"
						value={formatPrice(installment.totalAmount)}
						valueClass="text-primary-500 font-bold"
					/>
				)}
				{feeTotal > 0 && (
					<OrderInstallmentFeeDetails
						totalFee={feeTotal}
						feeDetails={installment.feeDetails}
					/>
				)}
				{installment.bankCode && (
					<OrderDetailRow
						label="Ngân hàng:"
						value={`${installment.bankCode}${installment.cardType ? ` (${installment.cardType})` : ""}`}
						valueClass="text-gray-900 font-medium uppercase"
					/>
				)}
			</div>
		</div>
	);
}
