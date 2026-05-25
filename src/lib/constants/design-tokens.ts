/**
 * DDV design color tokens — single source of truth for palette and globals.css.
 * Scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.
 */
export const colorTokens = {
	primary: {
		50: "#ECEBFF",
		100: "#D4D3FF",
		200: "#A9A7FF",
		300: "#7E7BFF",
		400: "#534FFF",
		500: "#1312E9",
		600: "#110FD1",
		700: "#0E0CAD",
		800: "#0B0989",
		900: "#080765",
		950: "#050441",
	},
	gray: {
		50: "#F9FAFB",
		100: "#F3F4F6",
		200: "#E5E7EB",
		300: "#D1D5DC",
		400: "#99A1AF",
		500: "#6A7282",
		600: "#4A5565",
		700: "#364153",
		800: "#1E2939",
		900: "#101B2B",
		950: "#030712",
	},
	orange: {
		50: "#FFF7ED",
		100: "#FFEDD4",
		200: "#FFD6A7",
		300: "#FFB86A",
		400: "#FF8904",
		500: "#FF6900",
		600: "#F54900",
		700: "#CA3500",
		800: "#9F2D00",
		900: "#7E2A0C",
		950: "#441306",
	},
	yellow: {
		50: "#FEFCE8",
		100: "#FEF9C2",
		200: "#FFF085",
		300: "#FFDF20",
		400: "#FDC700",
		500: "#F0B100",
		600: "#D08700",
		700: "#A65F00",
		800: "#894B00",
		900: "#733E0A",
		950: "#432004",
	},
	red: {
		50: "#FDEBED",
		100: "#F9C9CE",
		200: "#F3A4AC",
		300: "#E87782",
		400: "#D54552",
		500: "#BE1E2D",
		600: "#A81928",
		700: "#8A131F",
		800: "#6C0E18",
		900: "#4F0911",
		950: "#2C0509",
	},
	green: {
		50: "#F0FDF4",
		100: "#DCFCE7",
		200: "#B9F8CF",
		300: "#7BF1A8",
		400: "#05DF72",
		500: "#00C950",
		600: "#00A63E",
		700: "#008236",
		800: "#016630",
		900: "#0D542B",
		950: "#032E15",
	},
	blue: {
		50: "#EFF6FF",
		100: "#DBEAFE",
		200: "#BEDBFF",
		300: "#8EC5FF",
		400: "#51A2FF",
		500: "#2B7FFF",
		600: "#155DFC",
		700: "#1447E6",
		800: "#193CB8",
		900: "#1C398E",
		950: "#162456",
	},
} as const;

export const COLOR_SCALE = [
	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

type ColorScale = (typeof COLOR_SCALE)[number];
export type TokenKey = keyof typeof colorTokens;

/**
 * Static bg/text class names so Tailwind includes them (no dynamic strings).
 * Use getBgClass / getTextClass for lookup.
 */
export const colorClassesBg: Record<TokenKey, Record<ColorScale, string>> = {
	primary: {
		50: "bg-primary-50",
		100: "bg-primary-100",
		200: "bg-primary-200",
		300: "bg-primary-300",
		400: "bg-primary-400",
		500: "bg-primary-500",
		600: "bg-primary-600",
		700: "bg-primary-700",
		800: "bg-primary-800",
		900: "bg-primary-900",
		950: "bg-primary-950",
	},
	gray: {
		50: "bg-gray-50",
		100: "bg-gray-100",
		200: "bg-gray-200",
		300: "bg-gray-300",
		400: "bg-gray-400",
		500: "bg-gray-500",
		600: "bg-gray-600",
		700: "bg-gray-700",
		800: "bg-gray-800",
		900: "bg-gray-900",
		950: "bg-gray-950",
	},
	orange: {
		50: "bg-orange-50",
		100: "bg-orange-100",
		200: "bg-orange-200",
		300: "bg-orange-300",
		400: "bg-orange-400",
		500: "bg-orange-500",
		600: "bg-orange-600",
		700: "bg-orange-700",
		800: "bg-orange-800",
		900: "bg-orange-900",
		950: "bg-orange-950",
	},
	yellow: {
		50: "bg-yellow-50",
		100: "bg-yellow-100",
		200: "bg-yellow-200",
		300: "bg-yellow-300",
		400: "bg-yellow-400",
		500: "bg-yellow-500",
		600: "bg-yellow-600",
		700: "bg-yellow-700",
		800: "bg-yellow-800",
		900: "bg-yellow-900",
		950: "bg-yellow-950",
	},
	red: {
		50: "bg-red-50",
		100: "bg-red-100",
		200: "bg-red-200",
		300: "bg-red-300",
		400: "bg-red-400",
		500: "bg-red-500",
		600: "bg-red-600",
		700: "bg-red-700",
		800: "bg-red-800",
		900: "bg-red-900",
		950: "bg-red-950",
	},
	green: {
		50: "bg-green-50",
		100: "bg-green-100",
		200: "bg-green-200",
		300: "bg-green-300",
		400: "bg-green-400",
		500: "bg-green-500",
		600: "bg-green-600",
		700: "bg-green-700",
		800: "bg-green-800",
		900: "bg-green-900",
		950: "bg-green-950",
	},
	blue: {
		50: "bg-blue-50",
		100: "bg-blue-100",
		200: "bg-blue-200",
		300: "bg-blue-300",
		400: "bg-blue-400",
		500: "bg-blue-500",
		600: "bg-blue-600",
		700: "bg-blue-700",
		800: "bg-blue-800",
		900: "bg-blue-900",
		950: "bg-blue-950",
	},
};

export const colorClassesText: Record<TokenKey, Record<ColorScale, string>> = {
	primary: {
		50: "text-primary-50",
		100: "text-primary-100",
		200: "text-primary-200",
		300: "text-primary-300",
		400: "text-primary-400",
		500: "text-primary-500",
		600: "text-primary-600",
		700: "text-primary-700",
		800: "text-primary-800",
		900: "text-primary-900",
		950: "text-primary-950",
	},
	gray: {
		50: "text-gray-50",
		100: "text-gray-100",
		200: "text-gray-200",
		300: "text-gray-300",
		400: "text-gray-400",
		500: "text-gray-500",
		600: "text-gray-600",
		700: "text-gray-700",
		800: "text-gray-800",
		900: "text-gray-900",
		950: "text-gray-950",
	},
	orange: {
		50: "text-orange-50",
		100: "text-orange-100",
		200: "text-orange-200",
		300: "text-orange-300",
		400: "text-orange-400",
		500: "text-orange-500",
		600: "text-orange-600",
		700: "text-orange-700",
		800: "text-orange-800",
		900: "text-orange-900",
		950: "text-orange-950",
	},
	yellow: {
		50: "text-yellow-50",
		100: "text-yellow-100",
		200: "text-yellow-200",
		300: "text-yellow-300",
		400: "text-yellow-400",
		500: "text-yellow-500",
		600: "text-yellow-600",
		700: "text-yellow-700",
		800: "text-yellow-800",
		900: "text-yellow-900",
		950: "text-yellow-950",
	},
	red: {
		50: "text-red-50",
		100: "text-red-100",
		200: "text-red-200",
		300: "text-red-300",
		400: "text-red-400",
		500: "text-red-500",
		600: "text-red-600",
		700: "text-red-700",
		800: "text-red-800",
		900: "text-red-900",
		950: "text-red-950",
	},
	green: {
		50: "text-green-50",
		100: "text-green-100",
		200: "text-green-200",
		300: "text-green-300",
		400: "text-green-400",
		500: "text-green-500",
		600: "text-green-600",
		700: "text-green-700",
		800: "text-green-800",
		900: "text-green-900",
		950: "text-green-950",
	},
	blue: {
		50: "text-blue-50",
		100: "text-blue-100",
		200: "text-blue-200",
		300: "text-blue-300",
		400: "text-blue-400",
		500: "text-blue-500",
		600: "text-blue-600",
		700: "text-blue-700",
		800: "text-blue-800",
		900: "text-blue-900",
		950: "text-blue-950",
	},
};

/**
 * Token aliases: semantic class names → concrete scale classes.
 * Canonical alias definitions live in globals.css @theme (--color-*).
 * Use these for lookup/resolution in JS; use the alias class strings (e.g. "bg-card-gray") in JSX so Tailwind includes them.
 */
export const tokenAliases = {
	"bg-card-gray": "bg-gray-100",
	"text-card-gray": "text-gray-100",
	// Add more as you define --color-* aliases in globals.css, e.g.:
	// "bg-surface-subtle": "bg-gray-50",
	// "border-border-card": "border-gray-200",
} as const;

export type TokenAliasKey = keyof typeof tokenAliases;

/** Resolve an alias class to its concrete class, or return the input if not an alias. */
export function resolveTokenAlias(aliasOrClass: string): string {
	return (
		(tokenAliases as Record<string, string>)[aliasOrClass] ?? aliasOrClass
	);
}

/** Row config for design-system color grid (name + token key). */
const COLOR_GRID_CONFIG: { name: string; tokenPrefix: TokenKey }[] = [
	{ name: "Primary", tokenPrefix: "primary" },
	{ name: "Gray", tokenPrefix: "gray" },
	{ name: "Orange", tokenPrefix: "orange" },
	{ name: "Yellow", tokenPrefix: "yellow" },
	{ name: "Red", tokenPrefix: "red" },
	{ name: "Green", tokenPrefix: "green" },
	{ name: "Blue", tokenPrefix: "blue" },
];

/** Build color grid rows from tokens for the design-system Overview. */
export function getColorGridRows(): {
	name: string;
	tokenPrefix: TokenKey;
	colors: readonly string[];
}[] {
	return COLOR_GRID_CONFIG.map(({ name, tokenPrefix }) => {
		const palette = colorTokens[tokenPrefix];
		const colors = COLOR_SCALE.map(
			(s) => palette[s as keyof typeof palette],
		);
		return { name, tokenPrefix, colors };
	});
}

/** Typography tokens — single source for font family, size, line height, weight. */
export const typographyTokens = {
	fontFamily: "SF Pro Display, -apple-system, sans-serif",
	fontSize: {
		xxs: "0.625rem",
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem",
		"4xl": "2.25rem",
		"5xl": "2.5rem",
		"6xl": "3rem",
	},
	lineHeight: {
		xxs: "14px",
		xs: "16px",
		sm: "20px",
		md: "24px",
		lg: "26px",
		xl: "28px",
		"2xl": "30px",
		"3xl": "36px",
		"4xl": "40px",
		"5xl": "44px",
		"6xl": "53px",
	},
	fontWeight: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
	},
} as const;

export const TYPOGRAPHY_SIZE_KEYS = [
	"xxs",
	"xs",
	"sm",
	"md",
	"lg",
	"xl",
	"2xl",
	"3xl",
	"4xl",
	"5xl",
	"6xl",
] as const;

export const TYPOGRAPHY_WEIGHT_KEYS = [
	"normal",
	"medium",
	"semibold",
	"bold",
] as const;

/** Static Tailwind text-size class names for typography section (no dynamic classes). */
export const TYPOGRAPHY_SIZE_CLASSES: Record<
	(typeof TYPOGRAPHY_SIZE_KEYS)[number],
	string
> = {
	xxs: "text-xxs",
	xs: "text-xs",
	sm: "text-sm",
	md: "text-md",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
	"3xl": "text-3xl",
	"4xl": "text-4xl",
	"5xl": "text-5xl",
	"6xl": "text-6xl",
};
