export const GENDER = {
	MALE: 1,
	FEMALE: 2,
	OTHER: 3,
} as const;

export type GenderValue = (typeof GENDER)[keyof typeof GENDER];

export const GENDER_LABEL: Record<GenderValue, string> = {
	[GENDER.MALE]: "Nam",
	[GENDER.FEMALE]: "Nữ",
	[GENDER.OTHER]: "Khác",
};
