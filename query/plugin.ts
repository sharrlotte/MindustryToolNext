import VerifyPluginRequest from '@/types/request/VerifyPluginRequest';

import { CreatePluginRequest } from '@/types/request/CreatePluginRequest';
import { AxiosInstance } from 'axios';

import { PluginPaginationQuery } from '@/types/data/pageable-search-schema';
import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Plugin } from '@/types/response/Plugin';

export async function getPluginUploadCount(
  axios: AxiosInstance,
  params: Omit<PaginationSearchQuery, 'page' | 'size'>,
): Promise<number> {
  const result = await axios.get('/plugins/upload/total', {
    params,
  });

  return result.data;
}

export async function deletePlugin(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/plugins/${id}`);

  return result.data;
}

export async function getPluginUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Plugin[]> {
  const result = await axios.get('/plugins/upload', {
    params,
  });

  return result.data;
}

export async function getPlugins(
  axios: AxiosInstance,
  params: PluginPaginationQuery,
): Promise<Plugin[]> {
  const result = await axios.get('/plugins', {
    params,
  });

  return result.data;
}

export async function createPlugin(
  axios: AxiosInstance,
  data: CreatePluginRequest,
): Promise<void> {
  return axios.post('/plugins', data, {
    data,
  });
}

export default async function verifyPlugin(
  axios: AxiosInstance,
  { id, tags }: VerifyPluginRequest,
): Promise<void> {
  return axios.post(
    `/plugins/${id}/verify`,
    { tags },
    {
      data: { tags },
    },
  );
}
