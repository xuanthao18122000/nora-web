"use client";

import { useParams, useSearchParams } from "next/navigation";
import { SectionForm } from "@/features/admin/page/SectionForm";
import { useAdminPage } from "@/features/admin/page/useAdminPages";

export default function NewSectionPage() {
	const params = useParams<{ id: string }>();
	const searchParams = useSearchParams();
	const pageId = params?.id;
	const presetType = searchParams.get("type") ?? undefined;
	const presetKey = searchParams.get("key") ?? undefined;
	const { data: page } = useAdminPage(pageId ?? null);
	const defaultPosition = page?.sections?.length ?? 0;

	if (!pageId) return null;

	return (
		<SectionForm
			mode="create"
			pageId={pageId}
			presetType={presetType}
			presetKey={presetKey}
			defaultPosition={defaultPosition}
		/>
	);
}
