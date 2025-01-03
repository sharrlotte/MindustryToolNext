import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { IdSearchParams } from '@/types/data/id-search-schema';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import { Map } from '@/types/response/Map';
import { MapDetail } from '@/types/response/MapDetail';
import { MapPreviewResponse } from '@/types/response/MapPreviewResponse';
import { CreateMapRequest } from '@/types/schema/zod-schema';
import { ItemPaginationQueryType } from '@/query/search-query';

export async function getMapCount(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<number> {
  const result = await axios.get('/maps/total', { params });

  return result.data;
}

export async function deleteMap(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/maps/${id}`);

  return result.data;
}

export async function getMapData(axios: AxiosInstance, id: string): Promise<string> {
  const result = await axios.get(`/maps/${id}/data`);

  return result.data;
}

export async function getMapUpload(axios: AxiosInstance, { id }: IdSearchParams): Promise<MapDetail> {
  const result = await axios.get(`/maps/upload/${id}`);
  return result.data;
}

export async function getMapUploads(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Map[]> {
  const result = await axios.get('/maps/upload', {
    params,
  });

  return result.data;
}

export async function getMap(axios: AxiosInstance, { id }: IdSearchParams): Promise<MapDetail> {
  const result = await axios.get(`/maps/${id}`);
  return result.data;
}

export async function getMaps(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Map[]> {
  const result = await axios.get('/maps', {
    params,
  });

  return result.data;
}

export async function getMapUploadCount(axios: AxiosInstance, params: Omit<ItemPaginationQueryType, 'page' | 'size'>): Promise<number> {
  const result = await axios.get('/maps/upload/total', {
    params,
  });

  return result.data;
}
export async function getMapPreview(axios: AxiosInstance, { file }: MapPreviewRequest): Promise<MapPreviewResponse> {
  const form = new FormData();

  form.append('file', file);

  const result = await axios.post('/maps/preview', form, {
    data: form,
  });

  return result.data;
}

export async function createMap(axios: AxiosInstance, data: CreateMapRequest): Promise<void> {
  const form = toForm(data);

  return axios.post('/maps', form, {
    data: form,
  });
}

export async function createMultipleMap(axios: AxiosInstance, data: CreateMapRequest): Promise<void> {
  const form = toForm(data);

  return await axios.post('/maps/multiple', form, {
    data: form,
  });
}

export async function verifyMap(axios: AxiosInstance, { id, tags }: VerifyMapRequest): Promise<void> {
  return axios.post(
    `/maps/${id}/verify`,
    { tags },
    {
      data: { tags },
    },
  );
}

export async function unverifyMap(axios: AxiosInstance, id: string): Promise<string> {
  const result = await axios.put(`/maps/${id}`);

  return result.data;
}
