"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { SectionForm } from "@/features/admin/page/SectionForm";
import { Card, CardBody } from "@/features/admin/ui";
import { getAdminPageSection } from "@/lib/api/admin";

export default function EditSectionPage() {
	const params = useParams<{ id: string; sectionId: string }>();
	const pageId = params?.id;
	const sectionId = Number(params?.sectionId);

	const { data, isLoading, error } = useSWR(
		Number.isFinite(sectionId) ? ["admin/section", sectionId] : null,
		() => getAdminPageSection(sectionId),
	);

	if (!pageId) return null;

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
					<div className="text-sm text-red-600">Không tải được section.</div>
				</CardBody>
			</Card>
		);
	}

	if (!data) return null;

	return <SectionForm mode="edit" pageId={pageId} initialData={data} />;
}
