"use client";

import { adminFetch } from "./client";
import type { PaginatedResponse, StatusCommonEnum } from "./types";

export interface AdminCustomer {
	id: number;
	name: string;
	phoneNumber: string;
	email?: string;
	address?: string;
	totalOrders: number;
	totalSpent: number | string;
	status: StatusCommonEnum;
	deleted: number;
	createdAt: string;
	updatedAt: string;
}

export interface ListCustomerParams {
	page?: number;
	limit?: number;
	getFull?: boolean;
	sortBy?: string;
	order?: "ASC" | "DESC";
	name?: string;
	phoneNumber?: string;
	email?: string;
	status?: StatusCommonEnum;
	createdAtFrom?: string;
	createdAtTo?: string;
}

export interface CreateCustomerPayload {
	name: string;
	phoneNumber: string;
	email?: string;
	address?: string;
	status?: StatusCommonEnum;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

function buildQuery(params: object = {}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function listAdminCustomers(
	params: ListCustomerParams = {},
): Promise<PaginatedResponse<AdminCustomer>> {
	return adminFetch(`/cms/customers${buildQuery(params)}`);
}

export async function getAdminCustomer(id: number): Promise<AdminCustomer> {
	return adminFetch(`/cms/customers/${id}`);
}

export async function createAdminCustomer(
	payload: CreateCustomerPayload,
): Promise<AdminCustomer> {
	return adminFetch("/cms/customers", { method: "POST", body: payload });
}

export async function updateAdminCustomer(
	id: number,
	payload: UpdateCustomerPayload,
): Promise<AdminCustomer> {
	return adminFetch(`/cms/customers/${id}`, { method: "PATCH", body: payload });
}

export async function deleteAdminCustomer(id: number): Promise<void> {
	return adminFetch(`/cms/customers/${id}`, { method: "DELETE" });
}
