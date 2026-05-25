/**
 * Chuyển chuỗi tiếng Việt thành slug (lowercase, gạch ngang).
 * Vd: "Máy bơm Hayward 1.5HP" → "may-bom-hayward-15hp"
 */
export function slugify(input: string): string {
	if (!input) return "";

	return input
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}
