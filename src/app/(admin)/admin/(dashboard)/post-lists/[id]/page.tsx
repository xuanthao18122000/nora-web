"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { PostListForm } from "@/features/admin/post-list/PostListForm";
import { Card, CardBody } from "@/features/admin/ui";
import { getAdminPostList } from "@/lib/api/admin";

export default function EditPostListPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);

	const { data, isLoading, error } = useSWR(
		Number.isFinite(id) ? ["admin/post-list", id] : null,
		() => getAdminPostList(id),
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
						Không tải được danh sách. Vui lòng thử lại.
					</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return <PostListForm mode="edit" initialData={data} />;
}
