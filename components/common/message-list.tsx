import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { useSocket } from '@/context/socket-context';
import { cn, isReachedEnd, makeArray, mergeNestArray } from '@/lib/utils';
import { Message, MessageGroup, groupMessage } from '@/types/response/Message';

import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';
import useMessageQuery from '@/hooks/use-message-query';
import { MessageQuery } from '@/types/data/pageable-search-schema';
import useNotification from '@/hooks/use-notification';
import Tran from '@/components/common/tran';

type MessageListProps = {
  className?: string;
  queryKey: QueryKey;
  params: MessageQuery;
  loader?: ReactNode;
  noResult?: ReactNode;
  end?: ReactNode;
  threshold?: number;
  room: string;
  showNotification?: boolean;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  container: () => HTMLElement | null;
  children: (
    data: MessageGroup,
    index?: number,
    endIndex?: number,
  ) => ReactNode;
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
  children,
}: MessageListProps) {
  const currentContainer = container();
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down');
  const scrollTop = useRef(100);
  const lastHeight = useRef(100);
  const [isFirstLoad, setFirstLoad] = useState(true);

  const queryClient = useQueryClient();
  const isEndReached = isReachedEnd(currentContainer, threshold);
  const { socket } = useSocket();

  const { data, isFetching, error, isError, hasNextPage, fetchNextPage } =
    useMessageQuery(room, params, queryKey);

  const { postNotification } = useNotification();

  const pageMapper = useCallback(
    (item: MessageGroup, index: number, array: MessageGroup[]) =>
      children(item, index, array.length - params.size),
    [children, params.size],
  );

  lastHeight.current = list?.clientHeight ?? threshold;

  const remainScrollPosition = useCallback(() => {
    if (!currentContainer || !list || isFirstLoad) {
      return;
    }

    if (scrollDir === 'down') {
      return;
    }

    const diff =
      list.clientHeight - lastHeight.current + currentContainer.scrollTop;

    currentContainer.scrollTo({
      top: diff,
      behavior: 'instant',
    });
  }, [currentContainer, list, lastHeight, scrollDir, isFirstLoad]);

  useEffect(() => {
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

  const skeletonElements = useMemo(
    () =>
      skeleton
        ? makeArray(skeleton.amount) //
            .map((_, index) => <Fragment key={index}>{skeleton.item}</Fragment>)
        : null,
    [skeleton],
  );

  const checkIfNeedFetchMore = useCallback(() => {
    const handleEndReach = () => {
      if (hasNextPage) {
        fetchNextPage();
      }
    };

    if (currentContainer && !isFetching) {
      if (currentContainer.scrollTop <= threshold) {
        handleEndReach();
      }
    }
  }, [currentContainer, fetchNextPage, hasNextPage, isFetching, threshold]);

  useEffect(() => {
    const interval = setInterval(checkIfNeedFetchMore, 100);

    return () => {
      clearInterval(interval);
    };
  }, [checkIfNeedFetchMore]);

  useEffect(() => {
    if (pages.length && currentContainer && (isEndReached || isFirstLoad)) {
      currentContainer.scrollTo({
        top: 9999999999999,
        behavior: 'smooth',
      });
      setFirstLoad(false);
    }
  }, [currentContainer, pages, isFirstLoad, isEndReached]);

  useEffect(() => {
    socket
      .onRoom(room) //
      .onMessage('MESSAGE', (message) => {
        queryClient.setQueriesData<
          InfiniteData<Message[], unknown> | undefined
        >({ queryKey, exact: false }, (query) => {
          if (showNotification) {
            postNotification(message);
          }

          if (!query || !query.pages) {
            return undefined;
          }

          const [first, ...rest] = query.pages;

          const newFirst = [message, ...first];

          return {
            ...query,
            pages: [newFirst, ...rest],
          } satisfies InfiniteData<Message[], unknown>;
        });

        if (currentContainer && isEndReached) {
          currentContainer.scrollTo({
            top: 9999999999999,
            behavior: 'smooth',
          });
        }
      });
  }, [
    room,
    queryKey,
    list,
    socket,
    queryClient,
    isEndReached,
    currentContainer,
    showNotification,
    postNotification,
  ]);

  useEffect(() => {
    function onScroll() {
      if (currentContainer) {
        scrollTop.current = currentContainer.scrollTop;
        setScrollDir(
          currentContainer.scrollTop > scrollTop.current ? 'down' : 'up',
        );
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
    <Tran
      className="col-span-full flex w-full items-center justify-center"
      text="end-of-page"
    />
  );

  if (isError || error) {
    return (
      <div className="col-span-full flex w-full items-center justify-center">
        <Tran text="error" />: {error?.message}
      </div>
    );
  }

  if (!data || !currentContainer) {
    return (
      <div
        className={cn(
          'col-span-full flex h-full w-full items-center justify-center',
          className,
        )}
      >
        {loader ?? skeletonElements}
      </div>
    );
  }

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <div className="h-fit" ref={(ref) => setList(ref)}>
      {!hasNextPage && end}
      {isFetching && skeletonElements}
      {pages}
    </div>
  );
}
