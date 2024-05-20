import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';
import { throttle } from 'lodash';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

type ResponsiveInfiniteScrollGridProps<T, P> = {
  className?: string;
  queryKey: QueryKey[];
  params: P;
  loader?: ReactNode;
  noResult?: ReactNode;
  end?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  container: () => HTMLElement | null;
  itemMinWidth: number;
  itemMinHeight: number;
  contentOffsetHeight: number;
  gap?: number;
  threshold?: number;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

const defaultClassName =
  'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center';

export default function ResponsiveInfiniteScrollGrid<
  T extends { id: string },
  P extends PaginationQuery,
>({
  className,
  queryKey,
  params,
  container,
  loader,
  noResult,
  end,
  skeleton,
  threshold = 500,
  itemMinWidth,
  itemMinHeight,
  contentOffsetHeight,
  gap = 2,
  getFunc,
  children,
}: ResponsiveInfiniteScrollGridProps<T, P>) {
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
  const pages = useMemo(() => {
    return !data
      ? []
      : data.pages.reduce((prev, curr) => prev.concat(curr), []).map(children);
  }, [data, children]);

  const [scrollTop, setScrollTop] = useState(0);

  var currentContainer = container();
  const skeletonElements = useMemo(
    () =>
      skeleton &&
      Array(skeleton.amount)
        .fill(1)
        .map((_, index) => (
          <React.Fragment key={index}>{skeleton.item}</React.Fragment>
        )),
    [skeleton],
  );

  useEffect(() => {
    function handleScroll() {
      if (currentContainer) {
        setScrollTop(currentContainer.scrollTop);
      }
    }

    const throttled = throttle(() => handleScroll(), 50);

    currentContainer?.addEventListener('scroll', throttled);
    currentContainer?.addEventListener('scrollend', handleScroll);
    return () => {
      currentContainer?.removeEventListener('scrollend', handleScroll);
      currentContainer?.removeEventListener('scroll', throttled);
    };
  }, [currentContainer]);

  useEffect(() => {
    if (currentContainer) {
      const offsetFromBottom =
        currentContainer.scrollHeight -
        (scrollTop + currentContainer.clientHeight);

      if (offsetFromBottom < threshold && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    }
  }, [
    currentContainer,
    fetchNextPage,
    hasNextPage,
    isFetching,
    threshold,
    scrollTop,
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

  console.log({ isLoading, data, currentContainer });

  if (isLoading || !data || !currentContainer) {
    return (
      <div className={className ?? defaultClassName} style={{ gap }}>
        {loader ? loader : skeletonElements}
      </div>
    );
  }

  if (pages.length === 0) {
    return noResult;
  }

  const numberOfItems = pages.length + (isFetching ? skeleton?.amount ?? 0 : 0);

  const cols = Math.floor(currentContainer.clientWidth / (itemMinWidth + gap));

  const itemWith = (currentContainer.clientWidth - (cols - 1) * gap) / cols;

  const itemHeight = Math.max(itemWith + contentOffsetHeight, itemMinHeight);
  const rows = Math.ceil(numberOfItems / cols);

  const scrollHeight = rows * itemHeight + (rows - 1) * gap;

  const fixedScrollTop = Math.min(
    scrollHeight - currentContainer.clientHeight,
    scrollTop,
  );

  const startRow = Math.max(
    Math.floor(fixedScrollTop / (itemHeight + gap)) - 1,
    0,
  );

  const startIndex = Math.max(0, startRow * cols);
  const startHeight = startRow * (itemHeight + gap);

  const endRow = Math.min(
    rows,
    Math.floor(
      (fixedScrollTop + currentContainer.clientHeight) / (itemHeight + gap),
    ) + 2,
  );

  const endIndex = endRow * (cols + 1);

  return (
    <div
      className="w-full"
      style={{
        height: `${scrollHeight}px`,
        maxHeight: `${scrollHeight}px`,
        minHeight: `${scrollHeight}px`,
      }}
    >
      <div
        className={cn(className ?? defaultClassName)}
        style={{ transform: `translateY(${startHeight}px)`, gap }}
      >
        <Items pages={pages} startIndex={startIndex} endIndex={endIndex} />
        {isFetching && skeletonElements}
        {!hasNextPage && end}
      </div>
    </div>
  );
}

type Props = {
  pages: ReactNode[];
  startIndex: number;
  endIndex: number;
};

function Items({ pages, startIndex, endIndex }: Props) {
  const visiblePages = useMemo(
    () => pages.slice(startIndex, endIndex),
    [endIndex, pages, startIndex],
  );

  return visiblePages;
}
