import { AxiosInstance } from 'axios';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import EndOfPage from '@/components/common/end-of-page';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';

import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { isReachedEnd, makeArray, mapReversed, mergeNestArray } from '@/lib/utils';

import { QueryKey } from '@tanstack/react-query';
import { PaginationQuery } from '@/query/search-query';

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
  queryFn: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number, endIndex?: number) => ReactNode;
};

export default function InfiniteScrollList<T, P extends PaginationQuery = PaginationQuery>({
  className = 'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center',
  queryKey,
  params,
  loader,
  noResult = <NoResult className="flex w-full items-center justify-center" />,
  end,
  skeleton,
  threshold = 500,
  reversed,
  container,
  queryFn,
  children,
}: InfiniteScrollListProps<T, P>) {
  const currentContainer = container();
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down');
  const [scrollTop, setScrollTop] = useState(0);
  const [lastHeight, setLastHeight] = useState(0);

  const queryFnWrapper = useCallback(
    (axios: AxiosInstance, params: P) => {
      setLastHeight(list?.clientHeight ?? 0);

      return queryFn(axios, params);
    },
    [queryFn, list],
  );

  const { data, isLoading, error, isError, hasNextPage, hasPreviousPage, isFetching, fetchNextPage } = useInfinitePageQuery(queryFnWrapper, params, queryKey);

  const pageMapper = useCallback((item: T, index: number, array: T[]) => children(item, index, array.length - params.size), [children, params.size]);

  const remainScrollPosition = useCallback(() => {
    if (!currentContainer || !list) {
      return;
    }

    if (scrollDir === 'down') {
      return;
    }

    const diff = list.clientHeight - lastHeight;

    currentContainer.scrollTo({
      top: diff,
      behavior: 'instant',
    });

    setLastHeight(list.clientHeight);
  }, [currentContainer, list, lastHeight, scrollDir]);

  useEffect(() => {
    setLastHeight(list?.clientHeight ?? 0);
  }, [list]);

  useEffect(() => {
    remainScrollPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const pages = useMemo(() => {
    if (!data) {
      return [];
    }

    return reversed ? mapReversed(mergeNestArray(data.pages), pageMapper) : mergeNestArray(data.pages).map(pageMapper);
  }, [data, reversed, pageMapper]);

  const skeletonElements = useMemo(() => {
    if (skeleton) return makeArray(skeleton.amount).map((_, index) => <React.Fragment key={index}>{skeleton.item}</React.Fragment>);
  }, [skeleton]);

  const checkIfNeedFetchMore = useCallback(() => {
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
  }, [currentContainer, fetchNextPage, hasNextPage, hasPreviousPage, isFetching, reversed, threshold]);

  useEffect(() => {
    function onScroll() {
      if (list) {
        setLastHeight(list.clientHeight);
      }

      if (currentContainer) {
        setScrollTop(currentContainer.scrollTop);
        setScrollDir(currentContainer.scrollTop > scrollTop ? 'down' : 'up');
      }
    }

    currentContainer?.addEventListener('scrollend', onScroll);
    currentContainer?.addEventListener('scroll', onScroll);
    list?.addEventListener('scroll', checkIfNeedFetchMore);
    return () => {
      currentContainer?.removeEventListener('scrollend', onScroll);
      currentContainer?.removeEventListener('scroll', onScroll);
      list?.removeEventListener('scroll', checkIfNeedFetchMore);
    };
  }, [checkIfNeedFetchMore, currentContainer, list, scrollTop]);

  useEffect(() => {
    const interval = setInterval(() => checkIfNeedFetchMore(), 3000);

    return () => clearInterval(interval);
  }, [checkIfNeedFetchMore]);

  if (!loader && !skeleton) {
    loader = <LoadingSpinner key="loading" className="col-span-full flex h-full w-full items-center justify-center" />;
  }

  end = end ?? <EndOfPage />;

  if (isError || error) {
    return <div className="flex w-full justify-center">{error?.message}</div>;
  }

  if (isLoading || !data || !currentContainer) {
    return <div className={className}>{loader ? loader : skeletonElements}</div>;
  }

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <div ref={(ref) => setList(ref)}>
      {pages}
      {isFetching && skeletonElements}
      {!hasNextPage && end}
    </div>
  );
}
