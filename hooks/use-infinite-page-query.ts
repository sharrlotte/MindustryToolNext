import { AxiosInstance } from 'axios';
import { useCookies } from 'react-cookie';

import { PAGINATION_SIZE_PERSISTENT_KEY } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { PaginationQuery } from '@/types/schema/search-query';

import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';

export default function useInfinitePageQuery<T, P extends PaginationQuery>(
	queryFn: (axios: AxiosInstance, params: P) => Promise<T[]>,
	params: P,
	queryKey: QueryKey,
	initialData?: T[],
	enabled?: boolean,
) {
	const axios = useClientApi();
	const [{ paginationSize }] = useCookies([PAGINATION_SIZE_PERSISTENT_KEY]);

	const size = paginationSize ?? 0;

	const getNextPageParam = (lastPage: T[], allPages: T[][], lastPageParams: P) => {
		if (lastPage.length === 0 || lastPage.length < size) {
			return undefined;
		}

		return { ...lastPageParams, page: allPages.length, size };
	};

	const getPreviousPageParam = (lastPage: T[], allPages: T[][], lastPageParams: P) => {
		if (lastPageParams.page <= 0 || lastPage.length === 0 || lastPage.length < size) {
			return undefined;
		}

		return { ...lastPageParams, page: allPages.length - 1, size };
	};

	// Remove page and size from key
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { page, ...rest } = params;

	let filteredQueryKey: any[];

	if (Object.keys(rest).length > 0) {
		filteredQueryKey = [...queryKey, rest];
	} else {
		filteredQueryKey = [...queryKey];
	}

	const data: InfiniteData<T[], P> | undefined = initialData ? { pages: [initialData], pageParams: [params] } : undefined;

	return useInfiniteQuery<T[], Error, InfiniteData<T[], P>, QueryKey, P>({
		queryKey: filteredQueryKey,
		initialPageParam: params,
		// TODO: Fix this
		initialData: data,
		enabled,
		// @ts-expect-error idk
		queryFn: (context) => queryFn(axios, context.pageParam),
		getNextPageParam,
		getPreviousPageParam,
	});
}
