'use server';

import { AxiosInstance } from 'axios';
import { expireTag, unstable_cache, unstable_noStore } from 'next/cache';
import { expirePath } from 'next/cache';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import { z } from 'zod';

import { extractTranslationKey, formatTranslation } from '@/lib/utils';
import axiosInstance from '@/query/config/config';
import { QuerySchema } from '@/query/search-query';
import { Session } from '@/types/response/Session';

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

    return { error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) };
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

const getCachedTranslation = cache(
  unstable_cache(
    async (language: string, group: string) =>
      axiosInstance
        .get('/translations', {
          params: {
            group,
            language,
          },
        })
        .then((r) => r.data),
    ['translations'],
    { revalidate: 3600, tags: ['translations'] },
  ),
);

export async function getLocaleFromCookie() {
  const cookie = await cookies();
  return cookie.get('Locale')?.value || 'en';
}

export async function translate(locale: string, translationKey: string, args?: Record<string, any>) {
  const { text, group, key } = extractTranslationKey(translationKey);

  try {
    const keys = await getCachedTranslation(locale, group);
    const value = keys[key];

    return value ? (formatTranslation(value, args) ?? text) : text;
  } catch (error) {
    console.error(error);

    expireTag('translations');

    return text;
  }
}
