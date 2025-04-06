import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';



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



import ErrorMessage from './error-message';
import { SocketResult } from '@/types/data/SocketClient';


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

export default function MessageList({ className, queryKey, params, loader, noResult = <NoResult className="flex w-full items-center justify-center" />, end, threshold = 100, room, showNotification = true, children }: MessageListProps) {
  const container = useRef<HTMLDivElement>(null);
  const renderCause = useRef<'fetch' | 'event'>('fetch');
  const [_, setLastMessage] = useLocalStorage(`LAST_MESSAGE_${room}`, '');
  const [list, setList] = useState<HTMLElement | null>(null);

  const scrollTopRef = useRef(0);
  const lastHeightRef = useRef(0);

  const queryClient = useQueryClient();
  const isEndReached = isReachedEnd(container.current, threshold);
  const { socket } = useSocket();

  const clientHeight = list?.clientHeight || 0;
  const lastHeight = lastHeightRef.current || 0;
  const scrollTop = scrollTopRef.current || 0;

  // Only preserve scroll position when user scroll up
  if (clientHeight != lastHeight && container.current && list && !isEndReached && renderCause.current === 'fetch') {
    const diff = clientHeight - lastHeight + scrollTop;

    container.current.scrollTo({
      top: diff,
    });
  }

  lastHeightRef.current = clientHeight;

  const { data, isFetching, error, isError, hasNextPage, fetchNextPage } = useMessageQuery(room, params, queryKey, () => (renderCause.current = 'fetch'));

  const { postNotification } = useNotification();

  const pages = useMemo(() => {
    if (!data) {
      return [];
    }

    const array = mergeNestArray(data.pages);
    const group = groupMessage(array);

    return group.map((item: MessageGroup, index: number, array: MessageGroup[]) => children(item, index, array.length - params.size));
  }, [children, data, params.size]);

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
      if (container.current.scrollTop <= 500) {
        handleEndReach();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  useEffect(() => {
    if (container.current && isEndReached) {
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [pages, isEndReached]);

  useEffect(() => {
    const messageHandler = (message: SocketResult<'MESSAGE'>) => {
      renderCause.current = 'event';

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
    };

    socket
      .onRoom(room) //
      .onMessage('MESSAGE', messageHandler);
    return () => {
      socket
        .onRoom(room) //
        .remove('MESSAGE', messageHandler);
    };
  }, [room, queryKey, socket, queryClient, isEndReached, showNotification, postNotification]);

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

  if (!loader) {
    loader = <LoaderIcon key="loading" className="col-span-full m-auto flex h-full w-full items-center justify-center animate-spin size-6 max-w-6 max-h-6" />;
  }

  end = end ?? <Tran className="col-span-full flex w-full items-center justify-center" text="end-of-page" />;

  if (!data) {
    return undefined;
  }

  if (pages.length === 0) {
    return noResult;
  }

  return (
    <ScrollContainer className={cn('flex h-full w-full overflow-x-hidden', className)} ref={container}>
      <section className="h-fit w-full" ref={(ref) => setList(ref)}>
        {!hasNextPage && end}
        {isFetching && loader}
        {pages}
        {isError && <ErrorMessage error={error} />}
      </section>
    </ScrollContainer>
  );
}
