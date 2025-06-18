import { AxiosInstance } from 'axios';



import { RoleWithAuthorities } from '@/types/response/Role';

import { z } from 'zod/v4';

export async function changeRoles(axios: AxiosInstance, data: { userId: string; roleIds: number[] }): Promise<void> {
	const { userId, roleIds } = data;

	const result = await axios.put(`/users/${userId}/roles`, { roleIds }, { data: { roleIds } });

	return result.data;
}

export async function getRoles(axios: AxiosInstance): Promise<RoleWithAuthorities[]> {
	const result = await axios.get(`/roles`);

	return result.data;
}

export const CreateRoleSchema = z.object({
	position: z.coerce.number().int().min(0).max(32767),
	name: z.string().min(1).max(100),
	description: z.string(),
	color: z.string(),
});

export type CreateRoleRequest = z.infer<typeof CreateRoleSchema>;

export async function createRole(axios: AxiosInstance, payload: CreateRoleRequest) {
	const result = await axios.post('/roles', payload, { data: payload });

	return result.data;
}

export const UpdateRoleSchema = z.object({
	position: z.coerce.number().int().min(0).max(32767),
	name: z.string().min(1).max(100),
	description: z.string(),
	color: z.string(),
});

export type UpdateRoleRequest = z.infer<typeof UpdateRoleSchema>;

export async function updateRole(axios: AxiosInstance, id: number, payload: UpdateRoleRequest) {
	const result = await axios.put(`/roles/${id}`, payload, { data: payload });

	return result.data;
}

export async function moveRole(
	axios: AxiosInstance,
	payload: {
		id: number;
		index: number;
	}[],
) {
	const result = await axios.put(`/roles/move`, payload, { data: payload });

	return result.data;
}

export async function deleteRole(axios: AxiosInstance, id: number) {
	const result = await axios.delete(`/roles/${id}`);

	return result.data;
}
