"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ProductForm } from "@/features/admin/product/ProductForm";
import { Card, CardBody } from "@/features/admin/ui";
import { getAdminProduct } from "@/lib/api/admin";

export default function EditProductPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);

	const { data, isLoading, error } = useSWR(
		Number.isFinite(id) ? ["admin/product", id] : null,
		() => getAdminProduct(id),
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
						Không tải được sản phẩm. Vui lòng thử lại.
					</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return (
		<ProductForm
			mode="edit"
			initialData={data}
			extraHeaderActions={
				data.slug && (
					<Link
						href={`/${data.slug}`}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						<ExternalLink className="h-4 w-4" />
						Xem trên website
					</Link>
				)
			}
		/>
	);
}
