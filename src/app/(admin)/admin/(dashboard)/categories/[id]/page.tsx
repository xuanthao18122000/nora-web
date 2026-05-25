"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { CategoryForm } from "@/features/admin/category/CategoryForm";
import { Card, CardBody } from "@/features/admin/ui";
import { getAdminCategory } from "@/lib/api/admin";

export default function EditCategoryPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);

	const { data, isLoading, error } = useSWR(
		Number.isFinite(id) ? ["admin/category", id] : null,
		() => getAdminCategory(id),
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
						Không tải được danh mục. Vui lòng thử lại.
					</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return <CategoryForm mode="edit" initialData={data} />;
}
