'use client';

import { AxiosInstance } from 'axios';
import React, { JSXElementConstructor, ReactElement, ReactNode, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { z } from 'zod';

import EndOfPage from '@/components/common/end-of-page';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';

import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import useSearchQuery from '@/hooks/use-search-query';
import { QuerySchema } from '@/types/schema/search-query';

import { QueryKey } from '@tanstack/react-query';

type InfinitePageProps<T, P extends QuerySchema> = {
	className?: string;
	queryKey: QueryKey;
	paramSchema: P;
	params?: Omit<z.infer<P>, 'page' | 'size'>;
	loader?: ReactElement<any, string | JSXElementConstructor<any>>;
	noResult?: ReactNode;
	end?: ReactNode;
	skeleton?: {
		amount: number;
		item: ReactNode;
	};
	reversed?: boolean;
	enabled?: boolean;
	initialData?: T[];
	initialParams?: z.infer<P>;
	queryFn: (axios: AxiosInstance, params: z.infer<P>) => Promise<T[]>;
	children: (data: T[]) => ReactNode;
};

const InfinitePage = <T, P extends QuerySchema>({
	className,
	queryKey,
	paramSchema,
	loader,
	noResult,
	end,
	skeleton,
	reversed,
	initialData,
	initialParams,
	enabled,
	params,
	queryFn,
	children,
}: InfinitePageProps<T, P>) => {
	const p = useSearchQuery(paramSchema, params);

	const { data, isLoading, error, isError, hasNextPage, isFetching, fetchNextPage } = useInfinitePageQuery(
		queryFn,
		p,
		queryKey,
		JSON.stringify(p) === JSON.stringify(initialParams) ? initialData : undefined,
		enabled,
	);

	const loadMore = useCallback(
		(_: number) => {
			fetchNextPage();
		},
		[fetchNextPage],
	);

	noResult = useMemo(() => noResult ?? <NoResult className="flex w-full items-center justify-center" />, [noResult]);

	loader = useMemo(
		() =>
			!loader && !skeleton ? (
				<LoadingSpinner key="loading" className="col-span-full flex h-full w-full items-center justify-center" />
			) : undefined,
		[loader, skeleton],
	);

	const loadingSkeleton = useMemo(
		() =>
			skeleton
				? Array(skeleton.amount)
						.fill(1)
						.map((_, index) => <React.Fragment key={index}>{skeleton.item}</React.Fragment>)
				: undefined,
		[skeleton],
	);

	end = useMemo(() => end ?? <EndOfPage />, [end]);

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading || !data) {
		return (
			<div
				className={
					className ?? 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2'
				}
			>
				{loader ? loader : loadingSkeleton}
			</div>
		);
	}

	if (!data.pages || data.pages[0].length === 0) {
		return noResult;
	}

	return (
		<InfiniteScroll
			className={
				className ?? 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2'
			}
			loadMore={loadMore}
			hasMore={hasNextPage}
			loader={loader}
			useWindow={false}
			threshold={400}
			getScrollParent={() => {
				{
					const containers = document.getElementsByClassName('scroll-container');

					if (containers) {
						return containers[0] as HTMLElement;
					}

					return null;
				}
			}}
			isReverse={reversed}
		>
			{children(data.pages.flatMap((page) => page))}
			{isFetching && skeleton && loadingSkeleton}
			{!hasNextPage && end}
		</InfiniteScroll>
	);
};

export default InfinitePage;
