import { envConfig } from "@/lib/configs/env";

interface BreadcrumbSchemaProps {
	items: { label: string; href?: string }[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
	const baseUrl = envConfig.NEXT_PUBLIC_APP_URL || "https://acquyhnsaigon.vn";

	const schema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.label,
			item: item.href ? `${baseUrl}${item.href}` : undefined,
		})),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires this
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
