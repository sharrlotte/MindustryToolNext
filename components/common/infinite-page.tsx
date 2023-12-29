'use client';

import NoResult from '@/components/common/no-result';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { cn } from '@/lib/utils';
import { PageableSearchQuery } from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';
import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

type InfinitePageProps<T> = {
  className?: string;
  queryKey: any[];
  scrollContainer?: HTMLElement | null;
  getFunc: (axios: AxiosInstance, params: PageableSearchQuery) => Promise<T[]>;
  children: (data: T) => ReactNode;
};

export default function InfinitePage<T>({
  className,
  queryKey,
  scrollContainer = null,
  getFunc,
  children,
}: InfinitePageProps<T>) {
  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfinitePageQuery(getFunc, queryKey);

  if (isError) {
    return (
      <div className="flex w-full justify-center">Error : {error?.message}</div>
    );
  }

  if (!data || isLoading) {
    return (
      <LoadingSpinner className="absolute bottom-0 left-0 right-0 top-0" />
    );
  }

  const pages = data.pages.reduce((prev, curr) => prev.concat(curr), []);

  if (pages.length === 0) {
    return <NoResult className="flex w-full items-center justify-center" />;
  }

  return (
    <div className="h-full w-full">
      <InfiniteScroll
        className={cn(
          className ??
            'grid min-h-full w-full grid-cols-[repeat(auto-fill,var(--preview-size))] items-center justify-center gap-4 p-4',
        )}
        pageStart={0}
        loadMore={(_: number) => fetchNextPage()}
        hasMore={hasNextPage}
        loader={
          <LoadingSpinner key="Loading" className="col-span-full flex w-full items-center justify-center" />
        }
        useWindow={false}
        getScrollParent={() => scrollContainer}
      >
        {pages.map((data) => children(data))}
      </InfiniteScroll>
    </div>
  );
}
