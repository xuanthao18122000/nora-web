"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { CustomerForm } from "@/features/admin/customer/CustomerForm";
import { Card, CardBody } from "@/features/admin/ui";
import { getAdminCustomer } from "@/lib/api/admin";

export default function EditCustomerPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);

	const { data, isLoading, error } = useSWR(
		Number.isFinite(id) ? ["admin/customer", id] : null,
		() => getAdminCustomer(id),
	);

	if (isLoading) {
		return (
			<Card>
				<CardBody>
					<div className="text-sm text-gray-500">Đang tải...</div>
				</CardBody>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardBody>
					<div className="text-sm text-red-600">Không tải được khách hàng.</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return <CustomerForm mode="edit" initialData={data} />;
}
