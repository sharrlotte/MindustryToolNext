'use server';

import { AxiosInstance, isAxiosError } from 'axios';
import { revalidatePath, revalidateTag, unstable_cache, unstable_noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import { z } from 'zod';

import { DEFAULT_PAGINATION_SIZE, PAGINATION_SIZE_PERSISTENT_KEY } from '@/constant/constant';
import { ApiError } from '@/lib/error';
import axiosInstance from '@/query/config/config';
import { Session } from '@/types/response/Session';
import { QuerySchema } from '@/types/schema/search-query';

export async function revalidate({ path, tag }: { path?: string; tag?: string }) {
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

export async function catchError<T>(axios: AxiosInstance, queryFn: ServerApi<T>): Promise<T | ApiError> {
	try {
		const data = 'queryFn' in queryFn ? await queryFn.queryFn(axios) : await queryFn(axios);
		return data;
	} catch (error) {
		if (isAxiosError(error)) {
			return {
				error: {
					status: error.response?.status,
					data: error.response?.data,
					message: error?.message + error.response?.config.url,
				},
			};
		}
		return {
			error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
		};
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
			axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie);

			return await axiosInstance
				.get('/auth/session')
				.then((r) => r.data)
				.then((data) => data ?? null)
				.catch(() => null);
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
export async function getAuthSession() {
	const session = await getSession();

	if (!session) {
		throw new Error('Invalid state: No session');
	}

	return session;
}

export const getServerApi = async (): Promise<AxiosInstance> => {
	const cookie = await cookies();

	axiosInstance.defaults.headers['Cookie'] = decodeURIComponent(cookie.toString());

	axiosInstance.interceptors.request.use(async (config) => {
		const params = config.params;
		if (!params || !('size' in params) || 'autoSize' in params) {
			return config;
		}

		config.params['size'] = cookie.get(PAGINATION_SIZE_PERSISTENT_KEY)?.value ?? DEFAULT_PAGINATION_SIZE;

		return config;
	});
	
	axiosInstance.defaults.headers['Server'] = true;

	return axiosInstance;
};
