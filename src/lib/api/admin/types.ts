export enum StatusCommonEnum {
	ACTIVE = 1,
	INACTIVE = -1,
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages?: number;
}

export enum UserRoleEnum {
	ADMIN = 1,
	SUPER_ADMIN = 2,
}

export enum UserStatusEnum {
	ACTIVE = 1,
	INACTIVE = -1,
}

export interface AdminUser {
	id: number;
	email: string;
	fullName: string;
	avatar?: string;
	phoneNumber?: string;
	address?: string;
	role: UserRoleEnum;
	status: UserStatusEnum;
	createdAt: string;
	updatedAt: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	expiresIn: string;
	user: AdminUser;
}
