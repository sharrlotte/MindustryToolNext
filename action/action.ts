'use server';

import { revalidatePath, revalidateTag, unstable_cache, unstable_noStore } from 'next/cache';
import { z } from 'zod';

import { QuerySchema } from '@/query/search-query';
import 'server-only';

import { DefaultError, FetchQueryOptions, QueryClient, QueryKey, dehydrate } from '@tanstack/react-query';
import { Session } from '@/types/response/Session';
import { cookies } from 'next/headers';
import axiosInstance from '@/query/config/config';
import { formatTranslation } from '@/i18n/client';
import { AxiosInstance } from 'axios';
import { isError } from '@/lib/utils';

export async function revalidate({ path, tag }: { path?: string; tag?: string }) {
  'use server';
  if (path) {
    revalidatePath(path);
  }

  if (tag) {
    revalidateTag(tag);
  }
}

export async function getQuery<T extends QuerySchema>(params: any, schema: T): Promise<z.infer<typeof schema>> {
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

export async function serverApi<T>(queryFn: ServerApi<T>): Promise<T | ApiError> {
  unstable_noStore(); // To opt out of static renderer
  try {
    const axios = await getServerApi();

    const data = 'queryFn' in queryFn ? await queryFn.queryFn(axios) : await queryFn(axios);

    return data;
  } catch (error) {
    return { error: JSON.parse(JSON.stringify(error)) };
  }
}

export default async function prefetch<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  options: Omit<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryFn'> & {
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

const getCachedSession: (cookie: string) => Promise<Session> = unstable_cache(
  (cookie: string) => {
    axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie);

    return axiosInstance.get('/auth/session').then((r) => r.data) as Promise<Session>;
  },
  ['session'],
  { revalidate: 60 },
);

export async function getSession() {
  const cookie = await cookies();

  return serverApi(() => getCachedSession(cookie.toString()));
}

export const getServerApi = async (): Promise<AxiosInstance> => {
  const cookie = await cookies();

  axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie.toString());

  return axiosInstance;
};

const getCachedTranslation = unstable_cache(
  async (locale: string, group: string) => {
    return await serverApi((axios) =>
      axios
        .get('/translations', {
          params: {
            group,
            language: locale,
          },
        })
        .then((r) => r.data),
    );
  },
  ['translation'],
  { revalidate: 600 },
);

export async function translate(locale: string, text: string, args?: Record<string, any>) {
  const parts = text.split('.');

  if (parts.length === 0) {
    throw new Error('Bad key');
  }

  const group = parts.length === 1 ? 'common' : parts[0];
  const key = parts.length === 1 ? parts[0] : parts[1];

  text = `${group}.${key}`;

  const keys = await getCachedTranslation(locale, group);

  if (isError(keys)) {
    return text;
  }

  const value = keys[group];

  return value ? (formatTranslation(value[key], args) ?? text) : text;
}
