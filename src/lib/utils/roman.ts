const ROMAN_NUMERALS = [
	["M", 1000],
	["CM", 900],
	["D", 500],
	["CD", 400],
	["C", 100],
	["XC", 90],
	["L", 50],
	["XL", 40],
	["X", 10],
	["IX", 9],
	["V", 5],
	["IV", 4],
	["I", 1],
] as const;

export function toRoman(num: number): string {
	if (!Number.isFinite(num) || num <= 0) return "";
	let n = Math.floor(num);
	let result = "";
	for (const [symbol, value] of ROMAN_NUMERALS) {
		while (n >= (value as number)) {
			n -= value as number;
			result += symbol;
		}
	}
	return result;
}
