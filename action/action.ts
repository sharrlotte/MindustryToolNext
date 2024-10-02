'use server';

import { AxiosInstance } from 'axios';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { QuerySchema } from '@/query/search-query';
import 'server-only';

import {
  DefaultError,
  FetchQueryOptions,
  QueryClient,
  QueryKey,
  dehydrate,
} from '@tanstack/react-query';
import { Session } from '@/types/response/Session';
import { cookies } from 'next/headers';
import axiosInstance from '@/query/config/config';

export async function revalidate(path: string) {
  'use server';
  revalidatePath(path);
}

export async function getQuery<T extends QuerySchema>(
  params: any,
  schema: T,
): Promise<z.infer<typeof schema>> {
  const result = schema.parse(params);

  return result;
}

type QueryFn<T> = (axios: AxiosInstance) => Promise<T>;

type ServerApi<T> =
  | {
      queryFn: QueryFn<T>;
    }
  | QueryFn<T>;

export type ApiError = { error: any };

export async function serverApi<T>(
  queryFn: ServerApi<T>,
): Promise<T | ApiError> {
  try {
    const axios = await getServerApi();

    const data =
      'queryFn' in queryFn
        ? await queryFn.queryFn(axios)
        : await queryFn(axios);

    return data;
  } catch (error) {
    return { error };
  }
}

type ServerApis<T> =
  | {
      queryFn: QueryFn<T>[];
    }
  | QueryFn<T>[];

export async function serverApis<T>(
  queryFn: ServerApis<T>,
): Promise<T[] | ApiError> {
  try {
    const axios = await getServerApi();

    const data =
      'queryFn' in queryFn
        ? await Promise.all(queryFn.queryFn.map((fn) => fn(axios)))
        : await Promise.all(queryFn.map((fn) => fn(axios)));

    return data;
  } catch (error) {
    return { error };
  }
}

export default async function prefetch<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn'
  > & {
    queryFn: (axios: AxiosInstance) => Promise<TQueryFnData>;
  },
) {
  const { queryFn } = options;
  const queryClient = new QueryClient();
  const axios = await getServerApi();

  await queryClient.prefetchQuery({
    ...options,
    queryFn: () => queryFn(axios),
  });

  return dehydrate(queryClient);
}

export async function getSession(): Promise<Session> {
  const result = serverApi((axios) =>
    axios.get('/auth/session').then((r) => r.data),
  );

  return result;
}

export const getServerApi = async (): Promise<AxiosInstance> => {
  const cookie = cookies().toString();

  axiosInstance.defaults.headers['Cookie'] = cookie;

  return axiosInstance;
};
