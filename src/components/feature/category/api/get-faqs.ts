import { API, api } from "@/lib/api";

export enum FaqTargetType {
	PRODUCT = 1,
	CATEGORY = 2,
}

export interface FaqItem {
	id: string;
	targetType?: FaqTargetType;
	targetId?: string;
	question?: string;
	answer?: string;
}

export async function getFaqs(
	targetType: FaqTargetType,
	targetId: string,
): Promise<FaqItem[]> {
	return api.get<FaqItem[]>(API.FAQS.LIST, {
		params: {
			targetType: String(targetType),
			targetId,
		},
	});
}
