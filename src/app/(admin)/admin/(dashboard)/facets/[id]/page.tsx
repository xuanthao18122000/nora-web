"use client";

import { useParams } from "next/navigation";
import { FacetForm, useAdminFacet } from "@/features/admin/facets";
import { Card, CardBody } from "@/features/admin/ui";

export default function EditFacetPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);

	const { data, isLoading, error } = useAdminFacet(
		Number.isFinite(id) ? id : null,
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
					<div className="text-sm text-red-600">
						Không tải được bộ lọc. Vui lòng thử lại.
					</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return <FacetForm mode="edit" initialData={data} />;
}
