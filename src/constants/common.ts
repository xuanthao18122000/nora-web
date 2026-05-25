export const Gender = {
	MALE: 1,
	FEMALE: 2,
	OTHER: 3,
} as const;

export const OPERATION = {
	ADD: 1,
	SUBTRACT: 2,
} as const;

export const AMOUNT_TYPE = {
	CASH: 1,
	PERCENT: 2,
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];

export const StatusCommon = {
	ACTIVE: 1,
	INACTIVE: 0,
} as const;

export type StatusCommonType = (typeof StatusCommon)[keyof typeof StatusCommon];
