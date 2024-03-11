'use client';

import NoResult from '@/components/common/no-result';
import LoadingSpinner from '@/components/common/loading-spinner';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';
import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useI18n } from '@/locales/client';

type InfinitePageProps<T, P> = {
  className?: string;
  queryKey: QueryKey[];
  params: P;
  scrollContainer?: HTMLElement | null;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

export default function InfinitePage<
  T extends { id: string },
  P extends PaginationQuery,
>({
  className,
  queryKey,
  params,
  scrollContainer = null,
  getFunc,
  children,
}: InfinitePageProps<T, P>) {
  const t = useI18n();
  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfinitePageQuery(getFunc, params, queryKey);

  if (isLoading || !data) {
    return (
      <LoadingSpinner className="flex h-full w-full items-center justify-center" />
    );
  }

  const pages = data.pages
    .reduce((prev, curr) => prev.concat(curr), [])
    .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);

  if (pages.length === 0) {
    return <NoResult className="flex w-full items-center justify-center" />;
  }

  return (
    <InfiniteScroll
      className={
        className ??
        'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-4'
      }
      loadMore={(_: number) => fetchNextPage()}
      hasMore={hasNextPage}
      loader={
        <LoadingSpinner
          key="Loading"
          className="col-span-full flex w-full items-center justify-center"
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
          {t('end-of-page')}
        </span>
      )}
      {isError && (
        <div className="flex w-full justify-center">
          {t('error')} : {error?.message}
        </div>
      )}
    </InfiniteScroll>
  );
}
