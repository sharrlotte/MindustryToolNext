import { AxiosInstance } from 'axios';

import {
  PaginationSearchQuery,
  StatusPaginationSearchQuery,
} from '@/types/data/pageable-search-schema';

import { UserRole } from '@/constant/enum';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { User } from '@/types/response/User';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { MapPreview } from '@/types/response/MapPreview';
import { Post } from '@/types/response/Post';
import { Schematic } from '@/types/response/Schematic';

export async function getMeMaps(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<MapPreview[]> {
  const result = await axios.get(`/users/@me/maps`, {
    params,
  });

  return result.data;
}

export async function getMePosts(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get(`/users/@me/posts`, {
    params,
  });

  return result.data;
}

export async function getMeSchematics(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Schematic[]> {
  const result = await axios.get(`/users/@me/schematics`, {
    params,
  });

  return result.data;
}
export async function getMe(axios: AxiosInstance): Promise<User> {
  const result = await axios.get(`/users/@me`);

  return result.data;
}

export async function getUserMaps(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<MapPreview[]> {
  const result = await axios.get(`/users/${userId}/maps`, {
    params,
  });

  return result.data;
}

export async function getUserPosts(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get(`/users/${userId}/posts`, {
    params,
  });

  return result.data;
}

export async function getUserSchematics(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Schematic[]> {
  const result = await axios.get(`/users/${userId}/schematics`, {
    params,
  });

  return result.data;
}

export async function getUser(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<User> {
  const result = await axios.get(`/users/${id}`);

  return result.data;
}

export async function getUsers(
  axios: AxiosInstance,
  params: PaginationQuery & { role?: UserRole },
): Promise<User[]> {
  const result = await axios.get(`/users`, { params });

  return result.data;
}