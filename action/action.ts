'use server';

import { AxiosInstance } from 'axios';
import { revalidatePath, revalidateTag, unstable_cache, unstable_noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import { z } from 'zod';

import axiosInstance from '@/query/config/config';
import { QuerySchema } from '@/query/search-query';
import { Session } from '@/types/response/Session';

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

export async function catchError<T>(axios: AxiosInstance, queryFn: ServerApi<T>): Promise<T | ApiError> {
  try {
    const data = 'queryFn' in queryFn ? await queryFn.queryFn(axios) : await queryFn(axios);
    return data;
  } catch (error) {
    return { error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) };
  }
}

export async function serverApi<T>(queryFn: ServerApi<T>): Promise<T | ApiError> {
  unstable_noStore(); // To opt out of static renderer

  const axios = await getServerApi();

  return catchError(axios, async () => {
    const data = 'queryFn' in queryFn ? await queryFn.queryFn(axios) : await queryFn(axios);

    return data;
  });
}

const getCachedSession: (cookie: string) => Promise<Session | null | ApiError> = cache(
  unstable_cache(
    async (cookie: string) => {
      try {
        axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie);

        return await axiosInstance
          .get('/auth/session')
          .then((r) => r.data)
          .then((data) => data ?? null);
      } catch (error) {
        return { error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) };
      }
    },
    ['session'],
    { revalidate: 60 },
  ),
);

export async function getSession() {
  const cookie = await cookies();

  if (cookie.get('SESSION_ID') === undefined) {
    return null;
  }

  return getCachedSession(cookie.toString());
}

export const getServerApi = async (): Promise<AxiosInstance> => {
  const cookie = await cookies();

  axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie.toString());
  axiosInstance.defaults.headers['Server'] = true;

  return axiosInstance;
};

export async function getLocaleFromCookie() {
  const cookie = await cookies();
  return cookie.get('Locale')?.value || 'en';
}
