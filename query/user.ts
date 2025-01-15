import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { UserRole } from '@/constant/enum';
import { ItemPaginationQueryType, PaginationQuery, StatusPaginationSearchQuery } from '@/query/search-query';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { Map } from '@/types/response/Map';
import { Post } from '@/types/response/Post';
import { Schematic } from '@/types/response/Schematic';
import { ServerDetail } from '@/types/response/ServerDetail';
import { User } from '@/types/response/User';

export async function getMeServers(axios: AxiosInstance): Promise<ServerDetail[]> {
  const result = await axios.get(`/users/@me/servers`);

  return result.data;
}

export async function getRank(axios: AxiosInstance, params: PaginationQuery): Promise<User[]> {
  const result = await axios.get(`/users/rank`, {
    params,
  });

  return result.data;
}

export async function getUsersCount(axios: AxiosInstance): Promise<number> {
  const result = await axios.get(`/users/count`);

  return result.data;
}
export async function getMyRank(axios: AxiosInstance): Promise<number> {
  const result = await axios.get(`/users/@me/rank`);

  return result.data;
}

export async function getMeMaps(axios: AxiosInstance, params: StatusPaginationSearchQuery): Promise<Map[]> {
  const result = await axios.get(`/users/@me/maps`, {
    params,
  });

  return result.data;
}

export async function getMePosts(axios: AxiosInstance, params: StatusPaginationSearchQuery): Promise<Post[]> {
  const result = await axios.get(`/users/@me/posts`, {
    params,
  });

  return result.data;
}

export async function getMeSchematics(axios: AxiosInstance, params: StatusPaginationSearchQuery): Promise<Schematic[]> {
  const result = await axios.get(`/users/@me/schematics`, {
    params,
  });

  return result.data;
}
export async function getMe(axios: AxiosInstance): Promise<User> {
  const result = await axios.get(`/users/@me`);

  return result.data;
}

export async function getUserMaps(axios: AxiosInstance, userId: string, params: ItemPaginationQueryType): Promise<Map[]> {
  const result = await axios.get(`/users/${userId}/maps`, {
    params,
  });

  return result.data;
}

export async function getUserPosts(axios: AxiosInstance, userId: string, params: ItemPaginationQueryType): Promise<Post[]> {
  const result = await axios.get(`/users/${userId}/posts`, {
    params,
  });

  return result.data;
}

export async function getUserSchematics(axios: AxiosInstance, userId: string, params: ItemPaginationQueryType): Promise<Schematic[]> {
  const result = await axios.get(`/users/${userId}/schematics`, {
    params,
  });

  return result.data;
}

export async function getUser(axios: AxiosInstance, { id }: IdSearchParams): Promise<User> {
  const result = await axios.get(`/users/${id}`);

  return result.data;
}

export async function getUsers(axios: AxiosInstance, params: PaginationQuery & { name?: string; role?: UserRole }): Promise<User[]> {
  const result = await axios.get(`/users`, { params });

  return result.data;
}

export async function getUserCount(axios: AxiosInstance, params: { name?: string; role?: UserRole }): Promise<number> {
  const result = await axios.get(`/users/count`, { params });

  return result.data;
}

export async function getOnline(axios: AxiosInstance): Promise<number> {
  const result = await axios.get(`/online`);

  return result.data;
}

export async function updateThumbnail(axios: AxiosInstance, file: File): Promise<User[]> {
  const formData = new FormData();

  formData.append('file', file);

  const result = await axios.post(`/users/@me/thumbnail`, formData);

  return result.data;
}

export async function changeAuthorities(axios: AxiosInstance, data: { userId: string; authorityIds: string[] }): Promise<void> {
  const { userId, authorityIds } = data;

  const result = await axios.put(`/users/${userId}/authorities`, { authorityIds }, { data: { authorityIds } });

  return result.data;
}

export const SendNotificationSchema = z.object({
  userId: z.string(),
  title: z.string().min(1).max(1024),
  content: z.string().min(1).max(4096),
});

export type SendNotificationSchemaType = z.infer<typeof SendNotificationSchema>;

export async function sendNotification(axios: AxiosInstance, data: SendNotificationSchemaType): Promise<void> {
  const result = await axios.post(`/notifications`, data, { data });

  return result.data;
}

export async function banUser(axios: AxiosInstance, id: string) {
  const result = await axios.put(`/users/${id}/ban`);

  return result.data;
}

export async function unbanUser(axios: AxiosInstance, id: string) {
  const result = await axios.put(`/users/${id}/unban`);

  return result.data;
}
