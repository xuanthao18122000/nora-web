/**
 * useCheckoutStore — Zustand store for checkout address + settings
 *
 * effectType values (mirrors backend AddressEffectTypeEnum concept):
 *  1 = use saved address (from customer profile — future)
 *  2 = new address input by user (always used for guest / new address)
 */
import { create } from "zustand";
import type {
	CompanyInvoiceData,
	CustomerAddress,
	DeliveryMode,
} from "@/types/checkout";
import { persistMiddleware } from "./_persist";

export const ADDRESS_EFFECT_TYPE = {
	SAVED: 1,
	NEW: 2,
} as const;

export type AddressEffectType =
	(typeof ADDRESS_EFFECT_TYPE)[keyof typeof ADDRESS_EFFECT_TYPE];

export interface InstallmentConfirmedData {
	gatewayId: number;
	provider: string;
	gatewayName: string;
	bankCode?: string;
	cardType?: string;
	prepaidAmount: number;
	monthlyPayment: number;
	tenor: number;
	totalAmount: number;
	totalInterestAndFee: number;
	/** Chi tiết phí [{label, amount}] */
	feeDetails?: Array<{ label: string; amount: number }>;
	/** true = online (thẻ tín dụng), false = offline (công ty tài chính, chỉ nhận tại cửa hàng) */
	requiresOnlinePayment?: boolean;
}

export interface PreselectedVoucher {
	code: string;
	name: string;
	discountAmount: number;
}

export interface CheckoutAddressState {
	/** Always 2 (new address) for now — guest checkout always sends new address */
	effectType: AddressEffectType;
	deliveryMode: DeliveryMode;
	address: CustomerAddress;
	paymentGatewayId?: number;
	hasInvoice: boolean;
	invoiceData: CompanyInvoiceData;
	installmentData?: InstallmentConfirmedData;
	/** Voucher chosen on PDP, consumed once on the next checkout mount */
	preselectedVoucher: PreselectedVoucher | null;
}

interface CheckoutStoreActions {
	setEffectType: (type: AddressEffectType) => void;
	setDeliveryMode: (mode: DeliveryMode) => void;
	setAddress: (address: CustomerAddress) => void;
	setPaymentGatewayId: (id: number | undefined) => void;
	setHasInvoice: (has: boolean) => void;
	setInvoiceData: (data: CompanyInvoiceData) => void;
	setInstallmentData: (data: InstallmentConfirmedData | undefined) => void;
	setPreselectedVoucher: (voucher: PreselectedVoucher | null) => void;
	reset: () => void;
}

const DEFAULT_ADDRESS: CustomerAddress = {
	fullName: "",
	phone: "",
	street: "",
};

const DEFAULT_INVOICE: CompanyInvoiceData = {
	companyName: "",
	companyAddress: "",
	taxCode: "",
	email: "",
};

const DEFAULT_STATE: CheckoutAddressState = {
	effectType: ADDRESS_EFFECT_TYPE.NEW, // Always 2 — new address
	deliveryMode: "delivery",
	address: DEFAULT_ADDRESS,
	paymentGatewayId: undefined,
	hasInvoice: false,
	invoiceData: DEFAULT_INVOICE,
	installmentData: undefined,
	preselectedVoucher: null,
};

type CheckoutStore = CheckoutAddressState & CheckoutStoreActions;

export const useCheckoutStore = create<CheckoutStore>()(
	persistMiddleware<CheckoutStore>(
		(set) => ({
			...DEFAULT_STATE,

			setEffectType: (effectType) => set({ effectType }),
			setDeliveryMode: (deliveryMode) => set({ deliveryMode }),
			setAddress: (address) => set({ address }),
			setPaymentGatewayId: (paymentGatewayId) =>
				set({ paymentGatewayId }),
			setHasInvoice: (hasInvoice) => set({ hasInvoice }),
			setInvoiceData: (invoiceData) => set({ invoiceData }),
			setInstallmentData: (installmentData) => set({ installmentData }),
			setPreselectedVoucher: (preselectedVoucher) =>
				set({ preselectedVoucher }),
			reset: () => set(DEFAULT_STATE),
		}),
		{
			name: "ddv-checkout", // key in localStorage
			// Only persist address + settings, not transient UI state
			partialize: (state) => ({
				effectType: state.effectType,
				deliveryMode: state.deliveryMode,
				address: state.address,
				paymentGatewayId: state.paymentGatewayId,
				hasInvoice: state.hasInvoice,
				invoiceData: state.invoiceData,
				installmentData: state.installmentData,
				preselectedVoucher: state.preselectedVoucher,
			}),
		},
	),
);

/** Derived selector: is the address valid for submission? */
export function isAddressValidForSubmit(
	address: CustomerAddress,
	deliveryMode: DeliveryMode,
): boolean {
	if (!address) return false;
	if ((address.fullName || "").trim().length === 0) return false;
	if ((address.phone || "").trim().length < 9) return false;
	if ((address.phone || "").trim().startsWith("84")) return false;

	if (deliveryMode === "delivery") {
		if ((address.street || "").trim().length === 0) return false;
		if (!address.cityId) return false;
		if (!address.wardId) return false;
	}
	return true;
}
