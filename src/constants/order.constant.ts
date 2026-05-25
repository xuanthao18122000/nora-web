export enum OrderPaymentStatusEnum {
	PAID = "PAID",
	FAILED = "FAILED",
	EXPIRED = "EXPIRED",
	PENDING = "PENDING",
	CANCELLED = "CANCELLED",
}

export enum PaymentTypeNameEnum {
	INSTALLMENT = "Trả góp",
	CREDIT = "Thẻ tín dụng",
	STANDARD = "Trả thẳng",
}

export const PAYMENT_STATUS_MAP: Record<
	string,
	{ label: string; className: string }
> = {
	[OrderPaymentStatusEnum.PAID]: {
		label: "Đã thanh toán",
		className: "bg-green-50 text-green-600 border-green-200",
	},
	[OrderPaymentStatusEnum.EXPIRED]: {
		label: "Hết hạn thanh toán",
		className: "bg-red-50 text-red-600 border-red-200",
	},
	[OrderPaymentStatusEnum.FAILED]: {
		label: "Thanh toán thất bại",
		className: "bg-red-50 text-red-600 border-red-200",
	},
	[OrderPaymentStatusEnum.PENDING]: {
		label: "Chờ thanh toán",
		className: "bg-yellow-50 text-yellow-600 border-yellow-200",
	},
	[OrderPaymentStatusEnum.CANCELLED]: {
		label: "Đã huỷ",
		className: "bg-yellow-50 text-yellow-600 border-yellow-200",
	},
};
