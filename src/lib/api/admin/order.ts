"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse } from "./types";

export enum OrderStatusEnum {
	NEW = 1,
	CONFIRMED = 2,
	SHIPPING = 3,
	COMPLETED = 4,
	CANCELLED = 5,
}

export enum PaymentMethodEnum {
	COD = 1,
	BANK_TRANSFER = 2,
	OTHER = 3,
}

export const ORDER_STATUS_LABEL: Record<OrderStatusEnum, string> = {
	[OrderStatusEnum.NEW]: "Mới",
	[OrderStatusEnum.CONFIRMED]: "Đã duyệt",
	[OrderStatusEnum.SHIPPING]: "Đang giao",
	[OrderStatusEnum.COMPLETED]: "Hoàn tất",
	[OrderStatusEnum.CANCELLED]: "Đã huỷ",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethodEnum, string> = {
	[PaymentMethodEnum.COD]: "COD",
	[PaymentMethodEnum.BANK_TRANSFER]: "Chuyển khoản",
	[PaymentMethodEnum.OTHER]: "Khác",
};

/** Trạng thái cho phép chuyển — match với BE STATUS_TRANSITIONS. */
export const STATUS_TRANSITIONS: Record<OrderStatusEnum, OrderStatusEnum[]> = {
	[OrderStatusEnum.NEW]: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.CANCELLED],
	[OrderStatusEnum.CONFIRMED]: [OrderStatusEnum.SHIPPING, OrderStatusEnum.CANCELLED],
	[OrderStatusEnum.SHIPPING]: [OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELLED],
	[OrderStatusEnum.COMPLETED]: [],
	[OrderStatusEnum.CANCELLED]: [],
};

export interface AdminOrderItem {
	id: number;
	productName: string;
	productSlug?: string;
	quantity: number;
	unitPrice: number | string;
	totalPrice: number | string;
	selectedAttributes?: Record<string, unknown>;
	product?: { id: number; name: string; slug: string; thumbnailUrl?: string };
}

export interface AdminOrderCustomer {
	id: number;
	name: string;
	phoneNumber: string;
	email?: string;
	totalOrders: number;
	totalSpent: number | string;
}

export interface AdminOrder {
	id: number;
	customer?: AdminOrderCustomer | null;
	customerName: string;
	phone: string;
	email: string;
	shippingAddress: string;
	note?: string;
	totalAmount: number | string;
	status: OrderStatusEnum;
	paymentMethod: PaymentMethodEnum;
	confirmedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
	items?: AdminOrderItem[];
}

export interface ListOrderParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	customerName?: string;
	phone?: string;
	email?: string;
	customerId?: number;
	status?: OrderStatusEnum;
	paymentMethod?: PaymentMethodEnum;
	createdAtFrom?: string;
	createdAtTo?: string;
}

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminOrders(
	params: ListOrderParams = {},
): Promise<PaginatedResponse<AdminOrder>> {
	return adminFetch(`/cms/orders${buildQuery(params)}`);
}

export async function getAdminOrder(id: number): Promise<AdminOrder> {
	return adminFetch(`/cms/orders/${id}`);
}

export async function updateAdminOrderStatus(
	id: number,
	status: OrderStatusEnum,
): Promise<AdminOrder> {
	return adminFetch(`/cms/orders/${id}/status`, {
		method: "PATCH",
		body: { status },
	});
}
