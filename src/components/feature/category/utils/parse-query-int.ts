export function parseQueryInt(value: string | undefined): number | undefined {
	if (value == null || value === "") return undefined;
	const n = Number.parseInt(value, 10);
	return Number.isFinite(n) ? n : undefined;
}
