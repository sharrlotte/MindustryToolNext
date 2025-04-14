import { UserRole } from '@/constant/constant';

export type LoginResponse = {
	id: string;
	name: string;
	imageUrl?: string | null;
	roles: UserRole[];
	accessToken: string;
	refreshToken: string;
	expireTime: number;
};
