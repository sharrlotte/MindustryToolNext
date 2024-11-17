import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import CreateInternalServerPluginRequest from '@/types/request/CreaeteInternalServerPluginRequest';
import CreateInternalServerMapRequest from '@/types/request/CreateInternalServerMapRequest';
import { CreateInternalServerRequest } from '@/types/request/CreateInternalServerRequest';
import CreateServerRequest from '@/types/request/CreateServerRequest';
import { PutInternalServerPortRequest, PutInternalServerRequest } from '@/types/request/UpdateInternalServerRequest';
import { ExternalServer } from '@/types/response/ExternalServer';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import { InternalServerMap } from '@/types/response/InternalServerMap';
import { InternalServerPlugin } from '@/types/response/InternalServerPlugin';
import { Player } from '@/types/response/Player';
import { PostServerResponse } from '@/types/response/PostServerResponse';
import { ServerFile } from '@/types/response/ServerFile';

export async function deleteServerFile(axios: AxiosInstance, id: string, path: string): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}/files`, {
    params: { path },
  });

  return result.data;
}

export async function getServerPlayers(axios: AxiosInstance, id: string): Promise<Player[]> {
  const result = await axios.get(`/internal-servers/${id}/players`);

  return result.data;
}

export async function deleteInternalServerMap(axios: AxiosInstance, id: string, mapId: string): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}/maps/${mapId}`);

  return result.data;
}

export async function deleteInternalServerPlugin(axios: AxiosInstance, id: string, pluginId: string): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}/plugins/${pluginId}`);

  return result.data;
}

export async function deleteInternalServer(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}`);

  return result.data;
}

export async function getServerFiles(axios: AxiosInstance, id: string, path: string): Promise<ServerFile[]> {
  const result = await axios.get(`/internal-servers/${id}/files`, {
    params: { path },
  });

  return result.data;
}

export async function getInternalServerMaps(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<InternalServerMap[]> {
  const result = await axios.get(`/internal-servers/${id}/maps`, {
    params: params,
  });

  return result.data;
}

export async function getInternalServerPlugins(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<InternalServerPlugin[]> {
  const result = await axios.get(`/internal-servers/${id}/plugins`, {
    params: params,
  });

  return result.data;
}

export async function getInternalServer(axios: AxiosInstance, { id }: IdSearchParams): Promise<InternalServerDetail> {
  const result = await axios.get(`/internal-servers/${id}`);

  return result.data;
}

export async function getInternalServers(axios: AxiosInstance, params?: { official: boolean }): Promise<InternalServerDetail[]> {
  const result = await axios.get(`/internal-servers`, { params });

  return result.data;
}

export async function getServers(axios: AxiosInstance, params: PaginationQuery): Promise<ExternalServer[]> {
  const result = await axios.get(`/external-servers`, {
    params: {
      ...params,
      size: 40,
    },
  });

  return result.data;
}

export async function createServerFile(axios: AxiosInstance, serverId: string, path: string, file: File): Promise<void> {
  const form = toForm({ file });

  return axios.post(`/internal-servers/${serverId}/files`, form, {
    params: { path },
    data: form,
  });
}

export async function createInternalServerMap(axios: AxiosInstance, serverId: string, data: CreateInternalServerMapRequest): Promise<void> {
  return axios.post(`/internal-servers/${serverId}/maps`, data, {
    data,
  });
}

export async function createInternalServerPlugin(axios: AxiosInstance, serverId: string, data: CreateInternalServerPluginRequest): Promise<void> {
  return axios.post(`/internal-servers/${serverId}/plugins`, data, {
    data,
  });
}

export async function createInternalServer(axios: AxiosInstance, data: CreateInternalServerRequest): Promise<PostServerResponse> {
  const result = await axios.post('/internal-servers', data, {
    data,
  });

  return result.data;
}

export async function createReloadInternalServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/reload`);

  return result.data;
}

export async function createServer(axios: AxiosInstance, data: CreateServerRequest): Promise<PostServerResponse> {
  const result = await axios.post('/mindustry-servers', data, {
    data,
  });

  return result.data;
}

export async function shutdownInternalServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/shutdown`);

  return result.data;
}

export async function startInternalServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/start`);

  return result.data;
}

export async function reloadInternalServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/reload`);

  return result.data;
}

export async function reloadInternalServers(axios: AxiosInstance): Promise<PostServerResponse> {
  const result = await axios.post('/internal-servers/reload');

  return result.data;
}

export async function updateInternalServer(axios: AxiosInstance, serverId: string, data: PutInternalServerRequest): Promise<void> {
  return axios.put(`/internal-servers/${serverId}`, data, {
    data,
  });
}

export async function updateInternalServerPort(axios: AxiosInstance, serverId: string, data: PutInternalServerPortRequest): Promise<void> {
  return axios.put(`/internal-servers/${serverId}/port`, data, {
    data,
  });
}
