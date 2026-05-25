import { Gender } from "@/constants/common";

/**
 * Trả prefix xưng hô tiếng Việt theo giới tính.
 * - MALE → "anh", FEMALE → "chị"
 * - Khác/không xác định → `fallback` (mặc định "anh/chị")
 * - `capitalize: true` để viết hoa ("Anh"/"Chị"/"Anh/Chị")
 */
export function getGenderPrefix(
	gender: number | null | undefined,
	options: { capitalize?: boolean; fallback?: string } = {},
): string {
	const { capitalize = false, fallback } = options;
	const male = capitalize ? "Anh" : "anh";
	const female = capitalize ? "Chị" : "chị";
	const unknown = fallback ?? (capitalize ? "Anh/Chị" : "anh/chị");
	if (gender === Gender.MALE) return male;
	if (gender === Gender.FEMALE) return female;
	return unknown;
}
