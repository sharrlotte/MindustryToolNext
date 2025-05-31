import { AxiosInstance } from 'axios';

import { CreateServerManagerRequest } from '@/types/request/CreateServerRequest';
import { ServerManager, ServerManagerDetail } from '@/types/response/ServerManager';
import { ServerManagerMap } from '@/types/response/ServerManagerMap';
import { ServerManagerPlugin } from '@/types/response/ServerManagerPlugin';

export async function getMyServerManager(axios: AxiosInstance): Promise<ServerManager[]> {
	const result = await axios.get(`/users/@me/server-managers`);

	return result.data;
}

export async function getMyServerManagerById(axios: AxiosInstance, id: string): Promise<ServerManagerDetail> {
	const result = await axios.get(`/server-managers/${id}`);

	return result.data;
}

export async function createServerManager(axios: AxiosInstance, payload: CreateServerManagerRequest): Promise<void> {
	const result = await axios.post(`/server-managers`, payload);

	return result.data;
}

export async function resetTokenServerManager(axios: AxiosInstance, id: string): Promise<void> {
	const result = await axios.post(`/server-managers/${id}/reset-token`);

	return result.data;
}

export async function getServerManagerMaps(axios: AxiosInstance, id: string): Promise<ServerManagerMap[]> {
	const result = await axios.get(`/server-managers/${id}/maps`);

	return result.data;
}

export async function deleteServerManageMap(axios: AxiosInstance, id: string, filename: string): Promise<void> {
	const result = await axios.delete(`/server-managers/${id}/maps/${filename}`);

	return result.data;
}

export async function getServerManagerPlugins(axios: AxiosInstance, id: string): Promise<ServerManagerPlugin[]> {
	const result = await axios.get(`/server-managers/${id}/mods`);

	return result.data;
}

export async function deleteServerManagePlugin(axios: AxiosInstance, id: string, filename: string): Promise<void> {
	const result = await axios.delete(`/server-managers/${id}/mods/${filename}`);

	return result.data;
}
