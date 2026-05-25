"use client";

import { useParams } from "next/navigation";
import { PageSystemForm } from "@/features/admin/page/PageSystemForm";
import { useAdminPage } from "@/features/admin/page/useAdminPages";
import { Card, CardBody } from "@/features/admin/ui";

export default function PageDetailPage() {
	const params = useParams<{ id: string }>();
	const id = params?.id ?? null;
	const { data, isLoading, error, mutate } = useAdminPage(id);

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
					<div className="text-sm text-red-600">Không tải được trang.</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return (
		<PageSystemForm
			mode="edit"
			initialData={data}
			onSectionsChanged={() => mutate()}
		/>
	);
}
