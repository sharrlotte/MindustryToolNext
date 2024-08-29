import { AxiosInstance } from 'axios';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { useSocket } from '@/context/socket-context';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { isReachedEnd, makeArray, mergeNestArray } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Message, MessageGroup, groupMessage } from '@/types/response/Message';

import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/context/session-context';

type MessageListProps = {
  className?: string;
  queryKey: QueryKey;
  params: PaginationQuery;
  loader?: ReactNode;
  noResult?: ReactNode;
  end?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  threshold?: number;
  room: string;
  container: () => HTMLElement | null;
  getFunc: (
    axios: AxiosInstance,
    params: PaginationQuery,
  ) => Promise<Message[]>;
  children: (
    data: MessageGroup,
    index?: number,
    endIndex?: number,
  ) => ReactNode;
  showNotification?: boolean;
};

export default function MessageList({
  className = 'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center',
  queryKey,
  params,
  loader,
  noResult = <NoResult className="flex w-full items-center justify-center" />,
  end,
  skeleton,
  threshold = 500,
  room,
  showNotification = true,
  container,
  getFunc,
  children,
}: MessageListProps) {
  const currentContainer = container();
  const { session } = useSession();
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down');
  const [scrollTop, setScrollTop] = useState(100);
  const [lastHeight, setLastHeight] = useState(100);
  const [isFirstLoad, setFirstLoad] = useState(true);

  const t = useI18n();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

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
    (item: MessageGroup, index: number, array: MessageGroup[]) =>
      children(item, index, array.length - params.size),
    [children, params.size],
  );

  const remainScrollPosition = useCallback(() => {
    if (!currentContainer || !list || isFirstLoad) {
      return;
    }

    if (scrollDir === 'down' || isReachedEnd(currentContainer, 500)) {
      return;
    }

    const diff = list.clientHeight - lastHeight + currentContainer.scrollTop;

    currentContainer.scrollTo({
      top: diff,
      behavior: 'instant',
    });

    setLastHeight(list.clientHeight);
  }, [currentContainer, list, lastHeight, scrollDir, isFirstLoad]);

  useEffect(() => {
    setLastHeight(list?.clientHeight ?? 100);
  }, [list]);

  useLayoutEffect(() => {
    remainScrollPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const pages = useMemo(() => {
    if (!data) {
      return [];
    }

    const array = mergeNestArray(data.pages);

    const group = groupMessage(array);

    return group.map(pageMapper);
  }, [data, pageMapper]);

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
        handleTopReach();
      }

      if (currentContainer.scrollTop <= threshold) {
        handleEndReach();
      }
    }
  }, [
    currentContainer,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    threshold,
  ]);

  const processNotification = useCallback(
    (message: Message) => {
      if (message.userId === session?.id) return;

      new Notification(message.content);
    },
    [session?.id],
  );

  const displayNotification = useCallback(
    (message: Message) => {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          return processNotification(message);
        }

        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            processNotification(message);
          }
        });
      }
    },
    [processNotification],
  );

  useEffect(() => {
    const interval = setInterval(checkIfNeedFetchMore, 3000);

    return () => clearInterval(interval);
  }, [checkIfNeedFetchMore]);

  useEffect(() => {
    if (
      pages.length &&
      currentContainer &&
      (isReachedEnd(currentContainer, 500) || isFirstLoad)
    ) {
      currentContainer.scrollTo({
        top: 9999999999999,
        behavior: 'smooth',
      });
      setFirstLoad(false);
    }
  }, [currentContainer, pages, isFirstLoad]);

  useEffect(() => {
    socket.onRoom(room).onMessage('MESSAGE', (message) => {
      queryClient.setQueriesData<InfiniteData<Message[], unknown> | undefined>(
        { queryKey, exact: false },
        (query) => {
          if (showNotification) {
            displayNotification(message);
          }
          setLastHeight(list?.clientHeight ?? 100);

          if (!query || !query.pages) {
            return undefined;
          }

          const [first, ...rest] = query.pages;

          const newFirst = [message, ...first];

          return {
            ...query,
            pages: [newFirst, ...rest],
          } satisfies InfiniteData<Message[], unknown>;
        },
      );
      if (currentContainer && isReachedEnd(currentContainer, 500)) {
        currentContainer.scrollTo({
          top: 9999999999999,
          behavior: 'smooth',
        });
      }
    });
  }, [
    queryClient,
    queryKey,
    room,
    socket,
    list,
    currentContainer,
    showNotification,
    displayNotification,
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
