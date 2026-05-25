export const ADDRESS_TYPE = {
	HOME: 1,
	OFFICE: 2,
} as const;

export type AddressTypeValue = (typeof ADDRESS_TYPE)[keyof typeof ADDRESS_TYPE];

export const ADDRESS_TYPE_LABEL: Record<AddressTypeValue, string> = {
	[ADDRESS_TYPE.HOME]: "Nhà",
	[ADDRESS_TYPE.OFFICE]: "Văn Phòng",
};
