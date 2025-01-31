'use client';

import { AxiosInstance } from 'axios';
import React, { JSXElementConstructor, ReactElement, ReactNode, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import EndOfPage from '@/components/common/end-of-page';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import Tran from '@/components/common/tran';

import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { PaginationQuery } from '@/query/search-query';

import { QueryKey } from '@tanstack/react-query';

type InfinitePageProps<T, P> = {
  className?: string;
  queryKey: QueryKey;
  params: P;
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
  queryFn: (axios: AxiosInstance, params: P) => Promise<T[]>;
  // container?: () => HTMLElement | null;
  children: (data: T, index: number) => ReactNode;
};

export default function InfinitePage<T, P extends PaginationQuery>({ className, queryKey, params, loader, noResult, end, skeleton, reversed, initialData, enabled, queryFn, children }: InfinitePageProps<T, P>) {
  const { data, isLoading, error, isError, hasNextPage, isFetching, fetchNextPage } = useInfinitePageQuery(queryFn, params, queryKey, initialData, enabled);

  const loadMore = useCallback(
    (_: number) => {
      fetchNextPage();
    },
    [fetchNextPage],
  );

  noResult = useMemo(() => noResult ?? <NoResult className="flex w-full items-center justify-center" />, [noResult]);

  loader = useMemo(() => (!loader && !skeleton ? <LoadingSpinner key="loading" className="col-span-full flex h-full w-full items-center justify-center" /> : undefined), [loader, skeleton]);

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
    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className={className ?? 'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2'}>{loader ? loader : loadingSkeleton}</div>;
  }

  if (!data.pages || data.pages[0].length === 0) {
    return noResult;
  }

  return (
    <InfiniteScroll
      className={className ?? 'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2 '}
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
      {data.pages.map((page) => page.map((data, index) => children(data, index)))}
      {isFetching && skeleton && loadingSkeleton}
      {!hasNextPage && end}
    </InfiniteScroll>
  );
}
