import { useCallback, useEffect } from 'react';

import { useSocket } from '@/context/socket-context';
import { isBelongToLastMessage, isReachedEnd } from '@/lib/utils';
import { Message } from '@/types/response/Message';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

type Props = {
  containerElement: HTMLElement | null;
  room: string;
  queryKey: string[];
};

export default function useMessage({
  containerElement,
  queryKey,
  room,
}: Props) {
  const { socket, state } = useSocket();
  const queryClient = useQueryClient();

  const scrollToBottom = useCallback((containerElement: HTMLElement | null) => {
    setTimeout(() => {
      if (containerElement && isReachedEnd(containerElement, 500)) {
        containerElement.scrollTo({
          top: containerElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      containerElement?.scrollTo({
        top: containerElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 2000);
  }, [containerElement]);

  useEffect(() => {
    socket.onRoom(room).send({ method: 'JOIN_ROOM', data: room });
  }, [room, socket]);

  useEffect(() => {
    socket
      .onRoom(room)
      .onMessage('GET_MESSAGE', () => scrollToBottom(containerElement));

    socket.onRoom(room).onMessage('MESSAGE', (message) => {
      queryClient.setQueriesData<InfiniteData<Message[], unknown> | undefined>(
        { queryKey },
        (query) => {
          if (!query) {
            return undefined;
          }

          const pages = query.pages.map((page) => {
            let [firstPage, ...rest] = page;

            if (firstPage === undefined) {
              return [message, ...rest];
            }

            if (isBelongToLastMessage(firstPage, message)) {
              const { content } = firstPage;

              firstPage = {
                ...firstPage,
                content: [...content, ...message.content],
              };

              return [firstPage, ...rest];
            }

            return [message, firstPage, ...rest];
          });

          return { ...query, pages };
        },
      );

      scrollToBottom(containerElement);
    });
  }, [containerElement, queryClient, queryKey, room, scrollToBottom, socket]);

  const sendMessage = async (message: string) => {
    if (socket && state === 'connected') {
      socket.onRoom(room).send({ data: message, method: 'MESSAGE' });
    }

    containerElement?.scrollTo({
      top: containerElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return { sendMessage };
}
