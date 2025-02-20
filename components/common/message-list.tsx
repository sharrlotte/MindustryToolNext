import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval, useLocalStorage } from 'usehooks-ts';

import { LoaderIcon } from '@/components/common/icons';
import NoResult from '@/components/common/no-result';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';

import { useSocket } from '@/context/socket-context';
import useMessageQuery from '@/hooks/use-message-query';
import useNotification from '@/hooks/use-notification';
import { cn, isReachedEnd, mergeNestArray } from '@/lib/utils';
import { MessageQuery } from '@/query/search-query';
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
  children,
}: MessageListProps) {
  const container = useRef<HTMLDivElement>(null);
  const [_, setLastMessage] = useLocalStorage(`LAST_MESSAGE_${room}`, '');
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const scrollTopRef = useRef(0);
  const lastHeightRef = useRef(0);

  const queryClient = useQueryClient();
  const isEndReached = isReachedEnd(container.current, threshold);
  const { socket, state } = useSocket();

  const clientHeight = list?.clientHeight || 0;
  const lastHeight = lastHeightRef.current || 0;
  const scrollTop = scrollTopRef.current || 0;

  if (clientHeight != lastHeight && container.current && list && !isEndReached) {
    const diff = clientHeight - lastHeight + scrollTop;

    container.current.scrollTo({
      top: diff,
    });
  }

  lastHeightRef.current = clientHeight;

  const { data, isFetching, error, isError, hasNextPage, fetchNextPage } = useMessageQuery(room, params, queryKey);

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
    const handleEndReach = () => {
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    };

    if (container.current) {
      if (container.current.scrollTop <= threshold) {
        handleEndReach();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetching, threshold]);

  useEffect(() => {
    if (container.current && isEndReached) {
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [pages, isEndReached]);

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
              postNotification(message.content, message.userId);
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

          if (container.current && isEndReached) {
            container.current.scrollTo({
              top: container.current.scrollHeight,
              behavior: 'smooth',
            });
          }
        }),
    [room, queryKey, socket, queryClient, isEndReached, showNotification, postNotification],
  );
  useInterval(() => checkIfNeedFetchMore(), 1000);

  useEffect(() => {
    function onScroll() {
      checkIfNeedFetchMore();

      if (container.current) {
        scrollTopRef.current = container.current.scrollTop;
      }
    }

    const currentContainer = container.current;

    currentContainer?.addEventListener('scrollend', onScroll);
    currentContainer?.addEventListener('scroll', onScroll);

    list?.addEventListener('scroll', checkIfNeedFetchMore);

    return () => {
      currentContainer?.removeEventListener('scrollend', onScroll);
      currentContainer?.removeEventListener('scroll', onScroll);

      list?.removeEventListener('scroll', checkIfNeedFetchMore);
    };
  }, [checkIfNeedFetchMore, list, scrollTopRef]);

  useInterval(checkIfNeedFetchMore, 100);

  if (!loader) {
    loader = <LoaderIcon key="loading" className="col-span-full m-auto flex h-full w-full items-center justify-center animate-spin size-6 max-w-6 max-h-6" />;
  }

  end = end ?? <Tran className="col-span-full flex w-full items-center justify-center" text="end-of-page" />;

  if (isError) {
    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );
  }

  if (state !== 'connected' || !data) {
    return <div className={cn('col-span-full flex h-full w-full items-center justify-center', className)}>{loader}</div>;
  }

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <ScrollContainer className="flex h-full w-full overflow-x-hidden" ref={container}>
      <div className="h-fit w-full" ref={(ref) => setList(ref)}>
        {!hasNextPage && end}
        {isFetching && loader}
        {pages}
      </div>
    </ScrollContainer>
  );
}
