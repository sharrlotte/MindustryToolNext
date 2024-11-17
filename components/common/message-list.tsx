import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval, useLocalStorage } from 'usehooks-ts';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import Tran from '@/components/common/tran';
import { useSocket } from '@/context/socket-context';
import useMessageQuery from '@/hooks/use-message-query';
import useNotification from '@/hooks/use-notification';
import useWindow from '@/hooks/use-window';
import { cn, isReachedEnd, mergeNestArray } from '@/lib/utils';
import { MessageQuery } from '@/types/data/pageable-search-schema';
import { Message, MessageGroup, groupMessage } from '@/types/response/Message';

import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

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
  container: () => HTMLElement | null;
  children: (data: MessageGroup, index?: number, endIndex?: number) => ReactNode;
};

export default function MessageList({
  className = 'grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center break-words',
  queryKey,
  params,
  loader,
  noResult = <NoResult className="flex w-full items-center justify-center" />,
  end,
  threshold = 1000,
  room,
  showNotification = true,
  container,
  children,
}: MessageListProps) {
  const currentContainer = container();
  const [_, setLastMessage] = useLocalStorage(`LAST_MESSAGE_${room}`, '');
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const scrollTopRef = useRef(0);
  const lastHeightRef = useRef(0);

  const queryClient = useQueryClient();
  const isEndReached = isReachedEnd(currentContainer, threshold);
  const { socket } = useSocket();

  const isFocused = useWindow();

  const [shouldCheck, setShouldCheck] = useState(true);

  const clientHeight = list?.clientHeight || 0;
  const lastHeight = lastHeightRef.current || 0;
  const scrollTop = scrollTopRef.current || 0;

  if (clientHeight != lastHeight && currentContainer && list && !isEndReached) {
    const diff = clientHeight - lastHeight + scrollTop;

    currentContainer.scrollTo({
      top: diff,
    });
  }

  lastHeightRef.current = clientHeight;

  const { data, isFetching, error, isError, hasNextPage, fetchNextPage } = useMessageQuery(room, params, queryKey);

  useEffect(() => {
    setShouldCheck(isFocused);
  }, [isFocused]);

  const { postNotification } = useNotification();

  const pageMapper = useCallback((item: MessageGroup, index: number, array: MessageGroup[]) => children(item, index, array.length - params.size), [children, params.size]);

  const pages = useMemo(() => {
    if (!data) {
      return [];
    }

    const array = mergeNestArray(data.pages);
    const group = groupMessage(array);

    return group.map(pageMapper);
  }, [data, pageMapper]);

  useEffect(() => {
    const lastMessage = data?.pages?.at(0)?.at(0);

    if (lastMessage) {
      setLastMessage(lastMessage?.id ?? '');
    }
  }, [data, setLastMessage]);

  const checkIfNeedFetchMore = useCallback(() => {
    if (!shouldCheck) return;

    const handleEndReach = () => {
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    };

    if (currentContainer) {
      if (currentContainer.scrollTop <= threshold) {
        handleEndReach();
      }
    }
  }, [currentContainer, fetchNextPage, hasNextPage, isFetching, shouldCheck, threshold]);

  useEffect(() => {
    if (currentContainer && isEndReached) {
      currentContainer.scrollTo({
        top: currentContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentContainer, pages, isEndReached]);

  useEffect(
    () =>
      socket
        .onRoom(room) //
        .onMessage('MESSAGE', (message) => {
          queryClient.setQueriesData<InfiniteData<Message[], unknown> | undefined>({ queryKey, exact: false }, (query) => {
            if (message && 'error' in message) {
              return;
            }

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
              top: currentContainer.scrollHeight,
              behavior: 'smooth',
            });
          }
        }),
    [room, queryKey, socket, queryClient, isEndReached, currentContainer, showNotification, postNotification],
  );

  useEffect(() => {
    function onScroll() {
      setShouldCheck(true);
      checkIfNeedFetchMore();

      if (currentContainer) {
        scrollTopRef.current = currentContainer.scrollTop;
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
  }, [checkIfNeedFetchMore, currentContainer, list, scrollTopRef]);

  useInterval(checkIfNeedFetchMore, 100);

  if (!loader) {
    loader = <LoadingSpinner key="loading" className="col-span-full m-auto flex h-full w-full items-center justify-center" />;
  }

  end = end ?? <Tran className="col-span-full flex w-full items-center justify-center" text="end-of-page" />;

  if (isError || error) {
    return (
      <div className="col-span-full flex w-full items-center justify-center">
        <Tran text="error" />: {error?.message}
      </div>
    );
  }

  if (!data || !currentContainer) {
    return <div className={cn('col-span-full flex h-full w-full items-center justify-center', className)}>{loader}</div>;
  }

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <div className="h-fit w-full" ref={(ref) => setList(ref)}>
      {!hasNextPage && end}
      {isFetching && loader}
      {pages}
    </div>
  );
}
