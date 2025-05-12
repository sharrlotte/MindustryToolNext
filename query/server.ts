import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { toForm } from '@/lib/utils';
import CreateServerMapRequest from '@/types/request/CreateServerMapRequest';
import CreateServerPluginRequest from '@/types/request/CreateServerPluginRequest';
import { CreateServerManagerRequest, CreateServerRequest } from '@/types/request/CreateServerRequest';
import { PutServerPortRequest, PutServerRequest } from '@/types/request/UpdateServerRequest';
import { Player } from '@/types/response/Player';
import { PostServerResponse } from '@/types/response/PostServerResponse';
import Server from '@/types/response/Server';
import ServerAdmin from '@/types/response/ServerAdmin';
import { ServerBuildLog } from '@/types/response/ServerBuildLog';
import { ServerCommandDto } from '@/types/response/ServerCommand';
import { ServerDto } from '@/types/response/ServerDto';
import ServerEnv from '@/types/response/ServerEnv';
import { ServerFile } from '@/types/response/ServerFile';
import ServerLoginLog from '@/types/response/ServerLoginLog';
import { ServerManager, ServerManagerDetail } from '@/types/response/ServerManager';
import { ServerMap } from '@/types/response/ServerMap';
import { ServerPlugin } from '@/types/response/ServerPlugin';
import { PaginationQuery } from '@/types/schema/search-query';

export async function deleteServerFile(axios: AxiosInstance, id: string, path: string): Promise<void> {
	const result = await axios.delete(`/servers/${id}/files`, {
		params: { path },
	});

	return result.data;
}

export async function getServerPlayers(axios: AxiosInstance, id: string): Promise<Player[]> {
	const result = await axios.get(`/servers/${id}/players`);

	return result.data;
}
export async function getServerCommands(axios: AxiosInstance, id: string): Promise<ServerCommandDto[]> {
	
	return [
		{
			text: 'help',
			paramText: '[command]',
			description: 'Display the command list, or get help for a specific command.',
			params: [{ name: 'command', optional: true, variadic: false }],
		},
		{ text: 'version', paramText: '', description: 'Displays server version info.', params: [] },
		{ text: 'stop', paramText: '', description: 'Stop hosting the server.', params: [] },
		{
			text: 'maps',
			paramText: '[all/custom/default]',
			description: 'Display available maps. Displays only custom maps by default.',
			params: [{ name: 'all/custom/default', optional: true, variadic: false }],
		},
		{ text: 'reloadmaps', paramText: '', description: 'Reload all maps from disk.', params: [] },
		{ text: 'status', paramText: '', description: 'Display server status.', params: [] },
		{ text: 'mods', paramText: '', description: 'Display all loaded mods.', params: [] },
		{
			text: 'js',
			paramText: '<script...>',
			description: 'Run arbitrary Javascript.',
			params: [{ name: 'script', optional: false, variadic: true }],
		},
		{
			text: 'say',
			paramText: '<message...>',
			description: 'Send a message to all players.',
			params: [{ name: 'message', optional: false, variadic: true }],
		},
		{
			text: 'rules',
			paramText: '[remove/add] [name] [value...]',
			description: 'List, remove or add global rules. These will apply regardless of map.',
			params: [
				{ name: 'remove/add', optional: true, variadic: false },
				{ name: 'name', optional: true, variadic: false },
				{ name: 'value', optional: true, variadic: true },
			],
		},
		{
			text: 'playerlimit',
			paramText: '[off/somenumber]',
			description: 'Set the server player limit.',
			params: [{ name: 'off/somenumber', optional: true, variadic: false }],
		},
		{
			text: 'config',
			paramText: '[name] [value...]',
			description: 'Configure server settings.',
			params: [
				{ name: 'name', optional: true, variadic: false },
				{ name: 'value', optional: true, variadic: true },
			],
		},
		{
			text: 'whitelist',
			paramText: '[add/remove] [ID]',
			description: 'Add/remove players from the whitelist using their ID.',
			params: [
				{ name: 'add/remove', optional: true, variadic: false },
				{ name: 'ID', optional: true, variadic: false },
			],
		},
		{
			text: 'nextmap',
			paramText: '<mapname...>',
			description: 'Set the next map to be played after a game-over. Overrides shuffling.',
			params: [{ name: 'mapname', optional: false, variadic: true }],
		},
		{
			text: 'kick',
			paramText: '<username...>',
			description: 'Kick a person by name.',
			params: [{ name: 'username', optional: false, variadic: true }],
		},
		{
			text: 'ban',
			paramText: '<type-id/name/ip> <username/IP/ID...>',
			description: 'Ban a person.',
			params: [
				{ name: 'type-id/name/ip', optional: false, variadic: false },
				{ name: 'username/IP/ID', optional: false, variadic: true },
			],
		},
		{
			text: 'unban',
			paramText: '<ip/ID>',
			description: 'Completely unban a person by IP or ID.',
			params: [{ name: 'ip/ID', optional: false, variadic: false }],
		},
		{
			text: 'pardon',
			paramText: '<ID>',
			description: 'Pardons a votekicked player by ID and allows them to join again.',
			params: [{ name: 'ID', optional: false, variadic: false }],
		},
		{
			text: 'admin',
			paramText: '<add/remove> <username/ID...>',
			description: 'Make an online user admin',
			params: [
				{ name: 'add/remove', optional: false, variadic: false },
				{ name: 'username/ID', optional: false, variadic: true },
			],
		},
		{ text: 'admins', paramText: '', description: 'List all admins.', params: [] },
		{ text: 'players', paramText: '', description: 'List all players currently in game.', params: [] },
		{ text: 'gameover', paramText: '', description: 'Force a game over.', params: [] },
		{
			text: 'search',
			paramText: '<name...>',
			description: 'Search players who have used part of a name.',
			params: [{ name: 'name', optional: false, variadic: true }],
		},
		{
			text: 'nekoSystem',
			paramText: '[args...]',
			description: 'Neko system command handler',
			params: [{ name: 'args', optional: true, variadic: true }],
		},
		{
			text: 'nsystem',
			paramText: '[args...]',
			description: 'Neko system command handler',
			params: [{ name: 'args', optional: true, variadic: true }],
		},
		{
			text: 'ns',
			paramText: '[args...]',
			description: 'Neko system command handler',
			params: [{ name: 'args', optional: true, variadic: true }],
		},
		{
			text: 'user',
			paramText: '[args...]',
			description: 'User Manager system command handler',
			params: [{ name: 'args', optional: true, variadic: true }],
		},
		{
			text: 'account',
			paramText: '[args...]',
			description: 'User Manager system command handler',
			params: [{ name: 'args', optional: true, variadic: true }],
		},
	];
	// const result = await axios.get(`/servers/${id}/commands`);
	//	return result.data;
}

export async function deleteServerMap(axios: AxiosInstance, id: string, mapId: string): Promise<void> {
	const result = await axios.delete(`/servers/${id}/maps/${mapId}`);

	return result.data;
}

export async function deleteServerPlugin(axios: AxiosInstance, id: string, pluginId: string): Promise<void> {
	const result = await axios.delete(`/servers/${id}/plugins/${pluginId}`);

	return result.data;
}

export async function deleteServer(axios: AxiosInstance, id: string): Promise<void> {
	const result = await axios.delete(`/servers/${id}`);

	return result.data;
}

export async function getServerFiles(axios: AxiosInstance, id: string, path: string): Promise<ServerFile[]> {
	const result = await axios.get(`/servers/${id}/files`, {
		params: { path },
	});

	return result.data;
}

export async function getServerLogins(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerLoginLog[]> {
	const result = await axios.get(`/servers/${id}/logins`, {
		params: params,
	});

	return result.data;
}
export async function getServerBuildLog(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerBuildLog[]> {
	const result = await axios.get(`/servers/${id}/build-log`, {
		params: params,
	});

	return result.data;
}

export async function getServerMaps(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerMap[]> {
	const result = await axios.get(`/servers/${id}/maps`, {
		params: params,
	});

	return result.data;
}
export async function getServerMapCount(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<number> {
	const result = await axios.get(`/servers/${id}/maps/total`, {
		params: params,
	});

	return result.data;
}

export async function getServerPlugins(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerPlugin[]> {
	const result = await axios.get(`/servers/${id}/plugins`, {
		params: params,
	});

	return result.data;
}

export async function getServerPluginCount(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<number> {
	const result = await axios.get(`/servers/${id}/plugins/total`, {
		params: params,
	});

	return result.data;
}

export async function getServer(axios: AxiosInstance, { id }: { id: string }): Promise<ServerDto> {
	const result = await axios.get(`/servers/${id}`);

	return result.data;
}

export async function getServerSetting(axios: AxiosInstance, { id }: { id: string }): Promise<Server> {
	const result = await axios.get(`/servers/${id}/setting`);

	return result.data;
}

export async function getServers(
	axios: AxiosInstance,
	params: { official?: boolean; name?: string } & PaginationQuery,
): Promise<ServerDto[]> {
	const result = await axios.get(`/servers`, { params });

	return result.data;
}

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

export async function createServerFile(axios: AxiosInstance, serverId: string, path: string, file: File): Promise<void> {
	const form = toForm({ file });

	return axios.post(`/servers/${serverId}/files`, form, {
		params: { path },
		data: form,
	});
}

export async function createServerMap(axios: AxiosInstance, serverId: string, data: CreateServerMapRequest): Promise<void> {
	return axios.post(`/servers/${serverId}/maps`, data, {
		data,
	});
}

export async function createServerPlugin(axios: AxiosInstance, serverId: string, data: CreateServerPluginRequest): Promise<void> {
	return axios.post(`/servers/${serverId}/plugins`, data, {
		data,
	});
}

export async function createServer(axios: AxiosInstance, data: CreateServerRequest): Promise<PostServerResponse> {
	const result = await axios.post('/servers', data, {
		data,
	});

	return result.data;
}

export async function createReloadServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
	const result = await axios.post(`/servers/${id}/reload`);

	return result.data;
}

export async function shutdownServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
	const result = await axios.post(`/servers/${id}/shutdown`);

	return result.data;
}

export async function removeServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
	const result = await axios.post(`/servers/${id}/remove`);

	return result.data;
}

export async function stopServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
	const result = await axios.post(`/servers/${id}/stop`);

	return result.data;
}

export async function host(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
	const result = await axios.post(`/servers/${id}/host`);

	return result.data;
}

export async function reloadServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
	const result = await axios.post(`/servers/${id}/reload`);

	return result.data;
}

export async function reloadServers(axios: AxiosInstance): Promise<PostServerResponse> {
	const result = await axios.post('/servers/reload');

	return result.data;
}

export async function updateServer(axios: AxiosInstance, serverId: string, data: PutServerRequest): Promise<void> {
	return axios.put(`/servers/${serverId}`, data, {
		data,
	});
}

export async function updateServerPort(axios: AxiosInstance, serverId: string, data: PutServerPortRequest): Promise<void> {
	return axios.put(`/servers/${serverId}/port`, data, {
		data,
	});
}

export async function getServerAdmin(axios: AxiosInstance, serverId: string): Promise<ServerAdmin[]> {
	const result = await axios.get(`/servers/${serverId}/admin`);

	return result.data;
}

export async function createServerAdmin(axios: AxiosInstance, serverId: string, userId: string): Promise<ServerAdmin> {
	const result = await axios.post(`/servers/${serverId}/admin`, userId, { headers: { 'Content-Type': 'application/json' } });

	return result.data;
}

export async function deleteServerAdmin(axios: AxiosInstance, serverId: string, adminId: string): Promise<void> {
	const result = await axios.delete(`/servers/${serverId}/admin/${adminId}`);

	return result.data;
}
export async function getServerEnv(axios: AxiosInstance, serverId: string): Promise<ServerEnv[]> {
	const result = await axios.get(`/servers/${serverId}/env`);

	return result.data;
}

export const CreateServerEnvSchema = z.object({
	name: z.string().min(1).max(128),
	value: z.string().min(1).max(1024),
});

export const UpdateServerEnvSchema = z.object({
	name: z.string().min(1).max(128),
	value: z.string().min(1).max(1024),
});
export async function createServerEnv(
	axios: AxiosInstance,
	serverId: string,
	payload: z.infer<typeof CreateServerEnvSchema>,
): Promise<ServerAdmin> {
	const result = await axios.post(`/servers/${serverId}/env`, payload, { headers: { 'Content-Type': 'application/json' } });

	return result.data;
}
export async function updateServerEnv(
	axios: AxiosInstance,
	serverId: string,
	payload: z.infer<typeof UpdateServerEnvSchema>,
): Promise<ServerAdmin> {
	const result = await axios.post(`/servers/${serverId}/env`, payload, { headers: { 'Content-Type': 'application/json' } });

	return result.data;
}

export async function deleteServerEnv(axios: AxiosInstance, serverId: string, envId: string): Promise<void> {
	const result = await axios.delete(`/servers/${serverId}/env/${envId}`);

	return result.data;
}
