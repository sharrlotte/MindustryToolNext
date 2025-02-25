import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { PaginationQuery } from '@/query/search-query';
import { IdSearchParams } from '@/types/data/id-search-schema';
import CreateServerMapRequest from '@/types/request/CreateServerMapRequest';
import CreateServerPluginRequest from '@/types/request/CreateServerPluginRequest';
import { CreateServerManagerRequest, CreateServerRequest } from '@/types/request/CreateServerRequest';
import { PutServerPortRequest, PutServerRequest } from '@/types/request/UpdateServerRequest';
import { Player } from '@/types/response/Player';
import { PostServerResponse } from '@/types/response/PostServerResponse';
import Server from '@/types/response/Server';
import ServerAdmin from '@/types/response/ServerAdmin';
import { ServerDto } from '@/types/response/ServerDto';
import { ServerFile } from '@/types/response/ServerFile';
import ServerLoginLog from '@/types/response/ServerLoginLog';
import { ServerManager, ServerManagerDetail } from '@/types/response/ServerManager';
import { ServerMap } from '@/types/response/ServerMap';
import { ServerPlugin } from '@/types/response/ServerPlugin';
import ServerEnv from '@/types/response/ServerEnv';
import { z } from 'zod';

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
export async function getServerLoginCount(axios: AxiosInstance, id: string): Promise<number> {
  const result = await axios.get(`/servers/${id}/logins/count`);

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

export async function getServer(axios: AxiosInstance, { id }: IdSearchParams): Promise<ServerDto> {
  const result = await axios.get(`/servers/${id}`);

  return result.data;
}

export async function getServerSetting(axios: AxiosInstance, { id }: IdSearchParams): Promise<Server> {
  const result = await axios.get(`/servers/${id}/setting`);

  return result.data;
}

export async function getServers(axios: AxiosInstance, params: { official?: boolean } & PaginationQuery): Promise<ServerDto[]> {
  const result = await axios.get(`/servers`, { params });

  return result.data;
}

export async function getServersByAdmin(axios: AxiosInstance, params: { official?: boolean } & PaginationQuery): Promise<ServerDto[]> {
  const result = await axios.get(`/servers/admin`, { params });

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
export async function createServerEnv(axios: AxiosInstance, serverId: string, payload: z.infer<typeof CreateServerEnvSchema>): Promise<ServerAdmin> {
  const result = await axios.post(`/servers/${serverId}/env`, payload, { headers: { 'Content-Type': 'application/json' } });

  return result.data;
}
export async function updateServerEnv(axios: AxiosInstance, serverId: string, payload: z.infer<typeof UpdateServerEnvSchema>): Promise<ServerAdmin> {
  const result = await axios.post(`/servers/${serverId}/env`, payload, { headers: { 'Content-Type': 'application/json' } });

  return result.data;
}

export async function deleteServerEnv(axios: AxiosInstance, serverId: string, envId: string): Promise<void> {
  const result = await axios.delete(`/servers/${serverId}/env/${envId}`);

  return result.data;
}
