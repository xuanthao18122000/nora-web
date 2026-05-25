import { z } from "zod";

/** Vietnamese mobile phone number pattern */
export const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

/**
 * Password validation rules.
 *
 * - Length: 6-32 characters.
 * - Whitelist: Latin letters, digits, and common ASCII symbols only.
 *   Excludes emoji, non-ASCII unicode (e.g. Vietnamese-with-diacritics,
 *   CJK), whitespace, and control characters.
 * - Composition: must contain at least one letter AND one digit.
 */
export const PASSWORD_RULES = {
	minLength: 6,
	maxLength: 32,
	allowedChars: /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};:'",.<>/?~`|\\]+$/,
	hasLetter: /[A-Za-z]/,
	hasDigit: /\d/,
};

/**
 * Password schema shared by register, forgot-password reset, and any
 * future change-password forms.
 *
 * Checks run in order; the first failure is what the form displays:
 *   1. empty → "Vui lòng nhập mật khẩu"
 *   2. length out of 6-32 → "Mật khẩu phải từ 6 đến 32 ký tự"
 *   3. disallowed character (emoji, diacritics, whitespace, control) →
 *      "Mật khẩu chứa ký tự không hợp lệ"
 *   4. missing letter or digit → "Mật khẩu phải chứa cả chữ và số"
 *
 * NOTE: intentionally does NOT call `.trim()` — whitespace is a disallowed
 * character per the whitelist, so padded input fails with the correct message.
 *
 * `_phoneNumber` is accepted for API compatibility but is not used; the
 * previous phone-based complexity check was removed in favor of a
 * deterministic whitelist.
 */
export function passwordSchema(_phoneNumber?: string) {
	return z
		.string()
		.min(1, "Vui lòng nhập mật khẩu")
		.min(PASSWORD_RULES.minLength, "Mật khẩu phải từ 6 đến 32 ký tự")
		.max(PASSWORD_RULES.maxLength, "Mật khẩu phải từ 6 đến 32 ký tự")
		.regex(PASSWORD_RULES.allowedChars, "Mật khẩu chứa ký tự không hợp lệ")
		.refine(
			(v) =>
				PASSWORD_RULES.hasLetter.test(v) &&
				PASSWORD_RULES.hasDigit.test(v),
			"Mật khẩu phải chứa cả chữ và số",
		);
}
