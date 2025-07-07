import { UserRole } from '@/constant/constant';
import z from 'zod/v4';

export type Role = {
	id: number;
	name: string;
	position: number;
	description: string;
	color: string;
};

export const RoleSchema = z.object({
	id: z.number(),
	name: z.string(),
	position: z.number(),
	description: z.string(),
	color: z.string(),
});

export type RoleWithAuthorities = {
	id: number;
	name: UserRole;
	position: number;
	color: string;
	description: string;
	authorities: Authority[];
};

export type Authority = {
	id: string;
	name: string;
	authorityGroup: string;
	description: string;
};
