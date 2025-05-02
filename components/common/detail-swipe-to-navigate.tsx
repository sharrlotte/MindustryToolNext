'use client';

import { AxiosInstance } from 'axios';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import SwipeToNavigate from '@/components/common/swipe-to-navigate';

import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import useSearchQuery from '@/hooks/use-search-query';
import { QuerySchema } from '@/types/schema/search-query';

import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';

type Props<T, P extends QuerySchema> = {
	queryKey: QueryKey;
	paramSchema: P;
	params?: Omit<z.infer<P>, 'page' | 'size'>;
	children: ReactNode;
	queryFn: (axios: AxiosInstance, params: z.infer<P>) => Promise<T[]>;
};

export default function DetailSwipeToNavigate<T extends { id: any }, P extends QuerySchema>({ ...props }: Props<T, P>) {
	const {
		config: { paginationType },
	} = useSession();

	return (
		<Suspense>
			{paginationType === 'infinite-scroll' && <ListDetailSwipeToNavigate<T, P> {...props} />}
			{paginationType === 'grid' && <GridDetailSwipeToNavigate<T, P> {...props} />}
		</Suspense>
	);
}

function ListDetailSwipeToNavigate<T extends { id: any }, P extends QuerySchema>({
	children,
	paramSchema,
	params,
	queryKey,
	queryFn,
}: Props<T, P>) {
	const p = useSearchQuery(paramSchema, params);
	const { data, fetchNextPage, fetchPreviousPage } = useInfinitePageQuery(queryFn, p, queryKey);

	const items = useMemo(() => {
		if (!data) return [];
		return data.pages?.flatMap((page) => page) ?? [];
	}, [data]);

	const state = useSwipeToNavigate({
		fetchNextPage,
		fetchPreviousPage,
		items,
		children,
	});

	return <SwipeToNavigate {...state}>{children}</SwipeToNavigate>;
}
function GridDetailSwipeToNavigate<T extends { id: any }, P extends QuerySchema>({
	children,
	paramSchema,
	params,
	queryKey,
	queryFn,
}: Props<T, P>) {
	const p = useSearchQuery(paramSchema, params);
	const queryClient = useQueryClient();
	const [page, setPage] = useState(p.page);
	const axios = useClientApi();

	const { isFetching } = useQuery({
		queryKey: [{ ...p, page }, ...queryKey],
		queryFn: () => queryFn(axios, { ...p, page }),
	});
	const { page: _, ...paramWithoutPage } = p;

	const data =
		queryClient.getQueriesData({
			queryKey: [paramWithoutPage, ...queryKey],
			exact: false,
		}) ?? [];

	const fetchPreviousPage = useCallback(() => {
		if (isFetching) return;

		if (page > 1) {
			setPage(page - 1);
		}
	}, [isFetching, page]);

	const fetchNextPage = useCallback(() => {
		if (isFetching) return;
		setPage(page + 1);
	}, [isFetching, page]);

	const state = useSwipeToNavigate({
		fetchNextPage,
		fetchPreviousPage,
		items: data.flatMap((item) => (item?.[1] ?? []) as T[]) ?? [],
		children,
	});

	return <SwipeToNavigate {...state}>{children}</SwipeToNavigate>;
}

type DetailSwipeToNavigateInternalProps<T extends { id: any }> = {
	items: T[];
	children: ReactNode;
	fetchNextPage: () => void;
	fetchPreviousPage: () => void;
};

function useSwipeToNavigate<T extends { id: any }>({
	fetchNextPage,
	fetchPreviousPage,
	items,
}: DetailSwipeToNavigateInternalProps<T>) {
	const { id } = useParams();
	const router = useRouter();
	const path = usePathname();

	if (!id || typeof id !== 'string') {
		throw new Error('Id params is undefined');
	}

	const currentIndex = useMemo(() => items?.findIndex((item) => item.id === id), [items, id]) ?? -1;

	const hasNext = currentIndex < items.length - 1;
	const hasPrevious = currentIndex > 0;

	const nextUrl = useMemo(() => {
		if (!hasNext) return null;

		const next = items[currentIndex + 1];
		return path.replace(id, next.id);
	}, [hasNext, items, currentIndex, path, id]);

	const previousUrl = useMemo(() => {
		if (!hasPrevious) return null;

		const previous = items[currentIndex - 1];
		return path.replace(id, previous.id);
	}, [hasPrevious, items, currentIndex, path, id]);

	if (nextUrl) {
		router.prefetch(nextUrl);
	}

	const onSwipeNext = useCallback(() => {
		if (nextUrl) {
			router.replace(nextUrl);
		}
	}, [nextUrl, router]);

	const onSwipePrevious = useCallback(() => {
		if (previousUrl) {
			router.replace(previousUrl);
		}
	}, [previousUrl, router]);

	useEffect(() => {
		if (!hasNext) {
			fetchNextPage();
		} else if (!hasPrevious) {
			fetchPreviousPage();
		}
	}, [fetchNextPage, fetchPreviousPage, hasNext, hasPrevious]);

	return {
		onSwipeNext,
		onSwipePrevious,
		hasNext,
		hasPrevious,
	};
}
