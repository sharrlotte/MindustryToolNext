'use client';

import NoResult from '@/components/common/no-result';
import LoadingSpinner from '@/components/common/loading-spinner';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';
import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useI18n } from '@/locales/client';

type InfinitePageProps<T, P> = {
  className?: string;
  queryKey: QueryKey[];
  params: P;
  scrollContainer?: HTMLElement | null;
  loader?: ReactElement<any, string | JSXElementConstructor<any>>;
  noResult?: ReactNode;
  end?: ReactNode;
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
  loader,
  noResult,
  end,
  getFunc,
  children,
}: InfinitePageProps<T, P>) {
  const t = useI18n();
  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfinitePageQuery(getFunc, params, queryKey);

  loader = loader ?? (
    <LoadingSpinner
      key="loading"
      className="col-span-full flex h-full w-full items-center justify-center"
    />
  );

  noResult = noResult ?? (
    <NoResult className="flex w-full items-center justify-center" />
  );

  end = end ?? (
    <span
      className="col-span-full flex w-full items-center justify-center"
      key="End"
    >
      {t('end-of-page')}
    </span>
  );

  if (isLoading || !data) {
    return loader;
  }

  const pages = data.pages
    .reduce((prev, curr) => prev.concat(curr), [])
    .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <InfiniteScroll
      className={
        className ??
        'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-4'
      }
      loadMore={(_: number) => fetchNextPage()}
      hasMore={hasNextPage}
      loader={loader}
      useWindow={false}
      getScrollParent={() => scrollContainer}
    >
      {pages.map((data, index) => children(data, index))}
      {!hasNextPage && end}
      {isError && (
        <div className="flex w-full justify-center">
          {t('error')} : {error?.message}
        </div>
      )}
    </InfiniteScroll>
  );
}
