import { AxiosInstance } from 'axios';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { useSocket } from '@/context/socket-context';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import {
  isReachedEnd,
  makeArray,
  mapReversed,
  mergeNestArray,
} from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Message } from '@/types/response/Message';

import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

type MessageListProps<T, P> = {
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
  room: string;
  container: () => HTMLElement | null;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number, endIndex?: number) => ReactNode;
};

export default function MessageList<
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
  room,
  container,
  getFunc,
  children,
}: MessageListProps<T, P>) {
  const currentContainer = container();
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down');
  const [scrollTop, setScrollTop] = useState(100);
  const [lastHeight, setLastHeight] = useState(100);

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
  } = useInfinitePageQuery(getFunc, params, queryKey);

  const pageMapper = useCallback(
    (item: T, index: number, array: T[]) =>
      children(item, index, array.length - params.size),
    [children, params.size],
  );

  const remainScrollPosition = useCallback(() => {
    if (!currentContainer || !list) {
      return;
    }

    if (scrollDir === 'down') {
      return;
    }

    const diff = list.clientHeight - lastHeight + currentContainer.scrollTop;

    currentContainer.scrollTo({
      top: diff,
      behavior: 'instant',
    });

    setLastHeight(list.clientHeight);
  }, [currentContainer, list, lastHeight, scrollDir]);

  useEffect(() => {
    setLastHeight(list?.clientHeight ?? 100);
  }, [list]);

  useEffect(() => {
    setTimeout(() => remainScrollPosition(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const pages = useMemo(() => {
    if (!data) {
      return [];
    }

    const array = mergeNestArray(data.pages);
    const dedupe = array.filter(
      (item, index) => array.lastIndexOf(item) === index,
    );

    return reversed ? mapReversed(dedupe, pageMapper) : dedupe.map(pageMapper);
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
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const scrollToBottom = useCallback((containerElement: HTMLElement | null) => {
    if (containerElement && isReachedEnd(containerElement, 500)) {
      setTimeout(() => {
        containerElement.scrollTo({
          top: 9999999999999,
          behavior: 'smooth',
        });
      }, 200);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      currentContainer?.scrollTo({
        top: 9999999999999,
        behavior: 'smooth',
      });
    }, 1000);
  }, [currentContainer]);

  useEffect(() => {
    socket.onRoom(room).onMessage('MESSAGE', (message) => {
      queryClient.setQueriesData<InfiniteData<Message[], unknown> | undefined>(
        { queryKey },
        (query) => {
          setLastHeight(list?.clientHeight ?? 100);

          if (!query || !query.pages) {
            return undefined;
          }

          let found = false;
          let pages = query.pages.map((page) => {
            return page.map((item) => {
              if (item.id === message.id) {
                found = true;
                return message;
              }
              return item;
            });
          });

          if (!found) {
            const [lastPage, ...rest] = pages;
            lastPage.unshift(message);
            return { ...query, pages: [lastPage, ...rest] };
          }

          return { ...query, pages: [...pages] };
        },
      );

      scrollToBottom(currentContainer);
    });
  }, [
    queryClient,
    queryKey,
    room,
    socket,
    list,
    scrollToBottom,
    currentContainer,
  ]);

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
    <div ref={(ref) => setList(ref)}>
      {pages}
      {isFetching && skeletonElements}
      {!hasNextPage && end}
    </div>
  );
}
