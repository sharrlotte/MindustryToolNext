import { AxiosInstance } from 'axios';
import React, {
  ReactNode,
  experimental_useEffectEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import {
  isReachedEnd,
  makeArray,
  mapReversed,
  mergeNestArray,
} from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';

import { QueryKey } from '@tanstack/react-query';

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
  children: (data: T, index?: number, endIndex?: number) => ReactNode;
};

export default function InfiniteScrollList<
  T,
  P extends PaginationQuery = PaginationQuery,
>({
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
  getFunc,
  children,
}: InfiniteScrollListProps<T, P>) {
  const currentContainer = container();
  const listRef = useRef<HTMLDivElement>(null);
  const currentList = listRef.current;

  const [scrollTop, setScrollTop] = useState(0);
  const [lastHeight, setLastHeight] = useState(0);

  const t = useI18n();

  const getFuncWrapper = useCallback(
    (axios: AxiosInstance, params: P) => {
      setLastHeight(currentList?.clientHeight ?? 0);

      return getFunc(axios, params);
    },
    [currentList?.clientHeight, getFunc],
  );

  const {
    data,
    isLoading,
    error,
    isError,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    fetchNextPage,
  } = useInfinitePageQuery(getFuncWrapper, params, queryKey);

  const pageMapper = useCallback(
    (item: T, index: number, array: T[]) =>
      children(item, index, array.length - params.items),
    [children, params.items],
  );

  const remainScrollPosition = experimental_useEffectEvent(() => {
    if (!currentContainer || !currentList) {
      return;
    }

    const isScrollUp = currentContainer.scrollTop < scrollTop;

    if (!isScrollUp && currentContainer.scrollTop > threshold) {
      return;
    }

    const diff = currentList.clientHeight - lastHeight;

    currentContainer.scrollTo({
      top: diff,
    });
  });

  useEffect(() => {
    remainScrollPosition();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentContainer, currentList]);

  const pages = useMemo(() => {
    return !data
      ? []
      : reversed
        ? mapReversed(mergeNestArray(data.pages), pageMapper)
        : mergeNestArray(data.pages).map(pageMapper);
  }, [data, reversed, pageMapper]);

  const skeletonElements = useMemo(() => {
    if (skeleton)
      return makeArray(skeleton.amount).map((_, index) => (
        <React.Fragment key={index}>{skeleton.item}</React.Fragment>
      ));
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
  }, [
    currentContainer,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    reversed,
    threshold,
  ]);

  useEffect(() => {
    function onScroll() {
      if (currentContainer) {
        setScrollTop(currentContainer.scrollTop);
      }
    }

    currentContainer?.addEventListener('scrollend', onScroll);
    currentContainer?.addEventListener('scroll', onScroll);
    currentList?.addEventListener('scroll', checkIfNeedFetchMore);
    return () => {
      currentContainer?.removeEventListener('scrollend', onScroll);
      currentContainer?.removeEventListener('scroll', onScroll);
      currentList?.removeEventListener('scroll', checkIfNeedFetchMore);
    };
  }, [checkIfNeedFetchMore, currentContainer, currentList]);

  useEffect(() => {
    const interval = setInterval(() => checkIfNeedFetchMore(), 1000);

    return () => clearInterval(interval);
  }, [checkIfNeedFetchMore]);

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
    <div className={className} ref={listRef}>
      {pages}
      {isFetching && skeletonElements}
      {!hasNextPage && end}
    </div>
  );
}
