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
import { ServerDetail } from '@/types/response/ServerDetail';
import { ServerFile } from '@/types/response/ServerFile';
import { ServerManager, ServerManagerDetail } from '@/types/response/ServerManager';
import { ServerMap } from '@/types/response/ServerMap';
import { ServerPlugin } from '@/types/response/ServerPlugin';

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

export async function getServerMaps(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerMap[]> {
  const result = await axios.get(`/servers/${id}/maps`, {
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

export async function getServer(axios: AxiosInstance, { id }: IdSearchParams): Promise<ServerDetail> {
  const result = await axios.get(`/servers/${id}`);

  return result.data;
}

export async function getServers(axios: AxiosInstance, params: { official?: boolean } & PaginationQuery): Promise<ServerDetail[]> {
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
