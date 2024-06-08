import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { isReachedEnd, mapReversed } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';

import { QueryKey } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import React, { ReactNode, useEffect, useMemo } from 'react';

type InfiniteScrollListProps<T, P> = {
  className?: string;
  queryKey: QueryKey;
  params: P;
  loader?: ReactNode;
  noResult?: ReactNode;
  end?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  threshold?: number;
  reversed?: boolean;
  container: () => HTMLElement | null;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

export default function InfiniteScrollList<T, P extends PaginationQuery>({
  className = 'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center',
  queryKey,
  params,
  loader,
  noResult,
  end,
  skeleton,
  threshold = 500,
  reversed,
  container,
  getFunc,
  children,
}: InfiniteScrollListProps<T, P>) {
  const t = useI18n();
  const {
    data,
    isLoading,
    error,
    isError,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfinitePageQuery(getFunc, params, queryKey);
  const pages = useMemo(() => {
    return !data
      ? []
      : reversed
        ? mapReversed(
            data.pages.reduce((prev, curr) => prev.concat(curr), []),
            children,
          )
        : data.pages
            .reduce((prev, curr) => prev.concat(curr), [])
            .map(children);
  }, [data, reversed, children]);

  var currentContainer = container();
  const skeletonElements = useMemo(() => {
    if (skeleton)
      return Array(skeleton.amount)
        .fill(1)
        .map((_, index) => (
          <React.Fragment key={index}>{skeleton.item}</React.Fragment>
        ));
  }, [skeleton]);

  useEffect(() => {
    const handleEndReach = () => {
      if (hasNextPage) {
        fetchNextPage();
      }
    };

    const handleTopReach = () => {
      if (hasPreviousPage) {
        // fetchPreviousPage();
      }
    };

    const handleScroll = () => {
      if (currentContainer && !isFetching) {
        if (isReachedEnd(currentContainer, threshold)) {
          if (reversed) {
            handleTopReach();
          } else {
            handleEndReach();
          }
        }

        if (currentContainer.scrollTop <= threshold) {
          if (reversed) {
            handleEndReach();
          } else {
            handleTopReach();
          }
        }
      }
    };

    currentContainer?.addEventListener('scroll', handleScroll);
    return () => {
      currentContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [
    currentContainer,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    reversed,
    threshold,
  ]);

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

  if (isLoading || !data || !currentContainer) {
    return (
      <div className={className}>{loader ? loader : skeletonElements}</div>
    );
  }

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <div className={className}>
      {pages}
      {isFetching && skeletonElements}
      {!hasNextPage && end}
    </div>
  );
}
