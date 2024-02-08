'use client';

import NoResult from '@/components/common/no-result';
import LoadingSpinner from '@/components/common/loading-spinner';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { cn } from '@/lib/utils';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';
import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

type InfinitePageProps<T, P extends PaginationQuery> = {
  className?: string;
  queryKey: any[];
  params: P;
  scrollContainer?: HTMLElement | null;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

export default function InfinitePage<T, P extends PaginationQuery>({
  className,
  queryKey,
  params,
  scrollContainer = null,
  getFunc,
  children,
}: InfinitePageProps<T, P>) {
  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfinitePageQuery(getFunc, params, queryKey);

  if (isLoading || !data) {
    return (
      <LoadingSpinner className="absolute bottom-0 left-0 right-0 top-0 mb-2" />
    );
  }

  const pages = data.pages.reduce((prev, curr) => prev.concat(curr), []);

  if (pages.length === 0) {
    return <NoResult className="flex w-full items-center justify-center" />;
  }

  return (
    <InfiniteScroll
      className={
        className ??
        'grid w-full grid-cols-[repeat(auto-fill,var(--preview-size))] justify-center gap-4'
      }
      threshold={1000}
      loadMore={(_: number) => fetchNextPage()}
      hasMore={hasNextPage}
      loader={
        <LoadingSpinner
          key="Loading"
          className="col-span-full mb-4 flex w-full items-center justify-center"
        />
      }
      useWindow={false}
      getScrollParent={() => scrollContainer}
    >
      {pages.map((data, index) => children(data, index))}
      {!hasNextPage && (
        <span
          className="col-span-full flex w-full items-center justify-center"
          key="End"
        >
          End
        </span>
      )}
      {isError && (
        <div className="flex w-full justify-center">
          Error : {error?.message}
        </div>
      )}
    </InfiniteScroll>
  );
}
