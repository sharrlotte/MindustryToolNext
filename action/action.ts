'use server';

import { AxiosInstance } from 'axios';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import axiosInstance from '@/query/config/config';
import getServerAPI from '@/query/config/get-server-api';
import { QuerySchema } from '@/query/query';

import {
  DefaultError,
  FetchQueryOptions,
  QueryClient,
  QueryKey,
  dehydrate,
} from '@tanstack/react-query';

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

type Props<T> = {
  queryFn: (axios: AxiosInstance) => Promise<T>;
};

export async function serverApi<T>({ queryFn }: Props<T>) {
  const cookie = cookies().toString();

  axiosInstance.defaults.headers['Cookie'] = cookie;

  const data = await queryFn(axiosInstance);

  if (!data) {
    return notFound();
  }

  return data;
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
  const axios = await getServerAPI();

  await queryClient.prefetchQuery({
    ...options,
    queryFn: () => queryFn(axios),
  });

  return dehydrate(queryClient);
}
