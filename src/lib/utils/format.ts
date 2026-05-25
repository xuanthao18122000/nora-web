/**
 * Format price in Vietnamese Đồng
 * @example formatPrice(9200000) → "9.200.000 đ"
 */
export function formatPrice(amount: number): string {
	if (!Number(amount)) return "0 đ";
	return `${new Intl.NumberFormat("vi-VN").format(amount)} đ`;
}

/**
 * Format discount percentage
 * @example formatDiscount(30) → "-30%"
 */
export function formatDiscount(percent: number): string {
	return `-${percent}%`;
}

/**
 * Format date in Vietnamese locale
 * @example formatDate("2026-03-05") → "05/03/2026"
 */
export function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return new Intl.DateTimeFormat("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

/**
 * Format rating number
 * @example formatRating("4.50") → "4.5"
 */
export function formatRating(rating: string | number): string {
	return Number(rating).toFixed(1).replace(/\.0$/, "");
}

/**
 * Time-of-day for flash-sale slots. Uses a fixed IANA timezone so SSR and the
 * browser produce identical strings (avoids hydration mismatches from server
 * TZ vs client TZ).
 */
export function formatSlotClock(
	isoString: string,
	timeZone = "Asia/Ho_Chi_Minh",
): string {
	if (!isoString) return "";
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("vi-VN", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date);
}

/**
 * Convert "HH:mm" time string to today's (or tomorrow's) timestamp in ms.
 * Returns 0 if the input is invalid.
 */
export function endTimeToMs(endTime: string | null | undefined): number {
	if (!endTime) return 0;
	const [h, m] = endTime.split(":").map(Number);
	if (Number.isNaN(h) || Number.isNaN(m)) return 0;

	const now = new Date();
	const target = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		h,
		m,
		0,
		0,
	);
	if (target.getTime() < now.getTime()) {
		target.setDate(target.getDate() + 1);
	}
	return target.getTime();
}

export interface CountdownResult {
	prefix: string;
	time: string;
}

const EMPTY_COUNTDOWN: CountdownResult = { prefix: "", time: "" };
const pad2 = (v: number) => String(v).padStart(2, "0");

/**
 * Format countdown from endMs (timestamp) to { prefix, time }.
 * @returns e.g. { prefix: "Còn", time: "02:30:00" }
 */
/**
 * Rút gọn họ tên Việt cho header hiển thị.
 * "Nguyễn Văn A"  → maxLen >= 13 → "Nguyễn Văn A"
 *                 → maxLen < 13  → "Văn A"   (lót + tên)
 *                 → vẫn dài      → "A"       (tên)
 */
export function shortenName(fullName: string, maxLen = 12): string {
	const parts = fullName.trim().split(/\s+/);
	if (parts.length <= 1 || fullName.length <= maxLen) return fullName;

	// Bỏ họ → lót + tên
	const withoutHo = parts.slice(1).join(" ");
	if (withoutHo.length <= maxLen) return withoutHo;

	// Chỉ lấy tên (phần tử cuối)
	return parts[parts.length - 1];
}

/**
 * Format ISO date string to dd/MM/yyyy for birthday display.
 * @example formatBirthday("1990-05-15") -> "15/05/1990"
 */
export function formatBirthday(birthday: string | null): string {
	if (!birthday) return "-";
	try {
		const date = new Date(birthday);
		if (Number.isNaN(date.getTime())) return birthday;
		const dd = String(date.getDate()).padStart(2, "0");
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const yyyy = date.getFullYear();
		return `${dd}/${mm}/${yyyy}`;
	} catch {
		return birthday;
	}
}

export function formatFlashSaleCountdown(
	endAt: string | number,
	nowMs = Date.now(),
): CountdownResult {
	if (!endAt) return EMPTY_COUNTDOWN;

	const endMs =
		typeof endAt === "number"
			? endAt
			: endAt.includes(":")
				? endTimeToMs(endAt)
				: new Date(endAt).getTime();
	if (!endMs || Number.isNaN(endMs)) return EMPTY_COUNTDOWN;

	const totalSeconds = Math.max(0, Math.floor((endMs - nowMs) / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		prefix: "Còn",
		time: `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`,
	};
}
