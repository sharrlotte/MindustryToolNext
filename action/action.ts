'use server';

import { expireTag, unstable_cache, unstable_noStore } from 'next/cache';
import { z } from 'zod';

import { QuerySchema } from '@/query/search-query';
import 'server-only';

import { Session } from '@/types/response/Session';
import { cookies } from 'next/headers';
import axiosInstance from '@/query/config/config';
import { formatTranslation } from '@/i18n/client';
import { AxiosInstance } from 'axios';
import { isError } from '@/lib/utils';
import { expirePath } from 'next/cache';

export async function revalidate({ path, tag }: { path?: string; tag?: string }) {
  'use server';
  if (path) {
    expirePath(path);
  }

  if (tag) {
    expireTag(tag);
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
  try {
    unstable_noStore(); // To opt out of static renderer

    const axios = await getServerApi();

    const data = 'queryFn' in queryFn ? await queryFn.queryFn(axios) : await queryFn(axios);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    return { error: JSON.parse(JSON.stringify(error)) };
  }
}

const getCachedSession: (cookie: string) => Promise<Session | null | ApiError> = unstable_cache(
  async (cookie: string) => {
    try {
      axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie);

      return await axiosInstance
        .get('/auth/session')
        .then((r) => r.data)
        .then((data) => data || null);
    } catch (error) {
      return { error: JSON.parse(JSON.stringify(error)) };
    }
  },
  ['session'],
  { revalidate: 60 },
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
