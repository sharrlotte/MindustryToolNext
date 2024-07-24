'use client';

import { AxiosInstance } from 'axios';
import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { useI18n } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';

import { QueryKey } from '@tanstack/react-query';

type InfinitePageProps<T, P> = {
  className?: string;
  queryKey: QueryKey;
  params: P;
  container: () => HTMLElement | null;
  loader?: ReactElement<any, string | JSXElementConstructor<any>>;
  noResult?: ReactNode;
  end?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  reversed?: boolean;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

export default function InfinitePage<T, P extends PaginationQuery>({
  className,
  queryKey,
  params,
  container,
  loader,
  noResult,
  end,
  skeleton,
  getFunc,
  children,
  reversed,
}: InfinitePageProps<T, P>) {
  const t = useI18n();
  const {
    data,
    isLoading,
    error,
    isError,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useInfinitePageQuery(getFunc, params, queryKey);

  noResult = noResult ?? (
    <NoResult className="flex w-full items-center justify-center" />
  );

  if (!loader && !skeleton) {
    loader = (
      <LoadingSpinner
        key="loading"
        className="col-span-full flex h-full w-full items-center justify-center"
      />
    );
  }

  const loadingSkeleton =
    skeleton &&
    Array(skeleton.amount)
      .fill(1)
      .map((_, index) => (
        <React.Fragment key={index}>{skeleton.item}</React.Fragment>
      ));

  end = end ?? (
    <span
      className="col-span-full flex w-full items-center justify-center"
      key="End"
    >
      {t('end-of-page')}
    </span>
  );

  if (isError || error) {
    return (
      <div className="flex w-full justify-center">
        {t('error')} : {error?.message}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div
        className={
          className ??
          'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2'
        }
      >
        {loader ? loader : loadingSkeleton}
      </div>
    );
  }

  const pages = data.pages.reduce((prev, curr) => prev.concat(curr), []);

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <InfiniteScroll
      className={
        className ??
        'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2'
      }
      loadMore={(_: number) => fetchNextPage()}
      hasMore={hasNextPage}
      loader={loader}
      useWindow={false}
      threshold={400}
      getScrollParent={container}
      isReverse={reversed}
    >
      {pages.map((data, index) => children(data, index))}
      {isFetching && skeleton && loadingSkeleton}
      {!hasNextPage && end}
    </InfiniteScroll>
  );
}
